export type AttemptHistory = {
  attempts: number
  firstCorrect: boolean | null
  usedHint: boolean
  viewedSolution: boolean
  completed: boolean
}

export type AttemptEvent = 'correct' | 'incorrect' | 'hint' | 'solution'
export const emptyHistory: AttemptHistory = {
  attempts: 0, firstCorrect: null, usedHint: false, viewedSolution: false, completed: false,
}

function key(id: string) {
  return 'mushroom:p1:attempt-history:v1:' + id
}

export function readHistory(storage: Pick<Storage, 'getItem'>, id: string): AttemptHistory {
  try {
    const value = JSON.parse(storage.getItem(key(id)) ?? 'null')
    if (value && Number.isSafeInteger(value.attempts) && value.attempts >= 0 &&
      (value.attempts === 0 ? value.firstCorrect === null : typeof value.firstCorrect === 'boolean') &&
      typeof value.usedHint === 'boolean' && typeof value.viewedSolution === 'boolean' &&
      typeof value.completed === 'boolean' && (!value.completed || value.attempts > 0) &&
      (!value.firstCorrect || value.completed)) return value
  } catch { /* Invalid or unavailable storage falls back to a fresh record. */ }
  return emptyHistory
}

export function applyAttempt(history: AttemptHistory, event: AttemptEvent): AttemptHistory {
  if (event === 'hint' || event === 'solution') {
    if (history.completed) return history
    return { ...history, ...(event === 'hint' ? { usedHint: true } : { viewedSolution: true }) }
  }
  const correct = event === 'correct'
  return {
    ...history, attempts: history.attempts + 1, firstCorrect: history.firstCorrect ?? correct,
    completed: history.completed || correct,
  }
}

export function completionMethod(history: AttemptHistory, legacyCompleted: boolean) {
  if (!history.completed) return legacyCompleted ? 'legacy' : null
  if (history.usedHint || history.viewedSolution) return 'assisted'
  return history.firstCorrect ? 'first' : 'retried'
}

export function writeHistory(storage: Pick<Storage, 'setItem'>, id: string, history: AttemptHistory) {
  try { storage.setItem(key(id), JSON.stringify(history)) } catch { /* Keep the in-page attempt state. */ }
}
