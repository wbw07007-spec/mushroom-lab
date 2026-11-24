import type { SpaceLine, Vec } from './vector-math.ts'
import { add, classifyLines, isZero, norm, pointOn, scale, sub } from './vector-math.ts'

type Mark = { id: string; label: string; color: string }

export type Diagram = {
  points: (Mark & { at: Vec })[]
  arrows: (Mark & { from: Vec; to: Vec })[]
  lines: (Mark & { point: Vec; direction: Vec })[]
}

export type Step = { id: string; math: string; en: string; zh: string; highlight: readonly string[] }
export type Mode = 'points' | 'operations' | 'line' | 'relations'
export type Operation = 'add' | 'subtract' | 'scale'

export type SceneInput =
  | { mode: 'points'; a: Vec; b: Vec; positions: boolean; displacement: boolean }
  | { mode: 'operations'; u: Vec; v: Vec; k: number; op: Operation }
  | { mode: 'line'; a: Vec; d: Vec; t: number }
  | { mode: 'relations'; a: Vec; u: Vec; b: Vec; v: Vec }

export type SceneResult = {
  diagram: Diagram
  steps: Step[]
  equationMath?: string
  resultMath?: string
  status?: { en: string; zh: string; tone: 'info' | 'error' }
}

export const palette = {
  a: '#12675b',
  b: '#3159a4',
  u: '#12675b',
  v: '#3159a4',
  result: '#9d3e21',
  aux: '#775391',
} as const

const origin: Vec = [0, 0, 0]
const coordinate = ['x', 'y', 'z'] as const
const tex = String.raw
const color = (symbol: string, value: string) => tex`\textcolor{${value}}{${symbol}}`
const aligned = (...rows: string[]) => tex`\begin{aligned}${rows.join(tex`\\`)}\end{aligned}`
const column = (values: (number | string)[]) =>
  tex`\begin{pmatrix}${values.map(value => typeof value === 'number' ? number(value) : value).join(tex`\\`)}\end{pmatrix}`
const tuple = (values: Vec) => tex`\bigl(${values.map(number).join(',')}\bigr)`
const signedFactor = (value: number) => value < 0 ? tex`\left(${number(value)}\right)` : number(value)
const numericRelation = (value: number) => Number.isInteger(value) ? '=' : tex`\approx`

// Short, stable display formatting. This never feeds back into scene geometry or classification.
function number(value: number) {
  if (value === 0) return '0'
  if (!Number.isFinite(value)) return tex`\text{unavailable}`
  const rounded = Number(value.toPrecision(12))
  const [mantissa, exponent] = (Math.abs(rounded) >= 1e7 || Math.abs(rounded) < 1e-5
    ? rounded.toExponential() : String(rounded)).split('e')
  return exponent === undefined ? mantissa : tex`${mantissa}\times10^{${Number(exponent)}}`
}

const A = color('A', palette.a)
const B = color('B', palette.b)
const U = color(tex`\mathbf u`, palette.u)
const V = color(tex`\mathbf v`, palette.v)
const D = color(tex`\mathbf d`, palette.u)
const OA = color(tex`\overrightarrow{OA}`, palette.a)
const OB = color(tex`\overrightarrow{OB}`, palette.b)
const AB = color(tex`\overrightarrow{AB}`, palette.result)
const P = color('P', palette.result)
const AP = color(tex`\overrightarrow{AP}`, palette.aux)
const OP = color(tex`\overrightarrow{OP}`, palette.result)
const L1 = color('L_1', palette.a)
const L2 = color('L_2', palette.b)
const I = color('I', palette.result)

function emptyDiagram(): Diagram {
  return { points: [{ id: 'origin', at: origin, label: 'O', color: '#52615a' }], arrows: [], lines: [] }
}

function point(diagram: Diagram, id: string, at: Vec, label: string, stroke: string) {
  diagram.points.push({ id, at, label, color: stroke })
}

function arrow(diagram: Diagram, id: string, from: Vec, to: Vec, label: string, stroke: string) {
  if (isZero(sub(to, from))) point(diagram, id, from, label + ' = 0', stroke)
  else diagram.arrows.push({ id, from, to, label, color: stroke })
}

