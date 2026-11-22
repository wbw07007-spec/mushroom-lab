import type { Task } from './questions'

export const standardFormRoute = 'quadratics-standard-form'

type FoundationStep = {
  task: Task
  hint: string
  hintZh?: string
  commonMistake?: { answer: number; hint: string; zh?: string }
}

type BilingualFeedback = {
  workedSteps: NonNullable<Task['workedSteps']>
  hintZh: string
  misconceptionZh: string
}
export type FactorisationExercise = {
  id: string
  skill: readonly [string, string]
  context?: string
  steps: FoundationStep[]
}

function standardForm(
  position: number, prompt: string, answer: number, solution: string,
  solutionLines: string[], hint: string, wrong: number, wrongHint: string,
  bilingual?: BilingualFeedback & { wrongHintZh: string },
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
      ...(bilingual && {
        workedSteps: bilingual.workedSteps,
        hintZh: bilingual.hintZh,
        misconceptionZh: bilingual.misconceptionZh,
      }),
    },
    hint,
    ...(bilingual && { hintZh: bilingual.hintZh }),
    commonMistake: { answer: wrong, hint: wrongHint, ...(bilingual && { zh: bilingual.wrongHintZh }) },
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
    -14, 'The right-hand constant is negative. What is $-4-(-10)$?', {
      hintZh: '减去右边的每一项。先把常数项的减法写出来，再计算。',
      misconceptionZh: '检查减去整个右式时，是否把括号内的每一项都变了号。',
      wrongHintZh: '右边的常数是负数。$-4-(-10)$ 等于多少？',
      workedSteps: [
        {
          math: '3x^2+5x-4-(2x-10)=0',
          en: 'Subtract the whole right-hand expression $(2x-10)$ from both sides to make the right-hand side zero.',
          zh: '两边同时减去整个右式 $(2x-10)$，使右边变为零。',
        },
        {
          math: '3x^2+5x-4-2x+10=0',
          en: 'The minus sign before the brackets changes the sign of both $2x$ and $-10$.',
          zh: '括号前是减号，括号里的 $2x$ 和 $-10$ 都要变号。',
        },
        {
          math: '3x^2+3x+6=0',
          en: 'Collect like terms. The linear term is $5x-2x=3x$, and the constant is $-4+10=6$.',
          zh: '合并同类项。一次项是 $5x-2x=3x$，常数项是 $-4+10=6$。',
        },
        { math: 'c=6', en: 'Compare with the form given in the question to read the constant.', zh: '与题目指定的形式比较，读出常数项。' },
      ],
    }),
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
  bilingual?: BilingualFeedback,
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
      ...bilingual,
    },
    hint,
    ...(bilingual && { hintZh: bilingual.hintZh }),
    commonMistake,
  }
}

const findFactor = ['Find a missing factor', '确定因式中的常数'] as const
const findRoots = ['Apply the zero-product rule', '用零乘积规则求根'] as const
const rearrangeAndFactor = ['Rearrange and solve by factorisation', '整理方程并因式分解求根'] as const

const q8Prompt = 'Solve $2x^2+6x+1=9$ by factorisation.'
const q8Hint = 'Begin by making the right-hand side zero.'
const q8HintZh = '先想怎样把等式右边化为零。'

