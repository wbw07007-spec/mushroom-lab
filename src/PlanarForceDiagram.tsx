import { useId } from 'react'
import type { PlanarDiagram } from './content/m1-motion-types'

type Position = [number, number]
const origin: Position = [230, 169]

function polar(angle: number, distance: number, [x, y]: Position = origin): Position {
  const radians = angle * Math.PI / 180
  return [x + distance * Math.cos(radians), y - distance * Math.sin(radians)]
}

function line(from: Position, to: Position) {
  return { x1: from[0], y1: from[1], x2: to[0], y2: to[1] }
}

function AngleMark({ from, to, radius, at = origin }: { from: number; to: number; radius: number; at?: Position }) {
  const turn = ((to - from) % 360 + 540) % 360 - 180
  const first = polar(from, radius, at)
  const last = polar(from + turn, radius, at)
  const mid = polar(from + turn / 2, radius + 17, at)
  const degrees = Number(Math.abs(turn).toFixed(2))
  return <g className="planar-angle">
    <line {...line(polar(from, 18, at), first)} className="planar-angle-guide" />
    <line {...line(polar(from + turn, 18, at), last)} className="planar-angle-guide" />
    <path d={`M ${first.join(' ')} A ${radius} ${radius} 0 0 ${turn < 0 ? 1 : 0} ${last.join(' ')}`} />
    <text x={mid[0]} y={mid[1]} textAnchor="middle" dominantBaseline="central">{degrees}°</text>
  </g>
}

export function PlanarForceDiagram({ diagram, caption }: { diagram: PlanarDiagram; caption: string }) {
  const marker = useId()
  const angleMarker = useId()
  const { slope, axesAngle, forces, angles = [], body } = diagram
  const contact = slope === undefined ? origin : polar(slope + 90, -16)
  const slopeStart = slope === undefined ? origin : polar(slope, -166, contact)
  const description = [
    ...(body ? [body] : []),
    ...(slope === undefined ? [] : [slope === 0 ? 'Horizontal surface' :
      'Incline ' + Math.abs(slope) + ' degrees up to the ' + (slope > 0 ? 'right' : 'left')]),
    ...(axesAngle === undefined ? [] : ['Positive x axis rotated ' + axesAngle + ' degrees anticlockwise from horizontal']),
    ...forces.map(force => force.label + ' at ' + ((force.angle % 360 + 360) % 360) + ' degrees anticlockwise from horizontal'),
  ].join('. ')

  return <figure className="motion-figure planar-figure">
    <figcaption>{caption}</figcaption>
    <svg className="motion-svg planar-svg" viewBox="0 0 460 338" role="img" aria-label={description}>
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX="8.3" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
        </marker>
        <marker id={angleMarker} viewBox="0 0 10 10" refX="8.3" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="#687971" />
        </marker>
      </defs>
      {slope !== undefined && <g>
        <line {...line(slopeStart, polar(slope, 141, contact))} className="planar-surface" />
        {Array.from({ length: 22 }, (_, i) => {
          const tick = polar(slope, -161 + i * 14, contact)
          return <line key={i} {...line(tick, polar(slope + 235, 8, tick))} className="planar-hatch" />
        })}
        <line {...line(slopeStart, polar(0, 70, slopeStart))} className="planar-reference" />
        {slope !== 0 && <AngleMark from={0} to={slope} at={slopeStart} radius={28} />}
      </g>}
      {axesAngle !== undefined && [axesAngle, axesAngle + 90].map((angle, i) => {
        const end = polar(angle, 143)
        const label = polar(angle, 157)
        return <g key={i}>
          <line {...line(polar(angle, -120), end)} className="planar-axis" markerEnd={`url(#${angleMarker})`} />
          <text x={label[0]} y={label[1]} textAnchor="middle" dominantBaseline="central">{i === 0 ? 'x' : 'y'}</text>
        </g>
      })}
      {angles.map((angle, i) => <AngleMark key={i} {...angle} radius={38 + (i % 3) * 15} />)}
      {forces.map((force, i) => {
        const head = polar(force.angle, 94)
        const [nx, ny] = polar(force.angle, 1, [0, 0])
        const label = polar(force.angle, 110)
        return <g key={i} className="planar-load">
          <line {...line(origin, head)} markerEnd={`url(#${marker})`} />
          <text x={label[0]} y={label[1] - (Math.abs(ny) < 0.15 ? 12 : ny < -0.85 ? 2 : 0)} dominantBaseline="central"
            textAnchor={nx > 0.28 ? 'start' : nx < -0.28 ? 'end' : 'middle'}>{force.label}</text>
        </g>
      })}
      {slope === undefined
        ? <circle cx={origin[0]} cy={origin[1]} r="4" className="motion-point" />
        : <rect x={origin[0] - 21} y={origin[1] - 16} width="42" height="32" rx="4"
            transform={`rotate(${-slope} ${origin.join(' ')})`} className="force-body" />}
      {body && <text x="15" y="23" className="motion-axis-label">{body}</text>}
    </svg>
  </figure>
}
