type SectionQuestion = { id: string; tasks: readonly { id: string }[] }
export type SectionCursor = { questionId: string; taskId: string }

export function countCompletedQuestions(questions: readonly SectionQuestion[], completed: ReadonlySet<string>) {
  return questions.filter(question =>
    question.tasks.length > 0 && question.tasks.every(task => completed.has(task.id))).length
}

function storageKey(sectionId: string) {
  return 'mushroom:p1:section-cursor:v1:' + sectionId
}

export function readSectionCursor(
  storage: Pick<Storage, 'getItem'>, sectionId: string,
  questions: readonly SectionQuestion[], completed: ReadonlySet<string>,
): SectionCursor | undefined {
  try {
    const saved: unknown = JSON.parse(storage.getItem(storageKey(sectionId)) ?? 'null')
    if (saved && typeof saved === 'object' && 'questionId' in saved && 'taskId' in saved &&
      typeof saved.questionId === 'string' && typeof saved.taskId === 'string' &&
      questions.some(question => question.id === saved.questionId && question.tasks.some(task => task.id === saved.taskId))) {
      return { questionId: saved.questionId, taskId: saved.taskId }
    }
  } catch { /* Missing, invalid or unavailable storage falls back to the first incomplete step. */ }

  for (const question of questions) {
    const task = question.tasks.find(item => !completed.has(item.id))
    if (task) return { questionId: question.id, taskId: task.id }
  }
  const first = questions.find(question => question.tasks.length > 0)
  if (first) return { questionId: first.id, taskId: first.tasks[0].id }
}

export function writeSectionCursor(storage: Pick<Storage, 'setItem'>, sectionId: string, cursor: SectionCursor) {
  try { storage.setItem(storageKey(sectionId), JSON.stringify(cursor)) } catch { /* In-page navigation still works. */ }
}
