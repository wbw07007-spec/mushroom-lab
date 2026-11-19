import test from 'node:test'
import assert from 'node:assert/strict'
import { bank } from './content/questions.ts'
import { grade } from './grading.ts'

test('all published steps accept their authored answers', () => {
  const ids = new Set()
  for (const exercise of bank.exercises) {
    for (const task of exercise.tasks) {
      assert.ok(!ids.has(task.id))
      ids.add(task.id)
      const { answer } = task
      if (answer.type === 'single' || answer.type === 'multiple') {
        assert.ok(answer.correct.every(index => index >= 0 && index < answer.choices.length))
      }
      assert.equal(grade(answer, answer.type === 'number' ? String(answer.correct) : answer.type === 'vector' ? answer.correct.map(String) : answer.correct), true)
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
