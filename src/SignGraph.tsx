import { useEffect, useRef } from 'react'
import type { Task } from './content/questions'

export function SignGraph({ graph }: { graph: NonNullable<Task['signGraph']> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [first, second] = graph.labels
  const quantity = graph.quantity ?? 'The discriminant'
  const description = graph.region === 'inside'
    ? `${quantity} is negative between ${first} and ${second}.`
    : `${quantity} is positive to the left of ${first} and to the right of ${second}.`

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const c = canvas.getContext('2d')
    if (!c) return
    const [a, b] = graph.roots
    const span = b - a
    const left = a - span * .28
    const right = b + span * .28
    const x = (value: number) => 25 + (value - left) * 350 / (right - left)
    const y = (value: number) => 73 - 112 * (value - a) * (value - b) / (span * span)
    c.clearRect(0, 0, 400, 132)
    c.fillStyle = '#f9e8bc'
    if (graph.region === 'inside') c.fillRect(x(a), 23, x(b)-x(a), 83)
    else {
      c.fillRect(25, 23, x(a)-25, 83)
      c.fillRect(x(b), 23, 375-x(b), 83)
    }
    c.strokeStyle = '#68746b'
    c.lineWidth = 1
    c.beginPath()
    c.moveTo(23, 73)
    c.lineTo(376, 73)
    if (left < 0 && right > 0) {
      c.moveTo(x(0), 19)
      c.lineTo(x(0), 111)
    }
    c.stroke()
    c.strokeStyle = '#286b9c'
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(x(left), y(left))
    for (let i = 1; i <= 96; i++) {
      const value = left + (right-left)*i/96
      c.lineTo(x(value), y(value))
    }
    c.stroke()
    c.fillStyle = '#173a30'
    c.font = '13px system-ui'
    c.fillText(graph.quantity ?? 'Δ', 16, 17)
    c.fillText(graph.variable, 382, 77)
    c.textAlign = 'center'
    for (const [root, label] of [[a, first], [b, second]] as const) {
      c.fillStyle = '#fffdf6'
      c.strokeStyle = '#173a30'
      c.beginPath()
      c.arc(x(root), 73, 3, 0, 2*Math.PI)
      c.fill()
      c.stroke()
      c.fillStyle = '#173a30'
      c.fillText(label, x(root), 122)
    }
    c.textAlign = 'start'
  }, [first, graph, second])

  return <canvas className="sign-graph" ref={ref} width={400} height={132} aria-label={description} role="img">{description}</canvas>
}
