import { useState } from 'react'
import index from './content/p1-past-papers.json'

const topics = [
  ['1', 'Quadratics', '二次函数与方程'],
  ['2', 'Functions', '函数'],
  ['3', 'Coordinate geometry', '坐标几何'],
  ['4', 'Circular measure', '弧度制'],
  ['5', 'Trigonometry', '三角函数'],
  ['6', 'Series', '数列与级数'],
  ['7-8', 'Differentiation', '微分'],
  ['9', 'Integration', '积分'],
] as const
const years = [...new Set(index.papers.map(paper => paper.year))].reverse()
const official = 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/'
const pageSize = 25

export function PastPaperBank({ t }: { t: (en: string, cn: string) => string }) {
  const [view, setView] = useState<'questions' | 'papers'>('questions')
  const [topic, setTopic] = useState('')
  const [year, setYear] = useState(0)
  const [limit, setLimit] = useState(pageSize)
  const questions = index.questions.filter(row => (!year || row.year === year) && (!topic || row.chapter === topic))
  const papers = index.papers.filter(row => !year || row.year === year)
  const total = view === 'questions' ? questions.length : papers.length
  const paperCode = (row: { paper: number; series: string; year: number }) =>
    '9709/' + row.paper + '/' + row.series + '/' + String(row.year).slice(-2)
  return <>
    <a href="#library">{t('Resource Library', '教学资源库')}</a>
    <h1 className="practice-title">{t('Past Paper Question Bank', '历年真题索引')}</h1>
    <p>{t('Cambridge 9709 · Pure Mathematics 1 · 2020–2025', 'Cambridge 9709 · Pure Mathematics 1 · 2020–2025 年')}</p>
    <p>{t('Use the paper code and question number to locate the original. Cambridge provides selected papers and mark schemes through its official resources.', '按试卷编号和题号定位原题。试卷和评分细则请通过 Cambridge 官方资料查阅。')}</p>
    <a href={official}>{t('Cambridge 9709 past papers and mark schemes', 'Cambridge 9709 官方试卷与评分细则')}</a>
    <section className="card paper-index">
      <div className="actions">
        <button type="button" aria-pressed={view === 'questions'} onClick={() => { setView('questions'); setLimit(pageSize) }}>{t('Questions by topic', '按专题查题')}</button>
        <button type="button" aria-pressed={view === 'papers'} onClick={() => { setView('papers'); setLimit(pageSize) }}>{t('Full papers', '历年整卷索引')}</button>
      </div>
      <div className="resource-filters">
        {view === 'questions' && <label>{t('Topic', '专题')}<select value={topic} onChange={event => { setTopic(event.target.value); setLimit(pageSize) }}>
          <option value="">{t('All topics', '全部专题')}</option>
          {topics.map(([id, en, cn]) => <option key={id} value={id}>{t(en, cn)}</option>)}
        </select></label>}
        <label>{t('Year', '年份')}<select value={year} onChange={event => { setYear(Number(event.target.value)); setLimit(pageSize) }}>
          <option value={0}>{t('All years', '全部年份')}</option>
          {years.map(value => <option key={value} value={value}>{value}</option>)}
        </select></label>
      </div>
      <p aria-live="polite">{Math.min(limit, total)} / {total} {t('results', '条结果')}</p>
      {total > 0 && <div className="paper-table"><table>
        <thead><tr><th scope="col">{t('Paper reference', '试卷编号')}</th>
          {view === 'questions' ? <><th scope="col">{t('Question', '题号')}</th><th scope="col">{t('Marks', '分值')}</th><th scope="col">{t('Topic', '专题')}</th></>
            : <th scope="col">{t('Teaching archive', '教学资料库收录')}</th>}
        </tr></thead>
        <tbody>{view === 'questions' ? questions.slice(0, limit).map(row => {
          const label = topics.find(([id]) => id === row.chapter)
          return <tr key={paperCode(row) + ':' + row.question}><td>{paperCode(row)}</td><td>{row.question}</td><td>{row.marks}</td><td>{label && t(label[1], label[2])}</td></tr>
        }) : papers.slice(0, limit).map(row => <tr key={paperCode(row)}><td>{paperCode(row)}</td><td>{t('Question paper & mark scheme', '试卷与评分细则')}</td></tr>)}</tbody>
      </table></div>}
      {limit < total && <button type="button" onClick={() => setLimit(limit + pageSize)}>{t('Show more', '显示更多')}</button>}
    </section>
  </>
}
