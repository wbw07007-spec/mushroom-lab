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

export type MotionQuestion = {
  id: string
  title: string
  prompt: string
  plot?: MotionPlot
  candidates?: MotionPlot[]
  parts: MotionPart[]
  hint: Bilingual
  steps: { math: string; en: string; zh: string }[]
}
