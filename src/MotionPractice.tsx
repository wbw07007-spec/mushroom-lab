import { useState } from 'react'
import type { FormEvent } from 'react'
import katex from 'katex'
import { applyAttempt, completionMethod, readHistory, writeHistory } from './attempt-history'
import type { AttemptEvent, AttemptHistory } from './attempt-history'
import { motionNoteSections, motionQuestions, motionSections, motionTitle } from './content/m1-motion'
import type { MotionSection } from './content/m1-motion'
import type { MotionQuestion } from './content/m1-motion-types'
import { grade } from './grading'
import { MathText } from './MathText'
import { MotionPlot } from './MotionPlot'
import './motion.css'

type Translate = (en: string, zh: string) => string
const pdf = import.meta.env.BASE_URL + 'study-notes/m1-01.pdf'
const storage = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
}
const noteLinks = motionNoteSections.map(note => ({ ...note,
  href: '#' + note.sectionId + ('questionId' in note ? '/' + note.questionId : ''),
}))
const statusLabels = {
  first: ['Correct independently on first attempt', '首次独立答对'],
  retried: ['Correct independently after a retry', '重试后独立答对'],
  assisted: ['Correct after using help', '借助帮助后答对'],
  legacy: ['Completed · method unknown', '已完成 · 作答方式未知'],
} as const

function MotionText({ value }: { value: string }) {
  return <MathText value={value} component="m1" translate />
}

function getCursor(section: MotionSection) {
  try { return storage.getItem('mushroom:m1:cursor:v1:' + section.id) } catch { return null }
}

function MotionExercise({ question, history, t, mark }: {
  question: MotionQuestion; history: AttemptHistory; t: Translate; mark: (event: AttemptEvent) => void
}) {
  const [responses, setResponses] = useState<Partial<Record<number, string | number>>>({})
  const [results, setResults] = useState<(boolean | null)[]>()
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const method = completionMethod(history, false)
  const correct = results?.every(result => result === true)
  const invalid = results?.includes(null)

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = question.parts.map((part, index) => {
      const response = responses[index]
      if (part.choices) return typeof response === 'number' ? response === part.answer : null
      return grade({ type: 'number', correct: part.answer }, typeof response === 'string' ? response : '')
    })
    setResults(next)
    if (!next.includes(null)) mark(next.every(Boolean) ? 'correct' : 'incorrect')
  }
  function answer(index: number, value: string | number) {
    setResponses(current => ({ ...current, [index]: value }))
  }

  return <article className="card question motion-question">
    <p className="motion-task-meta"><strong>{method && t(statusLabels[method][0], statusLabels[method][1])}</strong>
      <span>{t('Valid attempts', '有效作答')} {history.attempts}</span></p>
    <div lang="en" className="motion-prompt"><MotionText value={question.prompt} /></div>
    {question.plot && <MotionPlot plot={question.plot} />}
    <form onSubmit={submit}>
      {question.parts.map((part, index) => <fieldset key={index} lang="en" className="motion-part">
        <legend>{question.parts.length > 1 && <span className="motion-part-letter">({String.fromCharCode(97 + index)}) </span>}<MotionText value={part.prompt} /></legend>
        {part.choices ? (
          <div className={question.candidates ? 'motion-candidates' : 'motion-choice-list'}>
            {part.choices.map((choice, i) => {
              const id = question.id + '-part-' + index + '-option-' + i
              const graph = question.candidates?.[i]
              return <div className="motion-choice" key={choice}>
                <div className="motion-choice-label">
                  <input id={id} type="radio" name={question.id + '-part-' + index}
                    aria-labelledby={id+'-label'} checked={responses[index] === i} onChange={() => answer(index, i)} />
                  {graph ? <label htmlFor={id} id={id+'-label'}>{choice}</label>
                    : <span id={id+'-label'} onClick={event => {
                        if (!(event.target as Element).closest('button')) answer(index, i)
                      }}><MotionText value={choice} /></span>}
                </div>
                {graph && <label htmlFor={id} className="motion-graph-select"><MotionPlot plot={graph} /></label>}
              </div>
            })}
          </div>
        ) : <label className="motion-number">
          <span lang={t('en', 'zh-CN')}>{question.parts.length > 1 ? t('Answer ', '答案 ') + '(' + String.fromCharCode(97 + index) + ')' : t('Answer', '答案')}</span>
          <input type="text" inputMode="text" autoComplete="off" spellCheck={false}
            value={String(responses[index] ?? '')} onChange={event => answer(index, event.target.value)} />
          {part.unit && <span className="motion-unit">{part.unit}</span>}
        </label>}
        {results?.[index] === false && !invalid && <p className="motion-part-feedback"><MotionText value={t(...part.feedback)} /></p>}
      </fieldset>)}
      <div className="actions motion-actions">
        <button type="submit" className="button">{t('Check answer', '检查答案')}</button>
        <button type="button" aria-expanded={showHint} onClick={() => {
          if (!showHint) mark('hint')
          setShowHint(!showHint)
        }}>{showHint ? t('Hide hint', '收起提示') : t('Give me a hint', '给我一点提示')}</button>
      </div>
    </form>
    {results && <div role="status" className={'feedback' + (correct ? '' : ' retry')}>
      {invalid ? t('Complete each part using a number, fraction or the choices shown.', '请完成每个小问，输入数值、分数或选择选项。')
        : correct ? t('Correct.', '答对了。') : t('Try again. Read the feedback beside each part and revise your answer.', '再试一次。参考各小问旁的反馈，自行订正。')}
    </div>}
    {showHint && <p className="motion-hint"><MotionText value={t(...question.hint)} /></p>}
    <div className="motion-worked">
      <button type="button" aria-expanded={showSolution} onClick={() => {
        if (!showSolution) mark('solution')
        setShowSolution(!showSolution)
      }}>{t('Worked Solution', '完整解析')}</button>
      {showSolution && <section aria-label={t('Worked solution steps', '逐行解析')}>
        {question.plot?.kind !== 'line' && question.plot?.analysis && <MotionPlot plot={question.plot} explain
          caption={t(question.plot.analysis.areas ? 'Signed area by region' : 'Gradient triangle',
            question.plot.analysis.areas ? '分区标注带符号面积' : '斜率三角形')} />}
        <ol className="motion-steps">
          {question.steps.map((row, i) => <li key={i} className="motion-step">
            <div className="motion-step-math" tabIndex={0} role="region" aria-label={t('Calculation ', '算式 ') + (i+1)}
              dangerouslySetInnerHTML={{ __html: katex.renderToString(row.math, { displayMode: true, throwOnError: false }) }} />
            <p className="motion-step-reason"><MotionText value={t(row.en, row.zh)} /></p>
          </li>)}
        </ol>
      </section>}
    </div>
  </article>
}

