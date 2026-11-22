import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import { findM1Chapter, m1Chapters } from './content/m1-practice.ts'
import { grade } from './grading.ts'

const chapter = m1Chapters[2]
const questions = chapter.sections.flatMap(section => section.questions)

test('chapter 3 follows the four published notes pages and keeps stable direct links', () => {
  assert.equal(findM1Chapter('m1-planar'), chapter)
  assert.equal(findM1Chapter('m1-planar-notes'), chapter)
  assert.equal(chapter.pdf, 'm1-03.pdf')
  assert.deepEqual(chapter.notes.map(note => [note.number, note.page]), [['3.1', 1], ['3.2', 2], ['3.4', 3], ['3.5', 4]])
  assert.deepEqual(chapter.sections.map(section => section.questions.length), [5, 5, 5, 5])
  for (const [i, section] of chapter.sections.entries()) {
    assert.equal(findM1Chapter(section.id), chapter)
    assert.equal(chapter.notes[i].sectionId, section.id)
    assert.equal(chapter.notes[i].page, section.notePage)
  }
  assert.deepEqual(questions.map(q => q.id), Array.from({ length: 20 }, (_, i) =>
    'm1-planar-' + String(i+1).padStart(2, '0')))
})

test('chapter 3 contains 16 four-option choices with bilingual distractors and four numerical responses', () => {
  assert.equal(questions.filter(q => q.parts[0]?.choices).length, 16)
  for (const question of questions) {
    assert.equal(question.parts.length, 1, question.id)
    const [part] = question.parts
    if (part.choices) {
      assert.equal(part.choices.length, 4, question.id)
      assert.equal(new Set(part.choices).size, 4, question.id)
      assert.ok(part.choices[part.answer], question.id)
      assert.deepEqual(Object.keys(part.choiceFeedback).map(Number), [0, 1, 2, 3].filter(i => i !== part.answer), question.id)
      for (const feedback of Object.values(part.choiceFeedback)) assert.ok(feedback[0].trim() && feedback[1].trim(), question.id)
    } else {
      assert.ok(part.unit, question.id)
      const answer = { type: 'number', correct: part.answer }
      assert.equal(grade(answer, String(part.answer)), true, question.id)
      assert.equal(grade(answer, String(part.answer + 1)), false, question.id)
    }
  }
})

test('planar diagrams and bilingual solutions have complete content and renderable mathematics', () => {
  for (const section of chapter.sections) {
    assert.ok(section.questions.filter(q => q.planarDiagram || q.workedPlanarDiagram || q.plot).length >= 2, section.id)
  }
  for (const question of questions) {
    for (const diagram of [question.planarDiagram, question.workedPlanarDiagram].filter(Boolean)) {
      assert.ok(diagram.forces.length, question.id)
      if (diagram.slope !== undefined) assert.ok(Math.abs(diagram.slope) < 90, question.id)
      if (diagram.axesAngle !== undefined) assert.ok(Number.isFinite(diagram.axesAngle), question.id)
      for (const force of diagram.forces) assert.ok(Number.isFinite(force.angle) && force.label.trim(), question.id)
      for (const { from, to } of diagram.angles ?? []) {
        assert.ok(Number.isFinite(from) && Number.isFinite(to) && (to - from) % 360 !== 0, question.id)
      }
    }
    const [part] = question.parts
    assert.ok(question.hint[0].trim() && question.hint[1].trim() && question.steps.length, question.id)
    const text = [question.prompt, ...question.hint, part.prompt, ...part.feedback, ...(part.choices ?? []),
      ...Object.values(part.choiceFeedback ?? {}).flat()]
    for (const row of question.steps) {
      assert.ok(row.en.trim() && row.zh.trim(), question.id)
      katex.renderToString(row.math, { displayMode: true, throwOnError: true })
      text.push(row.en, row.zh)
    }
    for (const piece of text) {
      for (const fragment of piece.split('$').filter((_, i) => i % 2)) {
        katex.renderToString(fragment, { throwOnError: true })
      }
    }
  }
})

test('planar answer keys match the independently resolved components and signed acceleration', () => {
  const expected = ['B', 'D', 'C', 17, 'A', 'C', 'A', 8, 'B', 'D',
    'B', 'D', 'A', 24, 'C', 'C', 'D', 'B', 'A', 4]
  assert.deepEqual(questions.map(({ parts: [part] }) =>
    part.choices ? 'ABCD'[part.answer] : part.answer), expected)
})
