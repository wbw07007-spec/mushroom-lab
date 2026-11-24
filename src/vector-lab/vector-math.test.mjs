import assert from 'node:assert/strict'
import { test } from 'node:test'
import { add, classifyLines, isZero, norm, parseScalar, pointOn, scale, sub } from './vector-math.ts'

const line = (base, direction) => ({ base, direction })

test('displacement, magnitude and coincident points', () => {
  const a = [-1, 2, 3]
  const b = [2, -2, 1]
  const displacement = sub(b, a)
  assert.deepEqual(displacement, [3, -4, -2])
  assert.ok(Math.abs(norm(displacement) - Math.sqrt(29)) < 1e-12)
  assert.ok(isZero(sub(a, a)))
  assert.equal(norm(sub(a, a)), 0)
})

test('vector addition, subtraction, negative scalar and zero results', () => {
  const u = [1, -2, 3]
  const v = [-2, 1, 4]
  assert.deepEqual(add(u, v), [-1, -1, 7])
  assert.deepEqual(sub(u, v), [3, -3, -1])
  assert.deepEqual(add(u, scale(-1, v)), [3, -3, -1])
  assert.deepEqual(scale(-2, u), [-2, 4, -6])
  assert.deepEqual(add(u, [-1, 2, -3]), [0, 0, 0])
  assert.deepEqual(scale(0, u), [0, 0, 0])
})

test('the point on a line changes with a negative parameter and returns to the base at zero', () => {
  const l = line([1, -2, 3], [2, 1, -1])
  assert.deepEqual(pointOn(l, -2), [-3, -4, 5])
  assert.deepEqual(pointOn(l, 0), [1, -2, 3])
})

test('decimal input gives exact zero when terms cancel and preserves tiny valid products', () => {
  const l = line([-0.3, 0, 0], [3, 0.000001, 0])
  assert.deepEqual(pointOn(l, 0.1), [0, 0.0000001, 0])
  assert.deepEqual(scale(0.000001, [0.000001, -0.000001, 0]), [1e-12, -1e-12, 0])
  assert.deepEqual(add([0.1, 0.03, 0], [0.2, 0.07, 0]), [0.3, 0.1, 0])
  assert.deepEqual(sub([-0.3, 0.5, 0], [-0.1, 0.25, 0]), [-0.2, 0.25, 0])
})

test('matching all three coordinates gives an intersection with independent parameters', () => {
  const first = line([1, 0, 2], [1, 2, -1])
  const second = line([3, 1, 3], [0, 1, -1])
  const result = classifyLines(first, second)
  assert.equal(result.kind, 'intersecting')
  assert.equal(result.s, 2)
  assert.equal(result.t, 3)
  assert.deepEqual(result.firstPoint, [3, 4, 0])
  assert.deepEqual(result.secondPoint, [3, 4, 0])
  assert.deepEqual(result.residual, [0, 0, 0])
})

test('a projected intersection only becomes a true intersection when the separation is zero', () => {
  const first = line([0, 0, 0], [1, 0, 0])
  const second = line([0, 0, 1], [0, 1, 0])
  const result = classifyLines(first, second)
  assert.equal(result.kind, 'skew')
  assert.deepEqual(result.axes, [0, 1])
  assert.deepEqual(result.firstPoint, [0, 0, 0])
  assert.deepEqual(result.secondPoint, [0, 0, 1])
  assert.deepEqual(result.residual, [0, 0, -1])
  const atZero = classifyLines(first, { ...second, base: [0, 0, 0] })
  assert.equal(atZero.kind, 'intersecting')
  assert.deepEqual(atZero.firstPoint, [0, 0, 0])
})

test('opposite proportional directions give coincident or distinct parallel lines', () => {
  const first = line([1, -2, 3], [2, 1, -1])
  const same = classifyLines(first, line([5, 0, 1], [-4, -2, 2]))
  assert.equal(same.kind, 'coincident')
  assert.equal(same.factor, -2)
  assert.equal(same.offsetFactor, 2)
  assert.deepEqual(same.offset, [4, 2, -2])
  const distinct = classifyLines(first, line([1, -1, 3], [-4, -2, 2]))
  assert.equal(distinct.kind, 'parallel')
  assert.equal(distinct.factor, -2)
  assert.deepEqual(distinct.offset, [0, 1, 0])
})

test('zero directions and non-finite data do not produce a line classification', () => {
  const zero = line([1, -2, 3], [0, -0, 0])
  const good = line([5, 0, 1], [-4, -2, 2])
  assert.deepEqual(classifyLines(zero, good), { kind: 'invalid' })
  assert.deepEqual(classifyLines(good, zero), { kind: 'invalid' })
  assert.deepEqual(classifyLines(good, line([0, 0, Infinity], [1, 0, 0])), { kind: 'invalid' })
})

test('the selected pair can include z, even when the xy minor is zero', () => {
  const result = classifyLines(line([0, 0, 1], [0, 0, 1]), line([1, 0, 2], [1, 0, 0]))
  assert.equal(result.kind, 'intersecting')
  assert.deepEqual(result.axes, [0, 2])
  assert.equal(result.s, 1)
  assert.equal(result.t, -1)
  assert.deepEqual(result.firstPoint, [0, 0, 2])
})

test('a distant intersection remains an intersection and is available to fit the view', () => {
  const result = classifyLines(line([0, 0, 0], [1, 0, 0]), line([0, 1, 0], [1, 0.000001, 0]))
  assert.equal(result.kind, 'intersecting')
  assert.equal(result.s, -1_000_000)
  assert.equal(result.t, -1_000_000)
  assert.deepEqual(result.firstPoint, [-1_000_000, 0, 0])
})

test('nearly proportional decimal directions keep their exact nonzero determinant', () => {
  const first = line([0, 0, 0], [100, 99.999999, 0])
  const second = line([0, 1, 0], [99.999999, 99.999998, 0])
  const result = classifyLines(first, second)
  assert.equal(result.kind, 'intersecting')
  assert.equal(result.determinant, -1e-12)
  assert.deepEqual(result.residual, [0, 0, 0])
  assert.equal(classifyLines(first, { ...second, base: [0, 1, 0.000001] }).kind, 'skew')
})

test('exact decimal proportions are recognized and small deviations remain visible', () => {
  const first = line([0, 0, 0], [0.3, 0.6, 0.9])
  assert.equal(classifyLines(first, line([0.1, 0.2, 0.3], [0.1, 0.2, 0.3])).kind, 'coincident')
  assert.equal(classifyLines(first, line([0.1, 0.2, 0.300001], [0.1, 0.2, 0.3])).kind, 'parallel')

  const smallGap = classifyLines(line([0, 0, 0], [1, 1, 1]), line([0, 0.000001, 0], [0, 1, 0.000001]))
  assert.equal(smallGap.kind, 'skew')
  assert.deepEqual(smallGap.residual, [0, 0, 1e-12])
})

test('input validation distinguishes unfinished, excessive and valid decimal input', () => {
  for (const bad of ['', ' ', '-', '−', '.', '1/2', '1e-6', '0x2', 'Infinity', 'NaN', '100.000001', '-101', '.0000001']) {
    assert.equal(parseScalar(bad), null, bad)
  }
  assert.equal(parseScalar(' +.5 '), 0.5)
  assert.equal(parseScalar('−0.25'), -0.25)
  assert.equal(parseScalar('1.'), 1)
  assert.equal(parseScalar('-.000001'), -0.000001)
  assert.equal(parseScalar('-100'), -100)
  assert.equal(parseScalar('100.000000'), 100)
  assert.equal(parseScalar('-0'), 0)
})
