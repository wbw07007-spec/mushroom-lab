import { useEffect, useId, useRef, useState } from 'react'
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
import { grade, sameNumericInput } from './grading'
import { applyAttempt, completionMethod, emptyHistory, readHistory, writeHistory } from './attempt-history'
import type { AttemptEvent } from './attempt-history'
import { factorisationExercises, q8Independent, standardFormRoute, standardFormTasks } from './content/quadratics-foundation'
import { quadraticsChapter } from './content/quadratics-sections'
import { countCompletedQuestions, readSectionCursor, writeSectionCursor } from './section-progress'
import { readDrafts } from './teacher-drafts'
import { AlgebraDiagram } from './AlgebraDiagram'
import type { DiagramKind } from './AlgebraDiagram'

const pages = [
  ['home', 'Home', '首页'], ['academy', 'Academy', '课程'],
  ['practice', 'Practice', '练习'], ['library', 'Resource Library', '资源库'],
  ['about', 'About', '学术主页'],
]
const firstSection = quadraticsChapter.sections[0]
const lessonQuestions: LessonQuestion[] = [
  ...standardFormTasks.map(entry => ({
    id: entry.task.id,
    skill: ['Standard form · Find the constant', '标准形式 · 确定常数项'] as const,
    steps: [entry],
  })),
  ...factorisationExercises,
].map(question => ({
  ...question,
  tasks: [
    ...(question.id === 'p1-quad-foundation-rearrange-factor' ? [q8Independent] : []),
    ...question.steps.map(entry => entry.task),
  ],
}))
const lessonCompletion = lessonQuestions.map(question => ({
  id: question.id,
  tasks: question.tasks[0].id === q8Independent.id ? [q8Independent] : question.tasks,
}))
const teacherSamples = Object.fromEntries([3, 7, 8].map(number => {
  const question = lessonQuestions[number - 1]
  const id = 'quadratics-sample-q' + number
  const exercise: Exercise = {
    id,
    title: 'Quadratics 1.1 · Q' + number,
    syllabusSection: { chapter: '1.1 Quadratics', topic: firstSection.title[0] },
    context: number === 8 ? undefined : question.context,
    tasks: question.tasks,
  }
  return ['teacher-q'+number, exercise]
}))
const tasks = [...practiceTopics.flatMap(topic => topic.tasks), ...lessonQuestions.flatMap(question => question.tasks)]
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
  const tooltipId = useId()
  return <span className="term">
    <button type="button" className="term-button" aria-expanded={open} aria-describedby={tooltipId}
      onClick={event => { event.stopPropagation(); setOpen(!open) }} onBlur={() => setOpen(false)}
      onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>{word}</button>
    <span id={tooltipId} className="definition" role="tooltip" lang="zh-CN">{glossary[word.toLowerCase()]}</span>
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
  const teacherSample = Object.hasOwn(teacherSamples, page) ? teacherSamples[page] : undefined
  const lessonOpen = page === firstSection.id || page === standardFormRoute
  const inChapter = page === quadraticsChapter.id || lessonOpen
  const [zh, setZh] = useState(false)
  const [progress, setProgress] = useState(() => [...new Set([
    ...readProgress(), ...lessonQuestions.flatMap(question => question.tasks)
      .filter(task => readHistory(browserStorage, task.id).completed).map(task => task.id),
  ])])
  const completed = new Set(progress)
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
        <a key={id} href={'#'+id} aria-current={page === id || (id === 'practice' && (practiceTopic || inChapter)) ? 'page' : undefined}>{t(en,cn)}</a>)}</nav>
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
          {practiceTopics.filter(topic => topic.id !== quadraticsChapter.consolidation.id && topic.id !== 'functions-foundation').map(topic => <li key={topic.id}>
            <a href={'#'+topic.id}>{t(topic.title[0], topic.title[1])}</a> · {topic.exercises.length}
          </li>)}
          <li><a href="#quadratics">{t(...quadraticsChapter.title)}</a></li>
          <li><a href="#functions-foundation">{t('Functions & Transformations', '函数与图像变换')}</a></li>
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
        <a className="button" href="#functions-foundation">{t('Practise this topic','练习这一专题')} →</a>
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
    {page === 'practice' && <P1Directory t={t} />}
    {page === quadraticsChapter.id && <QuadraticsDirectory t={t} completed={completed} />}
    {lessonOpen && <FactorisationPractice t={t} completed={completed} complete={complete} />}
    {practiceTopic && <Practice key={practiceTopic.id} topicId={practiceTopic.id} t={t} progress={progress} complete={complete}
      exercises={practiceTopic.exercises} topicTasks={practiceTopic.tasks} title={t(practiceTopic.title[0], practiceTopic.title[1])} />}
    {page === 'past-papers' && <p><a href="#library">{t('Return to Resource Library','返回教学资源库')}</a></p>}
    {(page === 'teacher' || teacherSample) && <>
      {teacherSample && <p><a href={'#'+firstSection.id}>{t('Return to the student exercise', '返回学生练习')}</a></p>}
      <TeacherEditor key={page} sample={teacherSample} t={t} preview={(task, context) =>
        <Question key={JSON.stringify(task)} task={task} context={context} t={t} onCorrect={() => {}} />} />
    </>}
    {page !== 'teacher' && !teacherSample && page !== 'past-papers' && !inChapter && !practiceTopic && !pages.some(([id]) => page === id) && <><h1>{t('Page unavailable','页面无法访问')}</h1><a href="#home">{t('Return home','返回首页')}</a></>}
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
  const isConsolidation = topicId === quadraticsChapter.consolidation.id
  const completedCount = isConsolidation
    ? countCompletedQuestions(exercises, new Set(progress))
    : topicTasks.filter(step => progress.includes(step.id)).length
  const progressTotal = isConsolidation ? exercises.length : topicTasks.length
  return <>
    <div className="practice-heading">
      <a href="#practice">{t('P1 Practice','P1 练习')}</a><span> / Cambridge 9709 / Pure Mathematics 1</span>
      <h1 className="practice-title">{title}</h1>
      <label className="exercise-picker" style={{ maxWidth: 420 }}>{t('P1 chapter', 'P1 章节')}
        <select value={topicId} onChange={event => { location.hash = event.target.value }}>
          {practiceTopics.map(topic => <option key={topic.id} value={topic.id}>{t(topic.title[0], topic.title[1])}</option>)}
        </select>
      </label>
    </div>
    {topicId === quadraticsChapter.consolidation.id && <p><a href="#quadratics">
      {t('Back to Chapter 1', '返回第一章目录')}
    </a></p>}
    <div className="practice-layout">
      <aside className="card"><p>{t('Progress','学习进度')} · {completedCount}/{progressTotal}</p>
      <progress aria-label={t('Progress','学习进度')} value={completedCount} max={progressTotal} />
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
    <p className="muted">{isConsolidation
      ? t('A question is complete when all its steps are correct.', '一道题的所有步骤均答对后计为完成。')
      : t('Progress measures completed practice tasks. Cambridge exam grades use separate assessment criteria.', '进度记录已完成的练习任务。Cambridge 考试使用独立的评分标准。')}</p>
  </>
}

