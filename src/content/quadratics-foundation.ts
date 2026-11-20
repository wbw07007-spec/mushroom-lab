import type { Task } from './questions'

export const standardFormRoute = 'quadratics-standard-form'

type FoundationStep = { task: Task; hint: string; commonMistake?: { answer: number; hint: string } }
export type FactorisationExercise = {
  id: string
  skill: readonly [string, string]
  context?: string
  steps: FoundationStep[]
}

function standardForm(
  position: number, prompt: string, answer: number, solution: string,
  solutionLines: string[], hint: string, wrong: number, wrongHint: string,
): FoundationStep {
  return {
    task: {
      id: 'p1-quad-foundation-standard-' + position,
      skill: 'Find the constant in standard form',
      difficulty: 'foundation',
      prompt,
      answer: { type: 'number', correct: answer },
      solution,
      solutionLines,
      misconception: 'Recheck the operation on both sides.',
    },
    hint,
    commonMistake: { answer: wrong, hint: wrongHint },
  }
}

export const standardFormTasks = [
  standardForm(1, 'Write $x^2+4x+7=12$ in standard form $x^2+4x+c=0$. Find $c$.', -5,
    'Subtract 12 from both sides. On the left, $7-12=-5$, so the standard form is $x^2+4x-5=0$.',
    [
      'x^2+4x+7&=12',
      'x^2+4x+7-12&=12-12',
      'x^2+4x-5&=0',
      String.raw`c&=\boxed{-5}`,
    ],
    'What must you subtract from both sides to make the right-hand side zero?',
    5, 'Check the order of the subtraction. Start with the constant already on the left.'),
  standardForm(2, 'Write $2x^2-x=-9$ in standard form $2x^2-x+c=0$. Find $c$.', 9,
    'Add 9 to both sides. The new constant on the left is $0+9=9$, giving $2x^2-x+9=0$.',
    [
      '2x^2-x&=-9',
      '2x^2-x+9&=-9+9',
      '2x^2-x+9&=0',
      String.raw`c&=0+9=\boxed{9}`,
    ],
    'What should you add to $-9$ to obtain zero?',
    -9, 'If you add $-9$ to the right-hand side, does it become zero?'),
  standardForm(3, 'Write $3x^2+5x-4=2x-10$ in standard form $3x^2+3x+c=0$. Find $c$.', 6,
    'Subtract the entire right-hand expression. The constant becomes $-4-(-10)=6$, so the standard form is $3x^2+3x+6=0$.',
    [
      '3x^2+5x-4&=2x-10',
      '3x^2+5x-4-(2x-10)&=0',
      '3x^2+3x-4+10&=0',
      '3x^2+3x+6&=0',
      String.raw`c&=\boxed{6}`,
    ],
    'Subtract each term on the right. Write the subtraction of the constants before calculating it.',
    -14, 'The right-hand constant is negative. What is $-4-(-10)$?'),
  standardForm(4, 'Put $4x^2+3x-5/2=3x-3/4$ in the form $4x^2+c=0$. Find $c$.', -7/4,
    'Subtract $3x-3/4$ from both sides. The linear terms cancel and the constant is $-5/2+3/4=-7/4$.',
    [
      String.raw`4x^2+3x-\frac{5}{2}&=3x-\frac{3}{4}`,
      String.raw`4x^2-\frac{5}{2}&=-\frac{3}{4}`,
      String.raw`4x^2-\frac{5}{2}+\frac{3}{4}&=0`,
      String.raw`4x^2-\frac{10}{4}+\frac{3}{4}&=0`,
      String.raw`4x^2-\frac{7}{4}&=0`,
      String.raw`c&=\boxed{-\frac{7}{4}}`,
    ],
    'The linear terms cancel. Subtract the right-hand constant from the left-hand constant using a common denominator.',
    -13/4, 'Check the sign when subtracting $-3/4$. Use $\\frac14$ as the common unit.'),
]

function factorStep(
  id: string, skill: string, prompt: string, answer: number, solution: string,
  solutionLines: string[], hint: string, commonMistake?: FoundationStep['commonMistake'],
): FoundationStep {
  return {
    task: {
      id,
      skill,
      difficulty: 'foundation',
      prompt,
      answer: { type: 'number', correct: answer },
      solution,
      solutionLines,
      misconception: hint,
    },
    hint,
    commonMistake,
  }
}

const findFactor = ['Find a missing factor', '确定因式中的常数'] as const
const findRoots = ['Apply the zero-product rule', '用零乘积规则求根'] as const
const rearrangeAndFactor = ['Rearrange and solve by factorisation', '整理方程并因式分解求根'] as const

