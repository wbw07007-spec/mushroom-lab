import type { Answer } from './content/questions.ts'

export function parseNumber(response: string): number | null {
  const normalized = response.trim().replaceAll('−', '-')
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?$/.exec(normalized)
  if (!match) return null
  const value = Number(match[1]) / Number(match[2] ?? 1)
  return Number.isFinite(value) ? value : null
}

export function sameNumber(first: number, second: number): boolean {
  return Math.abs(first - second) <= 1e-9
}

export function sameNumericInput(first: string, second: string): boolean {
  const firstValue = parseNumber(first)
  const secondValue = parseNumber(second)
  return firstValue !== null && secondValue !== null && sameNumber(firstValue, secondValue)
}

export function grade(answer: Answer, response: string | number[] | [string, string]): boolean | null {
  if (answer.type === 'number') {
    const value = typeof response === 'string' ? parseNumber(response) : null
    return value === null ? null : sameNumber(value, answer.correct)
  }
  if (answer.type === 'vector' || answer.type === 'root-pair') {
    if (!Array.isArray(response) || response.length !== 2) return null
    const [first, second] = response
    if (typeof first !== 'string' || typeof second !== 'string') return null
    const firstValue = parseNumber(first)
    const secondValue = parseNumber(second)
    if (firstValue === null || secondValue === null) return null
    const [firstExpected, secondExpected] = answer.correct
    const matchesInOrder = sameNumber(firstValue, firstExpected) && sameNumber(secondValue, secondExpected)
    if (answer.type === 'vector') return matchesInOrder
    if (sameNumber(firstValue, secondValue) || sameNumber(firstExpected, secondExpected)) return false
    return matchesInOrder || (sameNumber(firstValue, secondExpected) && sameNumber(secondValue, firstExpected))
  }
  if (!Array.isArray(response) || response.length === 0) return null
  return response.length === answer.correct.length && answer.correct.every(choice => response.some(value => value === choice))
}
