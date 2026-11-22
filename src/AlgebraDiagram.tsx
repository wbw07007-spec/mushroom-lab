import katex from 'katex'

export type DiagramKind = 'move-sign' | 'zero-product' | 'factor-roots'
type Translate = (en: string, zh: string) => string

const diagrams = {
  'move-sign': {
    heading: ['Distribute the minus sign', '负号作用于括号里的每一项'],
    start: '-(2x-10)',
    branches: [
      ['-(2x)', '-2x', 'Opposite of the linear term', '一次项取相反数'],
      ['-(-10)', '+10', 'Opposite of a negative constant', '负常数取相反数，得到正数'],
    ],
  },
  'zero-product': {
    heading: ['Zero-product branches', '零乘积的两个分支'],
    start: '(2x+5)(x-4)=0',
    branches: [
      ['2x+5=0', 'x=-\\tfrac52', 'Smaller root', '较小的根'],
      ['x-4=0', 'x=4', 'Larger root', '较大的根'],
    ],
  },
  'factor-roots': {
    heading: ['Match each factor to its root', '核对因式与根的对应关系'],
    start: '2(x+4)(x-1)=0',
    branches: [
      ['x+4=0', 'x=-4', 'The factor x + 4 vanishes', '使因式 x + 4 等于零'],
      ['x-1=0', 'x=1', 'The factor x − 1 vanishes', '使因式 x − 1 等于零'],
    ],
  },
} as const

function Formula({ math }: { math: string }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />
}

export function AlgebraDiagram({ kind, t }: { kind: DiagramKind; t: Translate }) {
  const diagram = diagrams[kind]
  return <figure className="algebra-diagram">
    <figcaption>{t(diagram.heading[0], diagram.heading[1])}</figcaption>
    <div className="diagram-start"><Formula math={diagram.start} /></div>
    <ul className="diagram-branches">
      {diagram.branches.map(([from, to, en, zh]) => <li key={from}>
        <div className="diagram-arrow"><Formula math={from} /><span aria-hidden="true">→</span><Formula math={to} /></div>
        <span>{t(en, zh)}</span>
      </li>)}
    </ul>
  </figure>
}
