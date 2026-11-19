import { useState } from 'react'
import catalog from './content/p1-resources.json'

const categories = [
  ['lesson', 'Teaching slides', '教学讲义'],
  ['homework', 'Homework', '课后作业'],
  ['review', 'Review', '章节复习'],
  ['solution', 'Worked solutions', '详解'],
] as const
const chapters = Array.from({ length: 9 }, (_, i) => i + 1)

export function ResourceCatalog({ t }: { t: (en: string, cn: string) => string }) {
  const [chapter, setChapter] = useState(0)
  const [category, setCategory] = useState('')
  const visible = catalog.filter(item => (!chapter || item.chapter === chapter) && (!category || item.category === category))

  function title(item: typeof catalog[number]) {
    switch (item.variant) {
      case 'section': return t('Section', '小节') + ' ' + item.chapter + '.' + item.section
      case 'readable': return t('Homework worked solutions · readable edition', '课后作业详解 · 易读版')
      case 'original': return t('Homework', '课后作业')
      case 'questions': return t('Review questions', '复习题')
      case 'Homework_Detailed': return t('Homework worked solutions', '课后作业详解')
      case 'Review_Handwritten_Solutions': return t('Handwritten review solutions', '复习题手写详解')
      default: return item.variant
    }
  }

  return <section className="card resource-catalog">
    <h2>{t('Pure Mathematics 1 · Resource catalogue', 'Pure Mathematics 1 教学资料目录')}</h2>
    <p>{t('This catalogue lists files held in the teaching archive. Online reading and downloads are not yet available for these entries.', '此目录列出教学资料库中的文件。这些条目暂未开放在线阅读或下载。')}</p>
    <div className="resource-filters">
      <label>{t('Chapter', '章节')}<select value={chapter} onChange={event => setChapter(Number(event.target.value))}>
        <option value={0}>{t('All chapters', '全部章节')}</option>
        {chapters.map(number => <option key={number} value={number}>{t('Chapter', '第')} {number}{t('', ' 章')}</option>)}
      </select></label>
      <label>{t('Resource type', '资料类型')}<select value={category} onChange={event => setCategory(event.target.value)}>
        <option value="">{t('All types', '全部类型')}</option>
        {categories.map(([id, en, cn]) => <option key={id} value={id}>{t(en, cn)}</option>)}
      </select></label>
    </div>
    <p aria-live="polite">{visible.length} {t('resources', '份资料')}</p>
    {chapters.map(number => {
      const rows = visible.filter(item => item.chapter === number)
      if (!rows.length) return null
      return <details key={number} open={chapter === number || undefined}>
        <summary>{t('Chapter', '第')} {number}{t('', ' 章')} · {rows.length}</summary>
        {categories.map(([id, en, cn]) => {
          const group = rows.filter(item => item.category === id)
          return group.length > 0 && <section key={id}>
            <h3>{t(en, cn)}</h3>
            <ul>{group.map(item => <li key={item.variant + item.section}>{title(item)} <small>{item.format}</small></li>)}</ul>
          </section>
        })}
      </details>
    })}
  </section>
}
