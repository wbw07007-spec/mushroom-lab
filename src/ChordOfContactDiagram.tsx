import { useEffect, useRef } from 'react'

export function ChordOfContactDiagram({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const context = ref.current?.getContext('2d')
    if (!context) return
    const scale = 16
    const toCanvas = ([x, y]: readonly [number, number]) => [88 + scale*x, 118 - scale*y] as const
    const centre = [2, 1] as const
    const external = [9, 2] as const
    const upperContact = [5, 5] as const
    const lowerContact = [6, -2] as const
    const segment = (start: readonly [number, number], end: readonly [number, number]) => {
      context.beginPath()
      context.moveTo(...toCanvas(start))
      context.lineTo(...toCanvas(end))
      context.stroke()
    }
    context.clearRect(0, 0, 280, 200)
    context.lineWidth = 1.75
    context.strokeStyle = '#286b9c'
    context.beginPath()
    context.arc(...toCanvas(centre), 5*scale, 0, 2*Math.PI)
    context.stroke()
    context.strokeStyle = '#173a30'
    segment(upperContact, external)
    segment(lowerContact, external)
    context.setLineDash([4, 4])
    segment(upperContact, lowerContact)
    segment(centre, external)
    context.setLineDash([])
    context.fillStyle = '#173a30'
    context.font = 'bold 14px system-ui'
    for (const [point, name, dx, dy] of [
      [centre, 'C', -14, 16], [external, 'T', 8, 5],
      [upperContact, 'A', -8, -8], [lowerContact, 'B', 6, 15],
    ] as const) {
      const [x, y] = toCanvas(point)
      context.beginPath()
      context.arc(x, y, 2.6, 0, 2*Math.PI)
      context.fill()
      context.fillText(name, x+dx, y+dy)
    }
  }, [])
  return <canvas ref={ref} className="sign-graph" style={{ maxWidth: 280 }} width={280} height={200} role="img" aria-label={label}>{label}</canvas>
}
