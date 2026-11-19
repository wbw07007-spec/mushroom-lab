export type Answer = { type: 'single' | 'multiple'; choices: string[]; correct: number[] }
  | { type: 'number'; correct: number }
  | { type: 'vector'; correct: [number, number] }
export type Task = {
  id: string; skill: string; difficulty: 'foundation' | 'standard'; prompt: string;
  answer: Answer; solution: string; misconception: string;
}
export type Exercise = { id: string; title: string; context?: string; tasks: Task[] }

export const bank = {
  syllabus: '9709', years: '2026–2027', component: 'P1', chapter: '1.2 Functions',
  topic: 'Functions & Transformations', version: 1,
  exercises: [
    { id: 'translation', title: 'Read a translation', tasks: [{
      id: 'translation-vector', skill: 'Horizontal translation', difficulty: 'foundation',
      prompt: 'The graph of $y=f(x)$ is mapped onto $y=f(x-3)$ by a translation. Give the translation vector as a column vector.',
      answer: { type: 'vector', correct: [3, 0] },
      solution: String.raw`Translation by the vector $\begin{pmatrix}3\\0\end{pmatrix}$. The original point $(a,f(a))$ maps to $(a+3,f(a))$, since $(a+3)-3=a$. The horizontal displacement is $3$ and the vertical displacement is $0$.`,
      misconception: 'Match the new argument x − 3 to the original input. Then compare the old and new coordinates.',
    }] },
    { id: 'properties', title: 'Compare two graphs', tasks: [{
      id: 'properties', skill: 'Reflection in the x-axis', difficulty: 'standard',
      prompt: 'Select every statement that holds when $y=f(x)$ becomes $y=-f(x)$.',
      answer: { type: 'multiple', choices: ['The domain stays the same.', 'Each output changes sign.', 'Each input changes sign.', 'The graph is reflected in the $y$-axis.'], correct: [0, 1] },
      solution: 'Each point $(x,y)$ maps to $(x,-y)$. The input is unchanged, so the domain is unchanged and the graph is reflected in the $x$-axis.',
      misconception: 'Negating the output reflects in the x-axis. Negating the input reflects in the y-axis.',
    }] },
    { id: 'minimum', title: 'Find a minimum', tasks: [{
      id: 'minimum', skill: 'Range of a quadratic', difficulty: 'foundation',
      prompt: 'Find the minimum value of $g(x)=(x-4)^2-3$ for real $x$.',
      answer: { type: 'number', correct: -3 },
      solution: 'The square is non-negative and equals zero at $x=4$. Therefore the minimum value of $g$ is $-3$.',
      misconception: 'The question asks for the output, so enter −3. The input at the minimum is 4.',
    }] },
    { id: 'point-mapping', title: 'Map a point in two steps',
      context: 'The point $(4,5)$ lies on $y=f(x)$. Find the corresponding point on $y=2f(x+3)-1$.',
      tasks: [
        { id: 'input', skill: 'Horizontal translation', difficulty: 'standard',
          prompt: 'Which equation gives the new $x$-coordinate?',
          answer: { type: 'single', choices: ['$x+3=4$', '$x-3=4$', '$2x=4$'], correct: [0] },
          solution: String.raw`Set $x+3=4$, giving $x=1$. The horizontal translation is by $\begin{pmatrix}-3\\0\end{pmatrix}$.`,
          misconception: 'Match the entire new argument to the original input.',
        },
        { id: 'output', skill: 'Vertical stretch and translation', difficulty: 'standard',
          prompt: 'Find the new $y$-coordinate.',
          answer: { type: 'number', correct: 9 },
          solution: String.raw`Apply a stretch of scale factor $2$ parallel to the $y$-axis, then a translation by $\begin{pmatrix}0\\-1\end{pmatrix}$. Since $f(4)=5$, the new output is $2(5)-1=9$. The corresponding point is $(1,9)$.`,
          misconception: 'Multiply the original output by 2 before subtracting 1.',
        },
      ],
    },
  ] satisfies Exercise[],
}

export const glossary: Record<string, string> = {
  'column vector': '列向量。平移向量上方写水平位移，下方写竖直位移。',
  'translation vector': '平移向量。每个分量表示对应坐标的改变量。',
  'corresponding point': '对应点。对原图上的点应用同一组变换后得到的点。',
  'minimum value': '最小值。题目要求的是最小的函数输出。',
  'translation': '平移。图像上的每个点沿同一方向移动相同距离。',
  'domain': '定义域。函数允许的所有输入值。',
  'reflected': '反射。图像关于指定轴或直线作镜像变换。',
  'real': '实数。',
}

