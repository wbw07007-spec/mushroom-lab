import type { MotionPlot, MotionQuestion, Point } from './m1-motion-types.ts'

const tex = String.raw

export const extraMotionDisplacementB: MotionQuestion[] = [
  {
    id: 'm1-motion-31',
    title: 'Compare two journeys with the same displacement',
    prompt: 'The displacement–time graph shows two carts, A and B, on the same straight track. Both positions are measured from the same origin.',
    plot: {
      kind: 's', points: [[0, -4], [2, 4], [6, 0]], series: [[[0, 0], [6, 4]]],
      tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-4, -2, 0, 2, 4],
    },
    parts: [{
      prompt: 'Which statement compares the two journeys correctly?',
      choices: [
        'The carts have the same displacement and travel the same distance.',
        'Cart B has the greater displacement, and the carts travel the same distance.',
        'The carts have the same displacement, and cart A travels farther.',
        'Cart A has the greater displacement, and the carts travel the same distance.',
      ],
      answer: 2,
      feedback: ['Compare the overall change of position for each cart, then check whether either cart retraces part of its path.', '分别比较两辆小车的末位置与初位置，再检查是否有小车折返。'],
      choiceFeedback: {
        0: ['Check the segment of A that slopes downwards. It still contributes to A’s distance.', '观察 A 向下倾斜的线段。这段运动也要计入 A 的路程。'],
        1: ['B finishes at the greater coordinate, but the carts start at different coordinates. Subtract each cart’s own starting coordinate.', 'B 的末位置坐标较大，但两辆小车的初位置不同。分别减去各自的初位置。'],
        3: ['Adding the lengths of A’s two legs gives its distance. For displacement, the return leg has a negative sign.', '把 A 的两段长度相加得到路程。计算位移时，折返路段的贡献带负号。'],
      },
    }],
    hint: ['For displacement, use the first and last coordinates. For distance, count each moving segment separately.', '求位移时只用初末位置。求路程时分别计算每段运动的长度。'],
    steps: [
      { math: tex`\Delta s_A=0-(-4)=4\,\mathrm{m}`, en: 'Subtract A’s starting coordinate from its finishing coordinate.', zh: '用 A 的末位置减去初位置。' },
      { math: tex`\Delta s_B=4-0=4\,\mathrm{m}`, en: 'B has the same displacement from its own starting point.', zh: '从 B 自己的起点算起，它的位移与 A 相同。' },
      { math: tex`L_A=|4-(-4)|+|0-4|=12\,\mathrm{m}`, en: 'A changes direction, so the lengths of both legs count.', zh: 'A 发生折返，因此两段长度都要计入路程。' },
      { math: tex`L_B=|4-0|=4\,\mathrm{m}`, en: 'B moves in one direction throughout, so A travels farther.', zh: 'B 始终沿同一方向运动，因此 A 的路程更长。' },
    ],
  },
  {
    id: 'm1-motion-32',
    title: 'Compare two stationary positions',
    prompt: 'The displacement–time graph shows a camera platform on a straight rail.',
    plot: { kind: 's', points: [[0, -3], [2, -3], [4, 3], [6, 3]], tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-3, 0, 3] },
    parts: [{
      prompt: 'Which statement is true at $t=1$ and $t=5$?',
      choices: [
        'The platform is stationary at both times, at different positions.',
        'The platform is stationary at both times, at the same position.',
        'The platform moves in the negative direction at $t=1$ and the positive direction at $t=5$.',
        'The platform changes direction at both times.',
      ],
      answer: 0,
      feedback: ['Read the height and gradient separately at each time. They represent different quantities.', '分别读出两个时刻的高度和斜率。两者表示不同的物理量。'],
      choiceFeedback: {
        1: ['The horizontal segments have equal gradients but different heights. Which feature shows position?', '两段水平线的斜率相同，但高度不同。哪个特征表示位置？'],
        2: ['The sign of the vertical coordinate tells you which side of the origin the platform is on. Use the gradient to decide if it is moving.', '纵坐标的正负表示平台位于原点哪一侧。是否在运动要看斜率。'],
        3: ['A change of direction requires a change in the sign of velocity. Compare the gradients just before and after each marked time.', '改变方向需要速度变号。比较每个时刻前后的斜率。'],
      },
    }],
    hint: ['A horizontal segment has gradient zero. Its vertical coordinate can be any position.', '水平线段的斜率为零，但它的纵坐标可以是任何位置。'],
    steps: [
      { math: tex`s(1)=-3\,\mathrm{m},\qquad v(1)=0\,\mathrm{m\,s^{-1}}`, en: 'At one second the line is horizontal below the time axis.', zh: '一秒时，水平线段位于时间轴下方。' },
      { math: tex`s(5)=3\,\mathrm{m},\qquad v(5)=0\,\mathrm{m\,s^{-1}}`, en: 'At five seconds the line is horizontal above the time axis. The platform is stationary again, at a different position.', zh: '五秒时，水平线段位于时间轴上方。平台再次处于静止状态，但所在位置不同。' },
    ],
  },
  {
    id: 'm1-motion-33',
    title: 'Find the distance over part of a journey',
    prompt: 'The displacement–time graph shows a trolley. Use only the part of the journey from $t=1$ to $t=9$.',
    plot: {
      kind: 's', points: [[0, -4], [4, 4], [6, 4], [10, -4]],
      tTicks: [0, 1, 2, 4, 6, 8, 9, 10], yTicks: [-4, -2, 0, 2, 4],
    },
    parts: [{
      prompt: 'Find the distance travelled during this interval.',
      answer: 12,
      unit: 'm',
      feedback: ['Read the graph at $t=1$ and $t=9$ rather than at the ends of the whole graph. Count both the outward and return motion within the interval.', '在 $t=1$ 和 $t=9$ 处读图，而不是读取整张图的两端。区间内的去程和回程都要计入路程。'],
    }],
    hint: ['Read the position at each end of the requested interval, including the horizontal section between the two moving legs.', '读出所求时间段两端的位置，并留意去程和回程之间的水平线段。'],
    steps: [
      { math: tex`s(1)=-2\,\mathrm{m},\qquad s(9)=-2\,\mathrm{m}`, en: 'Read the two endpoints of the requested interval. Their positions happen to coincide.', zh: '读出所求时间段两端的位置，两处恰好相同。' },
      { math: tex`L_1=|4-(-2)|=6\,\mathrm{m}`, en: 'The first moving leg within the interval takes the trolley from $-2$ m to $4$ m.', zh: '在所求时间段内，第一段运动从 $-2$ 米到 $4$ 米。' },
      { math: tex`L_2=|-2-4|=6\,\mathrm{m}`, en: 'After the rest interval, the trolley returns from $4$ m to $-2$ m.', zh: '静止一段时间后，小车由 $4$ 米返回到 $-2$ 米。' },
      { math: tex`L=6+0+6=12\,\mathrm{m}`, en: 'Both moving legs count. The horizontal segment contributes zero distance.', zh: '两段运动都计入路程，水平线段对应的路程为零。' },
    ],
  },
  {
    id: 'm1-motion-34',
    title: 'Identify a shared velocity from two trajectories',
    prompt: 'Two trolleys, A and B, travel on the same line. The displacement–time graph uses a common origin.',
    plot: {
      kind: 's', points: [[0, -2], [2, 2], [5, 8], [7, 6]], series: [[[0, 4], [2, 4], [5, 10], [7, 12]]],
      tTicks: [0, 1, 2, 3, 4, 5, 6, 7], yTicks: [-2, 0, 2, 4, 6, 8, 10, 12],
    },
    parts: [{
      prompt: 'During which interval do the two trolleys have the same velocity throughout?',
      choices: ['$0<t<2$', '$2<t<5$', '$5<t<7$', 'None, because the trolleys do not meet.'],
      answer: 1,
      feedback: ['Look for parallel segments. Two objects can have the same velocity while remaining at different positions.', '找出两条互相平行的线段。两个物体速度相同，但可以处在不同位置。'],
      choiceFeedback: {
        0: ['B is stationary in this interval while A is moving. Compare each line’s change in position.', '此区间内 B 静止，A 仍在运动。比较每条线的位置变化量。'],
        2: ['The gradients are opposite in sign on this interval. Equal speeds can correspond to different velocities.', '此区间内两条线的斜率异号。速率相等时，速度仍可能不同。'],
        3: ['Meeting means equal positions on the graph. This question asks for equal gradients.', '在图上，相遇表示位置相同。题目问的是哪一段的斜率相同。'],
      },
    }],
    hint: ['Compare the signed gradients of the two graphs across all three intervals.', '比较三个区间内两条图线各自带符号的斜率。'],
    steps: [
      { math: tex`v_A=\frac{2-(-2)}{2-0}=2\,\mathrm{m\,s^{-1}}`, en: 'A’s first segment rises, so it has positive velocity.', zh: 'A 的第一段图线上升，速度为正。' },
      { math: tex`v_B=\frac{4-4}{2-0}=0\,\mathrm{m\,s^{-1}}`, en: 'B’s first segment is horizontal, so B is stationary.', zh: 'B 的第一段图线是水平的，因此 B 静止。' },
      { math: tex`v_A=\frac{8-2}{5-2}=2\,\mathrm{m\,s^{-1}}`, en: 'Use the slope of A between two and five seconds.', zh: '计算 A 在第 2 秒到第 5 秒之间的斜率。' },
      { math: tex`v_B=\frac{10-4}{5-2}=2\,\mathrm{m\,s^{-1}}`, en: 'B has the same positive slope on this interval.', zh: 'B 在此区间内的斜率也是相同的正值。' },
      { math: tex`v_A=\frac{6-8}{7-5}=-1\,\mathrm{m\,s^{-1}}`, en: 'A moves in the negative direction after five seconds.', zh: '第 5 秒之后，A 沿负方向运动。' },
      { math: tex`v_B=\frac{12-10}{7-5}=1\,\mathrm{m\,s^{-1}}`, en: 'B moves in the positive direction over the same interval. The only equal velocities occur for $2<t<5$.', zh: '在同一区间内，B 沿正方向运动。两车速度相等的区间只有 $2<t<5$。' },
    ],
  },
]