export const factorisationExercises: FactorisationExercise[] = [
  {
    id: 'p1-quad-foundation-monic-factor',
    skill: findFactor,
    steps: [factorStep('p1-quad-foundation-monic-factor-k', findFactor[0],
      'The factorisation of $x^2-2x-35$ is $(x-7)(x+k)$. Find $k$.', 5,
      'The constant term in the product is $-7k$. Compare it with $-35$ to get $k=5$. The two constants give the required $x$-coefficient because $-7+5=-2$.',
      [
        '(x-7)(x+k)&=x^2+(k-7)x-7k',
        '-7k&=-35',
        'x^2-2x-35&=(x-7)(x+5)',
        String.raw`k&=\boxed{5}`,
      ],
      'Which multiplication in the brackets produces the term with no $x$?',
      { answer: -5, hint: 'If both constants were negative, what sign would their product have?' })],
  },
  {
    id: 'p1-quad-foundation-nonmonic-factor',
    skill: findFactor,
    steps: [factorStep('p1-quad-foundation-nonmonic-factor-k', findFactor[0],
      'The factorisation of $6x^2+7x-5$ is $(3x+5)(2x+k)$. Find $k$.', -1,
      'The constant term in the product is $5k$. Comparing with $-5$ gives $k=-1$. The cross terms give $-3x+10x=7x$.',
      [
        '(3x+5)(2x+k)&=6x^2+(3k+10)x+5k',
        '5k&=-5',
        '6x^2+7x-5&=(3x+5)(2x-1)',
        String.raw`k&=\boxed{-1}`,
      ],
      'Compare constant terms before checking the coefficient of $x$.',
      { answer: 1, hint: 'Check the sign of the constant formed by multiplying the two bracket constants.' })],
  },
  {
    id: 'p1-quad-foundation-zero-product',
    skill: findRoots,
    context: 'Solve $(2x+5)(x-4)=0$.',
    steps: [
      factorStep('p1-quad-foundation-zero-product-smaller', findRoots[0],
        'Enter the smaller root.', -5/2,
        'Since the product is zero, at least one factor is zero. The first factor gives $2x=-5$, so the smaller root is $-5/2$.',
        [
          '(2x+5)(x-4)&=0',
          String.raw`\Longrightarrow\quad 2x+5&=0\text{ or }x-4=0`,
          '2x&=-5',
          String.raw`x&=\boxed{-\frac{5}{2}}`,
        ],
        'Set one factor equal to zero at a time. Solve both resulting linear equations to compare their roots.',
        { answer: 5/2, hint: 'With $x=5/2$, does $2x+5$ become zero? Check the sign.' }),
      factorStep('p1-quad-foundation-zero-product-larger', findRoots[0],
        'Enter the larger root.', 4,
        'The second factor is zero when $x-4=0$, so the larger root is $4$.',
        ['x-4&=0', String.raw`x&=\boxed{4}`],
        'Use the equation formed by setting the second factor equal to zero.',
        { answer: -4, hint: 'Substitute $-4$ into the second factor. What value would make it equal to zero?' }),
    ],
  },
  {
    id: 'p1-quad-foundation-rearrange-factor',
    skill: rearrangeAndFactor,
    context: 'Solve $2x^2+6x+1=9$ by factorisation.',
    steps: [
      factorStep('p1-quad-foundation-rearrange-factor-c', rearrangeAndFactor[0],
        'Write the equation as $2x^2+6x+c=0$. Find $c$.', -8,
        'Subtract 9 from both sides. The constant on the left becomes $1-9=-8$.',
        ['2x^2+6x+1-9&=9-9', '2x^2+6x-8&=0', String.raw`c&=\boxed{-8}`],
        'What must you subtract from both sides to make the right-hand side zero?'),
      factorStep('p1-quad-foundation-rearrange-factor-q', rearrangeAndFactor[0],
        'Write the left-hand side as $2(x+p)(x+q)$ with $p<q$. Enter $q$.', 4,
        'Take out 2. To factor $x^2+3x-4$, find two integers with product $-4$ and sum $3$. They are $-1$ and $4$, so $q=4$.',
        [
          '2x^2+6x-8&=2(x^2+3x-4)',
          String.raw`p+q&=3,\quad pq=-4`,
          '2x^2+6x-8&=2(x-1)(x+4)',
          String.raw`q&=\boxed{4}`,
        ],
        'Divide the coefficients by 2. What product and sum must the two signed constants have?'),
      factorStep('p1-quad-foundation-rearrange-factor-smaller', rearrangeAndFactor[0],
        'Enter the smaller root.', -4,
        'Divide the factored equation by 2. Setting $x+4=0$ gives the smaller root, $-4$.',
        [
          '2(x-1)(x+4)&=0',
          '(x-1)(x+4)&=0',
          String.raw`x-1&=0\text{ or }x+4=0`,
          'x+4&=0',
          String.raw`x&=\boxed{-4}`,
        ],
        'Find the value that makes each of the two brackets zero and compare those values.'),
      factorStep('p1-quad-foundation-rearrange-factor-larger', rearrangeAndFactor[0],
        'Enter the larger root.', 1,
        'Setting $x-1=0$ gives the larger root, $1$. Both roots satisfy the original equation.',
        ['x-1&=0', String.raw`x&=\boxed{1}`],
        'Set the remaining linear factor equal to zero.'),
    ],
  },
]
