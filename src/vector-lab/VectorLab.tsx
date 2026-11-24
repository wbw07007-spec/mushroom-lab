import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import { MathText } from '../MathText'
import { parseScalar } from './vector-math'
import type { Vec } from './vector-math'
import { buildScene, palette } from './vector-scenes'
import type { Diagram, Mode, Operation, SceneInput } from './vector-scenes'
import { vectorRoute, vectorScenes } from './vector-routes'
import './vector-lab.css'

const VectorCanvas = lazy(() => import('./VectorCanvas').then(module => ({ default: module.VectorCanvas })))
type Translate = (en: string, zh: string) => string
type View = 'space' | 'xy' | 'xz' | 'yz'
type CameraAction = 'reset' | 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'fit'
type Draft = { fields: Record<string, string>; op: Operation; positions: boolean; displacement: boolean }
type ClassState = 'normal' | 'predict' | 'check'
type VectorGroup = 'a' | 'b' | 'd' | 'u' | 'v'
const axes = ['x', 'y', 'z'] as const
const groups: Record<Mode, VectorGroup[]> = { points: ['a','b'], operations: ['u','v'], line: ['a','d'], relations: ['a','u','b','v'] }
const captions: Record<VectorGroup, readonly [string, string, string]> = {
  a: ['Position of A', 'A 的坐标', 'A'], b: ['Position of B', 'B 的坐标', 'B'],
  d: ['Direction vector', '方向向量', 'd'], u: ['Vector u', '向量 u', 'u'], v: ['Vector v', '向量 v', 'v'],
}
const presets = {
  projection: { a: [0,0,0], u: [1,0,0], b: [0,0,1], v: [0,1,0] },
  intersecting: { a: [1,0,2], u: [1,2,-1], b: [3,1,3], v: [0,1,-1] },
  parallel: { a: [1,-2,3], u: [2,1,-1], b: [1,-1,3], v: [-4,-2,2] },
  coincident: { a: [1,-2,3], u: [2,1,-1], b: [5,0,1], v: [-4,-2,2] },
  skew: { a: [0,0,0], u: [1,1,0], b: [0,1,1], v: [1,-1,0] },
} satisfies Record<string, Partial<Record<VectorGroup, Vec>>>
const lessonA: Vec = [1,-2,3]
const lessonD: Vec = [2,1,-1]
const emptyDiagram: Diagram = { points: [], arrows: [], lines: [] }

function draftFrom(vectors: Partial<Record<VectorGroup, Vec>>, scalars: Record<string, string> = {}): Draft {
  const fields = { ...scalars }
  for (const [group, values] of Object.entries(vectors)) {
    axes.forEach((axis, i) => { fields[group + axis] = String(values[i]) })
  }
  return { fields, op: 'add', positions: false, displacement: true }
}

function defaultDraft(mode: Mode) {
  switch (mode) {
    case 'points': return draftFrom({ a: [-1,2,3], b: [2,-2,1] })
    case 'operations': return draftFrom({ u: [1,-2,3], v: [-2,1,4] }, { k: '-2' })
    case 'line': return draftFrom({ a: lessonA, d: lessonD }, { t: '0' })
    case 'relations': return draftFrom(presets.projection)
  }
}

function readVec(fields: Draft['fields'], name: VectorGroup): Vec | null {
  const [x,y,z] = axes.map(axis => parseScalar(fields[name + axis] ?? ''))
  return x === null || y === null || z === null ? null : [x,y,z]
}

function readScene(mode: Mode, draft: Draft): SceneInput | null {
  const vectors = new Map(groups[mode].map(name => [name, readVec(draft.fields, name)]))
  if ([...vectors.values()].some(value => value === null)) return null
  const at = (name: VectorGroup) => vectors.get(name)!
  switch (mode) {
    case 'points': return { mode, a: at('a'), b: at('b'), positions: draft.positions, displacement: draft.displacement }
    case 'operations': {
      const k = draft.op === 'scale' ? parseScalar(draft.fields.k) : 0
      return k === null ? null : { mode, u: at('u'), v: at('v'), k, op: draft.op }
    }
    case 'line': {
      const t = parseScalar(draft.fields.t)
      return t === null ? null : { mode, a: at('a'), d: at('d'), t }
    }
    case 'relations': return { mode, a: at('a'), u: at('u'), b: at('b'), v: at('v') }
  }
}