function buildPoints({ a, b, positions, displacement }: Extract<SceneInput, { mode: 'points' }>): SceneResult {
  const diagram = emptyDiagram()
  const delta = sub(b, a)
  const length = norm(delta)
  const square = delta.reduce((sum, component) => sum + component * component, 0)
  point(diagram, 'a', a, 'A', palette.a)
  point(diagram, 'b', b, 'B', palette.b)
  if (positions) {
    arrow(diagram, 'oa', origin, a, 'OA', palette.a)
    arrow(diagram, 'ob', origin, b, 'OB', palette.b)
  }
  if (displacement) arrow(diagram, 'ab', a, b, 'AB', palette.result)

  return {
    diagram,
    resultMath: aligned(tex`${AB}&=${column([...delta])}`, tex`\lVert${AB}\rVert&=${Number.isInteger(length)
      ? number(length) : tex`\sqrt{${number(square)}}`}`),
    status: isZero(delta) ? {
      tone: 'info',
      en: 'A and B coincide. The displacement is the zero vector.',
      zh: 'A 与 B 重合，位移是零向量。',
    } : undefined,
    steps: [
      {
        id: 'positions',
        math: aligned(tex`${A}&=${tuple(a)},\quad ${OA}=${column([...a])}`, tex`${B}&=${tuple(b)},\quad ${OB}=${column([...b])}`),
        en: 'A point names a location. Its position vector starts at the origin and uses the same three coordinates.',
        zh: '点表示位置。位置向量从原点出发，分量就是该点的三个坐标。',
        highlight: ['origin', 'a', 'b', 'oa', 'ob'],
      },
      {
        id: 'displacement',
        math: aligned(
          tex`${AB}&=${OB}-${OA}`,
          tex`&=${column(coordinate.map((_, i) => tex`${number(b[i])}-${signedFactor(a[i])}`))}`,
          tex`&=${column([...delta])}`,
        ),
        en: 'Subtract the coordinates of A from those of B. The displacement arrow starts at A and ends at B.',
        zh: '用终点 B 的坐标减去起点 A 的坐标。位移箭头从 A 指向 B。',
        highlight: ['a', 'b', 'ab'],
      },
      {
        id: 'magnitude',
        math: aligned(
          tex`\lVert${AB}\rVert&=\sqrt{${delta.map(value => tex`\left(${number(value)}\right)^2`).join('+')}}`,
          tex`&=\sqrt{${number(square)}}${numericRelation(length)}${number(length)}`,
        ),
        en: 'Square and add the three components, then take the nonnegative square root.',
        zh: '把三个分量分别平方并相加，再取非负平方根。',
        highlight: ['ab', 'a', 'b'],
      },
    ],
  }
}

