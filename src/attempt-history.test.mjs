import assert from 'node:assert/strict'
import test from 'node:test'
import { applyAttempt, completionMethod, emptyHistory, readHistory, writeHistory } from './attempt-history.ts'
import { grade } from './grading.ts'
import { standardFormTasks } from './content/quadratics-foundation.ts'

test('first success, independent retry and assistance use distinct evidence', () => {
  const first = applyAttempt(emptyHistory, 'correct')
  assert.equal(completionMethod(first, false), 'first')
  assert.equal(completionMethod(applyAttempt(first, 'solution'), false), 'first')
  const retry = applyAttempt(applyAttempt(emptyHistory, 'incorrect'), 'correct')
  assert.equal(completionMethod(retry, false), 'retried')
  assert.equal(retry.attempts, 2)
  assert.equal(retry.firstCorrect, false)
  assert.equal(completionMethod(applyAttempt(applyAttempt(emptyHistory, 'hint'), 'correct'), false), 'assisted')
  assert.equal(completionMethod(emptyHistory, true), 'legacy')
  assert.equal(applyAttempt(first, 'correct').completed, true)
})

test('opening the solution persists before any valid attempt', () => {
  const items = new Map()
  const storage = { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value) }
  writeHistory(storage, 'lesson', applyAttempt(emptyHistory, 'solution'))
  const reopened = readHistory(storage, 'lesson')
  assert.equal(reopened.attempts, 0)
  assert.equal(reopened.viewedSolution, true)
  assert.equal(completionMethod(applyAttempt(reopened, 'correct'), false), 'assisted')
  assert.deepEqual(readHistory(storage, 'other'), emptyHistory)
})

test('each standard-form answer follows from subtracting the constants', () => {
  const constants = [[7, 12], [0, -9], [-4, -10], [-5/2, -3/4]]
  for (const [index, { task, commonMistake }] of standardFormTasks.entries()) {
    const [left, right] = constants[index]
    assert.equal(grade(task.answer, String(left-right)), true)
    assert.equal(grade(task.answer, String(commonMistake.answer)), false)
    for (const invalid of ['', 'x=3', '1/0']) assert.equal(grade(task.answer, invalid), null)
  }
  for (const exact of ['-7/4', '−1.75', '-14 / 8']) assert.equal(grade(standardFormTasks[3].task.answer, exact), true)
})
