import test from 'node:test'
import assert from 'node:assert/strict'
import { bank } from './content/questions.ts'
import { grade } from './grading.ts'
import { draftsKey, parseDraft, readDrafts } from './teacher-drafts.ts'

const serialize = exercise => JSON.stringify({ syllabus: '9709', component: 'P1', exercises: [exercise] })

test('exported exercises reopen with the same answer keys and feedback', () => {
  for (const exercise of bank.exercises) assert.deepEqual(parseDraft(serialize(exercise)), exercise)
  const vector = parseDraft(serialize(bank.exercises[0])).tasks[0].answer
  assert.equal(grade(vector, ['3', '0']), true)
})

test('invalid imports and duplicate task IDs are rejected', () => {
  const sample = bank.exercises[0]
  assert.equal(parseDraft('{'), undefined)
  assert.equal(parseDraft(serialize({ ...sample, tasks: [sample.tasks[0], sample.tasks[0]] })), undefined)
  assert.equal(parseDraft(serialize({ ...sample, tasks: [{ ...sample.tasks[0], answer: { type: 'vector', correct: [3] } }] })), undefined)
})

test('drafts survive storage round trips and malformed records are ignored', () => {
  const sample = bank.exercises[0]
  const getItem = key => {
    assert.equal(key, draftsKey)
    return JSON.stringify([null, sample, { id: 'incomplete' }])
  }
  assert.deepEqual(readDrafts({ getItem }), [sample])
  assert.deepEqual(readDrafts({ getItem: () => '{' }), [])
  assert.deepEqual(readDrafts({ getItem: () => { throw new Error('storage unavailable') } }), [])
})