function buildOperations({ u, v, k, op }: Extract<SceneInput, { mode: 'operations' }>): SceneResult {
  const diagram = emptyDiagram()
  const subtract = op === 'subtract'
  const term = subtract ? scale(-1, v) : v
  const result = op === 'scale' ? scale(k, u) : add(u, term)
  const operation = color(op === 'scale' ? tex`k\mathbf u` : subtract ? tex`\mathbf u-\mathbf v` : tex`\mathbf u+\mathbf v`, palette.result)
  const resultLabel = op === 'scale' ? 'ku' : subtract ? 'u − v' : 'u + v'
  const steps: Step[] = []

  arrow(diagram, 'u', origin, u, 'u', palette.u)
  if (op === 'scale') {
    steps.push(
      {
        id: 'given',
        math: aligned(tex`${U}&=${column([...u])}`, tex`k&=${number(k)}`),
        en: 'The vector u gives the reference direction. The scalar k is a single number.',
        zh: '向量 u 给出参考方向，标量 k 是一个数。',
        highlight: ['u'],
      },
      {
        id: 'scale',
        math: aligned(tex`${operation}&=${signedFactor(k)}\,${column([...u])}`, tex`&=${column([...result])}`),
        en: isZero(u) ? 'Scaling the zero vector still gives the zero vector.'
          : k < 0 ? 'Multiply every component by k. The negative sign reverses the direction.'
          : k === 0 ? 'Multiplying every component by zero gives the zero vector.'
          : 'Multiply every component by k. The positive factor preserves the direction.',
        zh: isZero(u) ? '零向量乘任意数，结果仍是零向量。'
          : k < 0 ? '每个分量都乘以 k。负号使方向反转。'
          : k === 0 ? '每个分量都乘以零，得到零向量。'
          : '每个分量都乘以 k。正数倍保持原来的方向。',
        highlight: ['u', 'result'],
      },
      {
        id: 'scale-length',
        math: aligned(tex`\left\lVert${operation}\right\rVert&=|k|\,\left\lVert${U}\right\rVert`,
          tex`&=\left|${number(k)}\right|\,\left\lVert${U}\right\rVert`,
          tex`&${numericRelation(norm(result))}${number(norm(result))}`),
        en: 'Magnitude is nonnegative. It scales by the absolute value of k.',
        zh: '模是非负量，按照 k 的绝对值缩放。',
        highlight: ['result'],
      },
    )
  } else {
    arrow(diagram, 'v', origin, v, 'v', palette.v)
    if (subtract) arrow(diagram, 'negative-v', origin, term, '−v', palette.aux)
    arrow(diagram, 'translated', u, result, subtract ? '−v (shifted)' : 'v (shifted)', subtract ? palette.aux : palette.v)
    steps.push({
      id: 'given',
      math: aligned(tex`${U}&=${column([...u])}`, tex`${V}&=${column([...v])}`),
      en: 'With both arrows drawn from the origin, their tips show their three components.',
      zh: '两个箭头都从原点出发，因此箭头终点的坐标就是相应的分量。',
      highlight: ['origin', 'u', 'v'],
    })
    if (subtract) steps.push({
      id: 'negate',
      math: tex`${color(tex`-\mathbf v`, palette.aux)}=${column([...term])}`,
      en: 'Negate each component. The negative vector has the same length and the opposite direction whenever v is nonzero.',
      zh: '把 v 的每个分量变号。若 v 非零，负向量与它等长、反向。',
      highlight: ['v', 'negative-v'],
    })
    steps.push(
      {
        id: 'translate',
        math: subtract ? tex`${operation}=${U}+\left(${color(tex`-\mathbf v`, palette.aux)}\right)`
          : tex`\left(${operation}\right)-${U}=${V}`,
        en: subtract ? 'Place −v at the tip of u. Moving both endpoints by the same amount leaves the components of −v unchanged.'
          : 'Place v at the tip of u. Moving both endpoints by the same amount leaves the components of v unchanged.',
        zh: subtract ? '把 −v 的起点移到 u 的终点。两个端点一起平移，−v 的分量保持不变。'
          : '把 v 的起点移到 u 的终点。两个端点一起平移，v 的分量保持不变。',
        highlight: ['u', 'translated'],
      },
      {
        id: 'components',
        math: aligned(
          tex`${operation}&=${column(coordinate.map((_, i) =>
            subtract ? tex`${number(u[i])}-${signedFactor(v[i])}` : tex`${number(u[i])}+${signedFactor(v[i])}`))}`,
          tex`&=${column([...result])}`,
        ),
        en: 'The resulting arrow runs from the origin to the end of the head-to-tail construction.',
        zh: '结果向量从原点指向首尾相接后的最终端点。',
        highlight: ['origin', 'translated', 'result'],
      },
    )
  }
  arrow(diagram, 'result', origin, result, resultLabel, palette.result)

  return {
    diagram,
    steps,
    resultMath: tex`${operation}=${column([...result])}`,
    status: isZero(result) ? {
      tone: 'info',
      en: 'The result is the zero vector, shown at the origin.',
      zh: '结果是零向量，在原点用标记表示。',
    } : undefined,
  }
}

