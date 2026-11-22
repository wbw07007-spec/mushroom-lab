import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const extraMotionVelocityB: MotionQuestion[] = [
  {
    id: 'm1-motion-41',
    title: 'Read when speed decreases throughout a stage',
    prompt: 'The velocity–time graph shows a pump carriage moving along a straight rail.',
    plot: {
      kind: 'v', points: [[0, -6], [2, -2], [4, -2], [7, 4]],
      tTicks: [0, 2, 4, 5, 7], yTicks: [-6, -4, -2, 0, 2, 4],
      analysis: { gradient: [0, 2] },
    },
    parts: [{
      prompt: 'In which interval is the speed decreasing throughout?',
      choices: ['$2<t<4$', '$5<t<7$', '$4<t<7$', '$0<t<2$'],
      answer: 3,
      feedback: ['Compare the distance of the graph from the time axis throughout the chosen interval.', '观察所选时段内，图线与时间轴的距离如何变化。'],
      choiceFeedback: {
        0: ['The horizontal segment keeps the velocity at a fixed negative value, so its magnitude stays constant.', '水平线段上的速度保持为同一个负值，因此速率不变。'],
        1: ['After the graph crosses the time axis, positive velocity increases. Check what that means for speed.', '图线穿过时间轴后，正速度继续增大。想一想此时的速率如何变化。'],
        2: ['The velocity changes sign within this interval. Follow the speed before and after the crossing separately.', '这段时间内速度变号。请分别考察过零前后的速率。'],
      },
    }],
    hint: ['Speed is the distance of the velocity graph from the time axis. Look for an interval where the whole segment gets closer to that axis.', '速率在图上对应图线与时间轴之间的距离。找出图线在整个时段内持续靠近时间轴的一段。'],
    steps: [
      { math: tex`|v|:\ 6\longrightarrow2\;\mathrm{m\,s^{-1}}\quad(0<t<2)`, en: 'The velocity rises from $-6$ to $-2$. Its magnitude decreases throughout this interval.', zh: '速度由 $-6$ 增至 $-2$，绝对值在这段时间内持续减小。' },
      { math: tex`|v|:\ 2\longrightarrow0\longrightarrow4\;\mathrm{m\,s^{-1}}\quad(4<t<7)`, en: 'In the last stage, the speed decreases until the velocity becomes zero and then increases.', zh: '末段的速率先减小至零，随后增大。' },
      { math: tex`\boxed{0<t<2}`, en: 'The remaining horizontal stage has constant speed, so only this interval satisfies the question.', zh: '中间的水平段速率恒定，因此只有这个时段符合题意。' },
    ],
  },
  {
    id: 'm1-motion-42',
    title: 'Find the fraction of a journey travelled in reverse',
    prompt: 'An inspection trolley moves along a tunnel. The graph shows its velocity throughout the journey.',
    plot: {
      kind: 'v', points: [[0, 0], [2, 6], [5, 6], [8, 0], [10, -4], [12, 0]],
      tTicks: [0, 2, 5, 8, 10, 12], yTicks: [-4, -2, 0, 2, 4, 6],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'What fraction of the total distance is travelled in the negative direction?',
      choices: [tex`$\frac{8}{25}$`, tex`$\frac{8}{41}$`, tex`$\frac13$`, tex`$\frac{8}{33}$`],
      answer: 1,
      feedback: ['Use the distance in the negative direction as the numerator and the entire distance travelled as the denominator.', '分子取沿负方向运动的路程，分母取全程的总路程。'],
      choiceFeedback: {
        0: ['The denominator is the net displacement. The total distance includes the reverse leg as a positive length.', '这个分母是净位移。求总路程时，反向路段也要以正的长度计入。'],
        2: ['This is the fraction of time spent moving in the negative direction. Distance also depends on speed.', '这是沿负方向运动的时间占比，而路程还取决于速率。'],
        3: ['The denominator uses only the distance in the positive direction. Include travel in both directions.', '这个分母只计入了正方向的路程。总路程还要加上反向的那一段。'],
      },
    }],
    hint: ['Find the two distances using the regions above and below the time axis. Both distances count towards the total.', '分别用时间轴上方和下方的区域求出两个方向的路程。总路程包含两者。'],
    steps: [
      { math: tex`\begin{aligned}d_+&=\tfrac12(2)(6)+3(6)\\&\quad+\tfrac12(3)(6)\\&=33\,\mathrm m\end{aligned}`, en: 'Above the time axis, add the first triangle, the rectangle and the second triangle, in that order.', zh: '依次相加时间轴上方的第一个三角形、矩形和第二个三角形的面积。' },
      { math: tex`d_-=\tfrac12(12-8)(4)=8\,\mathrm m`, en: 'The region below the time axis is a triangle of base 4 s and height 4 m s⁻¹. Its unsigned area gives the distance in the negative direction.', zh: '时间轴下方的区域是一个底对应 $4$ 秒、高对应 $4\\,\\mathrm{m\\,s^{-1}}$ 的三角形。其面积给出负方向的路程。' },
      { math: tex`\frac{d_-}{d_++d_-}=\frac{8}{33+8}=\boxed{\frac{8}{41}}`, en: 'Divide the distance in the negative direction by the total distance travelled.', zh: '用负方向的路程除以总路程。' },
    ],
  },
  {
    id: 'm1-motion-43',
    title: 'Locate a return to the starting point',
    prompt: 'The velocity–time graph shows a cart travelling along a straight track.',
    plot: {
      kind: 'v', points: [[0, -6], [2, -6], [6, 6], [9, 6]],
      tTicks: [0, 2, 4, 6, 7, 8, 9], yTicks: [-6, -3, 0, 3, 6],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'Find the first time after $t=0$ when the cart returns to its starting position.',
      answer: 8,
      unit: 's',
      feedback: ['A return to the starting position requires zero cumulative displacement. Zero velocity only tells you that the cart is momentarily at rest.', '回到起点要求累计位移为零。速度为零只表示小车瞬时静止。'],
    }],
    hint: ['Compare the two equal triangles on the sloping segment. Then work out how much displacement is needed from the final horizontal segment.', '比较斜线段对应的两个等大三角形，再求末段水平线还需提供多少位移。'],
    steps: [
      { math: tex`\Delta s_{0\to 2}=(-6)(2)=-12\,\mathrm m`, en: 'The first rectangle is below the time axis.', zh: '第一个矩形位于时间轴下方。' },
      { math: tex`\Delta s_{2\to 6}=-\tfrac12(2)(6)+\tfrac12(2)(6)=0\,\mathrm m`, en: 'The two triangular regions have equal area and opposite signs. The accumulated displacement is still negative at 6 s.', zh: '两个三角形的面积相等、符号相反。到 $6$ 秒时，累计位移仍是负值。' },
      { math: tex`-12+6(t-6)=0\quad\Rightarrow\quad t=\boxed{8\,\mathrm s}`, en: 'After 6 s, the cart adds 6 m of displacement per second. Before 6 s, it first moves away from the start and only recovers part of the displacement, so 8 s is the first return.', zh: '从 $6$ 秒起，每秒增加 $6$ 米位移。此前小车先远离起点，折返后仍未到达起点，所以首次返回发生在 $8$ 秒。' },
    ],
  },
]

