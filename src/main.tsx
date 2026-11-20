import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './styles.css'
import mushroomMark from './mushroom-mark.svg'
import { functionNotes } from './content/function-notes'
import { TeacherEditor } from './TeacherEditor'
import { SignGraph } from './SignGraph'
import { ChordOfContactDiagram } from './ChordOfContactDiagram'
import { bank, glossary } from './content/questions'
import { practiceTopics } from './content/practice-topics'
import type { Exercise, Task } from './content/questions'
import { grade } from './grading'
import { applyAttempt, completionMethod, emptyHistory, readHistory, writeHistory } from './attempt-history'
import type { AttemptEvent } from './attempt-history'
import { standardFormRoute, standardFormTasks } from './content/quadratics-foundation'

const pages = [
  ['home', 'Home', '首页'], ['academy', 'Academy', '课程'],
  ['practice', 'Practice', '练习'], ['library', 'Resource Library', '资源库'],
  ['about', 'About', '学术主页'],
]
const tasks = practiceTopics.flatMap(topic => topic.tasks)
const storageKey = 'mushroom:p1:' + bank.version
const syllabus = 'https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf'
const studyNotes = [
  { course: '9709 · M1', prefix: 'm1', topics: [
    ['Motion in a straight line', '直线运动'], ['Forces and motion', '力与运动'], ['Forces in two dimensions', '二维力'],
  ] },
  { course: '0580 · Extended', prefix: 'ig0580', topics: [
    ['Number', '数与运算'], ['Algebra and graphs', '代数与图像'], ['Coordinate geometry', '坐标几何'],
    ['Geometry', '几何'], ['Mensuration', '度量'], ['Trigonometry', '三角学'],
    ['Transformations and vectors', '变换与向量'], ['Probability', '概率'], ['Statistics', '统计'],
  ] },
] as const
const terms = new RegExp('\\b(' + Object.keys(glossary).sort((a, b) => b.length - a.length).join('|') + ')\\b', 'gi')

function MathText({ value, translate = false }: {value: string; translate?: boolean}) {
  return value.split('$').map((part, i) => {
    if (i % 2) return <span key={i} dangerouslySetInnerHTML={{__html: katex.renderToString(part, {throwOnError: false})}} />
    if (!translate) return part
    return part.split(terms).map((word, j) => j % 2
      ? <Term key={i + '-' + j} word={word} />
      : word)
  })
}

function Term({ word }: { word: string }) {
  const [open, setOpen] = useState(false)
  return <span className="term">
    <button type="button" className="term-button" aria-expanded={open}
      onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}
      onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>{word}</button>
    <span className="definition" role="tooltip" lang="zh-CN">{glossary[word.toLowerCase()]}</span>
  </span>
}

function readProgress(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(data) ? tasks.filter(task => data.includes(task.id)).map(task => task.id) : []
  } catch { return [] }
}