function Question({ task, context, step, questionLabel, diagram, solutionDiagram, afterCorrect, onScaffold, draft, t, onCorrect, previous, next, track = false, legacyCompleted = false, hint, hintZh, commonMistake }: {
  task: Task; context?: string; step?: string; questionLabel?: string; diagram?: ReactNode; t: PracticeProps['t'];
  onCorrect: () => void; previous?: () => void; next?: () => void
  track?: boolean; legacyCompleted?: boolean; hint?: string; hintZh?: string
  commonMistake?: { answer: number; hint: string; zh?: string }
  solutionDiagram?: DiagramKind; afterCorrect?: DiagramKind; onScaffold?: () => void; draft?: boolean
}) {
  const [response, setResponse] = useState<number[]>([])
  const formInput = useRef<HTMLInputElement>(null)
  const [number, setNumber] = useState('')
  const [vector, setVector] = useState<[string, string]>(['', ''])
  const [feedback, setFeedback] = useState<'ready'|'correct'|'retry'|'missing'>('ready')
  const [history, setHistory] = useState(() => track ? readHistory(browserStorage, task.id) : emptyHistory)
  const [hintOpen, setHintOpen] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const method = completionMethod(history, legacyCompleted)
  const answer = task.answer
  const pair = answer.type === 'root-pair'
  const mistake = commonMistake && grade({ type: 'number', correct: commonMistake.answer }, number)
    ? commonMistake : undefined
  const mathHint = mistake
    ? t(mistake.hint, mistake.zh ?? hintZh ?? task.hintZh ?? mistake.hint)
    : t(hint ?? task.hint ?? task.misconception, hintZh ?? task.hintZh ?? task.misconceptionZh ?? hint ?? task.hint ?? task.misconception)
  const errorDetail = pair && sameNumericInput(...vector)
    ? t('You entered the same root twice. Enter two different roots.', '你填了两个相同的根。请分别填写两个不同的根。')
    : mistake
      ? t(mistake.hint, mistake.zh ?? task.misconceptionZh ?? mistake.hint)
      : task.misconceptionZh ? t(task.misconception, task.misconceptionZh) : undefined

  function remember(event: AttemptEvent) {
    if (!track) return
    const nextHistory = applyAttempt(history, event)
    setHistory(nextHistory)
    writeHistory(browserStorage, task.id, nextHistory)
  }

  function showHint() {
    setHintOpen(true)
    remember('hint')
  }

  function toggleSolution() {
    if (!solutionOpen) remember('solution')
    setSolutionOpen(!solutionOpen)
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    const result = grade(answer, answer.type === 'vector' || pair ? vector : answer.type === 'number' ? number : response)
    setFeedback(result === null ? 'missing' : result ? 'correct' : 'retry')
    if (result !== null) remember(result ? 'correct' : 'incorrect')
    if (result) onCorrect()
  }
  return <article className="card question">
    <p className="eyebrow">{[questionLabel ?? t('Guided practice','引导练习'), step && t('Step ', '步骤 ') + step].filter(Boolean).join(' · ')}</p>
    {context && <p><MathText value={context} translate /></p>}
    {diagram}
    {track && <p className="attempt-meta">
      {method && <strong>{t(completionLabels[method][0], completionLabels[method][1])} · </strong>}
      {t('Valid attempts', '有效尝试')} {history.attempts}
    </p>}
    <form onSubmit={submit}><fieldset><legend><MathText value={task.prompt} translate /></legend>
      {pair
        ? <div className="root-pair">
            <p>{t('Enter the two roots in either order.', '按任意顺序填写两个根。')}</p>
            <div className="root-fields">
              {([0, 1] as const).map(index => <label className="numeric" key={index}>
                {t('Root field ' + (index + 1), '根的输入框 ' + (index + 1))}
                <input ref={index === 0 ? formInput : undefined} autoComplete="off" value={vector[index]} onChange={event => {
                  const updated: [string, string] = [...vector]
                  updated[index] = event.target.value
                  setVector(updated)
                  setFeedback('ready')
                }} />
              </label>)}
            </div>
          </div>
        : answer.type === 'vector'
        ? <div className="vector-entry">
            <p>{t('Translation by the vector','平移向量')}</p>
            <div className="column-vector">
              <input aria-label={t('Horizontal displacement','水平位移')} autoComplete="off" value={vector[0]} onChange={event => {setVector([event.target.value, vector[1]]); setFeedback('ready')}} />
              <input aria-label={t('Vertical displacement','竖直位移')} autoComplete="off" value={vector[1]} onChange={event => {setVector([vector[0], event.target.value]); setFeedback('ready')}} />
            </div>
          </div>
        : answer.type === 'number'
        ? <label className="numeric">{t('Enter a number or fraction','输入数值或分数')}<input ref={formInput} autoComplete="off" value={number} onChange={event => {setNumber(event.target.value); setFeedback('ready'); setHintOpen(false)}} /></label>
        : answer.choices.map((choice, i) => <label className="choice" key={choice}>
            <input name="answer" type={answer.type === 'single' ? 'radio' : 'checkbox'} checked={response.includes(i)}
              onChange={event => {setFeedback('ready'); setResponse(answer.type === 'single' ? [i] : event.target.checked ? [...response,i] : response.filter(value => value !== i))}} />
            <MathText value={choice} translate />
          </label>)}</fieldset>
      <div className="actions"><button className="button" type="submit">{t('Check answer','检查答案')}</button>
        {previous && <button type="button" onClick={previous}>{t('Previous','上一步')}</button>}
        {next && <button type="button" onClick={next}>{t('Next','下一步')} →</button>}</div>
    </form>
    <div aria-live="polite">{feedback === 'correct' && <div className="feedback"><strong>{t('Correct','回答正确')}</strong></div>}
    {feedback === 'retry' && <div className="feedback retry"><strong>{t('Try again','再试一次')}</strong>
      {errorDetail && <p><MathText value={errorDetail} translate /></p>}
      {track
        ? <div className="actions">
            <button type="button" onClick={() => { setFeedback('ready'); setHintOpen(false); formInput.current?.focus() }}>{t('Retry without help', '自行订正')}</button>
            {!pair && <button type="button" onClick={showHint}>{t('Show hint', '看提示')}</button>}
          </div>
        : <> · {task.misconception}</>}
    </div>}
    {feedback === 'missing' && <p className="feedback retry">{answer.type === 'vector'
      ? t('Enter a valid number in both rows of the column vector.','请在列向量的上下两行分别输入有效数值。')
      : pair ? t('Enter a valid number or fraction in both root fields.', '请在两个根的输入框中各填一个有效数值或分数。')
        : t('Enter a valid answer or select an option.','请输入有效答案或选择选项。')}</p>}</div>
    {pair && <div className="actions">
      <button type="button" onClick={showHint}>{t('Give me a hint', '给我一点提示')}</button>
      {onScaffold && <button type="button" onClick={onScaffold}>{t('Use guided steps', '打开分步练习')}</button>}
    </div>}
    {hintOpen && <p className="math-hint" aria-live="polite"><MathText value={mathHint} translate /></p>}
    {afterCorrect && history.completed && <AlgebraDiagram kind={afterCorrect} t={t} />}
    <div className="worked-solution">
      <button type="button" aria-expanded={solutionOpen} onClick={toggleSolution}>{solutionOpen ? t('Hide worked solution', '收起完整解析') : t('Worked Solution', '查看完整解析')}</button>
      {solutionOpen && <>
        {draft && <p className="attempt-meta">{t('Worked solution from the draft saved in this browser.', '正在显示此浏览器保存的解析草稿。')}</p>}
        <WorkedSolution task={task} t={t} />
        {solutionDiagram && <AlgebraDiagram kind={solutionDiagram} t={t} />}
      </>}
    </div>
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

type LessonStep = { task: Task; hint: string; hintZh?: string; commonMistake?: { answer: number; hint: string; zh?: string } }
type LessonQuestion = {
  id: string
  skill: readonly [string, string]
  context?: string
  steps: LessonStep[]
  tasks: Task[]
}

function WorkedSolution({ task, t }: { task: Task; t: PracticeProps['t'] }) {
  return <div className="solution-body">
    {task.workedSteps?.length
      ? <ol className="worked-rows" aria-label={t('Mathematical steps and explanations', '逐行数学解答')}>
          {task.workedSteps.map((row, index) => <li className="worked-row" key={index}>
            <div className="worked-formula" tabIndex={0} role="region" aria-label={t('Calculation ' + (index+1), '第 ' + (index+1) + ' 行算式')}
              dangerouslySetInnerHTML={{ __html: row.math ? katex.renderToString(row.math, { displayMode: true, throwOnError: false }) : '' }} />
            <p className="worked-reason"><MathText value={t(row.en, row.zh || row.en)} translate /></p>
          </li>)}
        </ol>
      : Array.isArray(task.solutionLines) && task.solutionLines.length > 0 && task.solutionLines.every(line => typeof line === 'string')
      ? <div className="solution-math" role="region" aria-label={t('Written mathematical steps', '数学书写步骤')} tabIndex={0}
          dangerouslySetInnerHTML={{ __html: katex.renderToString(
            String.raw`\begin{aligned}` + task.solutionLines.join(String.raw`\\`) + String.raw`\end{aligned}`,
            { displayMode: true, throwOnError: false },
          ) }} />
      : <p><MathText value={task.solution} /></p>}
    {task.signGraph && <SignGraph graph={task.signGraph} />}
  </div>
}

function P1Directory({ t }: Pick<PracticeProps, 't'>) {
  const otherChapters = practiceTopics.filter(topic => ![
    quadraticsChapter.consolidation.id, 'functions-foundation', 'functions-companions',
  ].includes(topic.id))

  return <section className="chapter-directory">
    <p className="eyebrow">Cambridge 9709</p>
    <h1 className="practice-title">{t('Pure Mathematics 1 Practice', '纯数学 P1 练习')}</h1>
    <h2>{t('Choose a chapter', '选择章节')}</h2>
    <ul className="chapter-list">
      <li className="card chapter-row">
        <a href="#quadratics">{t(...quadraticsChapter.title)}</a>
      </li>
      <li className="card chapter-row">
        <span>{t('Functions', '函数')}</span>
        <div className="chapter-functions">
          <a href="#functions-foundation">{t('Functions & Transformations', '函数与图像变换')}</a>
          <a href="#functions-companions">{t('Exam-style practice', '真题同类练习')}</a>
        </div>
      </li>
      {otherChapters.map(topic => <li key={topic.id} className="card chapter-row">
        <a href={'#'+topic.id}>{t(topic.title[0], topic.title[1])}</a>
      </li>)}
    </ul>
  </section>
}

const consolidationQuestions = practiceTopics.find(topic => topic.id === quadraticsChapter.consolidation.id)!.exercises

function QuadraticsDirectory({ t, completed }: Pick<PracticeProps, 't'> & { completed: ReadonlySet<string> }) {
  return <section className="chapter-directory">
    <div className="practice-heading">
      <a href="#practice">{t('P1 Practice', 'P1 练习')}</a>
      <h1 className="practice-title">{t(...quadraticsChapter.title)}</h1>
      <h2>{t('Choose a section', '选择小节')}</h2>
    </div>
    <ul className="chapter-list">
      {quadraticsChapter.sections.map(section => {
        const questions = section.id === firstSection.id ? lessonQuestions : []
        return <li className="card chapter-row" key={section.id}>
          <span className="section-number">{section.number}</span>
          <div className="section-info">
            {questions.length
              ? <a href={'#'+section.id}>{t(section.title[0], section.title[1])}</a>
              : <span>{t(section.title[0], section.title[1])}</span>}
            <p className="attempt-meta">{t('Completed', '已完成')} {countCompletedQuestions(questions.length ? lessonCompletion : [], completed)}/{questions.length}{' · '}
              {questions.length ? t(questions.length + ' questions', questions.length + ' 道题') : t('Practice not yet available', '暂无本节练习')}
            </p>
          </div>
        </li>
      })}
    </ul>
    <div className="card chapter-row">
      <div className="section-info">
        <a href={'#'+quadraticsChapter.consolidation.id}>{t(...quadraticsChapter.consolidation.title)}</a>
        <p className="attempt-meta">{t('Completed', '已完成')} {countCompletedQuestions(consolidationQuestions, completed)}/{consolidationQuestions.length}{' · '}
          {t(consolidationQuestions.length + ' questions', consolidationQuestions.length + ' 道题')}</p>
      </div>
    </div>
  </section>
}

function FactorisationPractice({ t, completed, complete }: Pick<PracticeProps, 't' | 'complete'> & { completed: ReadonlySet<string> }) {
  const [cursor, setCursor] = useState(() => readSectionCursor(browserStorage, firstSection.id, lessonQuestions, completed)!)
  const questionIndex = lessonQuestions.findIndex(question => question.id === cursor.questionId)
  const question = lessonQuestions[questionIndex]
  const stepIndex = question.steps.findIndex(entry => entry.task.id === cursor.taskId)
  const independentQuestion = question.tasks[0].id === q8Independent.id
  const independentMode = cursor.taskId === q8Independent.id
  const active: LessonStep = independentMode
    ? { task: q8Independent, hint: q8Independent.hint ?? q8Independent.misconception, hintZh: q8Independent.hintZh }
    : question.steps[stepIndex]
  const sampleRoute = [3, 7, 8].includes(questionIndex + 1) ? 'teacher-q' + (questionIndex+1) : undefined
  const sample = sampleRoute ? teacherSamples[sampleRoute] : undefined
  const saved = sample && readDrafts(browserStorage).find(draft => draft.id === sample.id)
    ?.tasks.find(task => task.id === active.task.id)
  const visibleTask = saved ? { ...active.task, solution: saved.solution, workedSteps: saved.workedSteps, solutionLines: saved.solutionLines } : active.task
  const total = lessonQuestions.length
  const completeCount = countCompletedQuestions(lessonCompletion, completed)

  useEffect(() => {
    writeSectionCursor(browserStorage, firstSection.id, cursor)
    if (independentQuestion && !independentMode) {
      const history = readHistory(browserStorage, q8Independent.id)
      writeHistory(browserStorage, q8Independent.id, applyAttempt(history, 'hint'))
    }
  }, [cursor, independentQuestion, independentMode])

  function goToQuestion(index: number) {
    const target = lessonQuestions[index]
    const task = target.tasks[0].id === q8Independent.id
      ? q8Independent : target.tasks.find(item => !completed.has(item.id)) ?? target.tasks[0]
    setCursor({ questionId: target.id, taskId: task.id })
  }

  function goToStep(index: number) {
    setCursor({ questionId: question.id, taskId: question.steps[index].task.id })
  }

  return <section className="foundation-practice">
    <div className="practice-heading">
      <a href="#quadratics">{t(...quadraticsChapter.title)}</a>
      <h1 className="practice-title">1.1 {t(...firstSection.title)}</h1>
    </div>
    <p className="attempt-meta" aria-live="polite">{t('Completed', '已完成')} {completeCount}/{total}</p>
    <nav className="question-numbers" aria-label={t('Section question numbers', '本节题号')}>
      {lessonQuestions.map((item, index) => {
        const done = lessonCompletion[index].tasks.every(task => completed.has(task.id))
        return <button key={item.id} type="button" onClick={() => goToQuestion(index)}
          aria-current={index === questionIndex ? 'step' : undefined}
          aria-label={t('Question ' + (index + 1), '第 ' + (index + 1) + ' 题') + (done ? t(', completed', '，已完成') : '')}>
          {index + 1}{done && <span aria-hidden="true"> ✓</span>}
        </button>
      })}
    </nav>
    <h2 className="question-skill">{t(...question.skill)}</h2>
    {questionIndex === 0 && <details className="foundation-reference" open>
      <summary>{t('Rule and short example', '规则和短例题')}</summary>
      <p><MathText translate value={t(
        'Subtract the entire right-hand side from both sides. To find the new constant, subtract the right constant from the left constant.',
        '两边同时减去右边的整个式子。左边原常数减去右边原常数，就得到新的常数项。')} /></p>
      <p><MathText translate value={t(
        'For $x^2+2x-3=4$, subtract 4 to get $x^2+2x-7=0$. The new constant is $-7$.',
        '例如，在 $x^2+2x-3=4$ 中，两边减去 4 得 $x^2+2x-7=0$，所以常数项为 $-7$。')} /></p>
    </details>}
    {independentQuestion && !independentMode && <div className="guided-header">
      <p>{t('Guided practice', '分步练习')} · {question.steps.filter(entry => completed.has(entry.task.id)).length}/{question.steps.length}</p>
      <button type="button" onClick={() => setCursor({ questionId: question.id, taskId: q8Independent.id })}>
        {t('Return to both root fields', '返回整题填写两根')}
      </button>
    </div>}
    <Question key={active.task.id} task={visibleTask} context={independentMode ? undefined : question.context}
      questionLabel={t('Question ', '第 ') + (questionIndex + 1) + '/' + total + t('', ' 题')}
      step={!independentMode && question.steps.length > 1 ? (stepIndex + 1) + '/' + question.steps.length : undefined}
      draft={Boolean(saved)}
      solutionDiagram={questionIndex === 2 ? 'move-sign' : questionIndex === 6 && question.tasks.every(task => completed.has(task.id)) ? 'zero-product' : undefined}
      afterCorrect={independentMode ? 'factor-roots' : undefined}
      onScaffold={independentMode ? () => {
        const nextGuided = question.steps.findIndex(entry => !completed.has(entry.task.id))
        goToStep(nextGuided < 0 ? 0 : nextGuided)
      } : undefined}
      t={t} track legacyCompleted={completed.has(active.task.id)} hint={active.hint} hintZh={active.hintZh} commonMistake={active.commonMistake}
      previous={stepIndex > 0 ? () => goToStep(stepIndex - 1) : undefined}
      next={!independentMode && stepIndex + 1 < question.steps.length ? () => goToStep(stepIndex + 1) : undefined}
      onCorrect={() => complete(active.task.id)} />
    <div className="actions section-navigation">
      <button type="button" disabled={questionIndex === 0} onClick={() => goToQuestion(questionIndex - 1)}>{t('Previous question', '上一题')}</button>
      <button type="button" disabled={questionIndex === total - 1} onClick={() => goToQuestion(questionIndex + 1)}>{t('Next question', '下一题')} →</button>
    </div>
    {sampleRoute && <p className="attempt-meta"><a href={'#'+sampleRoute}>{t('Edit this sample locally', '在本地编辑样板')}</a></p>}
  </section>
}

createRoot(document.getElementById('root')!).render(<App />)
