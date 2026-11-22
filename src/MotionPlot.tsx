import { useId } from 'react'
import type { MotionPlot as Plot, Point } from './content/m1-motion-types'

const width = 400
const left = 49
const right = 378
const top = 34
const bottom = 199
const label = (value: number) => String(value).replace('-', '−')

export function MotionPlot({ plot, explain = false, caption }: { plot: Plot; explain?: boolean; caption?: string }) {
  const id = useId()
  if (plot.kind === 'line') {
    const x = (value: number) => left + (value - plot.ticks[0]) / (plot.ticks.at(-1)! - plot.ticks[0]) * (right - left)
    const description = plot.markers.map(marker => marker.label + ': ' + marker.position + ' m').join(', ')
    return <figure className="motion-figure">
      {caption && <figcaption>{caption}</figcaption>}
      <svg className="motion-svg" viewBox="0 0 400 143" role="img" aria-label={description + '. Positive to the right.' + (plot.positiveLabel ? ' ' + plot.positiveLabel : '')}>
        <line className="motion-axis" x1={left} x2={right+10} y1="67" y2="67" />
        <path className="motion-axis" d={`M${right+3} 62 l7 5 l-7 5`} />
        <text className="motion-axis-label" x={left} y="18">{plot.positiveLabel ?? 'Positive direction →'}</text>
        {plot.ticks.map(value => <g key={value}>
          <line className="motion-tick" x1={x(value)} x2={x(value)} y1="62" y2="72" />
          <text x={x(value)} y="96" textAnchor="middle">{label(value)}</text>
        </g>)}
        {plot.markers.map((marker, index) => {
          const position = x(marker.position)
          const above = index % 2 === 0
          return <g key={marker.label}>
            <line className="motion-guide" x1={position} x2={position} y1="67" y2={above ? 45 : 109} />
            <circle className="motion-point" cx={position} cy="67" r="4" />
            <text className="motion-marker" x={position} y={above ? 41 : 125} textAnchor="middle">{marker.label}</text>
          </g>
        })}
        <text className="motion-axis-label" x={left} y="137">x (m)</text>
      </svg>
    </figure>
  }
  const xMin = Math.min(...plot.tTicks, 0)
  const xMax = Math.max(...plot.tTicks)
  const yMin = Math.min(...plot.yTicks, 0)
  const yMax = Math.max(...plot.yTicks, 0)
  const x = (value: number) => left + (value - xMin) / (xMax - xMin) * (right - left)
  const y = (value: number) => bottom - (value - yMin) / (yMax - yMin) * (bottom - top)
  const xy = ([time, ordinate]: Point) => x(time) + ',' + y(ordinate)
  const series = [plot.points, ...(plot.series ?? [])]
  const description = (plot.kind === 's' ? 'Displacement–time' : 'Velocity–time') + ' graph. ' +
    series.map((points, index) =>
      (series.length > 1 ? String.fromCharCode(65 + index) + ': ' : 'Connected points: ') +
      points.map(([time, ordinate]) => `(${time}, ${ordinate})`).join(', ')).join('. ')

  const regions = explain && plot.analysis?.areas ? plot.points.slice(1).flatMap<[Point, Point]>((end, i) => {
    const start = plot.points[i]
    if (start[0] === end[0] || (start[1] === 0 && end[1] === 0)) return []
    if (start[1] * end[1] < 0) {
      const zero: Point = [start[0] - start[1] * (end[0] - start[0]) / (end[1] - start[1]), 0]
      return [[start, zero], [zero, end]]
    }
    return [[start, end]]
  }) : []
  const gradient = explain && plot.analysis?.gradient?.map(time => plot.points.find(point => point[0] === time))
  const [a, b] = gradient || []

  return <figure className="motion-figure">
    {caption && <figcaption>{caption}</figcaption>}
    <svg className="motion-svg" viewBox={`0 0 ${width} 257`} role="img" aria-label={description}>
      <defs>
        <pattern id={id+'-positive'} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M-2 2l4 -4M0 8l8 -8M6 10l4 -4" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
        </pattern>
        <pattern id={id+'-negative'} width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.15" fill="currentColor" opacity=".65" />
        </pattern>
      </defs>
      {plot.tTicks.map(time => <line key={time} className="motion-grid" x1={x(time)} x2={x(time)} y1={top} y2={bottom} />)}
      {plot.yTicks.map(value => <line key={value} className="motion-grid" x1={left} x2={right} y1={y(value)} y2={y(value)} />)}
      {regions.map(([start, end]) => {
        const sign = start[1]+end[1] > 0
        const vertices: Point[] = [start, end, [end[0],0], [start[0],0]]
        return <polygon key={start[0]} className="motion-area" fill={`url(#${id}-${sign ? 'positive' : 'negative'})`}
          points={vertices.map(xy).join(' ')} />
      })}
      <line className="motion-axis" x1={left} x2={right+8} y1={y(0)} y2={y(0)} />
      <line className="motion-axis" x1={x(0)} x2={x(0)} y1={top-8} y2={bottom} />
      {plot.tTicks.map(time => <g key={time}>
        <line className="motion-tick" x1={x(time)} x2={x(time)} y1={y(0)-4} y2={y(0)+4} />
        <text x={x(time)} y="222" textAnchor="middle">{label(time)}</text>
      </g>)}
      {plot.yTicks.map(value => <g key={value}>
        <line className="motion-tick" x1={left-4} x2={left} y1={y(value)} y2={y(value)} />
        <text x={left-9} y={y(value)+5} textAnchor="end">{label(value)}</text>
      </g>)}
      <text className="motion-axis-label" x="13" y="20">{plot.kind === 's' ? 's (m)' : 'v (m s⁻¹)'}</text>
      <text className="motion-axis-label" x={right} y="244" textAnchor="end">t (s)</text>
      {a && b && <polyline className="motion-gradient" points={([a, [b[0], a[1]], b] satisfies Point[]).map(xy).join(' ')} />}
      {series.map((points, index) => <g className={index ? 'motion-second-series' : undefined} key={index}>
        {plot.jumps ? points.slice(1).map((end, i) => {
          const start = points[i]
          return <polyline key={i} className={start[0] === end[0] ? 'motion-jump' : 'motion-curve'} points={[start, end].map(xy).join(' ')} />
        }) : <polyline className="motion-curve" points={points.map(xy).join(' ')} />}
        {points.map((point, i) => <circle key={i} className={plot.jumps && points[i+1]?.[0] === point[0] && points[i+1][1] !== point[1] ? 'motion-point motion-open-point' : 'motion-point'}
          cx={x(point[0])} cy={y(point[1])} r="3.7" />)}
      </g>)}
      {series.length > 1 && series.map((_, index) => <g className={index ? 'motion-second-series' : undefined} key={index}>
        <line className="motion-curve" x1={left+index*62} x2={left+28+index*62} y1="241" y2="241" />
        <text x={left+34+index*62} y="246">{String.fromCharCode(65 + index)}</text>
      </g>)}
    </svg>
  </figure>
}