const sameVec = (a: Vec, b: Vec) => a.every((entry, i) => entry === b[i])

function Formula({ value }: { value: string }) {
  return <div className="vl-formula" dangerouslySetInnerHTML={{ __html: katex.renderToString(
    value, { displayMode: true, throwOnError: false },
  ) }} />
}

function NumericInput({ name, value, onChange }: {
  name: string; value: string; onChange: (value: string) => void
}) {
  return <input type="text" autoComplete="off" spellCheck={false} aria-label={name} aria-describedby="vl-input-range"
    aria-invalid={parseScalar(value) === null || undefined} value={value} onChange={event => onChange(event.target.value)} />
}

function ScalarControl({ symbol, field, value, base, t, onChange }: {
  symbol: string; field: string; value: string; base: number; t: Translate; onChange: (value: string) => void
}) {
  const number = parseScalar(value)
  const [expanded, setExpanded] = useState(base)
  const inputBound = Math.ceil(Math.abs(number ?? 0))
  const bound = Math.max(expanded, inputBound)
  useEffect(() => { if (inputBound > expanded) setExpanded(inputBound) }, [inputBound, expanded])
  return <div className="vl-scalar">
    <label><span>{symbol}</span><NumericInput name={field} value={value} onChange={onChange} /></label>
    <input type="range" step=".1" min={-bound} max={bound} value={number ?? 0} disabled={number === null}
      aria-label={t(field + ' slider', field + ' 滑块')} onChange={event => onChange(event.target.value)} />
    <span className="vl-range-limit">−{bound} <span>{bound}</span></span>
  </div>
}

function LineCheck({ t, equation, onBack }: { t: Translate; equation: string; onBack: () => void }) {
  const [showA, setShowA] = useState(false)
  const [showB, setShowB] = useState(false)
  return <section className="card vl-check">
    <button type="button" onClick={onBack}>{t('Back to the line', '返回直线')}</button>
    <h2>{t('Classroom check', '课堂检查')}</h2>
    <Formula value={equation} />
    <section><h3>{t('Question A', '问题 A')}</h3>
      <p><MathText value={t('The point $Q=(7,1,0)$ lies on the line. Find $t$.', '点 $Q=(7,1,0)$ 在直线上。求 $t$。')} /></p>
      <button type="button" aria-expanded={showA} onClick={() => setShowA(!showA)}>{showA ? t('Hide answer', '收起答案') : t('Reveal & check', '显示并核查')}</button>
      {showA && <>
        <Formula value={"\\begin{aligned}1+2t=7&\\Rightarrow t=3\\\\-2+t=1&\\Rightarrow t=3\\\\3-t=0&\\Rightarrow t=3\\end{aligned}"} />
        <p>{t('All three components give the same parameter.', '三个分量给出同一个参数。')}</p>
      </>}
    </section>
    <section><h3>{t('Question B', '问题 B')}</h3>
      <p><MathText value={t('Does $R=(7,1,1)$ lie on the line? Give a reason.', '点 $R=(7,1,1)$ 在直线上吗？说明理由。')} /></p>
      <button type="button" aria-expanded={showB} onClick={() => setShowB(!showB)}>{showB ? t('Hide answer', '收起答案') : t('Reveal & check', '显示并核查')}</button>
      {showB && <>
        <Formula value={"\\begin{aligned}1+2t=7&\\Rightarrow t=3\\\\-2+t=1&\\Rightarrow t=3\\\\3-t=1&\\Rightarrow t=2\\end{aligned}"} />
        <p>{t('R is off the line because no single parameter satisfies all three components.', '三个分量无法共用同一个参数，所以 R 不在直线上。')}</p>
      </>}
    </section>
  </section>
}

