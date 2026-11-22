import type { MotionQuestion } from './m1-motion-types.ts'

const latex = String.raw

export const extraMotionBasics: MotionQuestion[] = [
  {
    id: 'm1-motion-21',
    title: 'Change the reference origin',
    prompt: 'The number line shows the original coordinates of $P$, $Q$ and $N$. A surveyor makes $N$ the new origin and keeps the same positive direction. A trolley travels from $P$ to $Q$.',
    plot: {
      kind: 'line', ticks: [-2, -1, 0, 1, 2, 3, 4, 5, 6],
      markers: [{ label: 'P', position: -1 }, { label: 'Q', position: 3 }, { label: 'N', position: 5 }],
    },
    parts: [{
      prompt: 'Which pair gives the new coordinate of $Q$ and the displacement of the trolley, respectively?',
      choices: ['$3$ m and $+4$ m', '$-2$ m and $-4$ m', '$-2$ m and $+4$ m', '$-2$ m and $+2$ m'],
      answer: 2,
      feedback: ['Separate the coordinate measured from the origin from the displacement measured from the starting point.', '区分从原点量起的坐标和从出发点量起的位移。'],
      choiceFeedback: {
        0: ['The displacement is correct. Measure the new coordinate from $N$.', '位移正确。新的坐标要从 $N$ 量起。'],
        1: ['$Q$ is on the negative side of the new origin, but the trolley moves towards increasing coordinates.', '$Q$ 在新原点的负方向一侧，但小车朝坐标增大的方向运动。'],
        3: ['Displacement is measured from $P$ to $Q$. The 2 m in this option is the separation of $N$ and $Q$.', '位移从 $P$ 量到 $Q$。选项中的 2 m 是 $N$ 与 $Q$ 的间距。'],
      },
    }],
    hint: ['Subtract the old coordinate of $N$ from each original coordinate. Then compare the two new coordinates.', '从每个原坐标中减去 $N$ 的旧坐标，再比较两个新坐标。'],
    steps: [
      { math: latex`x'_P=-1-5=-6\,\mathrm{m}`, en: 'Subtract the old coordinate of $N$ to find the position of $P$ relative to the new origin.', zh: '减去 $N$ 的旧坐标，得到 $P$ 相对于新原点的位置。' },
      { math: latex`x'_Q=3-5=-2\,\mathrm{m}`, en: '$Q$ lies 2 m to the left of $N$.', zh: '$Q$ 在 $N$ 左侧 2 m 处。' },
      { math: latex`\Delta s=(-2)-(-6)=+4\,\mathrm{m}`, en: 'The common shift cancels in the difference. The trolley moves 4 m in the positive direction.', zh: '计算坐标差时，共同的平移量抵消。小车沿正方向运动了 4 m。' },
    ],
  },
  {
    id: 'm1-motion-22',
    title: 'Include a stop in the average',
    prompt: 'A cart travels at $2$ m s⁻¹ for $3$ s, stops for $3$ s and then travels at $4$ m s⁻¹ for $6$ s.',
    parts: [{
      prompt: 'What is its average speed from departure to arrival?',
      choices: ['$2.5$ m s⁻¹', '$3$ m s⁻¹', '$\\dfrac{10}{3}$ m s⁻¹', '$2$ m s⁻¹'],
      answer: 0,
      feedback: ['Average speed uses the total distance and all elapsed time, including the stop.', '平均速率等于总路程除以全程用时，静止的时间也要计入。'],
      choiceFeedback: {
        1: ['The arithmetic mean of the two moving speeds gives both stages equal weight. The stages have different durations, and the stop also takes time.', '两段运动速率的算术平均数给两段相同的权重。两段运动用时不同，静止也占用时间。'],
        2: ['This uses only the 9 seconds spent moving. Include the stop when counting the time from departure to arrival.', '这个结果只计入了运动的 9 秒。计算全程时间还要计入静止的时间。'],
        3: ['This weights the three stages equally. Use the distance from each stage and its actual duration.', '这个结果给三个阶段相同的权重。应根据各阶段实际的用时与路程计算。'],
      },
    }],
    hint: ['Find the distance in each stage. The middle stage contributes time and zero distance.', '分别求各阶段的路程。中间阶段的路程为零，用时仍要计入。'],
    steps: [
      { math: latex`L=2(3)+0(3)+4(6)=30\,\mathrm{m}`, en: 'Each stage contributes its speed multiplied by its duration.', zh: '每个阶段的路程等于该阶段的速率乘以用时。' },
      { math: latex`\Delta t=3+3+6=12\,\mathrm{s}`, en: 'The wait is part of the journey time.', zh: '等待时间属于全程用时。' },
      { math: latex`\text{Average speed}=\frac{30}{12}=2.5\,\mathrm{m\,s^{-1}}`, en: 'Divide the total distance by the elapsed time.', zh: '用总路程除以全程用时。' },
    ],
  },
  {
    id: 'm1-motion-23',
    title: 'Recover a turning position from journey length',
    prompt: 'A runner starts at $P$, moves in the positive direction, turns once at $T$ and finishes at $Q$. The total distance travelled is $18$ m. The diagram marks $P$ and $Q$.',
    plot: {
      kind: 'line', ticks: [-4, -2, 0, 2, 4, 6, 8, 10, 12, 14],
      markers: [{ label: 'P', position: -4 }, { label: 'Q', position: 2 }],
    },
    parts: [{
      prompt: 'What is the coordinate of $T$?',
      choices: ['$12$ m', '$6$ m', '$14$ m', '$8$ m'],
      answer: 3,
      feedback: ['Use both marked positions. The total distance is the sum of the outward and return legs.', '两个标记点的位置都要用到。总路程等于去程和返程的长度之和。'],
      choiceFeedback: {
        0: ['This is the length of the outward leg. Start that leg at $P$ to obtain the turning position.', '这是去程的长度。要求折返点坐标，还需加上 $P$ 的坐标。'],
        1: ['This is the length of the return leg. Compare the turning point with the finishing position $Q$.', '这是返程的长度。还要结合终点 $Q$ 的坐标来确定折返点。'],
        2: ['This assigns the full 18 m to the outward leg. Some of that distance was covered on the way back to $Q$.', '这个结果把 18 m 全部算作去程。其中一部分是在折返到 $Q$ 时走的。'],
      },
    }],
    hint: ['Let the coordinate of $T$ be $x$. Write the two leg lengths using $x$ and the marked coordinates.', '设 $T$ 的坐标为 $x$，用 $x$ 和两个标记点的坐标分别表示两段路程。'],
    steps: [
      { math: latex`PT=x-(-4)=x+4`, en: 'Read the starting position as $-4$ m. The outward leg goes in the positive direction.', zh: '从数轴读出起点为 $-4$ m。去程沿正方向。' },
      { math: latex`TQ=x-2`, en: 'The return leg ends at coordinate $2$, to the left of $T$.', zh: '返程终点的坐标是 $2$，在 $T$ 的左侧。' },
      { math: latex`(x+4)+(x-2)=18`, en: 'Add the two lengths to match the total distance.', zh: '两个长度相加等于总路程。' },
      { math: latex`2x+2=18\quad\Rightarrow\quad x=8\,\mathrm{m}`, en: 'The turning point is 8 m to the right of the origin.', zh: '折返点位于原点右侧 8 m 处。' },
    ],
  },
  {
    id: 'm1-motion-24',
    title: 'Compare two complete journeys',
    prompt: 'Two walkers start at the same point and finish at the same second point on a straight path. They take the same time. Asha never changes direction. Ben covers a nonzero distance in both directions.',
    parts: [{
      prompt: 'Which statement about their journeys is correct?',
      choices: [
        'Their average speeds are equal. Ben has the greater average velocity.',
        'Their average velocities are equal. Ben has the greater average speed.',
        'Ben has both the greater average speed and the greater average velocity.',
        'Their average speeds and average velocities are both equal.',
      ],
      answer: 1,
      feedback: ['Compare the signed changes in position and then compare the lengths of the paths actually travelled.', '先比较带符号的位置变化，再比较实际走过的路程。'],
      choiceFeedback: {
        0: ['Same endpoints and elapsed time determine the average velocity. Ben’s movement in both directions changes the distance travelled.', '相同的起终点和用时决定了相同的平均速度。Ben 在两个方向都走过一段距离，这会改变总路程。'],
        2: ['A longer path increases the average speed in the same time. Check whether it changes the signed displacement between fixed endpoints.', '用时相同，路程更长会使平均速率更大。再判断固定起终点之间的位移是否随路线改变。'],
        3: ['The shared endpoints determine the same displacement. Walking in both directions makes Ben’s path longer.', '共同的起终点决定相同的位移。Ben 在两个方向都走过一段，因此总路程更长。'],
      },
    }],
    hint: ['Imagine both journeys on a number line. One walker covers part of the path in both directions.', '在数轴上想象这两次运动。其中一人沿两个方向走过了同一段路。'],
    steps: [
      { math: latex`\overline v_A=\frac{\Delta s}{\Delta t}=\overline v_B`, en: 'The two walkers have the same signed displacement and the same elapsed time.', zh: '两人的带符号位移和全程用时分别相同。' },
      { math: latex`L_B>L_A=|\Delta s|`, en: 'Asha follows the direct path. Ben’s return movement adds to the distance.', zh: 'Asha 直接到达终点。Ben 的折返增加了总路程。' },
      { math: latex`\frac{L_B}{\Delta t}>\frac{L_A}{\Delta t}`, en: 'Ben has the greater average speed.', zh: 'Ben 的平均速率更大。' },
    ],
  },
  {
    id: 'm1-motion-25',
    title: 'Track position from a negative starting point',
    prompt: 'A robot starts at $P$, shown on the number line. It moves $4$ m in the negative direction and then $9$ m in the positive direction.',
    plot: { kind: 'line', ticks: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4], markers: [{ label: 'P', position: -2 }] },
    parts: [{
      prompt: 'Find the final coordinate of the robot.',
      answer: 3,
      unit: 'm',
      feedback: ['Apply each signed change to the starting coordinate read from the number line. The final coordinate and the total displacement can differ.', '先从数轴读出起点坐标，再依次加上每段带符号的位移。末坐标和总位移可以不同。'],
    }],
    hint: ['Write the starting coordinate first and update it once for each stage.', '先写出起点坐标，每运动一段就更新一次位置。'],
    steps: [
      { math: latex`x_1=-2-4=-6\,\mathrm{m}`, en: 'The starting coordinate is $-2$ m. Motion in the negative direction reduces the coordinate by 4 m.', zh: '起点坐标为 $-2$ m。沿负方向运动使坐标减小 4 m。' },
      { math: latex`x_2=-6+9=3\,\mathrm{m}`, en: 'Add the second displacement to the intermediate position.', zh: '用第一段的末位置加上第二段的位移。' },
    ],
  },
  {
    id: 'm1-motion-26',
    title: 'Infer a change in speed through zero velocity',
    prompt: 'During a $4$ s interval, the velocity of a particle changes from $-6$ m s⁻¹ to $+2$ m s⁻¹ with constant acceleration.',
    parts: [{
      prompt: 'How does its speed change during the interval?',
      choices: ['It increases throughout.', 'It decreases throughout.', 'It decreases and then increases.', 'It stays constant.'],
      answer: 2,
      feedback: ['Velocity increases throughout. For speed, compare the magnitude before and after the velocity passes through zero.', '速度一直增大。判断速率时，分别考察速度过零前后的绝对值。'],
      choiceFeedback: {
        0: ['A positive acceleration increases signed velocity. While the velocity is negative and approaches zero, its magnitude gets smaller.', '正加速度使带符号的速度增大。负速度趋近零时，其绝对值变小。'],
        1: ['The final speed is lower than the initial speed. Check the speed again after the velocity becomes positive.', '末速率低于初速率。还要看速度变为正值之后，速率如何变化。'],
        3: ['Constant acceleration means equal changes in velocity over equal times. The magnitude of velocity can still vary.', '加速度恒定意味着相等时间内的速度变化相等，速度的绝对值仍可变化。'],
      },
    }],
    hint: ['Decide when the signed velocity is zero. Compare its absolute value on either side of that time.', '找出带符号的速度为零的时刻，再比较该时刻两侧的速度绝对值。'],
    steps: [
      { math: latex`a=\frac{2-(-6)}4=2\,\mathrm{m\,s^{-2}}`, en: 'The signed velocity increases by 2 m s⁻¹ each second.', zh: '带符号的速度每秒增大 2 m s⁻¹。' },
      { math: latex`0=-6+2t\quad\Rightarrow\quad t=3\,\mathrm{s}`, en: 'The particle has zero speed after 3 seconds.', zh: '第 3 秒末，粒子的速率为零。' },
      { math: latex`|v|:\quad 6\;\longrightarrow\;0\;\longrightarrow\;2`, en: 'The speed decreases to zero and then increases, with all speeds in m s⁻¹.', zh: '速率先减小到零，再增大。各数值的单位均为 m s⁻¹。' },
    ],
  },
]

