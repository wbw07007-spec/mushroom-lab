import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import { motionQuestions, motionSections } from './content/m1-motion.ts'
import { applyAttempt, completionMethod, emptyHistory, readHistory, writeHistory } from './attempt-history.ts'
import { grade } from './grading.ts'

test('the chapter has 20 stable whole-question IDs and 15 time-graph exercises', () => {
  assert.deepEqual(motionSections.map(section => section.questions.length), [4, 6, 6, 4])
  assert.deepEqual(motionQuestions.map(question => question.id),
    Array.from({ length: 20 }, (_, i) => 'm1-motion-' + String(i + 1).padStart(2, '0')))
  assert.equal(motionQuestions.filter(q => q.plot?.kind === 'line').length, 3)
  assert.equal(motionQuestions.filter(q => q.plot?.kind === 's' || q.plot?.kind === 'v' || q.candidates?.length).length, 15)
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

test('checked answers and bilingual written work match the question list', () => {
  const outcomes = [
    ['East'], [-9], [13, 3], [2.6, 1], [4, 3], [3, 'It continues in the negative direction.'],
    [3, 9], ['The final moving segment'], [-2], ['Graph B'], [-2],
    ['Negative direction, speed increasing.'], [16], [-18], [4, 20], [-3],
    [18, 45], [10/3, 5], ['Graph C'], [6, 9],
  ]
  for (const [index, question] of motionQuestions.entries()) {
    assert.deepEqual(question.parts.map(part => part.choices?.[part.answer] ?? part.answer), outcomes[index], question.id)
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
    const answer = { type: 'number', correct: motionQuestions[question-1].parts[part].answer }
    assert.equal(grade(answer, correct), true)
    assert.equal(grade(answer, wrong), false)
    assert.equal(grade(answer, '-'), null)
  }
})

test('using help survives reload without counting as an attempt or touching P1', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  const id = motionQuestions[16].id
  writeHistory(storage, id, applyAttempt(emptyHistory, 'hint'), 'm1')
  const saved = readHistory(storage, id, 'm1')
  assert.equal(saved.attempts, 0)
  assert.equal(completionMethod(applyAttempt(saved, 'correct'), false), 'assisted')
  assert.deepEqual(readHistory(storage, id), emptyHistory)
  const retried = applyAttempt(applyAttempt(emptyHistory, 'incorrect'), 'correct')
  assert.equal(completionMethod(applyAttempt(retried, 'solution'), false), 'retried')
})