function buildLine({ a, d, t }: Extract<SceneInput, { mode: 'line' }>): SceneResult {
  const diagram = emptyDiagram()
  const line: SpaceLine = { base: a, direction: d }
  if (isZero(d)) {
    point(diagram, 'a', a, 'A', palette.a)
    return {
      diagram,
      steps: [],
      status: {
        tone: 'error',
        en: 'The zero vector cannot define a line direction. Enter a nonzero direction vector.',
        zh: '零向量不能确定直线方向。请输入非零方向向量。',
      },
    }
  }

  const offset = scale(t, d)
  const p = pointOn(line, t)
  diagram.lines.push({ id: 'line', point: a, direction: d, label: 'L', color: palette.u })
  if (t === 0) point(diagram, 'p', a, 'A = P', palette.result)
  else {
    point(diagram, 'a', a, 'A', palette.a)
    point(diagram, 'p', p, 'P', palette.result)
    arrow(diagram, 'td', a, p, 'AP', palette.aux)
    if (!isZero(a) && !isZero(p)) arrow(diagram, 'op', origin, p, 'OP', palette.result)
  }
  if (!isZero(a)) arrow(diagram, 'oa', origin, a, 'OA', palette.a)
  arrow(diagram, 'd', origin, d, 'd', palette.u)
  const equationMath = aligned(
    tex`\mathbf r&=${color(tex`\mathbf a`, palette.a)}+t${D}`,
    tex`&=${column([...a])}+t\,${column([...d])},\quad t\in\mathbb R`,
  )
  const steps: Step[] = [
    {
      id: 'displacement',
      math: aligned(
        tex`${AP}&=t${D}`,
        tex`&=${signedFactor(t)}\,${column([...d])}`,
        tex`&=${column([...offset])}`,
      ),
      en: (t === 0 ? 'At t = 0 the displacement is zero, so P is at A. '
        : t < 0 ? 'From A, move opposite to d because t is negative. '
        : 'From A, move in the direction of d because t is positive. ') +
        'The parameter scales d. The distance from A to P is $|t|\\,\\lVert\\mathbf d\\rVert$.',
      zh: (t === 0 ? 't = 0 时位移为零，所以 P 与 A 重合。'
        : t < 0 ? 't 为负数，所以从 A 沿 d 的反方向移动。'
        : 't 为正数，所以从 A 沿 d 的方向移动。') +
        '参数决定 d 的倍数，A 到 P 的距离是 $|t|\\,\\lVert\\mathbf d\\rVert$。',
      highlight: ['td', 'p', 'a', 'd'],
    },
    {
      id: 'position-vector',
      math: aligned(
        tex`${OP}&=${OA}+${AP}`,
        tex`&=${column(coordinate.map((_, i) => tex`${number(a[i])}+${signedFactor(offset[i])}`))}`,
        tex`&=${column([...p])}`,
      ),
      en: t === 0 ? 'P and A coincide, so OP and OA are the same vector.'
        : isZero(a) ? 'A is at the origin, so AP is also the position vector OP.'
        : isZero(p) ? 'The displacement takes P back to the origin, so OP is the zero vector.'
        : 'Start from the origin, go to A, and add the displacement from A to P. Add the two vectors component by component.',
      zh: t === 0 ? 'P 与 A 重合，所以 OP 与 OA 是同一个向量。'
        : isZero(a) ? 'A 在原点，所以 AP 也是 P 的位置向量 OP。'
        : isZero(p) ? '位移使 P 回到原点，所以 OP 是零向量。'
        : '从原点走到 A，再加上从 A 到 P 的位移。两个向量按分量相加。',
      highlight: ['origin', 'oa', 'a', 'td', 'op', 'p'],
    },
    {
      id: 'coordinates',
      math: tex`${P}=${tuple(p)}`,
      en: 'Read the coordinates of P from its position vector. Changing t moves P along the same line. Replacing d by a nonzero multiple keeps the line and changes the parameter scale.',
      zh: '从位置向量读出 P 的坐标。改变 t 时，P 沿同一条直线移动。若把 d 换成它的非零倍数，直线保持不变，参数尺度随之改变。',
      highlight: ['p', 'line'],
    },
  ]
  return { diagram, steps, equationMath, resultMath: tex`${P}=${tuple(p)}` }
}

function equation(coefficientS: number, coefficientT: number, right: number) {
  const term = (value: number, variable: string) => (Math.abs(value) === 1 ? '' : number(Math.abs(value))) + variable
  if (coefficientS === 0 && coefficientT === 0) return tex`0&=${number(right)}`
  const first = coefficientS === 0 ? '' : (coefficientS < 0 ? '-' : '') + term(coefficientS, 's')
  const second = coefficientT === 0 ? '' : (coefficientT < 0 ? '-' : first ? '+' : '') + term(coefficientT, 't')
  return tex`${first}${second}&=${number(right)}`
}