function reversalCandidate(points: readonly Point[]): MotionPlot {
  return { kind: 'v', points, tTicks: [0, 1, 2, 3, 4, 5], yTicks: [-6, -3, 0, 3, 6] }
}

export const extraMotionVelocityA: MotionQuestion[] = [
  {
    id: 'm1-motion-35',
    title: 'Compare two negative accelerations',
    prompt: 'The velocity–time graph shows two robots, A and B, on a straight track. Their accelerations are $a_A$ and $a_B$.',
    plot: {
      kind: 'v', points: [[0, -2], [4, -6]], series: [[[0, 6], [4, -2]]],
      tTicks: [0, 1, 2, 3, 4], yTicks: [-6, -4, -2, 0, 2, 4, 6],
    },
    parts: [{
      prompt: 'Which comparison is correct?',
      choices: ['$a_A=a_B<0$', '$a_B<a_A<0$', '$a_A<a_B<0$', '$0<a_A<a_B$'],
      answer: 1,
      feedback: ['Acceleration is the signed gradient. Compare the two gradients over the same duration.', '加速度等于带符号的斜率。在相同的时间长度内比较两条图线的斜率。'],
      choiceFeedback: {
        0: ['Both graphs slope downwards, but look at how much each velocity decreases over the four seconds.', '两条图线都向下倾斜，但还要比较四秒内两者的速度各减少多少。'],
        2: ['A is drawn lower than B. To compare accelerations, compare the changes in velocity, rather than the heights of the lines.', 'A 的图线比 B 低。比较加速度时，要比较各自的速度变化量。'],
        3: ['A falling line has negative gradient, even when part of it lies above the time axis.', '图线向下倾斜时斜率为负，即使其中一部分位于时间轴上方。'],
      },
    }],
    hint: ['For each line, use its final velocity minus its initial velocity and divide by the common elapsed time.', '对每条图线，先用末速度减初速度，再除以共同的用时。'],
    steps: [
      { math: tex`a_A=\frac{-6-(-2)}{4-0}=-1\,\mathrm{m\,s^{-2}}`, en: 'Read the endpoints of line A and keep the sign of its velocity change.', zh: '读出图线 A 的两个端点，保留速度变化量的符号。' },
      { math: tex`a_B=\frac{-2-6}{4-0}=-2\,\mathrm{m\,s^{-2}}`, en: 'Line B loses more velocity over the same four seconds.', zh: '在同样的四秒内，B 的速度减小得更多。' },
      { math: tex`a_B<a_A<0`, en: 'Both accelerations are negative. B’s acceleration is the smaller signed value.', zh: '两者的加速度均为负，按带符号的数值比较，B 的加速度更小。' },
    ],
  },
  {
    id: 'm1-motion-36',
    title: 'Compare speed before and after a change of acceleration',
    prompt: 'The velocity–time graph shows a lift moving vertically. Upwards is the positive direction.',
    plot: { kind: 'v', points: [[0, -6], [2, -2], [6, -4]], tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-6, -4, -2, 0] },
    parts: [{
      prompt: 'Which description matches the whole interval shown?',
      choices: [
        'The lift moves downwards and its speed decreases throughout.',
        'The lift moves upwards and then downwards as the acceleration changes sign.',
        'The lift moves downwards throughout. Its speed increases and then decreases.',
        'The lift moves downwards throughout. Its speed decreases and then increases.',
      ],
      answer: 3,
      feedback: ['The side of the time axis indicates the direction. The distance from the time axis indicates the speed.', '图线位于时间轴的哪一侧表示方向，到时间轴的距离表示速率。'],
      choiceFeedback: {
        0: ['At the corner, check whether the graph starts moving closer to the time axis or farther away from it.', '在折点处检查：图线接下来是靠近时间轴，还是远离时间轴？'],
        1: ['The gradient changes sign, but the velocity is the vertical coordinate. Check whether that coordinate ever becomes positive.', '变号的是斜率，而速度是纵坐标。检查纵坐标是否曾经为正。'],
        2: ['The first segment approaches the time axis. Compare the magnitudes of the first two velocities.', '第一段图线靠近时间轴。比较前两个速度值的大小。'],
      },
    }],
    hint: ['Sketch the speed by reflecting the part below the time axis above it. Compare the two slopes of that reflection.', '把时间轴下方的速度图线关于时间轴翻折到上方，得到速率图像，再比较两段的斜率。'],
    steps: [
      { math: tex`v<0\qquad(0\le t\le6)`, en: 'The graph stays below the time axis, so the lift moves downwards throughout.', zh: '图线始终位于时间轴下方，所以电梯一直向下运动。' },
      { math: tex`|v|:\quad 6\longrightarrow 2\longrightarrow 4\,\mathrm{m\,s^{-1}}`, en: 'The graph first approaches the axis and then gets farther away. Speed decreases and then increases.', zh: '图线先靠近时间轴、再远离时间轴，因此速率先减小后增大。' },
    ],
  },
  {
    id: 'm1-motion-37',
    title: 'Find when an object first returns to its starting point',
    prompt: 'The velocity–time graph shows a shuttle travelling on a straight rail.',
    plot: {
      kind: 'v', points: [[0, 4], [2, 4], [4, 0], [8, -6], [10, -6]],
      tTicks: [0, 2, 4, 6, 8, 10], yTicks: [-6, -4, -2, 0, 2, 4], analysis: { areas: true },
    },
    parts: [{
      prompt: 'At what time after $t=0$ does the shuttle first return to its starting position?',
      choices: [tex`$t=2\,\mathrm{s}$`, tex`$t=4\,\mathrm{s}$`, tex`$t=8\,\mathrm{s}$`, tex`$t=10\,\mathrm{s}$`],
      answer: 2,
      feedback: ['The shuttle is back at its start when the signed area accumulated from $t=0$ is zero.', '从 $t=0$ 起累计的有符号面积等于零时，摆渡车回到起点。'],
      choiceFeedback: {
        0: ['At $t=2$ a whole rectangle of area has accumulated above the time axis.', '到 $t=2$ 为止，时间轴上方已经累计了一块矩形面积。'],
        1: ['Zero velocity gives the turnaround time here. The positive area already accumulated has yet to be cancelled.', '这里速度为零的时刻是折返时刻。此前累计的正面积还未被抵消。'],
        3: ['Include the final rectangle below the time axis. Check whether the earlier negative triangle has already cancelled the positive area.', '不要漏掉时间轴下方最后一个矩形。检查前面的负三角形是否已经抵消正面积。'],
      },
    }],
    hint: ['Add the positive rectangle and triangle before the turn. When does the area below the axis first reach that same size?', '先求折返前的正矩形和正三角形面积之和。轴下的面积大小何时首次达到该值？'],
    steps: [
      { math: tex`\Delta s_{0\to4}=2(4)+\tfrac12(2)(4)=12\,\mathrm{m}`, en: 'The first rectangle and triangle are above the time axis.', zh: '最初的矩形和三角形都在时间轴上方。' },
      { math: tex`\Delta s_{4\to8}=-\tfrac12(8-4)(6)=-12\,\mathrm{m}`, en: 'The triangle below the axis gives a displacement of $-12$ m.', zh: '时间轴下方的三角形给出 $-12$ 米的位移。' },
      { math: tex`\Delta s_{0\to8}=12-12=0\,\mathrm{m}`, en: 'Before the turn the displacement increases. After the turn it decreases to zero for the first time at eight seconds.', zh: '折返前位移一直增大，折返后逐渐减小，在第 8 秒首次回到零。' },
    ],
  },
  {
    id: 'm1-motion-38',
    title: 'Recover the displacement of an unplotted stage',
    prompt: tex`A moving platform travels in two stages. The velocity–time graph shows only the first stage. Its displacement over the entire journey is $-3\,\mathrm{m}$.`,
    plot: { kind: 'v', points: [[0, 4], [2, 4], [5, 0]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4], analysis: { areas: true } },
    parts: [{
      prompt: 'Find the displacement in the second stage.',
      answer: -17,
      unit: 'm',
      feedback: ['The first stage has positive displacement, so the second stage must more than cancel it to reach a negative total. Use the total minus the first-stage displacement.', '第一段位移为正。总位移为负，说明第二段位移为负，且大小超过第一段位移。用总位移减去第一段位移。'],
    }],
    hint: ['Find the signed area for the first stage. The sum of the two stage displacements equals the given total.', '计算第一段图线的有符号面积。两段位移之和等于题给总位移。'],
    steps: [
      { math: tex`\Delta s_1=2(4)+\tfrac12(5-2)(4)=14\,\mathrm{m}`, en: 'Add the positive rectangle and triangle to find the first-stage displacement.', zh: '把时间轴上方的矩形与三角形面积相加，得到第一段位移。' },
      { math: tex`\Delta s_1+\Delta s_2=-3\,\mathrm{m}`, en: 'The displacement contributions over the two stages add to the total.', zh: '两段位移相加得到总位移。' },
      { math: tex`\Delta s_2=-3-14=-17\,\mathrm{m}`, en: 'The negative sign shows that the platform’s net change of position in the second stage is in the negative direction.', zh: '负号表示平台在第二段内位置的净变化沿负方向。' },
    ],
  },
  {
    id: 'm1-motion-39',
    title: 'Select a velocity–time graph from a motion description',
    prompt: tex`A cart initially travels in the negative direction at speed $6\,\mathrm{m\,s^{-1}}$. Its speed decreases uniformly to zero at $t=2\,\mathrm{s}$. It then reverses direction and its speed increases uniformly to $3\,\mathrm{m\,s^{-1}}$ at $t=5\,\mathrm{s}$.`,
    candidates: [
      reversalCandidate([[0, -6], [2, 0], [5, 3]]),
      reversalCandidate([[0, -6], [2, 0], [5, -3]]),
      reversalCandidate([[0, 6], [2, 0], [5, 3]]),
      reversalCandidate([[0, -6], [3, 0], [5, 3]]),
    ],
    parts: [{
      prompt: 'Which velocity–time graph matches the description?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 0,
      feedback: ['Put a sign on each speed to turn it into a velocity. Check the time when the velocity reaches zero.', '给速率加上表示方向的符号，得到速度。核对速度达到零的时刻。'],
      choiceFeedback: {
        1: ['The line touches the time axis but stays below it on both sides. Check how a reversal should appear on this type of graph.', '图线接触时间轴，但接触前后都在轴下方。想想折返在速度–时间图上应如何表示。'],
        2: ['This graph starts with positive velocity. Check the initial direction in the description.', '这张图的初速度为正。请核对题目给出的初始运动方向。'],
        3: ['The signs at the two ends agree with the description. Check the time coordinate where this graph crosses the axis.', '此图两端的速度符号符合题意。请检查图线穿过时间轴的时刻。'],
      },
    }],
    hint: ['Read the initial velocity, the stopping time and the final velocity from each candidate, paying attention to signs.', '逐一读取各候选图的初速度、速度为零的时刻和末速度，并留意速度的正负号。'],
    steps: [
      { math: tex`v(0)=-6\,\mathrm{m\,s^{-1}}`, en: 'The cart starts in the negative direction.', zh: '小车开始时沿负方向运动，初速度为负。' },
      { math: tex`v(2)=0,\quad v(5)=3\,\mathrm{m\,s^{-1}}`, en: 'Its velocity is zero at 2 s. It then reverses and reaches a positive velocity.', zh: '小车在第 2 秒速度为零，随后折返，速度变为正。' },
      { math: tex`a_{0\to2}=\frac{0-(-6)}{2-0}=3\,\mathrm{m\,s^{-2}}`, en: 'Uniform change means a straight segment. The first line rises steeply to zero.', zh: '匀变速对应直线段。第一段斜率较大，速度上升到零。' },
      { math: tex`a_{2\to5}=\frac{3-0}{5-2}=1\,\mathrm{m\,s^{-2}}`, en: 'The second line rises more gently. Only Graph A has both segments with the required endpoint coordinates.', zh: '第二段仍向上，但更平缓。只有图 A 的两个线段端点都符合条件。' },
    ],
  },
  {
    id: 'm1-motion-40',
    title: 'Distinguish touching and crossing the time axis',
    prompt: 'The velocity–time graph shows a conveyor unit that can move in either direction along a track.',
    plot: {
      kind: 'v', points: [[0, 4], [2, 0], [4, 4], [6, -4], [8, -4]],
      tTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8], yTicks: [-4, -2, 0, 2, 4], analysis: { areas: true },
    },
    parts: [{
      prompt: 'For which interval is the distance travelled strictly greater than the magnitude of the displacement?',
      choices: [tex`$0\le t\le4$`, tex`$5\le t\le8$`, tex`$0\le t\le2$`, tex`$4\le t\le6$`],
      answer: 3,
      feedback: ['Distance is greater than the magnitude of displacement when the interval includes motion on both sides of the time axis.', '当区间内同时包含时间轴上方和下方的运动时，路程才大于位移的大小。'],
      choiceFeedback: {
        0: ['The graph touches the axis and goes back above it. Check whether any negative velocity occurs within the interval.', '图线接触时间轴后回到上方。检查此区间内是否出现负速度。'],
        1: ['The axis crossing is at the start of this interval. Check which signs of velocity occur after that start.', '穿过时间轴的时刻在该区间的起点。检查从起点之后的速度有哪些符号。'],
        2: ['The velocity reaches zero at the end, but the graph stays on one side of the axis before that.', '速度在区间终点达到零，但在此之前图线始终位于时间轴同一侧。'],
      },
    }],
    hint: ['For each candidate interval, check for a nonzero area above the axis and a nonzero area below it.', '逐一检查每个候选区间内是否同时存在非零的轴上面积和轴下面积。'],
    steps: [
      { math: tex`4\le t\le6:\qquad v(5)=0\,\mathrm{m\,s^{-1}}`, en: 'In this interval the graph crosses the axis and changes the sign of velocity.', zh: '在此区间内图线穿过时间轴，速度发生变号。' },
      { math: tex`\Delta s=\tfrac12(1)(4)-\tfrac12(1)(4)=0\,\mathrm{m}`, en: 'The equal triangular areas cancel when added with their signs.', zh: '两个三角形的面积相等，带符号相加时相互抵消。' },
      { math: tex`L=2+2=4\,\mathrm{m}>|\Delta s|`, en: 'Both triangular areas count towards distance. In each other listed interval only one sign of nonzero velocity occurs, so distance equals the magnitude of displacement there.', zh: '计算路程时两个三角形的面积都取正。在其余选项的区间内，非零速度只有一种符号，路程等于位移的大小。' },
    ],
  },
]
