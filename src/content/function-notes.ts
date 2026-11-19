export const functionNotes = [
  {
    title: ['Domain and range', '定义域与值域'],
    rule: ['The domain contains the allowed inputs; the range contains the outputs actually attained.', '定义域是所有允许的输入，值域是实际能够取得的输出。'],
    example: [
      'For $h(x)=\\sqrt{x+4}-2$, require $x+4\\geq 0$. The domain is $x\\geq -4$ and the range is $h(x)\\geq -2$.',
      '对 $h(x)=\\sqrt{x+4}-2$，先令 $x+4\\geq 0$。定义域为 $x\\geq -4$，值域为 $h(x)\\geq -2$。',
    ],
  },
  {
    title: ['Composite functions', '复合函数'],
    rule: ['In $gf(x)=g(f(x))$, apply $f$ first. The range of $f$ must lie within the domain of $g$ for the composite to be defined on the whole domain of $f$.', '$gf(x)=g(f(x))$ 中先应用 $f$。要使复合函数在 $f$ 的整个定义域上成立，$f$ 的值域须包含在 $g$ 的定义域内。'],
    example: [
      'If $f(x)=x+1$ and $g(x)=x^2$, then $gf(2)=9$ while $fg(2)=5$.',
      '若 $f(x)=x+1$、$g(x)=x^2$，则 $gf(2)=9$，而 $fg(2)=5$。',
    ],
  },
  {
    title: ['Inverse functions', '反函数'],
    rule: ['An inverse requires a one-to-one function. Its domain and range are swapped, and its graph is the reflection of the original graph in $y=x$.', '一一函数才有反函数。原函数的定义域与值域互换，两条图像关于 $y=x$ 对称。'],
    example: [
      'For $h(x)=x^2+2$ with $x\\leq 0$, take the negative square-root branch: $h^{-1}(x)=-\\sqrt{x-2}$ for $x\\geq 2$.',
      '对 $x\\leq 0$ 上的 $h(x)=x^2+2$，取负平方根分支，得 $h^{-1}(x)=-\\sqrt{x-2}$，定义域为 $x\\geq 2$。',
    ],
  },
  {
    title: ['Graph transformations', '图像变换'],
    rule: ['Use a column vector for a translation, with horizontal displacement above vertical displacement.', '平移用列向量表示，上方是水平位移，下方是竖直位移。'],
    example: [
      'If $a,b>0$, $y=f(x-a)+b$ is a translation by $\\begin{pmatrix}a\\\\b\\end{pmatrix}$. The graph of $y=-f(x)$ is a reflection in the $x$-axis.',
      '若 $a,b>0$，则 $y=f(x-a)+b$ 对应平移向量 $\\begin{pmatrix}a\\\\b\\end{pmatrix}$。$y=-f(x)$ 对应关于 $x$ 轴反射。',
    ],
  },
] as const