export const q8Independent: Task = {
  id: 'p1-quad-foundation-rearrange-factor-independent',
  skill: rearrangeAndFactor[0],
  difficulty: 'foundation',
  prompt: q8Prompt,
  answer: { type: 'root-pair', correct: [-4, 1] },
  hint: q8Hint,
  hintZh: q8HintZh,
  misconception: 'Check each value in the original equation.',
  misconceptionZh: '把所填的两个值分别代回原方程检查。',
  solution: 'Subtract 9 to get $2x^2+6x-8=0$. Factorise the left side as $2(x+4)(x-1)$. At least one bracket is zero, giving $x=-4$ or $x=1$.',
  workedSteps: [
    { math: '2x^2+6x+1-9=9-9', en: 'Subtract 9 from both sides.', zh: '等式两边同时减去 9。' },
    { math: '2x^2+6x-8=0', en: 'Combine the constant terms.', zh: '合并常数项，使右边为零。' },
    { math: '2(x^2+3x-4)=0', en: 'Take out the common factor 2.', zh: '提取公因数 2。' },
    {
      math: '2(x+4)(x-1)=0',
      en: 'Factorise using 4 and $-1$, whose sum is 3 and whose product is $-4$.',
      zh: '取 4 和 $-1$，它们的和是 3，积是 $-4$，据此分解括号内的二次式。',
    },
    {
      math: String.raw`x+4=0\quad\text{or}\quad x-1=0`,
      en: 'The constant factor 2 is nonzero. At least one bracket must be zero.',
      zh: '因数 2 不为零。根据零乘积法则，两个一次因式至少有一个等于零。',
    },
    {
      math: String.raw`\boxed{x=-4}\quad\text{or}\quad\boxed{x=1}`,
      en: 'Solve each linear equation. Both values satisfy the original equation.',
      zh: '分别解两个一次方程，所得两根均满足原方程。',
    },
  ],
}

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
        { answer: 5/2, hint: 'With $x=5/2$, does $2x+5$ become zero? Check the sign.', zh: '把 $x=5/2$ 代入 $2x+5$，结果是零吗？检查符号。' },
        {
          hintZh: '分别令每个因式等于零，再比较两个一次方程的解。',
          misconceptionZh: '用零乘积法则分别求根，再检查所填的是否为较小的根。',
          workedSteps: [
            {
              math: String.raw`2x+5=0\quad\text{or}\quad x-4=0`,
              en: 'By the zero-product rule, at least one factor equals zero.',
              zh: '根据零乘积法则，两个因式至少有一个等于零。',
            },
            { math: '2x=-5', en: 'The first equation gives a negative root. Subtract 5 from both sides.', zh: '第一个方程的根为负。等式两边同时减去 5。' },
            { math: String.raw`x=-\frac52`, en: 'Divide by 2. This is the smaller root, since the second equation gives a positive root.', zh: '两边同时除以 2。第二个方程的根为正，因此这是较小的根。' },
          ],
        }),
      factorStep('p1-quad-foundation-zero-product-larger', findRoots[0],
        'Enter the larger root.', 4,
        'The second factor is zero when $x-4=0$, so the larger root is $4$.',
        ['x-4&=0', String.raw`x&=\boxed{4}`],
        'Use the equation formed by setting the second factor equal to zero.',
        { answer: -4, hint: 'Substitute $-4$ into the second factor. What value would make it equal to zero?', zh: '把 $-4$ 代入第二个因式。哪个值能使它等于零？' },
        {
          hintZh: '令第二个因式等于零，再解这个一次方程。',
          misconceptionZh: '检查所填的值是否使第二个因式为零。',
          workedSteps: [
            { math: 'x-4=0', en: 'Set the second factor equal to zero.', zh: '令第二个因式等于零。' },
            { math: 'x=4', en: 'Add 4 to both sides. This is the larger root.', zh: '两边同时加上 4，得到较大的根。' },
          ],
        }),
    ],
  },
  {
    id: 'p1-quad-foundation-rearrange-factor',
    skill: rearrangeAndFactor,
    context: q8Prompt,
    steps: [
      factorStep('p1-quad-foundation-rearrange-factor-c', rearrangeAndFactor[0],
        'Write the equation as $2x^2+6x+c=0$. Find $c$.', -8,
        'Subtract 9 from both sides. The constant on the left becomes $1-9=-8$.',
        ['2x^2+6x+1-9&=9-9', '2x^2+6x-8&=0', String.raw`c&=\boxed{-8}`],
        'What must you subtract from both sides to make the right-hand side zero?',
        { answer: 8, hint: 'Write the left constant first when subtracting.', zh: '写减法时，先写原来在左边的常数。' },
        {
          hintZh: '等式两边同时减去什么，才能使右边变为零？',
          misconceptionZh: '检查移项后的常数项。',
          workedSteps: [
            { math: '2x^2+6x+1-9=9-9', en: 'Subtract 9 from both sides.', zh: '等式两边同时减去 9。' },
            { math: '2x^2+6x-8=0', en: 'Simplify each side.', zh: '分别化简等式两边。' },
            { math: 'c=-8', en: 'Compare with the form given in the question.', zh: '与题目给出的形式比较，读出常数项。' },
          ],
        }),
      factorStep('p1-quad-foundation-rearrange-factor-q', rearrangeAndFactor[0],
        'Write the left-hand side as $2(x+p)(x+q)$ with $p<q$. Enter $q$.', 4,
        'Take out 2. To factor $x^2+3x-4$, find two integers with product $-4$ and sum $3$. They are $-1$ and $4$, so $q=4$.',
        [
          '2x^2+6x-8&=2(x^2+3x-4)',
          String.raw`p+q&=3,\quad pq=-4`,
          '2x^2+6x-8&=2(x-1)(x+4)',
          String.raw`q&=\boxed{4}`,
        ],
        'Divide the coefficients by 2. What product and sum must the two signed constants have?',
        { answer: -4, hint: 'The signed constants must add to the linear coefficient inside the parentheses.', zh: '这两个带符号的数相加，应等于括号内二次式的一次项系数。' },
        {
          hintZh: '先提取公因数 2。两个带符号的常数的积与和应分别等于多少？',
          misconceptionZh: '同时检查两个带符号的常数的和与积。',
          workedSteps: [
            { math: '2x^2+6x-8=2(x^2+3x-4)', en: 'Take out the common factor 2.', zh: '提取公因数 2。' },
            { math: String.raw`p+q=3,\quad pq=-4`, en: 'Match the linear and constant coefficients.', zh: '比较一次项系数和常数项。' },
            { math: '2x^2+6x-8=2(x-1)(x+4)', en: 'Use the constants $-1$ and 4.', zh: '取 $-1$ 和 4 完成因式分解。' },
            { math: 'q=4', en: '$q$ is the larger of the two constants.', zh: '$q$ 是两个常数中较大的一个。' },
          ],
        }),
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
        'Find the value that makes each of the two brackets zero and compare those values.',
        { answer: 4, hint: 'What value makes $x+4$ zero?', zh: '哪个值能使 $x+4$ 等于零？' },
        {
          hintZh: '分别求出使每个括号等于零的值，再比较大小。',
          misconceptionZh: '检查所填的值是否使某个因式为零，以及它是否为较小的根。',
          workedSteps: [
            { math: '(x-1)(x+4)=0', en: 'Divide both sides by 2.', zh: '等式两边同时除以 2。' },
            { math: String.raw`x+4=0\quad\text{or}\quad x-1=0`, en: 'At least one factor equals zero.', zh: '两个因式至少有一个等于零。' },
            { math: 'x=-4', en: 'The first equation in this line gives the negative root, which is the smaller root.', zh: '上一步的第一个方程给出负根，也就是较小的根。' },
          ],
        }),
      factorStep('p1-quad-foundation-rearrange-factor-larger', rearrangeAndFactor[0],
        'Enter the larger root.', 1,
        'Setting $x-1=0$ gives the larger root, $1$. Both roots satisfy the original equation.',
        ['x-1&=0', String.raw`x&=\boxed{1}`],
        'Set the remaining linear factor equal to zero.',
        { answer: -1, hint: 'Check what you need to add to both sides of $x-1=0$.', zh: '检查等式 $x-1=0$ 的两边应同时加上什么。' },
        {
          hintZh: '令另一个一次因式等于零。',
          misconceptionZh: '检查所填的值是否为较大的根。',
          workedSteps: [
            { math: 'x-1=0', en: 'Set the remaining factor equal to zero.', zh: '令另一个因式等于零。' },
            { math: 'x=1', en: 'Add 1 to both sides to obtain the larger root.', zh: '等式两边同时加上 1，得到较大的根。' },
          ],
        }),
    ],
  },
]
