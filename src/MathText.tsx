import { useId, useState } from 'react'
import katex from 'katex'
import { glossary } from './content/questions'

const motionGlossary = {
  'average speed': '平均速率。总路程除以总用时，始终非负。',
  'average velocity': '平均速度。总位移除以总用时，正负表示方向。',
  'constant acceleration': '恒定加速度。相同时间内的速度变化相同。',
  'constant velocity': '匀速直线运动的速度，大小和方向都保持不变。',
  'constant speed': '恒定速率。速度的大小保持不变。',
  'total distance travelled': '总路程。把沿各个方向走过的路段长度全部相加。',
  'distance travelled': '行驶的路程。所有运动路段的长度之和。',
  'total distance': '总路程。把各段运动的距离相加。',
  'changes direction': '改变运动方向。速度由正变负或由负变正。',
  'change direction': '改变运动方向。速度由正变负或由负变正。',
  'changing direction': '正在改变运动方向。判断速度是否变号。',
  'turns back': '折返。沿与先前相反的方向运动。',
  'at rest': '静止。速度为零。',
  'from rest': '从静止开始。初速度为零。',
  'time axis': '时间轴。在速度–时间图上，轴上的点速度为零。',
  'signed area': '带符号面积。时间轴上方取正，下方取负。',
  'resultant force': '合力。沿选定方向把各力的有符号分量相加。',
  'driving force': '驱动力。使物体沿驱动方向运动的力。',
  'air resistance': '空气阻力。此处沿与物体瞬时运动方向相反的方向。',
  'free-body diagram': '受力图。只画作用在所选物体上的力。',
  'normal reaction': '法向反作用力。接触面对物体施加、垂直于接触面的力。',
  'scale reading': '秤的读数。站在秤上时，读数对应秤对人的支持力大小。',
  'highest point': '最高点。竖直运动到达最高点的一瞬间，速度为零。',
  'launch level': '发射高度。物体出发时所在的高度。',
  'free fall': '自由落体运动。只受重力的运动。',
  'loses contact': '失去接触。表面无法继续对物体施加支持力。',
  'elapsed time': '经过的时间。用结束时刻减去开始时刻。',
  'starting position': '初位置。运动开始时相对于原点的坐标。',
  'net displacement': '净位移。保留正负号，把各段位移相加。',
  'reverses direction': '折返。运动方向与折返前相反。',
  'catch up with': '追上。两物体在同一时刻到达同一位置。',
  'sets off': '出发。开始运动。',
  'positive direction': '规定的正方向。沿相反方向的位移和速度取负。',
  'negative direction': '负方向，与规定的正方向相反。',
  'displacement–time graph': '位移–时间图。其斜率等于速度。',
  'velocity–time graph': '速度–时间图。其斜率等于加速度。',
  'displacement-time graph': '位移–时间图。其斜率等于速度。',
  'velocity-time graph': '速度–时间图。其斜率等于加速度。',
  displacement: '位移。求一段运动的位移时，用末位置减初位置。',
  distance: '路程。沿运动轨迹经过的长度。',
  velocity: '速度。有方向的一维量，正负表示运动方向。',
  'speeding up': '速率增大。速度的绝对值变大。',
  'slowing down': '速率减小。速度的绝对值变小。',
  speed: '速率。等于速度的绝对值。',
  acceleration: '加速度。单位时间内有符号速度的变化。',
  gradient: '斜率。纵坐标的变化除以时间的变化。',
  origin: '参考原点。位置的读数为零。',
  separation: '间距。两物体同一时刻位置之差的绝对值。',
  weight: '重力。大小为质量乘以重力加速度，方向竖直向下。',
  mass: '质量。单位是千克。',
  resistance: '阻力。此处指与物体运动方向相反的力。',
  lift: '电梯。本章用它的竖直加速度确定秤的读数。',
  rebound: '反弹。物体碰撞后改变运动方向。',
  instantaneous: '瞬时的，指某一时刻。',
  respectively: '分别，按前面列出的顺序对应。',
  throughout: '在整个时段内。',
  stationary: '静止的。速度为零。',
  particle: '质点。把物体视作一个点来研究其运动。',
}
const motionDictionary: Record<string, string> = { ...glossary, ...motionGlossary }

function termPattern(dictionary: Record<string, string>) {
  const words = Object.keys(dictionary).sort((a, b) => b.length - a.length)
  return new RegExp('\\b(' + words.join('|') + ')\\b', 'gi')
}
const patterns = { p1: termPattern(glossary), m1: termPattern(motionDictionary) }

export function MathText({ value, translate = false, component = 'p1' }: {
  value: string; translate?: boolean; component?: 'p1' | 'm1'
}) {
  const dictionary = component === 'm1' ? motionDictionary : glossary
  return value.split('$').map((part, i) => {
    if (i % 2) return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false }) }} />
    if (!translate) return part
    return part.split(patterns[component]).map((word, j) => j % 2
      ? <Term key={i + '-' + j} word={word} meaning={dictionary[word.toLowerCase()]} />
      : word)
  })
}

function Term({ word, meaning }: { word: string; meaning: string }) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()
  return <span className="term">
    <button type="button" className="term-button" aria-expanded={open} aria-describedby={tooltipId}
      onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}
      onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}>{word}</button>
    <span id={tooltipId} className="definition" role="tooltip" lang="zh-CN">{meaning}</span>
  </span>
}
