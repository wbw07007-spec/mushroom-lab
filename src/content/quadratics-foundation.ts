import type { Task } from './questions'

export const standardFormRoute = 'quadratics-standard-form'

type StandardFormTask = { task: Task; hint: string; commonMistake: { answer: number; hint: string } }

function standardForm(
  position: number, prompt: string, answer: number, solution: string,
  hint: string, wrong: number, wrongHint: string,
): StandardFormTask {
  return {
    task: {
      id: 'p1-quad-foundation-standard-' + position,
      skill: 'Find the constant in standard form',
      difficulty: 'foundation',
      prompt,
      answer: { type: 'number', correct: answer },
      solution,
      misconception: 'Recheck the operation on both sides.',
    },
    hint,
    commonMistake: { answer: wrong, hint: wrongHint },
  }
}

export const standardFormTasks = [
  standardForm(1, 'Write $x^2+4x+7=12$ in standard form $x^2+4x+c=0$. Find $c$.', -5,
    'Subtract 12 from both sides. On the left, $7-12=-5$, so the standard form is $x^2+4x-5=0$.',
    'What must you subtract from both sides to make the right-hand side zero?',
    5, 'Check the order of the subtraction. Start with the constant already on the left.'),
  standardForm(2, 'Write $2x^2-x=-9$ in standard form $2x^2-x+c=0$. Find $c$.', 9,
    'Add 9 to both sides. The new constant on the left is $0+9=9$, giving $2x^2-x+9=0$.',
    'What should you add to $-9$ to obtain zero?',
    -9, 'If you add $-9$ to the right-hand side, does it become zero?'),
  standardForm(3, 'Write $3x^2+5x-4=2x-10$ in standard form $3x^2+3x+c=0$. Find $c$.', 6,
    'Subtract the entire right-hand expression. The constant becomes $-4-(-10)=6$, so the standard form is $3x^2+3x+6=0$.',
    'Subtract each term on the right. Write the subtraction of the constants before calculating it.',
    -14, 'The right-hand constant is negative. What is $-4-(-10)$?'),
  standardForm(4, 'Put $4x^2+3x-5/2=3x-3/4$ in the form $4x^2+c=0$. Find $c$.', -7/4,
    'Subtract $3x-3/4$ from both sides. The linear terms cancel and the constant is $-5/2+3/4=-7/4$.',
    'The linear terms cancel. Subtract the right-hand constant from the left-hand constant using a common denominator.',
    -13/4, 'Check the sign when subtracting $-3/4$. Use $\\frac14$ as the common unit.'),
]
