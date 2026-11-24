import type { Mode } from './vector-scenes'

export const vectorScenes = [
  { mode: 'points', title: ['Points & displacement', '点与位移向量'] },
  { mode: 'operations', title: ['Vector operations', '向量运算'] },
  { mode: 'line', title: ['Equation of a line', '直线向量方程'] },
  { mode: 'relations', title: ['Relationships between lines', '空间直线的位置关系'] },
] as const satisfies readonly { mode: Mode; title: readonly [string, string] }[]

export const vectorRoute = (mode: Mode) => '#vector-lab/' + mode

export function vectorMode(page: string): Mode | undefined {
  if (page === 'vector-lab') return 'line'
  return vectorScenes.find(scene => vectorRoute(scene.mode) === '#' + page)?.mode
}
