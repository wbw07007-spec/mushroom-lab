import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './styles.css'
import mushroomMark from './mushroom-mark.svg'
import { functionNotes } from './content/function-notes'
import { TeacherEditor } from './TeacherEditor'
import { SignGraph } from './SignGraph'
import { bank, glossary } from './content/questions'
import { quadratics } from './content/quadratics'
import { functionsCompanions } from './content/functions-companions'
import type { Exercise, Task } from './content/questions'
import { grade } from './grading'

const pages = [
  ['home', 'Home', '首页'], ['academy', 'Academy', '课程'],
  ['practice', 'Practice', '练习'], ['library', 'Resource Library', '资源库'],
  ['about', 'About', '学术主页'],
]
const functionsTasks = bank.exercises.flatMap<Task>(exercise => exercise.tasks)
const companionTasks = functionsCompanions.flatMap(exercise => exercise.tasks)
const quadraticsTasks = quadratics.flatMap(exercise => exercise.tasks)
const tasks = [...functionsTasks, ...quadraticsTasks, ...companionTasks]
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
        <a key={id} href={'#'+id} aria-current={page === id || (id === 'practice' && ['quadratics', 'functions-companions'].includes(page)) ? 'page' : undefined}>{t(en,cn)}</a>)}</nav>
      <button className="language" onClick={() => setZh(!zh)} lang={zh ? 'en' : 'zh-CN'}>{zh ? 'English' : '中文'}</button>
    </div></header>
    <main>
    {page === 'home' && <>
      <section className="hero">
        <div><p className="eyebrow">{t('Independent mathematics education', '国际课程数学学习平台')}</p>
        <h1>{t('Explore Mathematics Differently.', '用不同的方式探索数学。')}</h1>
        <p>{t('Explore international mathematics through guided practice, worked solutions and teaching resources by Bowen Wei.', '跟随 Bowen Wei 的分步练习、完整解析与教学资源，探索国际课程数学。')}</p>
        <div className="actions"><a className="button" href="#practice">{t('Start P1 practice', '开始 P1 练习')} →</a><a href="#academy">{t('Browse courses', '浏览课程')}</a></div></div>
        <div className="plot" aria-hidden="true"><div className="plot-label">P1 / FUNCTIONS</div><div className="curves"><i></i><i></i></div><div className="formula">f(x) → f(x − 3)</div></div>
      </section>
      <section className="cards">{[['academy','Academy','课程中心','Explore the international mathematics curriculum.','查看国际课程数学目录。'],['library','Resource Library','资源库','Review transformation rules and worked examples.','复习图像变换规则与例题。'],['about','Academic Portfolio','学术主页','Meet Bowen Wei, the teacher behind Mushroom Lab.','了解 Mushroom Lab 创办人 Bowen Wei。']].map(([id,en,cn,desc,cd]) =>
        <a className="card" key={id} href={'#'+id}><h2>{t(en,cn)}</h2><p>{t(desc,cd)}</p><span aria-hidden="true">↗</span></a>)}</section>
    </>}
    {page === 'academy' && <><h1>{t('Mushroom Academy','课程中心')}</h1><div className="cards">
      <article className="card"><p className="eyebrow">9709</p><h2>AS &amp; A Level Mathematics</h2><p>Pure Mathematics 1</p>
        <ul>
          <li><a href="#functions-companions">{t('Functions: Exam-style Practice', '函数真题同类练习')}</a></li>
          <li><a href="#quadratics">{t('1.1 Quadratics','1.1 二次函数与方程')}</a></li>
          <li><a href="#practice">{t('1.2 Functions','1.2 函数')}</a></li>
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
    {page === 'practice' && <Practice key="functions" t={t} progress={progress} complete={complete}
      exercises={bank.exercises} topicTasks={functionsTasks} title={t(bank.topic, '函数与图像变换')} />}
    {page === 'quadratics' && <Practice key="quadratics" t={t} progress={progress} complete={complete}
      exercises={quadratics} topicTasks={quadraticsTasks} title={t('Quadratics', '二次函数与方程')} />}
    {page === 'functions-companions' && <Practice key="functions-companions" t={t} progress={progress} complete={complete}
      exercises={functionsCompanions} topicTasks={companionTasks} title={t('Functions: Exam-style Practice', '函数真题同类练习')} />}
    {page === 'past-papers' && <p><a href="#library">{t('Return to Resource Library','返回教学资源库')}</a></p>}
    {page === 'teacher' && <TeacherEditor t={t} preview={(task, context) =>
      <Question key={JSON.stringify(task)} task={task} context={context} t={t} onCorrect={() => {}} />} />}
    {page !== 'teacher' && page !== 'past-papers' && page !== 'quadratics' && page !== 'functions-companions' && !pages.some(([id]) => page === id) && <><h1>{t('Page unavailable','页面无法访问')}</h1><a href="#home">{t('Return home','返回首页')}</a></>}
    </main>
    <footer><strong>Mushroom Lab</strong><a href="#teacher">{t('Question Builder','教师题目编辑器')}</a><span>{t('Explore Mathematics Differently.','蘑菇数学实验室')}</span></footer>
  </>
}

