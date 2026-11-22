import type { MotionPlot, MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const motionVelocity: MotionQuestion[] = [
  {
    id: 'm1-motion-11',
    title: 'Find acceleration from a graph',
    prompt: 'The velocity–time graph shows the motion of a baggage trolley.',
    plot: {
      kind: 'v', points: [[0, 6], [2, 6], [6, -2], [8, -2]],
      tTicks: [0, 2, 4, 6, 8], yTicks: [-4, -2, 0, 2, 4, 6],
      analysis: { gradient: [2, 6] },
    },
    parts: [{
      prompt: 'Find the acceleration between $t=2$ and $t=6$.',
      answer: -2,
      unit: 'm s⁻²',
      feedback: ['The graph falls as time increases. Decide what sign its gradient should have before rechecking your calculation.', '随着时间增加，图线下降。先判断斜率应取正还是取负，再检查计算。'],
    }],
    hint: ['Read the velocities at both endpoints of the sloping segment. The acceleration is its gradient.', '读出斜线两端的速度。该线段的斜率就是加速度。'],
    steps: [
      { math: tex`\Delta v=-2-6=-8\,\mathrm{m\,s^{-1}}`, en: 'Subtract the velocity at $t=2$ from the velocity at $t=6$.', zh: '用 $t=6$ 时的速度减去 $t=2$ 时的速度。' },
      { math: tex`\Delta t=6-2=4\,\mathrm{s}`, en: 'Find the duration of the sloping segment.', zh: '求这段斜线对应的时间长度。' },
      { math: tex`a=\frac{-8}{4}=-2\,\mathrm{m\,s^{-2}}`, en: 'The gradient gives the acceleration. Its negative sign means the acceleration is in the negative direction.', zh: '斜率给出加速度。负号表示加速度指向负方向。' },
    ],
  },
  {
    id: 'm1-motion-12',
    title: 'Read direction and change in speed',
    prompt: 'A small boat moves along a straight channel. Its velocity–time graph is shown.',
    plot: {
      kind: 'v', points: [[0, -2], [4, -6]],
      tTicks: [0, 1, 2, 3, 4], yTicks: [-6, -4, -2, 0, 2],
    },
    parts: [{
      prompt: 'Which description is correct over the interval shown?',
      choices: ['Positive direction, speed increasing.', 'Negative direction, speed decreasing.', 'Negative direction, speed increasing.', 'Negative direction, constant speed.'],
      answer: 2,
      feedback: ['The sign of velocity tells you the direction. Compare the magnitudes of the velocities to see what happens to speed.', '速度的正负表示运动方向。比较速度的绝对值，判断速率怎样变化。'],
    }],
    hint: ['Check both whether the graph is below the time axis and whether it gets farther from that axis.', '先看图线是否在时间轴下方，再看它是否离时间轴越来越远。'],
    steps: [
      { math: tex`v<0\qquad(0\le t\le4)`, en: 'The whole graph is below the time axis, so the boat moves in the negative direction.', zh: '整段图线在时间轴下方，因此小船沿负方向运动。' },
      { math: tex`|v|:\ 2\longrightarrow6\,\mathrm{m\,s^{-1}}`, en: 'The magnitude of velocity increases from $2$ to $6$. The boat speeds up while moving in the negative direction.', zh: '速度的绝对值从 $2$ 增大到 $6$，所以小船沿负方向运动，速率也在增大。' },
    ],
  },
  {
    id: 'm1-motion-13',
    title: 'Find displacement from a trapezium',
    prompt: 'The graph shows the velocity of a moving platform over one interval.',
    plot: {
      kind: 'v', points: [[0, 2], [4, 6]],
      tTicks: [0, 1, 2, 3, 4], yTicks: [0, 2, 4, 6],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'Find the displacement over the interval shown.',
      answer: 16,
      unit: 'm',
      feedback: ['The initial velocity is above zero. Check that your area includes the whole region down to the time axis.', '初速度大于零。检查所求面积是否包含图线与时间轴之间的整个区域。'],
    }],
    hint: ['Look at the region between the velocity graph and the time axis. Identify its two parallel sides.', '观察速度图线与时间轴之间的区域，找出它的两条平行边。'],
    steps: [
      { math: tex`\Delta t=4-0=4\,\mathrm{s}`, en: 'The parallel sides are four seconds apart.', zh: '梯形两条竖直平行边的水平间距对应 $4$ 秒。' },
      { math: tex`\Delta s=\tfrac12(2+6)\times4=16\,\mathrm{m}`, en: 'The two velocities give the lengths of the parallel sides. The whole area is above the time axis, so the displacement is positive.', zh: '两端的速度是两条平行边的长度。整个区域在时间轴上方，因此位移为正。' },
    ],
  },
  {
    id: 'm1-motion-14',
    title: 'Find displacement over three stages',
    prompt: 'A loading robot moves along a marked rail. Its velocity–time graph is shown.',
    plot: {
      kind: 'v', points: [[0, 0], [3, -4], [5, -4], [7, 0]],
      tTicks: [0, 1, 3, 5, 7], yTicks: [-4, -2, 0, 2],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'Find the displacement for the whole journey.',
      answer: -18,
      unit: 'm',
      feedback: ['An area below the time axis contributes a negative displacement. Check whether the question asks for displacement or total distance travelled.', '时间轴下方的面积对位移的贡献为负。请核对题目求的是位移还是总路程。'],
    }],
    hint: ['Split the region at the two corners. Keep track of which side of the time axis each part is on.', '在两个折点处分割区域，分别判断各部分位于时间轴的哪一侧。'],
    steps: [
      { math: tex`\Delta s_1=-\tfrac12\times3\times4=-6\,\mathrm{m}`, en: 'The first triangle is below the time axis.', zh: '第一个三角形位于时间轴下方。' },
      { math: tex`\Delta s_2=-(5-3)\times4=-8\,\mathrm{m}`, en: 'The rectangle is two seconds wide and below the time axis.', zh: '矩形位于时间轴下方，宽度对应 $2$ 秒。' },
      { math: tex`\Delta s_3=-\tfrac12(7-5)\times4=-4\,\mathrm{m}`, en: 'The final triangle is also below the time axis.', zh: '最后一个三角形也位于时间轴下方。' },
      { math: tex`\Delta s=-6-8-4=-18\,\mathrm{m}`, en: 'Add the signed contributions. The robot finishes 18 m in the negative direction from its starting position.', zh: '将各段的有符号面积相加。机器人终点在起点的负方向，离起点 $18$ 米。' },
    ],
  },
  {
    id: 'm1-motion-15',
    title: 'Compare displacement and total distance',
    prompt: 'A gate slides along a straight track. The graph shows its velocity for the whole journey.',
    plot: {
      kind: 'v', points: [[0, 6], [4, 0], [8, -4]],
      tTicks: [0, 2, 4, 6, 8], yTicks: [-4, -2, 0, 2, 4, 6],
      analysis: { areas: true },
    },
    parts: [
      {
        prompt: 'Find the displacement.',
        answer: 4,
        unit: 'm',
        feedback: ['Keep the signs of the two regions. One part of the motion undoes some of the displacement from the other part.', '保留两个区域各自的正负号。折返的一段会抵消前一段的部分位移。'],
      },
      {
        prompt: 'Find the total distance travelled.',
        answer: 20,
        unit: 'm',
        feedback: ['Both parts of the journey count towards the total distance. On the return leg the distance travelled keeps increasing.', '两段运动都要计入总路程。物体折返时，累计路程仍继续增加。'],
      },
    ],
    hint: ['Find where the velocity changes sign. Calculate each triangle separately before combining the results.', '找出速度变号的时刻，分别计算两个三角形对应的面积，再合并结果。'],
    steps: [
      { math: tex`\Delta s_1=\tfrac12(4-0)\times6=12\,\mathrm{m}`, en: 'The triangle from 0 to 4 s is above the time axis, so its contribution is positive.', zh: '从 $0$ 到 $4$ 秒，三角形位于时间轴上方，因此该段位移为正。' },
      { math: tex`\Delta s_2=-\tfrac12(8-4)\times4=-8\,\mathrm{m}`, en: 'The triangle from 4 to 8 s is below the time axis, so its contribution is negative.', zh: '从 $4$ 到 $8$ 秒，三角形位于时间轴下方，因此该段位移为负。' },
      { math: tex`\Delta s=12-8=4\,\mathrm{m}`, en: 'For displacement, add the contributions with their signs.', zh: '求位移时，保留各段的符号后相加。' },
      { math: tex`L=|12|+|-8|=20\,\mathrm{m}`, en: 'For total distance, add their magnitudes. The motion in both directions counts.', zh: '求总路程时，将各段位移的绝对值相加。两个方向上的运动都计入路程。' },
    ],
  },
  {
    id: 'm1-motion-16',
    title: 'Find the final position',
    prompt: tex`A camera rig starts at $s=7\,\mathrm{m}$, where $s$ is measured from a fixed origin. Its velocity–time graph is shown.`,
    plot: {
      kind: 'v', points: [[0, -4], [2, -4], [8, 2], [10, 2]],
      tTicks: [0, 2, 4, 6, 8, 10], yTicks: [-4, -2, 0, 2, 4],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'Find the value of $s$ at the end of the interval shown.',
      answer: -3,
      unit: 'm',
      feedback: ['The net signed area is a change in position. Check whether your answer gives a change or a position measured from the origin.', '总有符号面积表示位置的变化量。检查答案给出的是变化量，还是相对于原点的位置。'],
    }],
    hint: ['Work out the signed area in each region. How is the final position related to the initial position and the displacement?', '分别求出各区域的有符号面积，再想想末位置、初位置与位移的关系。'],
    steps: [
      { math: tex`\Delta s_1=(-4)(2-0)=-8\,\mathrm{m}`, en: 'The first rectangle is below the time axis.', zh: '第一个矩形位于时间轴下方。' },
      { math: tex`\Delta s_2=-\tfrac12(6-2)\times4=-8\,\mathrm{m}`, en: 'The sloping segment crosses the time axis at $t=6$, so first use the triangle below the axis.', zh: '斜线在 $t=6$ 时穿过时间轴，先计算轴下的三角形。' },
      { math: tex`\Delta s_3=\tfrac12(8-6)\times2=2\,\mathrm{m}`, en: 'The other triangle is above the time axis.', zh: '另一个三角形位于时间轴上方。' },
      { math: tex`\Delta s_4=2(10-8)=4\,\mathrm{m}`, en: 'The terminal section gives a positive rectangle.', zh: '最后一段对应时间轴上方的矩形。' },
      { math: tex`\Delta s=-8-8+2+4=-10\,\mathrm{m}`, en: 'Add the signed contributions to get the displacement.', zh: '将各段有符号面积相加，求得位移。' },
      { math: tex`s=7+(-10)=-3\,\mathrm{m}`, en: 'Add the displacement to the initial position. The rig finishes on the negative side of the origin.', zh: '初位置加上位移，得到末位置。装置最终位于原点的负方向一侧。' },
    ],
  },
]