export const extraMotionDisplacementA: MotionQuestion[] = [
  {
    id: 'm1-motion-27',
    title: 'Find two times at one location',
    prompt: 'The displacement–time graph shows a trolley on a straight track. A sensor is fixed at $s=6$ m.',
    plot: { kind: 's', points: [[0, -2], [3, 10], [7, 2]], tTicks: [0, 1, 2, 3, 4, 5, 6, 7], yTicks: [-2, 0, 2, 4, 6, 8, 10] },
    parts: [{
      prompt: 'At which times does the trolley pass the sensor?',
      choices: ['$t=2$ s only', '$t=3$ s and $t=7$ s', '$t=2$ s and $t=5$ s', '$t=1$ s and $t=7$ s'],
      answer: 2,
      feedback: ['A fixed sensor position corresponds to a horizontal level on the graph. Find every crossing at that level.', '固定传感器的位置对应图中的一条水平线。找出图线与该水平线的所有交点。'],
      choiceFeedback: {
        0: ['This gives the first pass. Check the descending segment for a second pass at the same position.', '这个时刻是第一次经过。检查下降线段是否再次经过同一位置。'],
        1: ['At these points the segments end. Look for the points where the ordinate equals the sensor position.', '这两个时刻是线段的端点。应找出图线的纵坐标等于传感器位置的点。'],
        3: ['These are the times when the position is 2 m. Trace across from 6 m on the vertical axis.', '这两个时刻的位置为 2 m。应从纵轴上的 6 m 水平向右读图。'],
      },
    }],
    hint: ['Imagine a horizontal line through the sensor position. Read the horizontal coordinate of each intersection.', '想象在传感器的位置画一条水平线，读取每个交点的横坐标。'],
    steps: [
      { math: latex`s(2)=6\,\mathrm{m}`, en: 'The horizontal line $s=6$ meets the rising segment at $t=2$.', zh: '水平线 $s=6$ 与上升线段相交，交点的横坐标为 $2$。' },
      { math: latex`s(5)=6\,\mathrm{m}`, en: 'The same horizontal line meets the falling segment at $t=5$.', zh: '同一条水平线与下降线段相交，交点的横坐标为 $5$。' },
      { math: latex`t=2\,\mathrm{s}\quad\text{or}\quad t=5\,\mathrm{s}`, en: 'These are the two times when the trolley is beside the sensor.', zh: '因此小车两次经过传感器，分别在 2 秒和 5 秒。' },
    ],
  },
  {
    id: 'm1-motion-28',
    title: 'Compare a time interval and a moving segment',
    prompt: 'The displacement–time graph shows a carriage that stops and then starts moving again.',
    plot: { kind: 's', points: [[0, -4], [2, 4], [4, 4], [6, 8]], tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-4, -2, 0, 2, 4, 6, 8] },
    parts: [{
      prompt: 'Which pair gives the average velocity from $t=1$ to $t=6$ and the velocity during the final segment, respectively? Both values are in m s⁻¹.',
      choices: ['$\\dfrac43$ and $2$', '$\\dfrac83$ and $2$', '$1.6$ and $4$', '$1.6$ and $2$'],
      answer: 3,
      feedback: ['Use the endpoints of the requested time interval for the average. Then find the gradient of the last segment separately.', '用题目指定的时间区间的两个端点计算平均速度，再单独计算最后一段的斜率。'],
      choiceFeedback: {
        0: ['The final segment velocity is correct. The averaging interval begins at $t=1$, so its duration is $6-1$ seconds.', '最后一段的速度正确。平均速度的计算从 $t=1$ 开始，所以用时为 $6-1$ 秒。'],
        1: ['The denominator of the average includes the time at rest. Count the entire interval from 1 s to 6 s.', '平均速度的分母包括静止时间。应计入 1 秒到 6 秒的完整时间段。'],
        2: ['The average is correct. For the velocity on the final segment, divide its change in position by its duration.', '平均速度正确。最后一段的速度等于该段位置变化量除以用时。'],
      },
    }],
    hint: ['Read $s(1)$ and $s(6)$ for the average, then read the endpoints of the final straight segment.', '先读出 $s(1)$ 和 $s(6)$，再读取最后一条直线段的两个端点。'],
    steps: [
      { math: latex`\overline v=\frac{8-0}{6-1}=1.6\,\mathrm{m\,s^{-1}}`, en: 'The position changes from 0 m to 8 m over the 5-second interval, including the stop.', zh: '位置从 0 m 变为 8 m，总用时为 5 秒，包含静止阶段。' },
      { math: latex`v_{\mathrm{final}}=\frac{8-4}{6-4}=2\,\mathrm{m\,s^{-1}}`, en: 'Use the slope of the last straight segment from $t=4$ to $t=6$.', zh: '最后一段的速度等于 $t=4$ 到 $t=6$ 这条线段的斜率。' },
    ],
  },
  {
    id: 'm1-motion-29',
    title: 'Distinguish equal speed and equal velocity at a meeting',
    prompt: 'The displacement–time graph shows two particles, A and B, on the same straight track. Both use the same position origin and clock.',
    plot: {
      kind: 's', points: [[0, -4], [6, 8]], series: [[[0, 8], [6, -4]]],
      tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-4, -2, 0, 2, 4, 6, 8],
    },
    parts: [{
      prompt: 'Which statement describes the particles at the instant when the lines intersect?',
      choices: [
        'They have the same position and the same velocity.',
        'They have the same position and the same speed, with opposite velocities.',
        'They have different positions and the same speed.',
        'They have the same position and different speeds.',
      ],
      answer: 1,
      feedback: ['The intersection compares position. The gradients give signed velocities and their magnitudes give speeds.', '交点用来比较位置。斜率给出带符号的速度，斜率的绝对值给出速率。'],
      choiceFeedback: {
        0: ['The lines reach the same height at the same time, but their slopes have opposite signs.', '两条线在同一时刻达到同一高度，但两条线的斜率符号相反。'],
        2: ['The speed comparison is correct. At an intersection, both lines have the same vertical coordinate.', '速率判断正确。在交点处，两条线的纵坐标相同。'],
        3: ['Both lines meet at the same position. To compare their speeds, take the absolute values of their gradients.', '两条线在同一个位置相交。比较速率时，要比较斜率的绝对值。'],
      },
    }],
    hint: ['Read the common height at the intersection and compare both the sign and magnitude of the two slopes.', '读出交点处共同的高度，再比较两条线斜率的符号和绝对值。'],
    steps: [
      { math: latex`s_A(3)=s_B(3)=2\,\mathrm{m}`, en: 'The intersection is at the same time and the same position for both particles.', zh: '交点表示两个粒子在同一时刻处于同一位置。' },
      { math: latex`v_A=\frac{8-(-4)}6=+2\,\mathrm{m\,s^{-1}}`, en: 'A moves in the positive direction.', zh: 'A 沿正方向运动。' },
      { math: latex`v_B=\frac{-4-8}6=-2\,\mathrm{m\,s^{-1}}`, en: 'B moves in the opposite direction at the same speed.', zh: 'B 的速率相同，运动方向相反。' },
    ],
  },
  {
    id: 'm1-motion-30',
    title: 'Measure time spent on the positive side',
    prompt: 'The displacement–time graph shows the motion of a trolley throughout a test run.',
    plot: { kind: 's', points: [[0, -4], [4, 4], [5, 4], [9, -4]], tTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yTicks: [-4, -2, 0, 2, 4] },
    parts: [{
      prompt: 'For how long in total is the trolley on the positive side of the origin, where $s>0$?',
      answer: 5,
      unit: 's',
      feedback: ['Use the time between the two crossings of $s=0$. The trolley stays on the positive side while it is at rest there.', '计算两次穿过 $s=0$ 之间的时间。小车在正方向一侧静止时，仍位于这一侧。'],
    }],
    hint: ['Mark both times when $s=0$. Identify the interval where the graph is above the time axis.', '标出 $s=0$ 的两个时刻，再确定图线在时间轴上方的区间。'],
    steps: [
      { math: latex`s(2)=0,\qquad s(7)=0`, en: 'The graph meets the time axis at $t=2$ and $t=7$.', zh: '图线与时间轴相交于 2 秒和 7 秒。' },
      { math: latex`s>0\quad\text{for}\quad 2<t<7`, en: 'The whole section above the time axis counts, including the horizontal part.', zh: '时间轴上方的整段图线都对应正位置，包括水平段。' },
      { math: latex`\Delta t=7-2=5\,\mathrm{s}`, en: 'Subtract the crossing times to get the duration.', zh: '两个交点对应的时刻相减，得到持续时间。' },
    ],
  },
]