type PracticeProps = { t: (en: string, cn: string) => string; progress: string[]; complete: (id: string) => void }
function Practice({ t, progress, complete, exercises, topicTasks, title }: PracticeProps & {
  exercises: Exercise[]; topicTasks: Task[]; title: string
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
      <div className="actions" aria-label={t('P1 topics','P1 专题')}>
        <a href="#quadratics">{t('Quadratics','二次函数与方程')}</a>
        <a href="#practice">{t('Functions & Transformations','函数与图像变换')}</a>
        <a href="#functions-companions">{t('Functions: Exam-style Practice','函数真题同类练习')}</a>
      </div>
    </div>
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
        t={t} onCorrect={() => complete(task.id)} previous={index > 0 ? () => setIndex(index-1) : undefined}
        next={index < topicTasks.length-1 ? () => setIndex(index+1) : undefined} />
    </div>
    <p className="muted">{t('Progress measures completed practice tasks. Cambridge exam grades use separate assessment criteria.','进度记录已完成的练习任务。Cambridge 考试使用独立的评分标准。')}</p>
  </>
}

function Question({ task, context, step, t, onCorrect, previous, next }: {
  task: typeof tasks[number]; context?: string; step?: string; t: PracticeProps['t'];
  onCorrect: () => void; previous?: () => void; next?: () => void
}) {
  const [response, setResponse] = useState<number[]>([])
  const [number, setNumber] = useState('')
  const [vector, setVector] = useState<[string, string]>(['', ''])
  const [feedback, setFeedback] = useState<'ready'|'correct'|'retry'|'missing'>('ready')
  const answer = task.answer
  function submit(event: FormEvent) {
    event.preventDefault()
    const result = grade(answer, answer.type === 'vector' ? vector : answer.type === 'number' ? number : response)
    setFeedback(result === null ? 'missing' : result ? 'correct' : 'retry')
    if (result) onCorrect()
  }
  return <article className="card question">
    <p className="eyebrow">{step ? t('Guided practice · Step ', '分步练习 · 步骤 ') + step : t('Guided practice','引导练习')}</p>
    {context && <p><MathText value={context} translate /></p>}
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
        ? <label className="numeric">{t('Enter a number or fraction','输入数值或分数')}<input value={number} onChange={event => {setNumber(event.target.value); setFeedback('ready')}} /></label>
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
    {feedback === 'retry' && <p className="feedback retry"><strong>{t('Try again','再试一次')}</strong> · {task.misconception}</p>}
    {feedback === 'missing' && <p className="feedback retry">{answer.type === 'vector'
      ? t('Enter a valid number in both rows of the column vector.','请在列向量的上下两行分别输入有效数值。')
      : t('Enter a valid answer or select an option.','请输入有效答案或选择选项。')}</p>}</div>
    {feedback !== 'correct' && <details><summary>{t('Worked solution','完整解析')}</summary><p><MathText value={task.solution} /></p>{task.signGraph && <SignGraph graph={task.signGraph} />}</details>}
  </article>
}

createRoot(document.getElementById('root')!).render(<App />)

