import type { Answer, Exercise, Task } from './content/questions.ts'

export const draftsKey = 'mushroom:teacher-drafts:v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isAnswer(answer: unknown): answer is Answer {
  if (!isRecord(answer)) return false
  if (answer.type === 'number') return isNumber(answer.correct)
  if (answer.type === 'vector') {
    return Array.isArray(answer.correct) && answer.correct.length === 2 && answer.correct.every(isNumber)
  }
  if (answer.type !== 'single' && answer.type !== 'multiple') return false
  const { choices, correct } = answer
  return Array.isArray(choices) && choices.length >= 2 && choices.every(hasText) &&
    Array.isArray(correct) && correct.length > 0 && (answer.type === 'multiple' || correct.length === 1) &&
    new Set(correct).size === correct.length &&
    correct.every(i => isNumber(i) && Number.isInteger(i) && i >= 0 && i < choices.length)
}

function isTask(task: unknown): task is Task {
  return isRecord(task) && hasText(task.id) && hasText(task.skill) && hasText(task.prompt) &&
    hasText(task.solution) && typeof task.misconception === 'string' &&
    (task.difficulty === 'foundation' || task.difficulty === 'standard') && isAnswer(task.answer) &&
    (task.signGraph === undefined || isSignGraph(task.signGraph))
}

function isSignGraph(graph: unknown): boolean {
  if (!isRecord(graph)) return false
  return Array.isArray(graph.roots) && graph.roots.length === 2 &&
    graph.roots.every(isNumber) && graph.roots[0] < graph.roots[1] &&
    Array.isArray(graph.labels) && graph.labels.length === 2 && graph.labels.every(hasText) &&
    hasText(graph.variable) && (graph.region === 'inside' || graph.region === 'outside')
}

export function isExercise(exercise: unknown): exercise is Exercise {
  if (!isRecord(exercise) || !hasText(exercise.id) || !hasText(exercise.title) ||
      (typeof exercise.context !== 'undefined' && typeof exercise.context !== 'string')) return false
  const { tasks } = exercise
  return Array.isArray(tasks) && tasks.length > 0 && tasks.every(isTask) &&
    new Set(tasks.map(task => task.id.trim())).size === tasks.length
}

export function parseDraft(json: string): Exercise | undefined {
  try {
    const payload: unknown = JSON.parse(json)
    if (!isRecord(payload) || payload.syllabus !== '9709' || payload.component !== 'P1' ||
        !Array.isArray(payload.exercises) || payload.exercises.length !== 1) return
    const [exercise] = payload.exercises
    if (isExercise(exercise)) return exercise
  } catch {
    return
  }
}

export function readDrafts(storage: Pick<Storage, 'getItem'>): Exercise[] {
  try {
    const decoded: unknown = JSON.parse(storage.getItem(draftsKey) ?? '[]')
    return Array.isArray(decoded) ? decoded.filter(isExercise) : []
  } catch {
    return []
  }
}