function velocityCandidate(first: number, second: number, third: number): MotionPlot {
  return {
    kind: 'v',
    points: [[0, first], [2, first], [2, second], [5, second], [5, third], [7, third]],
    tTicks: [0, 2, 5, 7],
    yTicks: [-6, -3, 0, 3, 6],
    jumps: true,
  }
}

export const motionIndependent: MotionQuestion[] = [
  {
    id: 'm1-motion-17',
    title: 'Extend a constant-acceleration model',
    prompt: 'A delivery cart moves with constant acceleration. The graph shows its velocity for the first part of the journey. The cart continues with the same acceleration until $t=8$.',
    plot: {
      kind: 'v', points: [[0, 2], [5, 12]],
      tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4, 6, 8, 10, 12],
      analysis: { gradient: [0, 5] },
    },
    parts: [
      {
        prompt: 'Find the velocity at $t=8$.',
        answer: 18,
        unit: 'm s⁻¹',
        feedback: ['Check the time interval you used. Since the acceleration is positive, the requested velocity should exceed the last plotted velocity.', '检查使用的时间间隔。加速度为正，因此所求速度应大于图上最后一个速度。'],
      },
      {
        prompt: 'Find the displacement from $t=5$ to $t=8$.',
        answer: 45,
        unit: 'm',
        feedback: ['The requested displacement covers only part of the journey. Check the time range you used and whether the velocity is fixed.', '题目只求部分路程中的位移。检查使用的时间范围，再判断这段的速度是否恒定。'],
      },
    ],
    hint: ['Read two velocities from the graph to find the constant acceleration. For the second part, set the time interval to $8-5$.', '从图上读出两个速度，求出恒定的加速度。求最后三秒的位移时，取时间间隔为 $8-5$。'],
    steps: [
      { math: tex`a=\frac{12-2}{5-0}=2\,\mathrm{m\,s^{-2}}`, en: 'The gradient of the straight line gives the constant acceleration.', zh: '直线的斜率给出恒定的加速度。' },
      { math: tex`\Delta t=8-5=3\,\mathrm{s}`, en: 'Use $t=5$ as the start of the requested interval.', zh: '把 $t=5$ 作为所求时间段的起点。' },
      { math: tex`v=12+2(3)=18\,\mathrm{m\,s^{-1}}`, en: tex`Use $v=u+a\Delta t$ with the velocity at $t=5$ as $u$.`, zh: tex`在 $v=u+a\Delta t$ 中，用 $t=5$ 时的速度作为初速度 $u$。` },
      { math: tex`\Delta s=12(3)+\tfrac12(2)(3^2)=45\,\mathrm{m}`, en: 'Apply the constant-acceleration displacement equation to the three-second interval.', zh: '对这三秒使用匀加速直线运动的位移公式。' },
    ],
  },
  {
    id: 'm1-motion-18',
    title: 'Find when two particles meet',
    prompt: 'The displacement–time graph shows two particles, A and B, moving along the same straight track. Their displacements are measured from the same fixed origin.',
    plot: {
      kind: 's', points: [[0, -2], [6, 10]], series: [[[0, 8], [6, 2]]],
      tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-2, 0, 2, 4, 6, 8, 10],
    },
    parts: [
      {
        prompt: 'Find the exact time at which A and B meet.',
        answer: 10 / 3,
        unit: 's',
        feedback: ['An estimate from the crossing may be close. The question asks for the exact time.', '从交点读出的估计值可能很接近。题目要求的是准确时刻。'],
      },
      {
        prompt: 'Find their separation at $t=5$.',
        answer: 5,
        unit: 'm',
        feedback: ['Check that both readings refer to the same time and that the separation is non-negative.', '检查两个位置是否取自同一时刻，并确认间距为非负数。'],
      },
    ],
    hint: ['Write each position as its initial value plus its gradient times $t$. Equate the expressions to find when the particles meet.', '用初位置加斜率乘 $t$ 写出各自的位置式。令两式相等，找出相遇时刻。'],
    steps: [
      { math: tex`v_A=\frac{10-(-2)}{6-0}=2\,\mathrm{m\,s^{-1}}`, en: 'Use the change in displacement divided by the time change for A.', zh: '用 A 的位移变化量除以对应的时间变化量。' },
      { math: tex`v_B=\frac{2-8}{6-0}=-1\,\mathrm{m\,s^{-1}}`, en: 'Repeat for B. The negative gradient gives negative velocity.', zh: '同理求 B 的斜率。斜率为负，速度也为负。' },
      { math: tex`s_A=-2+2t,\qquad s_B=8-t`, en: 'Use each line’s intercept at $t=0$ and its constant gradient.', zh: '用两条直线在 $t=0$ 时的截距及各自的恒定斜率列式。' },
      { math: tex`-2+2t=8-t\Rightarrow t=\tfrac{10}{3}\,\mathrm{s}`, en: 'At the meeting point the two positions are equal.', zh: '相遇时，两个质点的位置相同。' },
      { math: tex`s_A(5)=8\,\mathrm{m},\qquad s_B(5)=3\,\mathrm{m}`, en: 'Substitute the same time into both position expressions.', zh: '将同一时刻代入两个位置式。' },
      { math: tex`|s_A(5)-s_B(5)|=|8-3|=5\,\mathrm{m}`, en: 'Take the magnitude of the position difference to find their separation.', zh: '位置差的绝对值就是两者的间距。' },
    ],
  },
  {
    id: 'm1-motion-19',
    title: 'Match displacement and velocity graphs',
    prompt: 'The displacement–time graph shows a cart that can change velocity suddenly.',
    plot: {
      kind: 's', points: [[0, 2], [2, 8], [5, 8], [7, 2]],
      tTicks: [0, 2, 5, 7], yTicks: [0, 2, 4, 6, 8, 10],
    },
    candidates: [
      velocityCandidate(3, 0, 3),
      velocityCandidate(6, 0, -6),
      velocityCandidate(3, 0, -3),
      velocityCandidate(3, 3, -3),
    ],
    parts: [{
      prompt: 'Which velocity–time graph matches the motion?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 2,
      feedback: ['Recheck the direction of motion on the final segment and what the middle horizontal segment means.', '重新判断最后一段的运动方向，并想想中间水平线段表示什么。'],
    }],
    hint: ['Work out the signed gradient of each straight segment. Read the velocity in each candidate at the same times.', '求出每条直线段的有符号斜率，再逐段核对各候选图在对应时间内的速度。'],
    steps: [
      { math: tex`v_1=\frac{8-2}{2-0}=3\,\mathrm{m\,s^{-1}}`, en: 'The first segment has positive gradient.', zh: '第一段斜率为正。' },
      { math: tex`v_2=\frac{8-8}{5-2}=0\,\mathrm{m\,s^{-1}}`, en: 'The cart stays at a fixed position through the horizontal segment.', zh: '在水平线段中，小车停在同一位置。' },
      { math: tex`v_3=\frac{2-8}{7-5}=-3\,\mathrm{m\,s^{-1}}`, en: 'The falling line gives a negative velocity during the last segment.', zh: '最后一段图线下降，速度为负。' },
      { math: tex`(v_1,v_2,v_3)=(3,0,-3)\,\mathrm{m\,s^{-1}}`, en: 'Graph C has these velocities. The dashed jumps represent a sudden change between the constant values.', zh: '图 C 给出这三个速度。虚线表示速度在两个恒定值之间瞬间改变。' },
    ],
  },
  {
    id: 'm1-motion-20',
    title: 'Use calculus to connect motion quantities',
    prompt: tex`A particle has velocity $v=3t^2-12t+9$ for $0\le t\le4$, where $v$ is measured in $\mathrm{m\,s^{-1}}$ and $t$ in seconds. Its initial position is $s=5\,\mathrm{m}$.`,
    parts: [
      {
        prompt: 'Find the acceleration at $t=3$.',
        answer: 6,
        unit: 'm s⁻²',
        feedback: ['The question asks for the rate of change of velocity at one instant. Substituting the time directly into the given expression gives a velocity.', '题目求的是某一时刻的速度变化率。把时间直接代入题目给出的式子，得到的是速度。'],
      },
      {
        prompt: 'Find the position when $t=4$.',
        answer: 9,
        unit: 'm',
        feedback: ['Check whether your answer is a position measured from the origin or a change from the starting position.', '检查答案是相对于原点的位置，还是相对于起点的位置变化量。'],
      },
    ],
    hint: ['Differentiate $v$ to get acceleration and integrate $v$ from $0$ to $4$ to get displacement.', '对 $v$ 求导得到加速度。在 $0$ 到 $4$ 的区间内对 $v$ 积分，求出位移。'],
    steps: [
      { math: tex`a=\frac{\mathrm{d}v}{\mathrm{d}t}=6t-12`, en: 'Acceleration is the derivative of velocity with respect to time.', zh: '加速度是速度关于时间的导数。' },
      { math: tex`a(3)=6(3)-12=6\,\mathrm{m\,s^{-2}}`, en: 'Evaluate the acceleration at the requested instant.', zh: '代入指定时刻，求加速度。' },
      { math: tex`\Delta s=\int_0^4 (3t^2-12t+9)\,\mathrm{d}t`, en: 'Integrate the signed velocity over the given interval to find displacement.', zh: '在给定时间段对有符号速度积分，求得位移。' },
      { math: tex`\Delta s=[t^3-6t^2+9t]_0^4=4\,\mathrm{m}`, en: 'Evaluate the antiderivative at the upper and lower limits and subtract.', zh: '分别代入积分上限和下限，再作差。' },
      { math: tex`s(4)=5+4=9\,\mathrm{m}`, en: 'Add the displacement to the initial position.', zh: '位移加初位置，得到末位置。' },
    ],
  },
]
