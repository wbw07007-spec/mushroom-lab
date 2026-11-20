import { bank } from './questions.ts'
import { quadratics } from './quadratics.ts'
import { functionsCompanions } from './functions-companions.ts'
import { coordinateGeometry } from './coordinate-geometry.ts'
import { circularPractice } from './circular-practice.ts'
import { trigPractice } from './trig-practice.ts'
import { seriesPractice } from './series-practice.ts'
import { differentiationPractice } from './differentiation-practice.ts'
import { applicationsPractice } from './applications-practice.ts'
import { integrationPractice } from './integration-practice.ts'

export const practiceTopics = [
  { id: 'functions-foundation', title: [bank.topic, '函数与图像变换'], exercises: bank.exercises },
  { id: 'quadratics-consolidation', title: ['Chapter 1 Consolidation', '第一章巩固'], exercises: quadratics },
  { id: 'functions-companions', title: ['Functions: Exam-style Practice', '函数真题同类练习'], exercises: functionsCompanions },
  { id: 'coordinate-geometry', title: ['Coordinate Geometry', '坐标几何'], exercises: coordinateGeometry },
  { id: 'circular-measure', title: ['Circular Measure', '弧度制'], exercises: circularPractice },
  { id: 'trigonometry', title: ['Trigonometry', '三角函数'], exercises: trigPractice },
  { id: 'series', title: ['Series', '数列与级数'], exercises: seriesPractice },
  { id: 'differentiation', title: ['Differentiation', '微分基础'], exercises: differentiationPractice },
  { id: 'applications-of-differentiation', title: ['Applications of Differentiation', '微分应用'], exercises: applicationsPractice },
  { id: 'integration', title: ['Integration', '积分'], exercises: integrationPractice },
].map(topic => ({ ...topic, tasks: topic.exercises.flatMap(exercise => exercise.tasks) }))
