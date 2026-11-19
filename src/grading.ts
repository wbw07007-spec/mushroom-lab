import type { Answer } from './content/questions.ts'

function gradeNumber(response: string, expected: number): boolean | null {
  const normalized = response.trim().replaceAll('−', '-')
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?$/.exec(normalized)
  if (!match) return null
  const value = Number(match[1]) / Number(match[2] ?? 1)
  return Number.isFinite(value) ? Math.abs(value - expected) <= 1e-9 : null
}

export function grade(answer: Answer, response: string | number[] | [string, string]): boolean | null {
  if (answer.type === 'number') {
    return typeof response === 'string' ? gradeNumber(response, answer.correct) : null
  }
  if (answer.type === 'vector') {
    if (!Array.isArray(response) || response.length !== 2) return null
    const [horizontal, vertical] = response
    if (typeof horizontal !== 'string' || typeof vertical !== 'string') return null
    const x = gradeNumber(horizontal, answer.correct[0])
    const y = gradeNumber(vertical, answer.correct[1])
    return x === null || y === null ? null : x && y
  }
  if (!Array.isArray(response) || response.length === 0) return null
  return response.length === answer.correct.length && answer.correct.every(choice => response.some(value => value === choice))
}