export const extraMotionIndependent: MotionQuestion[] = [
  {
    id: 'm1-motion-44',
    title: 'Choose the velocity root at the first occurrence',
    prompt: 'A cable car moves along a straight test track. Its velocity–time graph is shown.',
    plot: {
      kind: 'v', points: [[0, -10], [8, 6]],
      tTicks: [0, 2, 4, 6, 8], yTicks: [-10, -6, -2, 0, 2, 6],
      analysis: { gradient: [0, 8] },
    },
    parts: [{
      prompt: tex`What is its velocity the first time its displacement from the starting position is $-24\,\mathrm m$?`,
      choices: [tex`$-2\,\mathrm{m\,s^{-1}}$`, tex`$2\,\mathrm{m\,s^{-1}}$`, tex`$-14\,\mathrm{m\,s^{-1}}$`, tex`$0\,\mathrm{m\,s^{-1}}$`],
      answer: 0,
      feedback: ['First determine the acceleration from the graph. If two velocities are possible, use the order of events to decide which occurs first.', '先从图中求加速度。若有两个可能的速度，要根据运动发生的先后确定哪个先出现。'],
      choiceFeedback: {
        1: ['This velocity occurs after the turn. Compare the times for the two velocities of this magnitude.', '这个速度出现在折返之后。比较两个速度取相同绝对值时分别对应的时刻。'],
        2: ['Recheck the sign of the displacement in the constant-acceleration equation. This velocity also lies outside the plotted range.', '检查代入匀加速公式的位移符号。这个速度也不在图示范围内。'],
        3: ['Zero velocity marks the turn. Check the displacement at the turning time to see whether it is the displacement asked for.', '速度为零标记的是折返时刻。求出折返时的位移，检验它是否是题目所求的位移。'],
      },
    }],
    hint: ['Read the initial velocity and acceleration from the graph. Which constant-acceleration equation relates velocity and displacement without using time?', '从图上读出初速度和加速度。哪个匀加速公式可以不经过时间直接联系速度和位移？'],
    steps: [
      { math: tex`a=\frac{6-(-10)}{8-0}=2\,\mathrm{m\,s^{-2}}`, en: 'Use the gradient of the velocity–time graph, with initial velocity $u=-10\\,\\mathrm{m\\,s^{-1}}$.', zh: '速度–时间图的斜率是加速度，图上读出的初速度为 $u=-10\\,\\mathrm{m\\,s^{-1}}$。' },
      { math: tex`v^2=u^2+2a\Delta s`, en: 'Use the constant-acceleration equation that does not contain time.', zh: '选用不含时间的匀加速公式。' },
      { math: tex`v^2=(-10)^2+2(2)(-24)=4\,\mathrm{m^2\,s^{-2}}`, en: 'Substitute the signed displacement. The two possible velocities are $-2$ and $2$ m s⁻¹.', zh: '代入带正负号的位移，得到两个可能的速度 $-2$ 和 $2$ 米每秒。' },
      { math: tex`v=-10+2t\quad\Rightarrow\quad t=4\,\mathrm s\ \text{or}\ 6\,\mathrm s`, en: 'The two velocities $-2$ and $2$ m s⁻¹ occur at 4 s and 6 s respectively.', zh: '速度为 $-2$ 和 $2$ 米每秒分别对应 $4$ 秒和 $6$ 秒。' },
      { math: tex`v(4)=\boxed{-2\,\mathrm{m\,s^{-1}}}`, en: 'The negative root occurs first, while the car is still moving in the negative direction.', zh: '负根对应较早的时刻，此时缆车仍沿负方向运动。' },
    ],
  },
  {
    id: 'm1-motion-45',
    title: 'Find the time from departure to catching up',
    prompt: 'The displacement–time graph shows two robots A and B on the same straight rail. A moves throughout the interval. B waits before setting off in the same direction.',
    plot: {
      kind: 's', points: [[0, 3], [9, 12]],
      series: [[[0, 0], [4, 0], [9, 15]]],
      tTicks: [0, 2, 4, 6, 8, 9], yTicks: [0, 3, 6, 9, 12, 15],
    },
    parts: [{
      prompt: 'How long after B sets off does B catch up with A?',
      choices: [tex`$7.5\,\mathrm{s}$`, tex`$1.5\,\mathrm{s}$`, tex`$3.5\,\mathrm{s}$`, tex`$\tfrac73\,\mathrm{s}$`],
      answer: 2,
      feedback: ['Use the gap when B sets off and how quickly the gap closes while both robots are moving.', '先确定 B 出发时的间距，再看两者都在运动时，间距以多快的速度缩小。'],
      choiceFeedback: {
        0: ['This uses the graph’s clock at the meeting. The question measures elapsed time from when B starts moving.', '这是相遇时图上时钟的读数。题目问的是从 B 开始运动起经过多久。'],
        1: ['This uses the gap at the start of the graph. A moves farther ahead while B is waiting.', '这是按图像起点处的间距计算的。B 等待时，A 还在继续前进。'],
        3: ['This would work if A stayed where it was when B set off. A continues moving, so compare the two velocities.', '如果 B 出发后 A 停在原地，这样计算才适用。A 仍在运动，因此要比较两者的速度。'],
      },
    }],
    hint: ['Find the time when B leaves its horizontal segment. Compare the positions at that time and the slopes afterwards.', '找出 B 离开水平线段的时刻，比较此时两者的位置，再比较之后的斜率。'],
    steps: [
      { math: tex`v_A=\frac{12-3}{9-0}=1\,\mathrm{m\,s^{-1}}`, en: 'The solid line has a constant gradient throughout.', zh: 'A 的实线全程斜率恒定。' },
      { math: tex`s_A(4)-s_B(4)=\bigl(3+1(4)\bigr)-0=7\,\mathrm m`, en: 'The dashed line leaves its horizontal segment at 4 s. A is already 7 m ahead then.', zh: 'B 的虚线在第 4 秒离开水平阶段。此时 A 已领先 7 米。' },
      { math: tex`v_B=\frac{15-0}{9-4}=3\,\mathrm{m\,s^{-1}}`, en: 'Use the rising part of B’s line to find its velocity after departure.', zh: '用 B 出发后的上升线段求其速度。' },
      { math: tex`v_B-v_A=3-1=2\,\mathrm{m\,s^{-1}}`, en: 'The gap closes at the difference between the two velocities.', zh: '间距缩小的速率等于两者的速度差。' },
      { math: tex`\Delta t=\frac{7}{2}=\boxed{3.5\,\mathrm s}`, en: 'The gap closes after 3.5 s of B’s motion, at 7.5 s on the graph’s clock.', zh: 'B 运动 3.5 秒后追上 A，对应图上时刻 7.5 秒。' },
    ],
  },
  {
    id: 'm1-motion-46',
    title: 'Find two positions after a sudden velocity change',
    prompt: tex`A puck begins at position $s=-2\,\mathrm m$ on a straight track and rebounds from a bumper. The graph shows its velocity.`,
    plot: {
      kind: 'v', points: [[0, 5], [2, 5], [2, -3], [6, -3]], jumps: true,
      tTicks: [0, 2, 4, 6], yTicks: [-3, -1, 0, 2, 5],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'At which values of $t$ is the puck 1 m from the origin after it rebounds? Use the time measured from the start of the journey.',
      choices: [
        tex`$\frac{13}{3}\,\mathrm s$ only`,
        tex`$\frac{13}{3}\,\mathrm s$ and $5\,\mathrm s$`,
        tex`$\frac73\,\mathrm s$ and $3\,\mathrm s$`,
        tex`$5\,\mathrm s$ and $\frac{17}{3}\,\mathrm s$`,
      ],
      answer: 1,
      feedback: ['Take the starting position into account, then consider both sides of the origin after the rebound.', '先计入初位置，再分别考虑反弹后原点两侧的位置。'],
      choiceFeedback: {
        0: ['This finds the time when the position is positive. A distance from the origin can also come from a negative position.', '这只找到了位置为正时的时刻。位置为负时，与原点的距离也可能为 $1$ 米。'],
        2: ['These are elapsed times from the rebound. The graph measures time from the start of the journey.', '这些是从反弹时刻开始计量的时间。图的横轴从整个运动的起点计时。'],
        3: ['These times would apply if the puck started at the origin. Include the stated starting position.', '如果冰球从原点出发，才会得到这两个时刻。这里要计入给出的初位置。'],
      },
    }],
    hint: ['Use the first rectangle to find the position at the rebound. Starting from that position, consider both signed positions that are 1 m from the origin.', '先用反弹前的矩形面积确定反弹位置，再分别找出反弹后到达原点两侧各 $1$ 米的时刻。'],
    steps: [
      { math: tex`s(2)=-2+5(2)=8\,\mathrm m`, en: 'The first rectangle contributes 10 m of displacement. The vertical jump in velocity has zero duration and adds no displacement.', zh: '第一个矩形贡献 $10$ 米位移。速度的竖直跳变没有持续时间，不产生位移。' },
      { math: tex`s(t)=8-3(t-2)=14-3t`, en: 'For $2<t\\le6$, the puck moves at $-3\\,\\mathrm{m\\,s^{-1}}$ for the elapsed time $t-2$.', zh: '当 $2<t\\le6$ 时，冰球以 $-3\\,\\mathrm{m\\,s^{-1}}$ 运动，自反弹起经过的时间为 $t-2$。' },
      { math: tex`14-3t=1\quad\Rightarrow\quad t=\frac{13}{3}\,\mathrm s`, en: 'The puck first reaches 1 m from the origin on the positive side.', zh: '冰球先在原点的正方向一侧到达距原点 $1$ 米的位置。' },
      { math: tex`14-3t=-1\quad\Rightarrow\quad t=5\,\mathrm s`, en: 'It reaches the same distance again on the negative side. Both times are within the interval shown.', zh: '冰球到达原点的负方向一侧时，距离再次等于 $1$ 米。两个时刻均在图示时段内。' },
    ],
  },
  {
    id: 'm1-motion-47',
    title: 'Classify two turning times using differentiation',
    prompt: 'A particle has position $s=2t^3-15t^2+36t-7$ metres for $0\\le t\\le5$, where $t$ is measured in seconds.',
    parts: [{
      prompt: 'Which statement describes the local extrema of the position during $0<t<5$?',
      choices: [
        'Local minimum at $t=2$, local maximum at $t=3$.',
        'Local maximum at both $t=2$ and $t=3$.',
        'Neither $t=2$ nor $t=3$ is a turning time.',
        'Local maximum at $t=2$, local minimum at $t=3$.',
      ],
      answer: 3,
      feedback: ['Differentiate the position and check the sign of the velocity on each side of each zero.', '先对位置函数求导，再检查每个零点两侧的速度符号。'],
      choiceFeedback: {
        0: ['Check the change of sign at the earlier root. A change from positive velocity to negative velocity puts a local maximum there.', '检查前一个根两侧的符号。速度由正变负时，位置在该点取局部最大值。'],
        1: ['The two zeros of velocity have different sign changes. Test the sign separately around each root.', '两个速度零点附近的变号方向不同。请分别检验每个根的两侧。'],
        2: ['Velocity is zero at both these times. Check whether the velocity changes sign rather than using its value at a single instant.', '这两个时刻的速度均为零。判断是否折返，要检查速度是否变号。'],
      },
    }],
    hint: ['Differentiate $s$ with respect to $t$. Factor the resulting expression and use its signs on the intervals either side of each zero.', '将 $s$ 对 $t$ 求导并因式分解，判断每个零点两侧区间内的符号。'],
    steps: [
      { math: tex`v=\frac{\mathrm ds}{\mathrm dt}=6t^2-30t+36`, en: 'Differentiate position with respect to time to get velocity.', zh: '把位置对时间求导，得到速度。' },
      { math: tex`v=6(t-2)(t-3)`, en: 'Factor to find when the velocity is zero.', zh: '分解因式，找出速度为零的时刻。' },
      { math: tex`v>0\quad (0<t<2\ \text{or}\ 3<t<5)`, en: 'Both factors have the same sign, so the position increases on these two intervals.', zh: '这两个区间内两因式同号，因此位置函数递增。' },
      { math: tex`v<0\quad (2<t<3)`, en: 'Between the roots, the factors have opposite signs and the position decreases.', zh: '在两个根之间，两因式异号，位置函数递减。' },
      { math: tex`t_{\mathrm{max}}=2\,\mathrm s,\qquad t_{\mathrm{min}}=3\,\mathrm s`, en: 'The position changes from increasing to decreasing at 2 s, then from decreasing to increasing at 3 s.', zh: '位置在 $2$ 秒时由增转减，在 $3$ 秒时由减转增。' },
    ],
  },
  {
    id: 'm1-motion-48',
    title: 'Find the maximum separation from two velocity graphs',
    prompt: 'Two carts A and B start at the same position. The graph shows their velocities for the next six seconds, with the same positive direction for both.',
    plot: {
      kind: 'v', points: [[0, 8], [6, 2]], series: [[[0, 2], [6, 8]]],
      tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [0, 2, 4, 5, 6, 8],
    },
    parts: [{
      prompt: 'What is the maximum separation of the carts during the six seconds?',
      choices: [tex`$0\,\mathrm m$`, tex`$5\,\mathrm m$`, tex`$9\,\mathrm m$`, tex`$18\,\mathrm m$`],
      answer: 2,
      feedback: ['The vertical gap on this graph is the difference in velocities. To get a change in separation, use the signed area between the lines.', '图上竖直间距表示速度差。要确定两车间距的变化，须计算两条图线间的有符号面积。'],
      choiceFeedback: {
        0: ['Equal velocities mean the gap has stopped increasing at that instant. They do not tell you the carts are in the same position.', '速度相等只说明那一刻间距停止增大，不能据此判断两车位置相同。'],
        1: ['The intersection has a velocity coordinate of 5 m s⁻¹. The question asks for a separation in metres.', '交点的纵坐标是速度 $5\\,\\mathrm{m\\,s^{-1}}$，而题目要求用米表示的间距。'],
        3: ['Adding both unsigned areas counts the recovery of the gap as extra separation. Look at how the order of the velocity lines changes.', '把两块面积都按正值相加，会把两车重新靠近的过程也算成间距增加。注意两条速度图线的上下顺序如何变化。'],
      },
    }],
    hint: ['The gap increases while A has the greater velocity. Find when the lines cross and work out the area between them up to that point.', '当 A 的速度更大时，两车间距增大。找出两条图线的交点，再求交点之前两线所围的面积。'],
    steps: [
      { math: tex`v_A-v_B=(8-t)-(2+t)=6-2t`, en: 'Use the endpoints to write each velocity. A pulls ahead before $t=3$ and B gains after $t=3$.', zh: '利用端点写出各车的速度。$3$ 秒前 A 拉开距离，$3$ 秒后 B 追近。' },
      { math: tex`s_A(3)-s_B(3)=\tfrac12(3)(6)=9\,\mathrm m`, en: 'By 3 s, the gap has grown by the area of the first triangle.', zh: '到 $3$ 秒时，两车间距增加了第一块三角形所对应的面积。' },
      { math: tex`s_A(6)-s_B(6)=9-9=0\,\mathrm m`, en: 'The second triangle is equal in area and reduces the gap back to zero, so A remains ahead until 6 s.', zh: '第二块三角形面积相等，间距相应减回零。A 在 $6$ 秒之前始终领先。' },
      { math: tex`d_{\mathrm{max}}=\boxed{9\,\mathrm m}\quad(t=3\,\mathrm s)`, en: 'The separation grows until 3 s and decreases afterwards, so its maximum is 9 m.', zh: '间距在 $3$ 秒之前增大，之后减小，因此最大间距为 $9$ 米。' },
    ],
  },
  {
    id: 'm1-motion-49',
    title: 'Infer acceleration from successive signed displacements',
    prompt: 'A particle moves with constant acceleration along a straight line. Its displacement in the first 3 s is $-9\\,\\mathrm m$. Its displacement in the next 2 s is $4\\,\\mathrm m$.',
    parts: [{
      prompt: 'Find its acceleration.',
      answer: 2,
      unit: 'm s⁻²',
      feedback: ['The 4 m is the displacement in the second interval alone. Find the total signed displacement after 5 s before using a formula from the initial time.', '这 $4$ 米是第二个时段单独产生的位移。从初始时刻列式前，先求 $5$ 秒内的总位移，保留正负号。'],
    }],
    hint: ['Calculate the average velocities over the first 3 s and the first 5 s. For constant acceleration, the average velocity in each interval equals the velocity at its midpoint.', '求前 $3$ 秒和前 $5$ 秒的平均速度。加速度恒定时，每个时段的平均速度等于该时段中点的瞬时速度。'],
    steps: [
      { math: tex`\bar v_{0\to3}=\frac{-9}{3}=-3\,\mathrm{m\,s^{-1}}`, en: 'Divide the first signed displacement by its duration.', zh: '将第一段有符号位移除以该段时长。' },
      { math: tex`\bar v_{0\to5}=\frac{-9+4}{3+2}=-1\,\mathrm{m\,s^{-1}}`, en: 'Add the two displacements with their signs and divide by the full duration.', zh: '保留两段位移的符号相加，再除以总时长。' },
      { math: tex`v(1.5)=-3,\qquad v(2.5)=-1`, en: 'Constant acceleration makes the velocity linear in time. Each average is the instantaneous velocity at the midpoint of its interval.', zh: '加速度恒定，速度是时间的一次函数。各时段的平均速度等于该时段中点时刻的速度。' },
      { math: tex`a=\frac{-1-(-3)}{2.5-1.5}=\boxed{2\,\mathrm{m\,s^{-2}}}`, en: 'Use the change in instantaneous velocity over the interval between these midpoint times.', zh: '用两个中点时刻的瞬时速度之差除以两时刻之差。' },
    ],
  },
  {
    id: 'm1-motion-50',
    title: 'Compare average speed and velocity over a mixed journey',
    prompt: 'A camera platform moves along a straight track. The velocity–time graph shows its entire journey.',
    plot: {
      kind: 'v', points: [[0, 4], [3, 4], [5, 0], [9, -2], [11, -2]],
      tTicks: [0, 3, 5, 9, 11], yTicks: [-2, 0, 2, 4],
      analysis: { areas: true },
    },
    parts: [{
      prompt: 'Which pair gives the average speed followed by the average velocity, both in m s⁻¹?',
      choices: [
        tex`$\frac{24}{11},\ \frac8{11}$`,
        tex`$\frac8{11},\ \frac{24}{11}$`,
        tex`$\frac{24}{11},\ -\frac8{11}$`,
        '$3,\\ 1$',
      ],
      answer: 0,
      feedback: ['Use distance for average speed and signed displacement for average velocity. Both use the total duration.', '平均速率的分子是路程，平均速度的分子是有符号位移。两者均除以总时长。'],
      choiceFeedback: {
        1: ['These quantities are reversed. The total distance includes movement in both directions.', '两个量的次序颠倒了。总路程计入两个方向的运动。'],
        2: ['The final velocity is negative, but the sign of average velocity comes from the net displacement.', '末速度为负，但平均速度的正负由净位移决定。'],
        3: ['Averaging endpoint values does not apply to this whole graph. The acceleration changes between stages.', '全程加速度分段变化，不能只用首末速度取平均。'],
      },
    }],
    hint: ['Split the graph where its slope changes and at the zero of velocity. Combine the regions differently for distance and displacement before dividing by time.', '在斜率改变处和速度零点处分割图形。分别按路程和位移的规则合并这些面积，再除以时间。'],
    steps: [
      { math: tex`A_+=3(4)+\tfrac12(5-3)(4)=16\,\mathrm m`, en: 'The initial rectangle and triangle lie above the time axis.', zh: '开始的矩形和三角形位于时间轴上方。' },
      { math: tex`A_-=\tfrac12(9-5)(2)+(11-9)(2)=8\,\mathrm m`, en: 'The final triangle and rectangle lie below the axis. Their unsigned area gives the reverse distance.', zh: '末段的三角形和矩形位于时间轴下方，取正面积得到反向的路程。' },
      { math: tex`d_{\mathrm{total}}=16+8=24\,\mathrm m`, en: 'Add both magnitudes for distance travelled.', zh: '将两侧面积的绝对值相加，得到总路程。' },
      { math: tex`\Delta s=16-8=8\,\mathrm m`, en: 'Subtract the contribution below the axis for displacement.', zh: '求位移时，减去时间轴下方的面积。' },
      { math: tex`\frac{d_{\mathrm{total}}}{11}=\frac{24}{11}\,\mathrm{m\,s^{-1}}`, en: 'Divide the total distance by the full 11 s to get the average speed.', zh: '总路程除以全程所用的 $11$ 秒，得到平均速率。' },
      { math: tex`\bar v=\frac{8}{11}\,\mathrm{m\,s^{-1}}`, en: 'Divide the positive displacement by the same duration. This gives the average velocity in the positive direction.', zh: '将正位移除以相同的时间，得到沿正方向的平均速度。' },
    ],
  },
]
