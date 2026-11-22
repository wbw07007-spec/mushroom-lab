import { useId } from 'react'
import type { ForceDiagram as Diagram } from './content/m1-motion-types'

const centerX = 210
const centerY = 128
const directions = {
  up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
} as const

export function ForceDiagram({ diagram, caption }: { diagram: Diagram; caption?: string }) {
  const markerId = useId()
  const byDirection = Object.entries(directions) as [keyof typeof directions, readonly [number, number]][]
  const axisUp = diagram.positive === 'up'
  const accessibleName = (diagram.body ? diagram.body + '. ' : '') + 'Positive direction: ' +
    (axisUp ? 'upwards. ' : 'to the right. ') +
    diagram.arrows.map(arrow => arrow.label + ' acting ' + arrow.direction).join(', ')

  return <figure className="motion-figure">
    {caption && <figcaption>{caption}</figcaption>}
    <svg className="motion-svg force-svg" viewBox="0 0 420 250" role="img" aria-label={accessibleName}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8.2" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
      </defs>
      <line x1="33" y1="52" x2={axisUp ? 33 : 70} y2={axisUp ? 22 : 52}
        className="force-arrow" markerEnd={`url(#${markerId})`} />
      <text x={axisUp ? 46 : 32} y={axisUp ? 39 : 32} className="motion-axis-label">+</text>
      {diagram.surface && <line x1="134" y1="153" x2="286" y2="153" className="force-surface" />}
      {diagram.surface === 'lift' && <path d="M134 153v-50M286 153v-50" className="force-surface" />}
      <rect x="168" y="103" width="84" height="50" rx="9" className="force-body" />
      {diagram.body && <text x={centerX} y={centerY+5} textAnchor="middle">{diagram.body}</text>}
      {byDirection.flatMap(([direction, [dx, dy]]) => {
        const arrows = diagram.arrows.filter(arrow => arrow.direction === direction)
        return arrows.map((arrow, i) => {
          const offset = i - (arrows.length - 1) / 2
          const x1 = centerX + 42*dx + offset*42*Math.abs(dy)
          const y1 = centerY + 25*dy + offset*28*Math.abs(dx)
          const x2 = x1 + 91*dx
          const y2 = y1 + 57*dy
          const xLabel = dx ? (x1+x2)/2 : x2 + Math.sign(offset)*5
          const yLabel = dx ? y2-9 : y2+(dy > 0 ? 23 : -8)
          const anchor = dy && offset ? (offset < 0 ? 'end' : 'start') : 'middle'
          return <g key={direction+i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="force-arrow" markerEnd={`url(#${markerId})`} />
            <text x={xLabel} y={yLabel} textAnchor={anchor}>{arrow.label}</text>
          </g>
        })
      })}
    </svg>
  </figure>
}
