import { useId, useState } from 'react'
import katex from 'katex'
import { glossary } from './content/questions'

const terms = new RegExp('\\b(' + Object.keys(glossary).sort((a, b) => b.length - a.length).join('|') + ')\\b', 'gi')

export function MathText({ value, translate = false }: { value: string; translate?: boolean }) {
  return value.split('$').map((part, i) => {
    if (i % 2) return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false }) }} />
    if (!translate) return part
    return part.split(terms).map((word, j) => j % 2 ? <Term key={i + '-' + j} word={word} /> : word)
  })
}

function Term({ word }: { word: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <span className="term">
    <button type="button" className="term-button" aria-expanded={open} aria-describedby={id}
      onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}
      onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>{word}</button>
    <span className="definition" id={id} role="tooltip" lang="zh-CN">{glossary[word.toLowerCase()]}</span>
  </span>
}
