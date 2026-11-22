import { motionNoteSections, motionSections, motionTitle } from './m1-motion.ts'
import { resultantForceQuestions, verticalMotionFoundation } from './m1-forces-foundation.ts'
import { liftQuestions, verticalMotionApplication } from './m1-forces-application.ts'
import type { Bilingual, MotionSection } from './m1-motion-types.ts'

type NoteSection = { page: number; number: string; title: Bilingual; sectionId: string; questionId?: string }
type M1Chapter = {
  id: string
  ordinal: Bilingual
  title: Bilingual
  pdf: string
  sections: MotionSection[]
  notes: NoteSection[]
}

const forcesSections: MotionSection[] = [
  { id: 'm1-forces-resultant', notePage: 1, title: ['Resultant force & motion', '合力与运动'], questions: resultantForceQuestions },
  { id: 'm1-forces-vertical', notePage: 2, title: ['Weight & vertical motion', '重力与竖直运动'],
    questions: [...verticalMotionFoundation, ...verticalMotionApplication] },
  { id: 'm1-forces-lifts', notePage: 3, title: ['Normal reaction & lifts', '法向反作用力与电梯'], questions: liftQuestions },
]

export const m1Chapters: M1Chapter[] = [
  { id: 'm1-motion', ordinal: ['Chapter 1', '第一章'], title: motionTitle, pdf: 'm1-01.pdf', sections: motionSections, notes: motionNoteSections },
  { id: 'm1-forces', ordinal: ['Chapter 2', '第二章'], title: ['Forces and motion', '力与运动'], pdf: 'm1-02.pdf', sections: forcesSections,
    notes: forcesSections.map((section, i) => ({
      page: i+1, number: ['2.1–2.2', '2.3', '2.4'][i], title: section.title, sectionId: section.id,
    })) },
]

export function findM1Chapter(route: string) {
  return m1Chapters.find(chapter => route === chapter.id || route === chapter.id+'-notes'
    || chapter.sections.some(section => section.id === route))
}
