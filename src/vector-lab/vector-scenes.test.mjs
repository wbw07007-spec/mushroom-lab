import assert from 'node:assert/strict'
import { test } from 'node:test'
import katex from 'katex'
import { buildScene } from './vector-scenes.ts'

const a = [1, -2, 3]
const d = [2, 1, -1]
const line = { mode: 'line', a, d }
const at = (diagram, id) => diagram.points.find(point => point.id === id)?.at
const arrow = (diagram, id) => diagram.arrows.find(mark => mark.id === id)
const withoutTupleSizing = math => math.replace(/\\(?:bigl|bigr|left|right)\b/g, '')

test('the default line point is A = P, without a displacement arrow', () => {
  const { diagram, resultMath } = buildScene({ ...line, t: 0 })
  assert.deepEqual(at(diagram, 'p'), a)
  assert.match(diagram.points.find(point => point.id === 'p').label, /^A\s*=\s*P$/)
  assert.equal(arrow(diagram, 'td'), undefined)
  assert.equal(diagram.points.filter(point => point.at.every((value, i) => value === a[i])).length, 1)
  assert.match(withoutTupleSizing(resultMath), /\(1,-2,3\)/)
})

test('negative parameter changes AP and the point formula while the line stays fixed', () => {
  const initial = buildScene({ ...line, t: 0 })
  const moved = buildScene({ ...line, t: -2 })
  const displacement = arrow(moved.diagram, 'td')
  assert.deepEqual(displacement.from, a)
  assert.deepEqual(displacement.to, [-3, -4, 5])
  assert.deepEqual(at(moved.diagram, 'p'), displacement.to)
  assert.deepEqual(moved.diagram.lines, initial.diagram.lines)
  assert.equal(moved.equationMath, initial.equationMath)
  assert.match(withoutTupleSizing(moved.resultMath), /\(-3,-4,5\)/)
  assert.ok(moved.steps.find(step => step.id === 'displacement').highlight.includes(displacement.id))
})

test('scaling the direction and compensating t keeps the locus and point', () => {
  const initial = buildScene({ ...line, t: -2 })
  const rescaled = buildScene({ ...line, d: [4, 2, -2], t: -1 })
  const [originalLine] = initial.diagram.lines
  const [rescaledLine] = rescaled.diagram.lines
  assert.deepEqual(rescaledLine.point, originalLine.point)
  assert.deepEqual(rescaledLine.direction, originalLine.direction.map(value => 2 * value))
  assert.deepEqual(at(rescaled.diagram, 'p'), [-3, -4, 5])
  assert.equal(rescaled.resultMath, initial.resultMath)
})

test('zero direction clears the line formula, point and steps', () => {
  const invalid = buildScene({ ...line, d: [0, 0, 0], t: -2 })
  assert.equal(invalid.status.tone, 'error')
  assert.deepEqual(invalid.diagram.lines, [])
  assert.deepEqual(invalid.diagram.arrows, [])
  assert.equal(at(invalid.diagram, 'p'), undefined)
  assert.deepEqual(invalid.steps, [])
  assert.equal(invalid.equationMath, undefined)
  assert.equal(invalid.resultMath, undefined)
})

test('the displacement and subtraction formulas match the plotted arrow endpoints', () => {
  const points = buildScene({ mode: 'points', a: [-1, 2, 3], b: [2, -2, 1], positions: false, displacement: true })
  const displacement = arrow(points.diagram, 'ab')
  assert.deepEqual(displacement.from, [-1, 2, 3])
  assert.deepEqual(displacement.to, [2, -2, 1])
  assert.match(points.resultMath, /\\sqrt\{29\}/)

  const subtraction = buildScene({ mode: 'operations', op: 'subtract', u: [1, -2, 3], v: [-2, 1, 4], k: -2 })
  assert.deepEqual(arrow(subtraction.diagram, 'negative-v').to, [2, -1, -4])
  assert.deepEqual(arrow(subtraction.diagram, 'translated').from, [1, -2, 3])
  assert.deepEqual(arrow(subtraction.diagram, 'translated').to, [3, -3, -1])
  assert.deepEqual(arrow(subtraction.diagram, 'result').to, [3, -3, -1])
  assert.ok(subtraction.resultMath.includes(String.raw`3\\-3\\-1`))

  const zero = buildScene({ mode: 'operations', op: 'scale', u: [1, -2, 3], v: [-2, 1, 4], k: 0 })
  assert.equal(arrow(zero.diagram, 'result'), undefined)
  assert.deepEqual(at(zero.diagram, 'result'), [0, 0, 0])
})

test('the xy projection example displays an intersection only when its heights agree', () => {
  const projection = { mode: 'relations', a: [0, 0, 0], u: [1, 0, 0], v: [0, 1, 0] }
  const skew = buildScene({ ...projection, b: [0, 0, 1] })
  const intersects = buildScene({ ...projection, b: [0, 0, 0] })
  assert.equal(at(skew.diagram, 'intersection'), undefined)
  assert.deepEqual(at(skew.diagram, 'p1'), [0, 0, 0])
  assert.deepEqual(at(skew.diagram, 'p2'), [0, 0, 1])
  assert.deepEqual(at(intersects.diagram, 'intersection'), [0, 0, 0])
  assert.match(skew.resultMath, /\\varnothing/)
  assert.match(withoutTupleSizing(intersects.resultMath), /\(0,0,0\)/)
  for (const scene of [skew, intersects]) {
    assert.ok(scene.steps.some(step => step.id === 'projection'))
    for (const step of scene.steps) katex.renderToString(step.math, { throwOnError: true })
  }
})