export function MotionPractice({ page, t }: { page: string; t: Translate }) {
  const [route, deepQuestion] = page.split('/')
  const section = motionSections.find(item => item.id === route)
  const [histories, setHistories] = useState(() => Object.fromEntries(
    motionQuestions.map(question => [question.id, readHistory(storage, question.id, 'm1')]),
  ))
  const count = (questions: MotionQuestion[]) => questions.filter(question => histories[question.id].completed).length
  const notes = route === 'm1-motion-notes'
  const chapterName = t('Chapter 1 · ' + motionTitle[0], '第一章 · ' + motionTitle[1])

  const breadcrumbs = <nav className="motion-breadcrumb" aria-label={t('Practice location', '练习位置')}>
    <a href="#academy">{t('Academy', '课程中心')}</a>
    {route !== 'm1' && <a href="#m1">{t('M1 Practice', 'M1 练习')}</a>}
    {route !== 'm1' && route !== 'm1-motion' && <a href="#m1-motion">{t('Chapter 1', '第一章')}</a>}
  </nav>

  if (route === 'm1') return <div className="motion-page">
    {breadcrumbs}
    <p className="eyebrow">Cambridge 9709 · Paper 4</p>
    <h1 className="practice-title">{t('M1 Practice', 'M1 练习')}</h1>
    <a className="card motion-chapter-card" href="#m1-motion">
      <h2>{chapterName}</h2>
      <p>{count(motionQuestions)}/{motionQuestions.length} {t('completed', '已完成')}</p>
    </a>
  </div>

  if (!section) return <div className="motion-page">
    {breadcrumbs}
    <h1 className="practice-title">{notes ? t('Motion in a straight line · Study Notes', '直线运动 · 第一章笔记') : chapterName}</h1>
    <div className="motion-library-links">
      {notes ? <a className="button" href="#m1-motion">{t('Practise Chapter 1', '练习第一章')}</a>
        : <a className="button" href="#m1-motion-notes">{t('Read the Chapter 1 notes', '阅读第一章笔记')}</a>}
      <a href={pdf}>{t('Open PDF', '打开 PDF')}</a>
    </div>
    <ul className="motion-sections">
      {noteLinks.map(note => {
        const group = motionSections.find(item => item.id === note.sectionId)!
        const items = 'questionId' in note ? group.questions.filter(question => question.id === note.questionId) : group.questions
        return <li key={note.page} className="card motion-section-card">
          <div><span className="eyebrow">{note.number} · {t('Notes p. ', '笔记第 ')}{note.page}{t('', ' 页')}</span>
            <h2><a href={note.href}>{t(note.title[0], note.title[1])}</a></h2>
            <span className="muted">{count(items)}/{items.length} {t('completed', '已完成')}
              {'questionId' in note && ' · ' + t('in chapter independent practice', '见章节独立练习')}</span>
          </div>
          {notes && <a href={pdf + '#page=' + note.page} aria-label={t('Read notes page ', '打开笔记第 ') + note.page}>{t('Read PDF page', '阅读此页')}</a>}
        </li>
      })}
      <li className="card motion-section-card">
        <div><h2><a href={'#' + motionSections[3].id}>{t(...motionSections[3].title)}</a></h2>
          <span className="muted">{count(motionSections[3].questions)}/{motionSections[3].questions.length} {t('completed', '已完成')}</span></div>
      </li>
    </ul>
  </div>

  const question = section.questions.find(item => item.id === deepQuestion)
    ?? section.questions.find(item => item.id === getCursor(section))
    ?? section.questions.find(item => !histories[item.id].completed)
    ?? section.questions[0]
  const index = section.questions.indexOf(question)
  const questionHref = (item: MotionQuestion) => '#' + section.id + '/' + item.id
  function record(event: AttemptEvent) {
    const next = applyAttempt(histories[question.id], event)
    setHistories({ ...histories, [question.id]: next })
    writeHistory(storage, question.id, next, 'm1')
    try { storage.setItem('mushroom:m1:cursor:v1:' + section!.id, question.id) } catch { /* History remains usable for this visit. */ }
  }
  function remember(item: MotionQuestion) {
    try { storage.setItem('mushroom:m1:cursor:v1:' + section!.id, item.id) } catch { /* The question link still resumes across refresh. */ }
  }

  return <div className="motion-page">
    {breadcrumbs}
    <p className="eyebrow">{chapterName}</p>
    <h1 className="practice-title motion-section-title">{t(...section.title)}</h1>
    <div className="motion-section-nav">
      <span>{t('Question', '题目')} {index+1}/{section.questions.length} · {count(section.questions)} {t('completed', '已完成')}</span>
      <nav className="motion-question-numbers" aria-label={t('Section question numbers', '本节题号')}>
        {section.questions.map((item, i) => <a key={item.id} href={questionHref(item)}
          onClick={() => remember(item)} aria-current={item.id === question.id ? 'page' : undefined}
          aria-label={t('Question ', '第 ') + (i+1) + t('', ' 题') + (histories[item.id].completed ? t(', completed', '，已完成') : '')}>
          {i+1}{histories[item.id].completed && <span aria-hidden="true"> ✓</span>}
        </a>)}
      </nav>
    </div>
    <MotionExercise key={question.id} question={question} history={histories[question.id]} t={t} mark={record} />
    <nav className="actions motion-next" aria-label={t('Move between questions', '切换题目')}>
      {index > 0 && <a href={questionHref(section.questions[index-1])} onClick={() => remember(section.questions[index-1])}>{t('Previous question', '上一题')}</a>}
      {index < section.questions.length-1 && <a href={questionHref(section.questions[index+1])} onClick={() => remember(section.questions[index+1])}>{t('Next question →', '下一题 →')}</a>}
      {section.notePage && <a href={pdf + '#page=' + section.notePage}>{t('Read this section in the notes', '阅读本节笔记')}</a>}
    </nav>
  </div>
}
