import type { Exercise, Task } from './questions'

type Step = Omit<Task, 'id' | 'difficulty' | 'skill'>
export type Problem = [title: string, context: string, ...steps: Step[]]

export function n(prompt: string, correct: number, solution: string, misconception = 'Check the setup and keep exact values until the last step.'): Step {
  return { prompt, answer: { type: 'number', correct }, solution, misconception }
}

export function c(prompt: string, correct: string, wrong: [string, string, string], solution: string): Step {
  return { prompt, answer: { type: 'single', choices: [correct, ...wrong], correct: [0] }, solution,
    misconception: 'Check the conditions in the question and test your result in the original expression.' }
}

export function makeSet(prefix: string, problems: Problem[]): Exercise[] {
  return problems.map(([title, context, ...steps], position) => {
    const id = prefix + '-' + String(position + 1).padStart(2, '0')
    const tasks = steps.map((step, index): Task => {
      const task: Task = { ...step, id: id + '-' + (index + 1), difficulty: 'standard', skill: title }
      if (task.answer.type === 'single') {
        const { choices } = task.answer
        const shift = (position + index) % choices.length
        task.answer = { ...task.answer, choices: [...choices.slice(shift), ...choices.slice(0, shift)], correct: [(choices.length - shift) % choices.length] }
      }
      return task
    })
    return { id, title, context, tasks }
  })
}

