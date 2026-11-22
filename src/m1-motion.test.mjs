import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import { motionQuestions, motionSections } from './content/m1-motion.ts'
import { applyAttempt, completionMethod, emptyHistory, readHistory, writeHistory } from './attempt-history.ts'
import { grade } from './grading.ts'

const byId = [...motionQuestions].sort((a, b) => a.id.localeCompare(b.id))
const hasTimeGraph = q => q.plot?.kind === 's' || q.plot?.kind === 'v' || Boolean(q.candidates?.length)

test('the chapter appends 30 questions and preserves the original section positions', () => {
  assert.deepEqual(motionSections.map(section => section.questions.length), [10, 14, 15, 11])
  const id = number => 'm1-motion-' + String(number).padStart(2, '0')
  assert.deepEqual(byId.map(question => question.id), Array.from({ length: 50 }, (_, i) => id(i+1)))
  const oldRanges = [[1, 4], [5, 10], [11, 16], [17, 20]]
  for (const [i, [first, last]] of oldRanges.entries()) {
    const originalIds = Array.from({ length: last-first+1 }, (_, j) => id(first+j))
    assert.deepEqual(motionSections[i].questions.slice(0, originalIds.length).map(q => q.id), originalIds)
  }
  assert.equal(byId.slice(0, 20).filter(q => q.plot?.kind === 'line').length, 3)
  assert.equal(byId.slice(0, 20).filter(hasTimeGraph).length, 15)
})

test('the extension contains 24 single choices and six independent numerical responses', () => {
  const extension = byId.slice(20)
  const multipleOptions = extension.filter(q => q.parts.every(part => part.choices))
  assert.equal(multipleOptions.length, 24)
  assert.equal(extension.filter(q => q.parts.every(part => !part.choices)).length, 6)
  assert.equal(extension.filter(hasTimeGraph).length, 22)
  assert.equal(extension.filter(q => q.plot?.kind === 'line').length, 3)
  for (const question of multipleOptions) {
    for (const part of question.parts) {
      assert.equal(part.choices.length, 4, question.id)
      assert.equal(new Set(part.choices).size, part.choices.length, question.id)
      assert.ok(Number.isInteger(part.answer) && part.answer >= 0 && part.answer < part.choices.length, question.id)
      const feedback = Object.entries(part.choiceFeedback ?? {})
      assert.equal(feedback.length, 3, question.id)
      for (const [choice, reasons] of feedback) {
        assert.ok(part.choices[choice] && Number(choice) !== part.answer, question.id)
        assert.ok(reasons[0].trim() && reasons[1].trim(), question.id)
      }
    }
  }
})

test('new question keys match the independently checked outcomes', () => {
  const expected = [
    'C', 'A', 'D', 'B', 3, 'C', 'C', 'D', 'B', 5,
    'C', 'A', 12, 'B', 'B', 'D', 'C', -17, 'A', 'D',
    'D', 'B', 8, 'A', 'C', 'B', 'D', 'C', 2, 'A',
  ]
  const actual = byId.slice(20).map(question => question.parts.map(part =>
    part.choices ? 'ABCD'[part.answer] : part.answer))
  assert.deepEqual(actual, expected.map(key => [key]))
})

test('authored vertices fit the labelled scales and candidate graphs share axes', () => {
  for (const question of motionQuestions) {
    for (const plot of [question.plot, ...(question.candidates ?? [])].filter(Boolean)) {
      if (plot.kind === 'line') {
        for (const marker of plot.markers) assert.ok(plot.ticks.includes(marker.position), question.id)
        continue
      }
      for (const points of [plot.points, ...(plot.series ?? [])]) {
        for (const [i, [t, y]] of points.entries()) {
          assert.ok(t >= plot.tTicks[0] && t <= plot.tTicks.at(-1), question.id)
          assert.ok(y >= plot.yTicks[0] && y <= plot.yTicks.at(-1), question.id)
          if (i) assert.ok(plot.jumps ? t >= points[i-1][0] : t > points[i-1][0], question.id)
        }
      }
      if (question.candidates?.includes(plot)) {
        assert.deepEqual(plot.tTicks, question.candidates[0].tTicks, question.id)
        assert.deepEqual(plot.yTicks, question.candidates[0].yTicks, question.id)
      }
    }
    if (question.candidates) assert.equal(question.parts[0].choices.length, question.candidates.length, question.id)
  }
})

test('original answers remain stable, and all bilingual written work is valid KaTeX', () => {
  const outcomes = [
    ['East'], [-9], [13, 3], [2.6, 1], [4, 3], [3, 'It continues in the negative direction.'],
    [3, 9], ['The final moving segment'], [-2], ['Graph B'], [-2],
    ['Negative direction, speed increasing.'], [16], [-18], [4, 20], [-3],
    [18, 45], [10/3, 5], ['Graph C'], [6, 9],
  ]
  for (const [index, question] of byId.entries()) {
    if (index < outcomes.length) {
      assert.deepEqual(question.parts.map(part => part.choices?.[part.answer] ?? part.answer), outcomes[index], question.id)
    }
    assert.ok(question.steps.length && question.hint[0].trim() && question.hint[1].trim(), question.id)
    for (const row of question.steps) {
      assert.ok(row.en.trim() && row.zh.trim(), question.id)
      assert.doesNotThrow(() => katex.renderToString(row.math, { displayMode: true, throwOnError: true }), question.id)
    }
  }
})

test('sign-sensitive grading distinguishes negative answers and the post-turn distance', () => {
  const cases = [
    { question: 2, part: 0, correct: '−9', wrong: '9' },
    { question: 11, part: 0, correct: '-2', wrong: '2' },
    { question: 14, part: 0, correct: '-18', wrong: '18' },
    { question: 15, part: 1, correct: '20', wrong: '4' },
  ]
  for (const { question, part, correct, wrong } of cases) {
    const answer = { type: 'number', correct: byId[question-1].parts[part].answer }
    assert.equal(grade(answer, correct), true)
    assert.equal(grade(answer, wrong), false)
    assert.equal(grade(answer, '-'), null)
  }
})

test('using help survives reload without counting as an attempt or touching P1', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  const id = byId[16].id
  writeHistory(storage, id, applyAttempt(emptyHistory, 'hint'), 'm1')
  const saved = readHistory(storage, id, 'm1')
  assert.equal(saved.attempts, 0)
  assert.equal(completionMethod(applyAttempt(saved, 'correct'), false), 'assisted')
  assert.deepEqual(readHistory(storage, id), emptyHistory)
  const retried = applyAttempt(applyAttempt(emptyHistory, 'incorrect'), 'correct')
  assert.equal(completionMethod(applyAttempt(retried, 'solution'), false), 'retried')
})
