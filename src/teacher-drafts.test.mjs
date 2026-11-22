import test from 'node:test'
import assert from 'node:assert/strict'
import { bank } from './content/questions.ts'
import { grade } from './grading.ts'
import { draftsKey, parseDraft, readDrafts, serializeDraft } from './teacher-drafts.ts'

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

test('paired written steps and exact legacy fallback survive reopening a draft', () => {
  const sample = {
    id: 'factorisation',
    title: 'Solve by factorising',
    syllabusSection: { chapter: '1.1 Quadratics', topic: 'Solving quadratic equations by factorisation' },
    tasks: [{
      id: 'factorisation-1',
      skill: 'Apply the zero-product rule',
      difficulty: 'foundation',
      prompt: 'Find both roots.',
      answer: { type: 'root-pair', correct: [-2.5, 4] },
      solution: 'Original worked solution.',
      solutionLines: [String.raw`(2x+5)(x-4)&=0`],
      workedSteps: [
        { math: String.raw`(2x+5)(x-4)&=0`, en: 'Factor the quadratic.', zh: '分解二次式。' },
        { math: String.raw`x=-\frac52\text{ or }x=4`, en: 'Set each factor to zero.', zh: '分别令每个因式为零。' },
      ],
      hint: 'Check when each factor is zero.',
      hintZh: '检查每个因式何时为零。',
      misconception: 'Check the sign of the negative root.',
      misconceptionZh: '检查负根的符号。',
    }],
  }
  const json = serializeDraft(sample)
  const { chapter, topic } = JSON.parse(json)
  assert.deepEqual({ chapter, topic }, sample.syllabusSection)
  const imported = parseDraft(json)
  assert.deepEqual(imported, sample)
  assert.deepEqual(readDrafts({ getItem: () => JSON.stringify([imported]) }), [sample])
  assert.equal(grade(imported.tasks[0].answer, ['4', '-5/2']), true)
  assert.equal(grade(imported.tasks[0].answer, ['4', '4']), false)

  const withTask = properties => serialize({ ...sample, tasks: [{ ...sample.tasks[0], ...properties }] })
  assert.ok(parseDraft(withTask({ solution: '', solutionLines: [] })))
  assert.ok(parseDraft(withTask({ solution: '', workedSteps: [] })))
  assert.equal(parseDraft(withTask({ answer: { type: 'root-pair', correct: [4, 4] } })), undefined)
  assert.equal(parseDraft(withTask({ answer: { type: 'root-pair', correct: [4] } })), undefined)
  assert.equal(parseDraft(withTask({ workedSteps: [{ math: 'x=4', en: 'Solve.', zh: '' }] })), undefined)
  assert.equal(parseDraft(withTask({ workedSteps: [{ math: 4, en: 'Solve.', zh: '解方程。' }] })), undefined)
  assert.equal(parseDraft(withTask({ hintZh: 1 })), undefined)
})