function buildRelations({ a, u, b, v }: Extract<SceneInput, { mode: 'relations' }>): SceneResult {
  const diagram = emptyDiagram()
  const steps: Step[] = []
  point(diagram, 'a', a, 'A', palette.a)
  point(diagram, 'b', b, 'B', palette.b)
  if (!isZero(u)) diagram.lines.push({ id: 'l1', point: a, direction: u, label: 'L₁', color: palette.a })
  if (!isZero(v)) diagram.lines.push({ id: 'l2', point: b, direction: v, label: 'L₂', color: palette.b })
  const relation = classifyLines({ base: a, direction: u }, { base: b, direction: v })
  if (relation.kind === 'invalid') return {
    diagram,
    steps,
    status: { tone: 'error', en: 'Both lines need a nonzero direction vector before their relationship can be determined.',
      zh: '两条直线的方向向量都必须非零，才能判断它们的位置关系。' },
  }

  steps.push({
    id: 'equations',
    math: aligned(
      tex`${L1}:\ \mathbf r&=${column([...a])}+s\,${column([...u])}`,
      tex`${L2}:\ \mathbf r&=${column([...b])}+t\,${column([...v])}`,
    ),
    en: 'Give each line its own parameter. The same point may correspond to different parameter values.',
    zh: '两条直线分别使用独立的参数。同一个点在两条直线上的参数值可能不同。',
    highlight: ['a', 'b', 'l1', 'l2'],
  })

  if (!('axes' in relation)) {
    const { factor, offset, offsetFactor, pivot } = relation
    const coincident = relation.kind === 'coincident'
    const factorLabel = color(tex`\mathbf v`, palette.b)
    steps.push(
      {
        id: 'proportion',
        math: aligned(
          tex`k&=\frac{v_{${coordinate[pivot]}}}{u_{${coordinate[pivot]}}}=\frac{${number(v[pivot])}}{${number(u[pivot])}}`,
          tex`${factorLabel}&=k${U},\qquad k${numericRelation(factor)}${number(factor)}`,
        ),
        en: 'The same multiplier applies to all three components, so the direction vectors are proportional.',
        zh: '三个分量都满足同一个倍数关系，所以两个方向向量成比例。',
        highlight: ['l1', 'l2'],
      },
      {
        id: 'offset',
        math: aligned(
          tex`\mathbf b-\mathbf a&=${column([...offset])}`,
          tex`q&=\frac{b_{${coordinate[pivot]}}-a_{${coordinate[pivot]}}}{u_{${coordinate[pivot]}}}${numericRelation(offsetFactor)}${number(offsetFactor)}`,
          tex`\mathbf b-\mathbf a&${coincident ? '=' : '\\ne'}q\,${U}`,
        ),
        en: coincident ? 'The base point B lies on the first line because all three offset components fit the same multiplier q.'
          : 'The value q fits the selected component only as a candidate. The full offset is not a multiple of u, so the lines are distinct.',
        zh: coincident ? '三个偏移分量都符合倍数 q，因此基准点 B 在第一条直线上。'
          : 'q 由所选分量求出，仍需检查其余分量。整个偏移向量不是 u 的数倍，因此两条直线不同。',
        highlight: ['a', 'b', 'l1', 'l2'],
      },
    )
    if (coincident) steps.push({
      id: 'parameter-match',
      math: aligned(
        tex`\mathbf a+s${U}&=\mathbf a+(q+kt)${U}`,
        tex`s&=q+kt`,
        tex`&${Number.isInteger(factor) && Number.isInteger(offsetFactor) ? '=' : tex`\approx`}${number(offsetFactor)}${factor < 0 ? '-' : '+'}${number(Math.abs(factor))}t`,
      ),
      en: 'These parameters describe the same line. Every point on it is common to both equations.',
      zh: '两个参数描述同一条直线，这条直线上的每个点都满足两组方程。',
      highlight: ['l1', 'l2'],
    })
    return {
      diagram, steps,
      resultMath: coincident ? tex`${L1}=${L2}` : tex`${L1}\cap${L2}=\varnothing`,
      status: coincident
        ? { tone: 'info', en: 'Coincident lines', zh: '直线重合' }
        : { tone: 'info', en: 'Distinct parallel lines', zh: '平行且不重合' },
    }
  }

  const { axes: [i, j], s, t, firstPoint, secondPoint, determinant, residual } = relation
  if (relation.kind === 'uncertain') return {
    diagram, steps,
    status: { tone: 'error', en: 'These coordinates are too close to a numerical limit to display a reliable relationship.',
      zh: '这组坐标接近数值表示极限，暂时无法可靠显示位置关系。' },
  }
  steps.push({
    id: 'nonparallel',
    math: aligned(
      tex`\Delta&=u_{${coordinate[i]}}v_{${coordinate[j]}}-u_{${coordinate[j]}}v_{${coordinate[i]}}`,
      tex`&${numericRelation(determinant)}${number(determinant)}\ne0`,
    ),
    en: 'A nonzero difference of cross products of these two components means the directions are not proportional.',
    zh: '这两个方向分量交叉相乘的差非零，说明方向向量不成比例。',
    highlight: ['l1', 'l2'],
  })
  const offset = sub(b, a)
  const intersects = relation.kind === 'intersecting'
  if (intersects) point(diagram, 'intersection', firstPoint, 'I', palette.result)
  else {
    point(diagram, 'p1', firstPoint, 'P₁', palette.a)
    point(diagram, 'p2', secondPoint, 'P₂', palette.b)
  }
  const marks = intersects ? ['intersection', 'l1', 'l2'] : ['p1', 'p2', 'l1', 'l2']
  steps.push(
    {
      id: 'solve',
      math: aligned(
        equation(u[i], -v[i], offset[i]),
        equation(u[j], -v[j], offset[j]),
        tex`s&${numericRelation(s)}${number(s)},\qquad t${numericRelation(t)}${number(t)}`,
      ),
      en: 'Equate these two coordinates and solve the pair of equations for the independent parameters s and t.',
      zh: '令这两个坐标分别相等，联立求出彼此独立的参数 s、t。',
      highlight: marks,
    },
    {
      id: 'verify',
      math: aligned(
        ...coordinate.map((name, axis) => tex`${name}_{L_1}-${name}_{L_2}&=${number(residual[axis])}`),
      ),
      en: intersects ? 'All three coordinate differences are zero. Both lines contain the same point I.'
        : 'The two selected coordinates agree, but the remaining coordinate differs. The lines are skew.',
      zh: intersects ? '三个坐标的差均为零，所以两条直线经过同一点 I。'
        : '所选两个坐标相同，但剩下的坐标不同，因此两条直线异面。',
      highlight: marks,
    },
  )

  const isProjectionCase = isZero(a) && u[0] === 1 && u[1] === 0 && u[2] === 0 &&
    b[0] === 0 && b[1] === 0 && v[0] === 0 && v[1] === 1 && v[2] === 0
  if (isProjectionCase) steps.push({
    id: 'projection',
    math: aligned(tex`\operatorname{proj}_{xy}(L_1)&:\ y=0`, tex`\operatorname{proj}_{xy}(L_2)&:\ x=0`,
      tex`z_{L_1}&=0,\quad z_{L_2}=${number(b[2])}`),
    en: 'In the xy view the two projections cross at the origin. The actual lines intersect there only when their heights agree.',
    zh: '沿 z 轴观察时，两条投影在原点交叉。只有实际高度相同，两条空间直线才在原点相交。',
    highlight: marks,
  })

  return {
    diagram, steps,
    resultMath: intersects ? tex`${I}=${tuple(firstPoint)}` : tex`${L1}\cap${L2}=\varnothing`,
    status: intersects
      ? { tone: 'info', en: 'Intersecting lines', zh: '直线相交' }
      : { tone: 'info', en: 'Skew lines', zh: '异面直线' },
  }
}

export function buildScene(input: SceneInput): SceneResult {
  switch (input.mode) {
    case 'points': return buildPoints(input)
    case 'operations': return buildOperations(input)
    case 'line': return buildLine(input)
    case 'relations': return buildRelations(input)
  }
}
