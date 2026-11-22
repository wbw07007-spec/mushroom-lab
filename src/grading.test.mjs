import test from 'node:test'
import assert from 'node:assert/strict'
import { practiceTopics } from './content/practice-topics.ts'
import { grade, sameNumericInput } from './grading.ts'

test('all published steps accept their authored answers', () => {
  const ids = new Set()
  for (const exercise of practiceTopics.flatMap(topic => topic.exercises)) {
    for (const task of exercise.tasks) {
      assert.ok(!ids.has(task.id))
      ids.add(task.id)
      const { answer } = task
      if (answer.type === 'single' || answer.type === 'multiple') {
        assert.ok(answer.correct.every(index => index >= 0 && index < answer.choices.length))
      }
      const response = answer.type === 'number' ? String(answer.correct)
        : answer.type === 'vector' || answer.type === 'root-pair' ? answer.correct.map(String)
        : answer.correct
      assert.equal(grade(answer, response), true)
    }
  }
})

test('numeric forms and multiple selections', () => {
  assert.equal(grade({ type: 'number', correct: -3 }, '−6 / 2'), true)
  assert.equal(grade({ type: 'number', correct: -3 }, '-3.0'), true)
  assert.equal(grade({ type: 'number', correct: -3 }, '0/0'), null)
  assert.equal(grade({ type: 'number', correct: -3 }, '4'), false)
  assert.equal(grade({ type: 'multiple', correct: [0, 1], choices: ['a', 'b', 'c'] }, [1, 0]), true)
  assert.equal(grade({ type: 'multiple', correct: [0, 1], choices: ['a', 'b', 'c'] }, [0]), false)
})


test('column vector grading checks both components in order', () => {
  const answer = { type: 'vector', correct: [3, 0] }
  assert.equal(grade(answer, ['6/2', '0']), true)
  assert.equal(grade(answer, ['0', '3']), false)
  assert.equal(grade(answer, ['−3', '0']), false)
  assert.equal(grade(answer, ['3', '']), null)
})

test('root pairs accept distinct correct numbers in either order', () => {
  const answer = { type: 'root-pair', correct: [-1.5, 1.25] }
  assert.equal(grade(answer, ['−3 / 2', '+5/4']), true)
  assert.equal(grade(answer, ['+1.25', '-1.50']), true)
  assert.equal(grade(answer, ['-1.5000000001', '1.25']), true)
  assert.equal(grade(answer, ['3/2', '5/4']), false)
  assert.equal(grade(answer, ['-3/2', '-1.5']), false)
  assert.equal(grade({ type: 'root-pair', correct: [3, 3] }, ['3', '6/2']), false)
})

test('root pairs reject missing and nonnumeric inputs as invalid attempts', () => {
  const answer = { type: 'root-pair', correct: [-1.5, 1.25] }
  for (const response of [
    ['', '1.25'], ['-1.5', ' '], ['-1.5', '1/0'], ['a', '+5/4'], ['x=-1.5', '+5/4'],
    ['-1.5', '1.25', '2'], ['-1.5'], [-1.5, 1.25], '-1.5, 1.25',
  ]) {
    assert.equal(grade(answer, response), null)
  }
})

test('duplicate-root detection uses numeric equivalence and rejects invalid strings', () => {
  assert.equal(sameNumericInput(' −2 / 4 ', '-.5'), true)
  assert.equal(sameNumericInput('0', '-0'), true)
  assert.equal(sameNumericInput('1', '1.0000000001'), true)
  assert.equal(sameNumericInput('1', '-1'), false)
  assert.equal(sameNumericInput('1/0', '1/0'), false)
  assert.equal(sameNumericInput('', ''), false)
})