export function VectorLab({ mode, t }: { mode: Mode; t: Translate }) {
  const [drafts, setDrafts] = useState(() => ({
    points: defaultDraft('points'), operations: defaultDraft('operations'), line: defaultDraft('line'), relations: defaultDraft('relations'),
  }))
  const [view, setView] = useState<View>('space')
  const [guides, setGuides] = useState(false)
  const [command, setCommand] = useState<{ id: number; action: CameraAction }>({ id: 0, action: 'reset' })
  const [stepsOpen, setStepsOpen] = useState<Partial<Record<Mode, boolean>>>({})
  const [chosen, setChosen] = useState<Partial<Record<Mode, string>>>({})
  const [classState, setClassState] = useState<ClassState>('normal')
  const [resetVersion, setResetVersion] = useState(0)
  const [presentation, setPresentation] = useState<'native' | 'page' | null>(null)
  const lab = useRef<HTMLDivElement>(null)
  const fullscreenButton = useRef<HTMLButtonElement>(null)
  const editor = useRef<HTMLDetailsElement>(null)
  const last = useRef<Partial<Record<Mode, Diagram>>>({})
  const draft = drafts[mode]
  const input = useMemo(() => readScene(mode, draft), [mode, draft])
  const scene = useMemo(() => input ? buildScene(input) : null, [input])
  const predicting = mode === 'line' && classState === 'predict'
  const classReady = input?.mode === 'line' && sameVec(input.a, lessonA) && sameVec(input.d, lessonD)
  const open = !predicting && (stepsOpen[mode] ?? mode !== 'line')
  const steps = scene?.steps ?? []
  const step = steps.find(entry => entry.id === chosen[mode]) ?? steps[0]
  const highlights = open ? step?.highlight ?? [] : []

  useEffect(() => {
    if (scene) last.current[mode] = scene.diagram
  }, [mode, scene])

  useEffect(() => {
    const element = lab.current
    function syncFullscreen(event: Event) {
      if (document.fullscreenElement === element) setPresentation('native')
      else {
        setPresentation(current => current === 'native' ? null : current)
        if (event.target === element) fullscreenButton.current?.focus({ preventScroll: true })
      }
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  useEffect(() => {
    if (presentation !== 'page') return
    function exitOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      setPresentation(null)
      fullscreenButton.current?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', exitOnEscape)
    return () => document.removeEventListener('keydown', exitOnEscape)
  }, [presentation])

  async function toggleFullscreen() {
    const element = lab.current
    if (!element) return
    if (document.fullscreenElement === element) {
      await document.exitFullscreen().catch(() => {})
      return
    }
    if (presentation === 'page') {
      setPresentation(null)
      return
    }
    if (document.fullscreenEnabled && element.requestFullscreen) {
      try {
        await element.requestFullscreen()
        return
      } catch {
        // Embedded browsers may block native fullscreen. Use the page viewport instead.
      }
    }
    if (element.isConnected) setPresentation('page')
  }

  function transform(change: (current: Draft) => Draft) {
    setDrafts(current => ({ ...current, [mode]: change(current[mode]) }))
  }
  function put(key: string, value: string) {
    transform(current => ({ ...current, fields: { ...current.fields, [key]: value } }))
  }
  function camera(action: CameraAction) {
    if (action === 'reset' || ['left','right','up','down'].includes(action)) setView('space')
    setCommand(current => ({ id: current.id + 1, action }))
  }
  function resetData() {
    transform(() => defaultDraft(mode))
    setResetVersion(version => version + 1)
    setChosen(current => ({ ...current, [mode]: undefined }))
    if (mode === 'line') {
      if (editor.current) editor.current.open = false
      setClassState('normal')
      setStepsOpen(current => ({ ...current, line: false }))
    }
  }
  function chooseExample(key: keyof typeof presets) {
    transform(() => draftFrom(presets[key]))
    setResetVersion(version => version + 1)
    setChosen(current => ({ ...current, relations: undefined }))
  }
  function predict(value?: number) {
    if (value !== undefined) put('t', String(value))
    setClassState('predict')
  }

  const plot = scene?.diagram ?? last.current[mode] ?? emptyDiagram
  const base = mode === 'line' ? readVec(draft.fields, 'a') : null
  const lineOnly: Diagram = predicting ? {
    points: [{ id: 'origin', at: [0,0,0], label: 'O', color: palette.aux },
      ...(base ? [{ id: 'a', at: base, label: 'A', color: palette.a }] : [])],
    arrows: [], lines: scene?.diagram.lines ?? [],
  } : { ...plot, arrows: open ? plot.arrows.filter(arrow => highlights.includes(arrow.id)) : [] }
  const diagram = mode === 'line' ? lineOnly : plot
  const projectionExample = mode === 'relations'
    && Object.entries({ ax:0, ay:0, az:0, ux:1, uy:0, uz:0, bx:0, by:0, vx:0, vy:1, vz:0 })
      .every(([field, expected]) => parseScalar(draft.fields[field]) === expected)
  const unavailable = t('3D view is unavailable. You can still use the inputs, results and worked steps.',
    '此浏览器无法显示三维画布。输入、结果和计算步骤仍可使用。')
  const fields = groups[mode].map(group => {
    const [en, zh, symbol] = captions[group]
    const color = group === 'd' ? palette.u : palette[group]
    return <fieldset className="vl-vector" key={group} style={{ borderInlineStartColor: color }}>
      <legend><span className="vl-symbol" style={{ color }}>{symbol}</span> {t(en, zh)}</legend>
      <div className="vl-coordinate-fields">{axes.map(axis =>
        <label key={axis}><span>{axis}</span><NumericInput name={symbol + ' ' + axis} value={draft.fields[group+axis]}
          onChange={value => put(group+axis, value)} /></label>)}</div>
    </fieldset>
  })

  return <div className={presentation ? 'vl vl-presenting' : 'vl'} ref={lab}>
    <div className="vl-crumbs"><a href="#math-lab">{t('Math Lab', '数学实验室')}</a><a href="#p3-vectors">{t('P3 · Chapter 9', 'P3 · 第九章')}</a></div>
    <div className="vl-heading">
      <h1 className="practice-title">P3 Vector Lab</h1>
      <button ref={fullscreenButton} type="button" onClick={toggleFullscreen}>
        {presentation ? t('Exit full screen', '退出全屏') : t('Full screen', '全屏')}
      </button>
    </div>
    <nav className="vl-tabs" aria-label={t('Vector scenes', '向量场景')}>{vectorScenes.map(scene =>
      <a href={vectorRoute(scene.mode)} key={scene.mode} aria-current={scene.mode === mode ? 'page' : undefined}>
        {t(scene.title[0], scene.title[1])}
      </a>)}</nav>
    {mode === 'line' && classState === 'check' && classReady && scene?.equationMath
      ? <LineCheck t={t} equation={scene.equationMath} onBack={() => setClassState('normal')} />
      : <>
        <div className="vl-layout">
          {mode === 'line' && scene?.equationMath && <div className="vl-equation"><Formula value={scene.equationMath} /></div>}
          <section className="card vl-view">
            <div className="vl-view-bar">
              <div className="vl-view-tabs" role="group" aria-label={t('Camera view', '观察视角')}>
                {(['space','xy','xz','yz'] as const).map(item => <button type="button" key={item} aria-pressed={item === view}
                  onClick={() => setView(item)}>{item === 'space' ? t('3D', '空间') : item}</button>)}
              </div>
              <label className="vl-check-toggle"><input type="checkbox" checked={guides} onChange={event => setGuides(event.target.checked)} />
                {t('Coordinate guides', '坐标辅助线')}</label>
            </div>
            <Suspense fallback={<div className="vector-canvas-fallback vl-canvas-loading" role="status">{t('Loading 3D view…', '正在载入三维视图…')}</div>}>
              <VectorCanvas key={mode} diagram={diagram} highlighted={predicting ? [] : highlights} guides={guides} view={view} command={command}
                unavailable={unavailable} label={t('Interactive 3D vector diagram', '三维向量交互图')}
                guideLabel={t('Drag to rotate. Scroll or pinch to zoom.', '拖动可旋转，滚动或双指捏合可缩放。')} />
            </Suspense>
            <div className="vl-commands">
              <div className="vl-icon-actions" role="group" aria-label={t('Rotate and zoom', '旋转与缩放')}>
                {([
                  ['left','←','Rotate left','向左旋转'], ['right','→','Rotate right','向右旋转'],
                  ['up','↑','Rotate up','向上旋转'], ['down','↓','Rotate down','向下旋转'],
                  ['in','+','Zoom in','放大'], ['out','−','Zoom out','缩小'],
                ] as const).map(([action,label,en,zh]) => <button type="button" key={action} aria-label={t(en,zh)}
                  onClick={() => camera(action)}>{label}</button>)}
              </div>
              <button type="button" onClick={() => camera('fit')}>{t('Fit diagram', '适配图形')}</button>
              <button type="button" onClick={() => camera('reset')}>{t('Reset view', '重置视角')}</button>
            </div>
            {(mode === 'line' || mode === 'relations') && <p className="vl-caption">{t(
              'The drawn segments extend as infinite lines. Use the calculations to check the geometry.',
              '图中的线段代表无限延伸的直线。位置关系请以计算结果为准。')}</p>}
          </section>
          <section className="card vl-controls">
            <div className="vl-controls-title"><h2>{t('Inputs', '输入')}</h2>
              <button type="button" onClick={resetData}>{mode === 'line' ? t('Load classroom example', '载入课堂示例') : t('Restore defaults', '恢复默认数据')}</button>
            </div>
            {mode === 'line' ? <>
              <ScalarControl key={resetVersion} symbol="t" field="t" value={draft.fields.t} base={3} t={t} onChange={value => put('t', value)} />
              <p className="vl-caption">{t('The slider shows the current viewing interval. The line allows any real parameter t.',
                '滑块只表示当前观察区间。直线方程中的参数 t 可以取任意实数。')}</p>
              <details ref={editor} className="vl-editor"><summary>{t('Edit the line', '修改直线')}</summary>{fields}</details>
              <div className="vl-lesson-actions">
                {predicting ? <button type="button" className="button" onClick={() => {
                  setClassState('normal')
                  setStepsOpen(current => ({ ...current, line: true }))
                }}>{t('Reveal & check', '显示并核查')}</button>
                  : <button type="button" onClick={() => predict()}>{t('Predict first', '先预测')}</button>}
                <button type="button" disabled={!classReady} onClick={() => setClassState('check')}>
                  {t('Classroom check', '课堂检查')}</button>
              </div>
              {!classReady && <p className="vl-caption">{t('Load the classroom example to use the two check questions.', '载入课堂示例后可使用两道课堂检查题。')}</p>}
              <details className="vl-editor"><summary>{t('Lesson sequence · 10–12 min', '课堂流程 · 10–12 分钟')}</summary>
                <ol className="vl-lesson">
                  <li>{t('At t = 0, identify A in the equation.', 't = 0 时，在方程里找到基准点 A。')}</li>
                  <li>{t('Predict the point at t = 1 and t = 2. Compare the change between them.', '先预测 t = 1 和 t = 2 时的点。比较两点坐标的变化。')}
                    {classReady && <div className="vl-lesson-actions">{[1,2].map(value => <button key={value} type="button" onClick={() => predict(value)}>
                      {t('Predict t = ', '预测 t = ')}{value}</button>)}</div>}</li>
                  <li>{t('Predict t = −1. Then try t = −2 and reveal the displacement.', '先预测 t = −1，再试 t = −2 并揭示位移。')}
                    {classReady && <button type="button" onClick={() => predict(-1)}>{t('Predict t = −1', '预测 t = −1')}</button>}</li>
                  <li>{t('Change t and rotate the view. What remains the same?', '改变 t 并旋转视角，观察什么保持不变。')}</li>
                  <li>{t('Use the classroom check to compare all three components.', '用课堂检查题核对三个分量能否共用同一个参数。')}</li>
                </ol>
              </details>
            </> : <>
              {mode === 'relations' && <div className="vl-examples" aria-label={t('Line examples', '空间直线示例')}>
                {([
                  ['projection','Projection example','投影示例'], ['parallel','Distinct parallel','平行且不同'],
                  ['coincident','Coincident','重合'], ['intersecting','Intersecting','相交'], ['skew','Skew','异面'],
                ] as const).map(([key,en,zh]) => <button type="button" key={key} onClick={() => chooseExample(key)}>{t(en,zh)}</button>)}</div>}
              {fields}
              {mode === 'points' && <div className="vl-checks">
                <label><input type="checkbox" checked={draft.positions} onChange={event => {
                  const checked = event.target.checked
                  transform(current => ({ ...current, positions: checked }))
                }} />{t('Show position vectors', '显示位置向量')}</label>
                <label><input type="checkbox" checked={draft.displacement} onChange={event => {
                  const checked = event.target.checked
                  transform(current => ({ ...current, displacement: checked }))
                }} />{t('Show displacement vector', '显示位移向量')}</label>
              </div>}
              {mode === 'operations' && <>
                <div className="vl-op" role="group" aria-label={t('Operation', '运算')}>
                  {([['add','u + v'], ['subtract','u − v'], ['scale','k u']] as const).map(([op,label]) =>
                    <button type="button" key={op} aria-pressed={op === draft.op} onClick={() => transform(current => ({ ...current, op }))}>{label}</button>)}
                </div>
                {draft.op === 'scale' && <ScalarControl key={resetVersion} symbol="k" field="k" value={draft.fields.k} base={8} t={t} onChange={value => put('k', value)} />}
              </>}
              {projectionExample && <>
                <ScalarControl key={resetVersion} symbol="h" field="h" value={draft.fields.bz} base={5} t={t} onChange={value => put('bz', value)} />
                <p className="vl-caption">{t('h equals the z-coordinate of B. Compare the xy view with the 3D view.',
                  'h 是 B 的 z 坐标。试着比较 xy 视角和空间视角。')}</p>
              </>}
            </>}
            <p className="vl-caption" id="vl-input-range">{t('Numbers from −100 to 100, with up to six decimal places.', '请输入 −100 到 100 的数，最多六位小数。')}</p>
            {!scene ? <p className="vl-error" role="status">{t('Input pending. Correct the marked fields to apply the changes.', '输入尚未应用。请修正标出的输入框。')}</p>
              : predicting ? <p role="status" className={scene.status?.tone === 'error' ? 'vl-error' : undefined}>
                {scene.status?.tone === 'error' ? t(scene.status.en, scene.status.zh) :
                  t('Predict the coordinates of P at the chosen parameter, then reveal them.', '先根据当前参数预测 P 的坐标，再点击揭示。')}</p>
                : <div className="vl-result" aria-live="polite">
                  {scene.status && <p className={scene.status.tone === 'error' ? 'vl-error' : ''}><MathText value={t(scene.status.en, scene.status.zh)} translate /></p>}
                  {scene.resultMath && <Formula value={scene.resultMath} />}
                </div>}
          </section>
        </div>
        {!predicting && steps.length > 0 && <section className="card vl-steps">
          <button type="button" className="vl-steps-toggle" aria-expanded={open}
            onClick={() => setStepsOpen(current => ({ ...current, [mode]: !open }))}>
            {t('Worked steps', '计算步骤')} <span aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
          {open && <ol>{steps.map((entry, i) => <li key={entry.id} className={step?.id === entry.id ? 'vl-current-step' : undefined}>
            <div className="vl-step-math"><button type="button" aria-pressed={step?.id === entry.id}
              onClick={() => setChosen(current => ({ ...current, [mode]: entry.id }))}>{t('Step ', '步骤 ')}{i+1}</button>
              <Formula value={entry.math} /></div>
            <p><MathText value={t(entry.en,entry.zh)} translate /></p>
          </li>)}</ol>}
        </section>}
      </>}
  </div>
}
