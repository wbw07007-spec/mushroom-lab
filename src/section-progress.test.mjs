import assert from 'node:assert/strict'
import test from 'node:test'
import katex from 'katex'
import { factorisationExercises, standardFormTasks } from './content/quadratics-foundation.ts'
import { countCompletedQuestions, readSectionCursor, writeSectionCursor } from './section-progress.ts'

const first = { id: 'q-1', tasks: [{ id: 's-1a' }, { id: 's-1b' }, { id: 's-1c' }] }
const second = { id: 'q-2', tasks: [{ id: 's-2a' }] }
const questions = [first, second]
const firstStep = { questionId: first.id, taskId: 's-1a' }
const secondStep = { questionId: first.id, taskId: 's-1b' }
const laterQuestion = { questionId: second.id, taskId: 's-2a' }
const noSteps = new Set()
const allSteps = new Set(questions.flatMap(question => question.tasks.map(task => task.id)))

function memoryStorage() {
  const items = new Map()
  return {
    items,
    getItem: key => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, value),
  }
}

test('completion totals count whole questions and skip incomplete multi-step questions', () => {
  assert.equal(countCompletedQuestions(questions, new Set(['s-1a', 's-1b', 's-2a'])), 1)
  assert.equal(countCompletedQuestions(questions, allSteps), 2)
  assert.equal(countCompletedQuestions([{ id: 'empty', tasks: [] }], allSteps), 0)
})

test('without a valid saved position, resume at the first incomplete step', () => {
  const storage = memoryStorage()
  assert.deepEqual(readSectionCursor(storage, '1.1', questions, new Set(['s-1a'])), secondStep)
  assert.deepEqual(readSectionCursor(storage, '1.1', questions, allSteps), firstStep)
  assert.equal(readSectionCursor(storage, '1.2', [], noSteps), undefined)
})

test('resume by question and task ID after questions or steps move', () => {
  const storage = memoryStorage()
  writeSectionCursor(storage, '1.1', secondStep)
  const reordered = [second, { ...first, tasks: [...first.tasks].reverse() }]
  assert.deepEqual(readSectionCursor(storage, '1.1', reordered, allSteps), secondStep)
})

test('sections keep independent saved positions and reject mismatched or malformed records', () => {
  const storage = memoryStorage()
  writeSectionCursor(storage, '1.1', secondStep)
  writeSectionCursor(storage, 'consolidation', laterQuestion)
  writeSectionCursor(storage, '1.2', { questionId: second.id, taskId: 's-1a' })
  assert.deepEqual(readSectionCursor(storage, '1.1', questions, noSteps), secondStep)
  assert.deepEqual(readSectionCursor(storage, 'consolidation', questions, noSteps), laterQuestion)
  assert.deepEqual(readSectionCursor(storage, '1.2', questions, noSteps), firstStep)
  const firstSectionKey = [...storage.items.keys()][0]
  storage.items.set(firstSectionKey, '{')
  assert.deepEqual(readSectionCursor(storage, '1.1', questions, noSteps), firstStep)
  storage.items.set(firstSectionKey, JSON.stringify({ questionId: first.id, taskId: 1 }))
  assert.deepEqual(readSectionCursor(storage, '1.1', questions, noSteps), firstStep)
})

test('navigation can still choose a fallback when local storage is unavailable', () => {
  const unavailable = {
    getItem() { throw new Error('Storage disabled') },
    setItem() { throw new Error('Storage disabled') },
  }
  assert.doesNotThrow(() => writeSectionCursor(unavailable, '1.1', laterQuestion))
  assert.deepEqual(readSectionCursor(unavailable, '1.1', questions, new Set(['s-1a'])), secondStep)
})

test('aligned worked solutions typeset for every existing and new section step', () => {
  const entries = [...standardFormTasks, ...factorisationExercises.flatMap(exercise => exercise.steps)]
  for (const { task } of entries) {
    assert.ok(task.solutionLines?.length >= 2, task.id)
    assert.ok(task.solutionLines.every(line => line.includes('&')), task.id)
    assert.ok(task.solutionLines.some(line => line.includes(String.raw`\boxed`)), task.id)
    const source = String.raw`\begin{aligned}` + task.solutionLines.join(String.raw`\\`) + String.raw`\end{aligned}`
    assert.doesNotThrow(() => katex.renderToString(source, { displayMode: true }), task.id)
  }
  assert.equal(new Set(entries.map(({ task }) => task.id)).size, entries.length)
})
