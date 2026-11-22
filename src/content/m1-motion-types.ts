export type Bilingual = readonly [en: string, zh: string]
export type Point = readonly [time: number, ordinate: number]

export type MotionPlot =
  | {
    kind: 's' | 'v'
    points: readonly Point[]
    series?: readonly (readonly Point[])[]
    jumps?: true
    tTicks: number[]
    yTicks: number[]
    analysis?: { areas?: true; gradient?: readonly [start: number, end: number] }
  }
  | {
    kind: 'line'
    ticks: number[]
    markers: { label: string; position: number }[]
    positiveLabel?: string
  }

export type MotionPart = { prompt: string; answer: number; feedback: Bilingual } &
  ({ unit?: string; choices?: never; choiceFeedback?: never } |
    { choices: string[]; choiceFeedback?: Partial<Record<number, Bilingual>>; unit?: never })

export type ForceDiagram = {
  positive: 'up' | 'right'
  surface?: 'floor' | 'lift'
  body?: string
  arrows: { direction: 'up' | 'down' | 'left' | 'right'; label: string }[]
}

export type MotionQuestion = {
  id: string
  title: string
  prompt: string
  plot?: MotionPlot
  candidates?: MotionPlot[]
  forceDiagram?: ForceDiagram
  workedForceDiagram?: ForceDiagram
  parts: MotionPart[]
  hint: Bilingual
  steps: { math: string; en: string; zh: string }[]
}

export type MotionSection = {
  id: string
  title: Bilingual
  notePage?: number
  questions: MotionQuestion[]
}