function App() {
  const [page, setPage] = useState(location.hash.slice(1) || 'home')
  const practiceTopic = practiceTopics.find(topic => topic.id === page)
  const [zh, setZh] = useState(false)
  const [progress, setProgress] = useState(readProgress)
  const t = (en: string, cn: string) => zh ? cn : en
  useEffect(() => {
    function navigate() {
      setPage(location.hash.slice(1) || 'home')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  useEffect(() => { document.documentElement.lang = zh ? 'zh-CN' : 'en' }, [zh])
  function complete(id: string) {
    const next = [...new Set([...progress, id])]
    setProgress(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* Session progress is still available. */ }
  }

  return <>
    <header><div className="nav">
      <a className="brand" href="#home"><img className="logo" src={mushroomMark} alt="" width="40" height="40" /><span>Mushroom Lab</span></a>
      <nav aria-label={t('Main navigation', '主导航')}>{pages.map(([id,en,cn]) =>
        <a key={id} href={'#'+id} aria-current={page === id || (id === 'practice' && (practiceTopic || page === standardFormRoute)) ? 'page' : undefined}>{t(en,cn)}</a>)}</nav>
      <button className="language" onClick={() => setZh(!zh)} lang={zh ? 'en' : 'zh-CN'}>{zh ? 'English' : '中文'}</button>
    </div></header>
    <main>
    {page === 'home' && <>
      <section className="hero">
        <div><p className="eyebrow">{t('Independent mathematics education', '国际课程数学学习平台')}</p>
        <h1>{t('Explore Mathematics Differently.', '用不同的方式探索数学。')}</h1>
        <p>{t('Explore international mathematics through guided practice, worked solutions and teaching resources by Bowen Wei.', '跟随 Bowen Wei 的分步练习、完整解析与教学资源，探索国际课程数学。')}</p>
        <div className="actions"><a className="button" href="#practice">{t('Start P1 practice', '开始 P1 练习')} →</a><a href="#quadratics">{t('Chapter 1 · Quadratics', '第一章 · 二次函数与方程')}</a><a href="#academy">{t('Browse courses', '浏览课程')}</a></div></div>
        <div className="plot" aria-hidden="true"><div className="plot-label">P1 / FUNCTIONS</div><div className="curves"><i></i><i></i></div><div className="formula">f(x) → f(x − 3)</div></div>
      </section>
      <section className="cards">{[['academy','Academy','课程中心','Explore the international mathematics curriculum.','查看国际课程数学目录。'],['library','Resource Library','资源库','Review transformation rules and worked examples.','复习图像变换规则与例题。'],['about','Academic Portfolio','学术主页','Meet Bowen Wei, the teacher behind Mushroom Lab.','了解 Mushroom Lab 创办人 Bowen Wei。']].map(([id,en,cn,desc,cd]) =>
        <a className="card" key={id} href={'#'+id}><h2>{t(en,cn)}</h2><p>{t(desc,cd)}</p><span aria-hidden="true">↗</span></a>)}</section>
    </>}
    {page === 'academy' && <><h1>{t('Mushroom Academy','课程中心')}</h1><div className="cards">
      <article className="card"><p className="eyebrow">9709</p><h2>AS &amp; A Level Mathematics</h2><p>Pure Mathematics 1</p>
        <ul>
          {practiceTopics.filter(topic => topic.id !== 'practice').map(topic => <li key={topic.id}>
            <a href={'#'+topic.id}>{t(topic.title[0], topic.title[1])}</a> · {topic.exercises.length}
          </li>)}
          <li><a href="#practice">{t('Functions & Transformations', '函数与图像变换')}</a></li>
        </ul>
        <p><a href={syllabus}>{t('Official syllabus','官方考纲')}</a></p><p>{t('Planned modules','规划模块')} · P3 / M1 / S1</p></article>
      <article className="card"><p className="eyebrow">0580</p><h2>IGCSE Mathematics</h2><p>{t('Planned course','规划课程')}</p></article>
      <article className="card"><p className="eyebrow">9231</p><h2>Further Mathematics</h2><p>{t('Planned course','规划课程')}</p></article>
    </div></>}
    {page === 'library' && <>
      <h1>{t('Resource Library','教学资源库')}</h1>
      <article className="card reading function-notes">
        <p className="eyebrow">9709 / P1 / 1.2</p>
        <h2>{t('Functions revision notes','函数复习笔记')}</h2>
        {functionNotes.map(note => <section key={note.title[0]}>
          <h3>{note.title[zh ? 1 : 0]}</h3>
          <p><MathText value={note.rule[zh ? 1 : 0]} /></p>
          <p><MathText value={note.example[zh ? 1 : 0]} /></p>
        </section>)}
        <a className="button" href="#practice">{t('Practise this topic','练习这一专题')} →</a>
      </article>
      <section className="cards study-notes" aria-label={t('Downloadable study notes', '可下载知识点整理')}>
        {studyNotes.map(({course, prefix, topics}) => <article className="card" key={prefix}>
          <h2>{course}</h2>
          <ul>{topics.map(([en, cn], index) => <li key={en}>
            <a href={import.meta.env.BASE_URL + 'study-notes/' + prefix + '-' + String(index + 1).padStart(2, '0') + '.pdf'}>
              {t(en, cn)} (PDF)
            </a>
          </li>)}</ul>
        </article>)}
      </section>
    </>}
    {page === 'about' && <><p className="eyebrow">{t('Academic Portfolio','学术主页')}</p><h1>Bowen Wei</h1><article className="card reading"><h2>{t('Education','教育背景')}</h2><p>University of Manchester · Mathematics with Financial Mathematics</p><h2>{t('Teaching & curriculum','教学与课程开发')}</h2><p>{t('International mathematics teaching, curriculum development and mathematics teaching leadership.', '国际课程数学教学、课程开发与数学教研管理。')}</p></article></>}
    {page === standardFormRoute && <StandardFormPractice t={t} />}
    {practiceTopic && <Practice key={practiceTopic.id} topicId={practiceTopic.id} t={t} progress={progress} complete={complete}
      exercises={practiceTopic.exercises} topicTasks={practiceTopic.tasks} title={t(practiceTopic.title[0], practiceTopic.title[1])} />}
    {page === 'past-papers' && <p><a href="#library">{t('Return to Resource Library','返回教学资源库')}</a></p>}
    {page === 'teacher' && <TeacherEditor t={t} preview={(task, context) =>
      <Question key={JSON.stringify(task)} task={task} context={context} t={t} onCorrect={() => {}} />} />}
    {page !== 'teacher' && page !== 'past-papers' && page !== standardFormRoute && !practiceTopic && !pages.some(([id]) => page === id) && <><h1>{t('Page unavailable','页面无法访问')}</h1><a href="#home">{t('Return home','返回首页')}</a></>}
    </main>
    <footer><strong>Mushroom Lab</strong><a href="#teacher">{t('Question Builder','教师题目编辑器')}</a><span>{t('Explore Mathematics Differently.','蘑菇数学实验室')}</span></footer>
  </>
}

type PracticeProps = { t: (en: string, cn: string) => string; progress: string[]; complete: (id: string) => void }
function Practice({ t, progress, complete, exercises, topicTasks, title, topicId }: PracticeProps & {
  exercises: Exercise[]; topicTasks: Task[]; title: string; topicId: string
}) {
  const [index, setIndex] = useState(() => Math.max(0, topicTasks.findIndex(task => !progress.includes(task.id))))
  const task = topicTasks[index]
  const exercise = exercises.find(item => item.tasks.some(step => step.id === task.id))!
  const exerciseStart = topicTasks.findIndex(step => step.id === exercise.tasks[0].id)
  const completedCount = topicTasks.filter(step => progress.includes(step.id)).length
  return <>
    <div className="practice-heading">
      <a href="#academy">{t('Academy','课程中心')}</a><span> / Cambridge 9709 / Pure Mathematics 1</span>
      <h1 className="practice-title">{title}</h1>
      <label className="exercise-picker" style={{ maxWidth: 420 }}>{t('P1 chapter', 'P1 章节')}
        <select value={topicId} onChange={event => { location.hash = event.target.value }}>
          {practiceTopics.map(topic => <option key={topic.id} value={topic.id}>{t(topic.title[0], topic.title[1])}</option>)}
        </select>
      </label>
    </div>
    {topicId === 'quadratics' && <section className="card foundation-entry">
      <p className="eyebrow">{t('Chapter 1 · Lesson 1.1', '第一章 · 第 1.1 节')}</p>
      <h2>{t('Solving quadratics by factorisation', '用因式分解解二次方程')}</h2>
      <a href={'#'+standardFormRoute}>{t('Foundation · Standard form: find the constant', '基础练习 · 化为标准形式：确定常数项')}</a>
    </section>}
    {topicId === 'quadratics' && <h2>{t('Chapter consolidation · Exam-style questions', '章节巩固 · 真题同类练习')}</h2>}
    <div className="practice-layout">
      <aside className="card"><p>{t('Progress','学习进度')} · {completedCount}/{topicTasks.length}</p>
      <progress aria-label={t('Progress','学习进度')} value={completedCount} max={topicTasks.length} />
      <label className="exercise-picker">{t('Exercise','选择练习')}
        <select value={exercise.id} onChange={event => {
          const selected = exercises.find(item => item.id === event.target.value)
          if (selected) setIndex(topicTasks.findIndex(step => step.id === selected.tasks[0].id))
        }}>
          {exercises.map((item, position) => <option key={item.id} value={item.id}>
            {position + 1}. {item.title}{item.tasks.every(step => progress.includes(step.id)) ? ' ✓' : ''}
          </option>)}
        </select>
      </label></aside>
      <Question key={task.id} task={task} context={exercise.context} step={exercise.tasks.length > 1 ? (index-exerciseStart+1) + '/' + exercise.tasks.length : undefined}
        diagram={exercise.id === 'p1-cg-07' && <ChordOfContactDiagram label={t('Two tangents from T touch the circle at A and B. C is the centre.', '从圆外点 T 引两条切线，切点为 A 和 B，圆心为 C。')} />}
        t={t} track legacyCompleted={progress.includes(task.id)} onCorrect={() => complete(task.id)} previous={index > 0 ? () => setIndex(index-1) : undefined}
        next={index < topicTasks.length-1 ? () => setIndex(index+1) : undefined} />
    </div>
    <p className="muted">{t('Progress measures completed practice tasks. Cambridge exam grades use separate assessment criteria.','进度记录已完成的练习任务。Cambridge 考试使用独立的评分标准。')}</p>
  </>
}

function Question({ task, context, step, diagram, t, onCorrect, previous, next, track = false, legacyCompleted = false, hint, commonMistake }: {
  task: typeof tasks[number]; context?: string; step?: string; diagram?: ReactNode; t: PracticeProps['t'];
  onCorrect: () => void; previous?: () => void; next?: () => void
  track?: boolean; legacyCompleted?: boolean; hint?: string; commonMistake?: { answer: number; hint: string }
}) {
  const [response, setResponse] = useState<number[]>([])
  const formInput = useRef<HTMLInputElement>(null)
  const [number, setNumber] = useState('')
  const [vector, setVector] = useState<[string, string]>(['', ''])
  const [feedback, setFeedback] = useState<'ready'|'correct'|'retry'|'missing'>('ready')
  const [history, setHistory] = useState(() => track ? readHistory(browserStorage, task.id) : emptyHistory)
  const [hintText, setHintText] = useState('')
  const [solutionOpen, setSolutionOpen] = useState(false)
  const method = completionMethod(history, legacyCompleted)
  const answer = task.answer

  function remember(event: AttemptEvent) {
    if (!track) return
    const nextHistory = applyAttempt(history, event)
    setHistory(nextHistory)
    writeHistory(browserStorage, task.id, nextHistory)
  }

  function showHint() {
    const matchesMistake = commonMistake && grade({ type: 'number', correct: commonMistake.answer }, number)
    setHintText(matchesMistake ? commonMistake.hint : hint ?? task.misconception)
    remember('hint')
  }

  function toggleSolution() {
    if (!solutionOpen) remember('solution')
    setSolutionOpen(!solutionOpen)
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    const result = grade(answer, answer.type === 'vector' ? vector : answer.type === 'number' ? number : response)
    setFeedback(result === null ? 'missing' : result ? 'correct' : 'retry')
    if (result !== null) remember(result ? 'correct' : 'incorrect')
    if (result) onCorrect()
  }
  return <article className="card question">
    <p className="eyebrow">{step ? t('Guided practice · Step ', '分步练习 · 步骤 ') + step : t('Guided practice','引导练习')}</p>
    {context && <p><MathText value={context} translate /></p>}
    {diagram}
    {track && <p className="attempt-meta">
      {method && <strong>{t(completionLabels[method][0], completionLabels[method][1])} · </strong>}
      {t('Valid attempts', '有效尝试')} {history.attempts}
    </p>}
    <form onSubmit={submit}><fieldset><legend><MathText value={task.prompt} translate /></legend>
      {answer.type === 'vector'
        ? <div className="vector-entry">
            <p>{t('Translation by the vector','平移向量')}</p>
            <div className="column-vector">
              <input aria-label={t('Horizontal displacement','水平位移')} autoComplete="off" value={vector[0]} onChange={event => {setVector([event.target.value, vector[1]]); setFeedback('ready')}} />
              <input aria-label={t('Vertical displacement','竖直位移')} autoComplete="off" value={vector[1]} onChange={event => {setVector([vector[0], event.target.value]); setFeedback('ready')}} />
            </div>
          </div>
        : answer.type === 'number'
        ? <label className="numeric">{t('Enter a number or fraction','输入数值或分数')}<input ref={formInput} autoComplete="off" value={number} onChange={event => {setNumber(event.target.value); setFeedback('ready')}} /></label>
        : answer.choices.map((choice, i) => <label className="choice" key={choice}>
            <input name="answer" type={answer.type === 'single' ? 'radio' : 'checkbox'} checked={response.includes(i)}
              onChange={event => {setFeedback('ready'); setResponse(answer.type === 'single' ? [i] : event.target.checked ? [...response,i] : response.filter(value => value !== i))}} />
            <MathText value={choice} />
          </label>)}</fieldset>
      <div className="actions"><button className="button" type="submit">{t('Check answer','检查答案')}</button>
        {previous && <button type="button" onClick={previous}>{t('Previous','上一步')}</button>}
        {next && <button type="button" onClick={next}>{t('Next','下一步')} →</button>}</div>
    </form>
    <div aria-live="polite">{feedback === 'correct' && <div className="feedback"><strong>{t('Correct','回答正确')}</strong><p><MathText value={task.solution} /></p>{task.signGraph && <SignGraph graph={task.signGraph} />}</div>}
    {feedback === 'retry' && <div className="feedback retry"><strong>{t('Try again','再试一次')}</strong>
      {track
        ? <div className="actions">
            <button type="button" onClick={() => { setFeedback('ready'); setHintText(''); formInput.current?.focus() }}>{t('Retry without help', '自行订正')}</button>
            <button type="button" onClick={showHint}>{t('Show hint', '看提示')}</button>
          </div>
        : <> · {task.misconception}</>}
      {hintText && <p><MathText value={hintText} /></p>}
    </div>}
    {feedback === 'missing' && <p className="feedback retry">{answer.type === 'vector'
      ? t('Enter a valid number in both rows of the column vector.','请在列向量的上下两行分别输入有效数值。')
      : t('Enter a valid answer or select an option.','请输入有效答案或选择选项。')}</p>}</div>
    {feedback !== 'correct' && <div className="worked-solution">
      <button type="button" aria-expanded={solutionOpen} onClick={toggleSolution}>{solutionOpen ? t('Hide worked solution', '收起完整解析') : t('Show worked solution', '查看完整解析')}</button>
      {solutionOpen && <div><p><MathText value={task.solution} /></p>{task.signGraph && <SignGraph graph={task.signGraph} />}</div>}
    </div>}
  </article>
}

const browserStorage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
}

const completionLabels = {
  first: ['Correct independently on first attempt', '首次独立答对'],
  retried: ['Correct independently after a retry', '重试后独立答对'],
  assisted: ['Correct after using help', '借助帮助后答对'],
  legacy: ['Completed · method unknown', '已完成，作答方式未知'],
} as const

function StandardFormPractice({ t }: Pick<PracticeProps, 't'>) {
  const [index, setIndex] = useState<number | null>(null)
  const [completed, setCompleted] = useState(() => standardFormTasks.map(({ task }) =>
    readHistory(browserStorage, task.id).completed))
  const active = index === null ? null : standardFormTasks[index]
  const count = completed.filter(Boolean).length

  return <section className="foundation-practice">
    <div className="practice-heading">
      <a href="#quadratics">{t('Chapter 1 · Quadratics', '第一章 · 二次函数与方程')}</a>
      <p className="eyebrow">{t('Lesson 1.1 · Solving quadratics by factorisation', '第 1.1 节 · 用因式分解解二次方程')}</p>
      <h1 className="practice-title">{t('Standard form: find the constant', '化为标准形式：确定常数项')}</h1>
    </div>
    <article className="card reading foundation-guide">
      <p><strong>{t('Learning goal', '学习目标')}</strong> <MathText translate value={t(
        'Find the signed constant after writing a quadratic equation with zero on the right.',
        '把二次方程右边化为零后，确定左边常数项的值及其符号。')} /></p>
      <p><strong>{t('Rule', '规则')}</strong> <MathText translate value={t(
        'Subtract the entire right-hand side from both sides. The new constant is the left constant minus the right constant.',
        '两边同时减去右边的整个式子。新的常数项等于左边的常数项减去右边的常数项。')} /></p>
      <p><strong>{t('Example', '例题')}</strong> <MathText translate value={t(
        'In $x^2+2x-3=4$, subtract 4 from both sides to get $x^2+2x-7=0$. The constant is $-7$.',
        '在 $x^2+2x-3=4$ 中，两边减去 4 得 $x^2+2x-7=0$，因此常数项为 $-7$。')} /></p>
      {index === null && <button className="button" onClick={() => {
        const firstIncomplete = completed.indexOf(false)
        setIndex(firstIncomplete < 0 ? 0 : firstIncomplete)
      }}>{count > 0 && count < standardFormTasks.length ? t('Resume practice', '继续练习') : t('Start practice', '开始练习')}</button>}
    </article>
    <p className="attempt-meta" aria-live="polite">{t('Completed', '已完成')} {count}/{standardFormTasks.length}</p>
    {active && index !== null && <>
      <label className="exercise-picker foundation-picker">{t('Question', '题目')}
        <select value={index} onChange={event => setIndex(Number(event.target.value))}>
          {standardFormTasks.map(({ task }, position) => <option key={task.id} value={position}>
            {position+1}{completed[position] ? ' ✓' : ''}
          </option>)}
        </select>
      </label>
      <Question key={active.task.id} task={active.task} hint={active.hint} commonMistake={active.commonMistake}
        step={(index+1)+'/'+standardFormTasks.length} t={t} track
        onCorrect={() => setCompleted(current => current.map((done, position) => done || position === index))}
        previous={index > 0 ? () => setIndex(index-1) : undefined}
        next={index+1 < standardFormTasks.length ? () => setIndex(index+1) : undefined} />
    </>}
  </section>
}

createRoot(document.getElementById('root')!).render(<App />)

