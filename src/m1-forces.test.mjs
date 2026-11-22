import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import { findM1Chapter, m1Chapters } from './content/m1-practice.ts'
import { grade } from './grading.ts'

const [motion, forces] = m1Chapters
const questions = forces.sections.flatMap(section => section.questions).sort((a, b) => a.id.localeCompare(b.id))

test('both M1 chapters have distinct question IDs and valid chapter, note and section links', () => {
  const all = m1Chapters.flatMap(chapter => chapter.sections.flatMap(section => section.questions))
  assert.equal(all.length, 100)
  assert.equal(new Set(all.map(question => question.id)).size, 100)
  assert.equal(findM1Chapter('m1-motion-st'), motion)
  assert.deepEqual(forces.sections.map(section => section.questions.length), [17, 17, 16])
  const initialIds = [[1, 7], [8, 14], [15, 20]]
  for (const [i, [start, end]] of initialIds.entries()) {
    assert.deepEqual(forces.sections[i].questions.slice(0, end-start+1).map(q => q.id),
      questions.slice(start-1, end).map(q => q.id))
  }
  assert.deepEqual(forces.notes.map(note => [note.number, note.page]), [['2.1–2.2', 1], ['2.3', 2], ['2.4', 3]])
  assert.equal(forces.pdf, 'm1-02.pdf')
  assert.equal(findM1Chapter('m1-forces-notes'), forces)
  for (const note of forces.notes) {
    assert.equal(findM1Chapter(note.sectionId), forces)
    assert.equal(forces.sections.find(section => section.id === note.sectionId).notePage, note.page)
  }
  assert.equal(findM1Chapter('m1-forces-unavailable'), undefined)
})

test('the extension adds 24 four-option questions and six numeric questions, with bilingual feedback', () => {
  const ids = Array.from({ length: 50 }, (_, i) => 'm1-forces-' + String(i+1).padStart(2, '0'))
  assert.deepEqual(questions.map(question => question.id), ids)
  assert.equal(questions.slice(0, 20).filter(q => q.parts.length === 1 && q.parts[0].choices).length, 16)
  assert.equal(questions.slice(20).filter(q => q.parts.length === 1 && q.parts[0].choices).length, 24)
  for (const question of questions) {
    assert.equal(question.parts.length, 1, question.id)
    const part = question.parts[0]
    if (!part.choices) {
      const answer = { type: 'number', correct: part.answer }
      assert.ok(part.unit?.length, question.id)
      assert.equal(grade(answer, String(part.answer)), true, question.id)
      assert.equal(grade(answer, String(part.answer+1)), false, question.id)
      continue
    }
    assert.equal(part.choices.length, 4, question.id)
    assert.equal(new Set(part.choices).size, 4, question.id)
    assert.ok(part.choices[part.answer], question.id)
    assert.deepEqual(Object.keys(part.choiceFeedback).map(Number), [0, 1, 2, 3].filter(i => i !== part.answer), question.id)
    for (const pair of Object.values(part.choiceFeedback)) assert.ok(pair[0].trim() && pair[1].trim(), question.id)
  }
})

test('force diagrams and bilingual KaTeX solutions have complete labels and valid formulas', () => {
  assert.ok(questions.slice(20).filter(q => q.forceDiagram || q.workedForceDiagram || q.plot || q.candidates?.length).length >= 12)
  for (const question of questions) {
    const labels = [question.prompt, ...question.hint]
    const part = question.parts[0]
    labels.push(part.prompt, ...part.feedback, ...(part.choices ?? []), ...Object.values(part.choiceFeedback ?? {}).flat())
    for (const plot of [question.plot, ...(question.candidates ?? [])].filter(Boolean)) {
      if (plot.kind === 'line') continue
      for (const points of [plot.points, ...(plot.series ?? [])]) {
        for (const [i, [time, ordinate]] of points.entries()) {
          assert.ok(time >= plot.tTicks[0] && time <= plot.tTicks.at(-1), question.id)
          assert.ok(ordinate >= plot.yTicks[0] && ordinate <= plot.yTicks.at(-1), question.id)
          if (i) assert.ok(plot.jumps ? time >= points[i-1][0] : time > points[i-1][0], question.id)
        }
      }
      if (question.candidates?.includes(plot)) {
        assert.deepEqual(plot.tTicks, question.candidates[0].tTicks, question.id)
        assert.deepEqual(plot.yTicks, question.candidates[0].yTicks, question.id)
      }
    }
    for (const diagram of [question.forceDiagram, question.workedForceDiagram].filter(Boolean)) {
      assert.ok(['up', 'right'].includes(diagram.positive), question.id)
      assert.ok(diagram.arrows.length, question.id)
      for (const arrow of diagram.arrows) assert.ok(arrow.label.trim() && ['up', 'down', 'left', 'right'].includes(arrow.direction), question.id)
    }
    for (const step of question.steps) {
      assert.ok(step.en.trim() && step.zh.trim(), question.id)
      katex.renderToString(step.math, { displayMode: true, throwOnError: true })
      labels.push(step.en, step.zh)
    }
    for (const label of labels) {
      for (const fragment of label.split('$').filter((_, i) => i % 2)) {
        katex.renderToString(fragment, { throwOnError: true })
      }
    }
  }
})

test('force answer keys match the independent arithmetic and sign checks', () => {
  const expected = ['B', 'C', 'A', 'D', 32, 'D', 'C', 'A', 16.2, 'B',
    'B', 25, 'D', 'A', 'C', -1.5, 'C', 'A', 'D', 'B',
    'A', 'C', 'D', 'B', 13.5, 'D', 1.5, 'C', 'A', 'B',
    'D', 'B', 'A', 6, 'C', 'A', 'C', 'B', 'D', 3,
    'C', 66, 'A', 'D', 'B', 'C', 'D', 75, 'A', 'B']
  assert.deepEqual(questions.map(({ parts: [part] }) => part.choices ? 'ABCD'[part.answer] : part.answer), expected)
})
