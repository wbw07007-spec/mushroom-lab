import { motionBasics, motionDisplacement } from './m1-motion-basics.ts'
import { motionIndependent, motionVelocity } from './m1-motion-advanced.ts'
import { extraMotionBasics, extraMotionDisplacementA } from './m1-motion-extension-basics.ts'
import { extraMotionDisplacementB, extraMotionVelocityA } from './m1-motion-extension-graphs.ts'
import { extraMotionIndependent, extraMotionVelocityB } from './m1-motion-extension-review.ts'
import type { Bilingual, MotionQuestion } from './m1-motion-types.ts'

export type MotionSection = {
  id: string
  title: Bilingual
  notePage?: number
  questions: MotionQuestion[]
}

export const motionTitle = ['Motion in a straight line', '直线运动'] as const
export const motionSections: MotionSection[] = [
  { id: 'm1-motion-basics', notePage: 1, title: ['Displacement, velocity & acceleration', '位移、速度与加速度'],
    questions: [...motionBasics, ...extraMotionBasics] },
  { id: 'm1-motion-st', notePage: 3, title: ['Displacement–time graphs', '位移–时间图'],
    questions: [...motionDisplacement, ...extraMotionDisplacementA, ...extraMotionDisplacementB] },
  { id: 'm1-motion-vt', notePage: 5, title: ['Velocity–time graphs', '速度–时间图'],
    questions: [...motionVelocity, ...extraMotionVelocityA, ...extraMotionVelocityB] },
  { id: 'm1-motion-independent', title: ['Chapter independent practice', '章节独立练习'],
    questions: [...motionIndependent, ...extraMotionIndependent] },
]
export const motionQuestions = motionSections.flatMap(section => section.questions)
export const motionNoteSections = [
  { page: 1, number: '1.1–1.2', title: motionSections[0].title, sectionId: 'm1-motion-basics' },
  { page: 2, number: '1.3', title: ['Constant-acceleration equations', '匀加速运动公式'], sectionId: 'm1-motion-independent', questionId: 'm1-motion-17' },
  { page: 3, number: '1.4', title: motionSections[1].title, sectionId: 'm1-motion-st' },
  { page: 4, number: '1.4', title: ['Two particles & separation', '两质点与间距'], sectionId: 'm1-motion-independent', questionId: 'm1-motion-18' },
  { page: 5, number: '1.5', title: motionSections[2].title, sectionId: 'm1-motion-vt' },
  { page: 6, number: '1.6', title: ['Sudden changes of velocity', '速度突变'], sectionId: 'm1-motion-independent', questionId: 'm1-motion-19' },
] satisfies { page: number; number: string; title: Bilingual; sectionId: string; questionId?: string }[]
