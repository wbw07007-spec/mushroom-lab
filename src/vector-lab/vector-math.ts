export type Vec = readonly [number, number, number]
export type SpaceLine = { base: Vec; direction: Vec }

type ExactVec = readonly [bigint, bigint, bigint]
type Axis = 0 | 1 | 2
type AxisPair = readonly [Axis, Axis]

export type LineClassification =
  | { kind: 'invalid' }
  | { kind: 'parallel' | 'coincident'; factor: number; offset: Vec; offsetFactor: number; pivot: Axis }
  | {
    kind: 'intersecting' | 'skew' | 'uncertain'
    axes: AxisPair
    s: number
    t: number
    firstPoint: Vec
    secondPoint: Vec
    determinant: number
    /** The signed difference between the points, evaluated before presentation rounding. */
    residual: Vec
  }

export const scalarLimit = 100
export const scalarDecimalPlaces = 6
const decimalInput = /^[+-]?(?:\d+(?:\.\d{0,6})?|\.\d{1,6})$/
const axes: readonly Axis[] = [0, 1, 2]
const axisPairs: readonly AxisPair[] = [[0, 1], [0, 2], [1, 2]]

export function parseScalar(raw: string): number | null {
  const decimal = raw.trim().replaceAll('−', '-')
  if (!decimalInput.test(decimal)) return null
  const value = Number(decimal)
  if (!Number.isFinite(value) || Math.abs(value) > scalarLimit) return null
  return value === 0 ? 0 : value
}

export function add(a: Vec, b: Vec): Vec {
  return [sum(a[0], b[0]), sum(a[1], b[1]), sum(a[2], b[2])]
}

export function sub(a: Vec, b: Vec): Vec {
  return [sum(a[0], -b[0]), sum(a[1], -b[1]), sum(a[2], -b[2])]
}

export function scale(k: number, v: Vec): Vec {
  return [product(k, v[0]), product(k, v[1]), product(k, v[2])]
}

export function norm(v: Vec): number {
  return Math.hypot(...v)
}

export function isZero(v: Vec): boolean {
  return v.every(component => component === 0)
}

export function pointOn(line: SpaceLine, t: number): Vec {
  return add(line.base, scale(t, line.direction))
}

const abs = (value: bigint) => value < 0n ? -value : value

function decimalParts(value: number) {
  const [significand, exponent] = String(value).split('e')
  const [integer, fractional = ''] = significand.split('.')
  return { coefficient: BigInt(integer + fractional), power: Number(exponent ?? 0) - fractional.length }
}

function fromDecimal(coefficient: bigint, power: number) {
  return coefficient === 0n ? 0 : Number(`${coefficient}e${power}`)
}

function sum(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a + b
  const left = decimalParts(a)
  const right = decimalParts(b)
  const power = Math.min(left.power, right.power)
  return fromDecimal(
    left.coefficient * 10n ** BigInt(left.power - power) + right.coefficient * 10n ** BigInt(right.power - power),
    power,
  )
}

function product(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a * b
  const left = decimalParts(a)
  const right = decimalParts(b)
  return fromDecimal(left.coefficient * right.coefficient, left.power + right.power)
}

/** Scale the specified decimals to integers with a shared power-of-ten denominator. */
function exactLines(first: SpaceLine, second: SpaceLine) {
  const parts = [...first.base, ...first.direction, ...second.base, ...second.direction].map(decimalParts)
  const minPower = Math.min(0, ...parts.map(part => part.power))
  const integers = parts.map(({ coefficient, power }) => coefficient * 10n ** BigInt(power - minPower))
  const vector = (start: number): ExactVec => [integers[start], integers[start + 1], integers[start + 2]]
  return { a: vector(0), u: vector(3), b: vector(6), v: vector(9), denominator: 10n ** BigInt(-minPower) }
}

function quotient(numerator: bigint, denominator: bigint): number {
  if (numerator === 0n) return 0
  const n = Number(numerator)
  const d = Number(denominator)
  if (Number.isFinite(n) && Number.isFinite(d)) return n / d

  // The lab's input bounds keep the integers small. This also handles finite
  // callers outside that range whose intermediate integers exceed Number.
  const top = abs(numerator).toString()
  const bottom = abs(denominator).toString()
  const leading = (digits: string) => Number('0.' + digits.slice(0, 16))
  const sign = (numerator < 0n) === (denominator < 0n) ? 1 : -1
  return Number(`${sign * leading(top) / leading(bottom)}e${top.length - bottom.length}`)
}

export function classifyLines(first: SpaceLine, second: SpaceLine): LineClassification {
  if (isZero(first.direction) || isZero(second.direction) ||
      ![...first.base, ...first.direction, ...second.base, ...second.direction].every(Number.isFinite)) {
    return { kind: 'invalid' }
  }

  const { a, u, b, v, denominator } = exactLines(first, second)
  const offset: ExactVec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const minor = ([i, j]: AxisPair) => u[i] * v[j] - u[j] * v[i]
  const pair = axisPairs.reduce((best, candidate) => abs(minor(candidate)) > abs(minor(best)) ? candidate : best)
  const determinant = minor(pair)
  const asVec = (values: ExactVec, divisor: bigint): Vec =>
    [quotient(values[0], divisor), quotient(values[1], divisor), quotient(values[2], divisor)]

  if (determinant === 0n) {
    const pivot = axes.reduce((best, candidate) => abs(u[candidate]) > abs(u[best]) ? candidate : best)
    const sameLine = axes.every(axis => offset[axis] * u[pivot] === offset[pivot] * u[axis])
    return {
      kind: sameLine ? 'coincident' : 'parallel',
      factor: quotient(v[pivot], u[pivot]),
      offset: asVec(offset, denominator),
      offsetFactor: quotient(offset[pivot], u[pivot]),
      pivot,
    }
  }

  // Use the largest absolute determinant. For the chosen coordinates this is
  // s*u - t*v = b - a. The third equation is checked on integer numerators.
  const [i, j] = pair
  const sNumerator = offset[i] * v[j] - offset[j] * v[i]
  const tNumerator = offset[i] * u[j] - offset[j] * u[i]
  const pointNumerators = (base: ExactVec, direction: ExactVec, parameter: bigint): ExactVec => [
    base[0] * determinant + parameter * direction[0],
    base[1] * determinant + parameter * direction[1],
    base[2] * determinant + parameter * direction[2],
  ]
  const firstNumerator = pointNumerators(a, u, sNumerator)
  const secondNumerator = pointNumerators(b, v, tNumerator)
  const residualNumerator: ExactVec = [
    firstNumerator[0] - secondNumerator[0],
    firstNumerator[1] - secondNumerator[1],
    firstNumerator[2] - secondNumerator[2],
  ]
  const pointDenominator = determinant * denominator
  const s = quotient(sNumerator, determinant)
  const t = quotient(tNumerator, determinant)
  const firstPoint = asVec(firstNumerator, pointDenominator)
  const secondPoint = asVec(secondNumerator, pointDenominator)
  const residual = asVec(residualNumerator, pointDenominator)
  const displayedDeterminant = quotient(determinant, denominator ** 2n)
  const precise = displayedDeterminant !== 0 && [s, t, displayedDeterminant, ...firstPoint, ...secondPoint, ...residual]
    .every(Number.isFinite) && residualNumerator.every((value, axis) => value === 0n || residual[axis] !== 0)
  return {
    kind: !precise ? 'uncertain' : residualNumerator.every(value => value === 0n) ? 'intersecting' : 'skew',
    axes: pair,
    s,
    t,
    firstPoint,
    secondPoint,
    determinant: displayedDeterminant,
    residual,
  }
}
