import type { MotionQuestion, Point } from './m1-motion-types.ts'

const tex = String.raw

function velocityCandidate(points: readonly Point[]) {
  return { kind: 'v' as const, points, tTicks: [0, 0.5, 1, 1.5, 2, 2.5],
    yTicks: [-18, -12, -6, 0, 6, 12] }
}

export const extraVerticalForceQuestions: MotionQuestion[] = [
  {
    id: 'm1-forces-31',
    title: 'Compare displacement and distance during a flight',
    prompt: 'A ball is launched vertically upwards. The velocity–time graph starts at launch and ends when the ball reaches a lower platform. Take upwards as positive.',
    plot: { kind: 'v', points: [[0, 20], [2, 0], [5, -30]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [-30, -20, -10, 0, 10, 20], analysis: { areas: true } },
    parts: [{
      prompt: 'What are the signed displacement and the total distance travelled from launch to the platform, respectively? Both are in metres.',
      choices: ['$+25$ and $65$', '$-25$ and $25$', '$-45$ and $65$', '$-25$ and $65$'],
      answer: 3,
      feedback: ['Use both triangular regions. Keep their signs for displacement and add their magnitudes for distance.', '两个三角形区域都要计入。求位移时保留面积的符号，求路程时相加面积的大小。'],
      choiceFeedback: {
        0: ['The total distance is right. The area below the axis is larger, so check the sign of the net displacement.', '总路程正确。横轴下方的面积更大，请检查总位移的符号。'],
        1: ['The net displacement is right. Distance counts the full rise and the full fall.', '总位移正确。路程需要计入上升和下降各自的全程。'],
        2: ['This displacement counts only the descent. Include the displacement from launch to the highest point.', '这个位移只计算了下降阶段。还要计入从发射点到最高点的位移。'],
      },
    }],
    hint: ['Split the graph where velocity is zero. Read the base and height of each triangle.', '在速度为零处把图像分成两部分，分别读出两个三角形的底和高。'],
    steps: [
      { math: tex`\Delta y_{\mathrm{rise}}=\tfrac12(2)(20)=20\,\mathrm m`, en: 'The area above the time axis gives positive displacement.', zh: '时间轴上方的面积对应正位移。' },
      { math: tex`\Delta y_{\mathrm{fall}}=-\tfrac12(3)(30)=-45\,\mathrm m`, en: 'The falling phase lasts three seconds and its displacement is negative.', zh: '下降阶段持续三秒，位移为负。' },
      { math: tex`\Delta y=20-45=-25\,\mathrm m`, en: 'The platform is 25 m below the launch point.', zh: '平台在发射点下方 25 米。' },
      { math: tex`L=20+45=65\,\mathrm m`, en: 'Add the lengths of the two stages to find the distance travelled.', zh: '将两个阶段各自的路程相加。' },
    ],
  },
  {
    id: 'm1-forces-32',
    title: 'Infer gravity from two speeds',
    prompt: 'On a planet, a ball rises freely under gravity. Its speeds at two positions are 12 m s⁻¹ and 8 m s⁻¹, respectively. The second position is 5 m higher than the first. Air resistance is negligible and gravity is uniform. Take upwards as positive.',
    parts: [{
      prompt: 'What is the magnitude of the gravitational acceleration on this planet?',
      choices: ['4 m s⁻²', '8 m s⁻²', '10 m s⁻²', '16 m s⁻²'],
      answer: 1,
      feedback: ['The measurements give displacement and two speeds. Use the constant-acceleration relation that does not require time.', '已知位移和两个速率。选用不含时间的匀加速运动公式。'],
      choiceFeedback: {
        0: ['This is the change in speed, in m s⁻¹. Relate the speeds to the distance between the measurements.', '这是速率的变化量，单位是米每秒。应使用包含两处间距的运动关系式。'],
        2: ['Use the planet’s measurements to determine its gravity. This question supplies no value of 10 m s⁻².', '用该行星上的测量数据求重力加速度。本题未给出 10 米每二次方秒这一数值。'],
        3: ['Check the factor of two that multiplies acceleration and displacement in the equation.', '检查公式中加速度与位移的乘积前面的系数 2。'],
      },
    }],
    hint: ['Between the two positions, the signed displacement is +5 m and the acceleration is −g.', '从第一处到第二处，有符号位移为 +5 米，加速度为 −g。'],
    steps: [
      { math: tex`v^2=u^2+2a\Delta y`, en: 'Both measurements are on the rising path, with gravity providing constant acceleration.', zh: '两次测量都在上升阶段，重力提供恒定的加速度。' },
      { math: tex`8^2=12^2+2(-g)(5)`, en: 'Use the higher point as the end of this interval.', zh: '以较高的位置为这一段的终点。' },
      { math: tex`g=\frac{144-64}{10}=\boxed{8\,\mathrm{m\,s^{-2}}}`, en: 'The signed acceleration is negative. The question asks for its magnitude.', zh: '有符号加速度为负。题目问的是它的大小。' },
    ],
  },
  {
    id: 'm1-forces-33',
    title: 'Identify the signs of height, velocity and acceleration',
    prompt: 'A ball is thrown vertically upwards and then falls freely with negligible air resistance. The launch point is the origin and upwards is positive. At the instant considered, the ball has begun descending and is 3 m above the launch point.',
    workedForceDiagram: { positive: 'up', body: 'Ball', arrows: [{ direction: 'down', label: 'Weight mg' }] },
    parts: [{
      prompt: 'What are the signs of the position coordinate, velocity and acceleration at this instant, respectively?',
      choices: ['Positive, negative, negative.', 'Negative, negative, negative.', 'Positive, positive, negative.', 'Positive, negative, positive.'],
      answer: 0,
      feedback: ['Check position relative to the origin, velocity from the motion, and acceleration from the resultant force.', '根据相对原点的位置判断坐标符号，根据运动方向判断速度符号，根据合力方向判断加速度符号。'],
      choiceFeedback: {
        1: ['A ball can descend while it is still above the origin. Check the given position independently of the velocity.', '球下降时仍可能在原点上方。请根据已知位置独立判断坐标符号。'],
        2: ['Its coordinate is positive, but that coordinate is decreasing. Check what this means for velocity.', '球的位置坐标为正，但该坐标正在减小。请据此判断速度的符号。'],
        3: ['When air resistance is negligible, the only force in flight is the downward weight.', '空气阻力可忽略时，飞行中的球只受竖直向下的重力。'],
      },
    }],
    hint: ['Ask where the ball is, where it is moving, and what force acts on it.', '分别判断球在哪里、向哪里运动、受到什么力。'],
    steps: [
      { math: tex`y=+3\,\mathrm m,\qquad v<0`, en: 'The ball is above the origin and is moving downwards.', zh: '球在原点上方，且正在向下运动。' },
      { math: tex`ma=-mg\quad\Rightarrow\quad a=-g<0`, en: 'The downward weight gives negative acceleration.', zh: '竖直向下的重力产生负加速度。' },
    ],
  },
  {
    id: 'm1-forces-34',
    title: 'Infer resistance from a falling velocity graph',
    prompt: 'A 1.5 kg package is released from rest. As it falls, constant upward resistance acts in addition to its weight. The velocity–time graph covers the first two seconds of the fall. Take upwards as positive and $g=10$ m s⁻².',
    plot: { kind: 'v', points: [[0, 0], [2, -12]], tTicks: [0, 0.5, 1, 1.5, 2], yTicks: [-12, -9, -6, -3, 0], analysis: { gradient: [0, 2] } },
    workedForceDiagram: { positive: 'up', body: 'Package',
      arrows: [{ direction: 'up', label: 'Resistance R' }, { direction: 'down', label: 'Weight 15 N' }] },
    parts: [{
      prompt: 'Find the magnitude of the resistance.',
      answer: 6, unit: 'N',
      feedback: ['The slope gives the signed acceleration. Multiplying by mass gives the resultant force, so account for weight as well.', '斜率给出有符号加速度。乘以质量得到的是合力，求阻力时还要把重力计入方程。'],
    }],
    hint: ['Read the change in velocity over the two seconds. Write the upward resistance minus the downward weight.', '读出两秒内的速度变化。用向上的阻力减去向下的重力。'],
    steps: [
      { math: tex`a=\frac{-12-0}{2-0}=-6\,\mathrm{m\,s^{-2}}`, en: 'The velocity decreases at a constant rate. The graph slopes downwards.', zh: '速度以恒定的变化率减小，图像斜率为负。' },
      { math: tex`R-15=1.5(-6)`, en: 'The weight is 15 N downwards. The resistance acts upwards as the package falls.', zh: '重力大小为 15 牛，方向向下。物体下降时，阻力方向向上。' },
      { math: tex`R=15-9=\boxed{6\,\mathrm N}`, en: 'The upward resistance partly balances the weight.', zh: '向上的阻力抵消了部分重力。' },
    ],
  },
  {
    id: 'm1-forces-35',
    title: 'Match forces to the two gradients of a velocity graph',
    prompt: 'A 1 kg ball is launched vertically upwards at 12 m s⁻¹ from a high platform. Whenever it is moving, a constant resistance of 2 N opposes its motion. The ball is still in flight at $t=2.5$ s. Take upwards as positive and $g=10$ m s⁻².',
    candidates: [
      velocityCandidate([[0, 12], [1, 0], [2.5, -18]]),
      velocityCandidate([[0, 12], [1.5, 0], [2.5, -12]]),
      velocityCandidate([[0, 12], [1, 0], [2.5, -12]]),
      velocityCandidate([[0, 12], [1, 0], [2.5, 12]]),
    ],
    parts: [{
      prompt: 'Which graph represents the signed velocity during the 2.5 seconds after launch?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 2,
      feedback: ['The graph has two gradients. Calculate the resultant force independently on the ascent and on the descent.', '图像有两个斜率。分别计算上升和下降阶段的合力。'],
      choiceFeedback: {
        0: ['The ascent is right. During the descent the upward resistance reduces the magnitude of the resultant, so the slope should be less steep.', '上升阶段正确。下降时向上的阻力使合力的大小减小，斜率的绝对值应更小。'],
        1: ['The gradients have been swapped. On the ascent, weight and resistance both act downwards.', '图像交换了两个阶段的斜率。上升时重力与阻力均向下。'],
        3: ['This graph makes the falling velocity positive. It reflects the falling part as if plotting speed.', '图像把下降阶段的速度画成了正值，相当于把下降部分当成速率来画。'],
      },
    }],
    hint: ['Use $F=ma$ in each phase. Velocity is zero at the transition, and the acceleration is the gradient on each side.', '对两个阶段分别用 $F=ma$。在转折时刻速度为零，两侧斜率各自表示对应阶段的加速度。'],
    steps: [
      { math: tex`a_{\mathrm{rise}}=\frac{-10-2}{1}=-12\,\mathrm{m\,s^{-2}}`, en: 'Weight and resistance act downwards while the ball rises.', zh: '球上升时，重力和阻力均向下。' },
      { math: tex`0=12-12t\quad\Rightarrow\quad t=1\,\mathrm s`, en: 'The graph reaches the time axis at 1 s.', zh: '图像在第 1 秒到达时间轴。' },
      { math: tex`a_{\mathrm{fall}}=\frac{-10+2}{1}=-8\,\mathrm{m\,s^{-2}}`, en: 'On the descent, resistance reverses and acts upwards.', zh: '球下降时，阻力反向，改为向上。' },
      { math: tex`v(2.5)=-8(2.5-1)=-12\,\mathrm{m\,s^{-1}}`, en: 'The falling phase lasts 1.5 s in the interval shown. Only Graph C has both required slopes.', zh: '图示时间内下降阶段持续 1.5 秒。只有图 C 的两段斜率都符合要求。' },
    ],
  },
  {
    id: 'm1-forces-36',
    title: 'Find velocity after applying an upward braking force',
    prompt: 'A 4 kg payload is already falling vertically at 7 m s⁻¹ when a braking device starts operating. The diagram shows the only forces on it. Assume the forces remain constant for the next second. Take upwards as positive.',
    forceDiagram: { positive: 'up', body: 'Payload',
      arrows: [{ direction: 'up', label: 'Braking force 52 N' }, { direction: 'down', label: 'Weight 40 N' }] },
    parts: [{
      prompt: 'Which pair gives the signed acceleration and the signed velocity one second later, respectively?',
      choices: [
        '+3 m s⁻² and −4 m s⁻¹', '−3 m s⁻² and −10 m s⁻¹',
        '+3 m s⁻² and +4 m s⁻¹', '+13 m s⁻² and +6 m s⁻¹',
      ],
      answer: 0,
      feedback: ['The resultant follows the larger force. Use the negative sign of the initial downward velocity in the motion equation.', '合力方向与较大的力相同。运动方程中的初速度向下，应带负号。'],
      choiceFeedback: {
        1: ['The payload moves downwards at first, but the larger force points upwards. This determines the acceleration sign.', '物体起初向下运动，但较大的力向上。由此决定加速度的符号。'],
        2: ['The acceleration is right. After one second, the upward change in velocity is smaller than the initial downward speed.', '加速度正确。一秒后，向上的速度变化量仍小于初始向下速率。'],
        3: ['This uses the braking force alone. Subtract the downward weight to obtain the actual resultant.', '你只计入了制动力。还要减去向下的重力，才能得到实际合力。'],
      },
    }],
    hint: ['Read both force magnitudes from the diagram. Then use $v=u+at$ with $u=-7$ m s⁻¹.', '从图中读出两个力的大小，再用 $v=u+at$，其中 $u=-7$ 米每秒。'],
    steps: [
      { math: tex`4a=52-40=12\,\mathrm N`, en: 'Upward braking exceeds the weight, so the resultant is upwards.', zh: '向上的制动力大于重力，所以合力向上。' },
      { math: tex`a=+3\,\mathrm{m\,s^{-2}}`, en: 'Divide the resultant force by the mass.', zh: '用合力除以质量。' },
      { math: tex`v=-7+3(1)=-4\,\mathrm{m\,s^{-1}}`, en: 'After one second it is still falling, with a smaller speed.', zh: '经过一秒，物体仍在下降，但速率已减小。' },
    ],
  },
  {
    id: 'm1-forces-37',
    title: 'Find resistance from two speeds at the same height',
    prompt: 'A 0.5 kg ball is thrown vertically upwards. It passes a fixed marker at a speed of 12 m s⁻¹ on the way up and at a speed of 6 m s⁻¹ on the way down. While it is moving, resistance has a constant magnitude $R$ and acts opposite to its motion. Take upwards as positive and $g=10$ m s⁻².',
    parts: [{
      prompt: 'What is the value of $R$?',
      choices: ['1 N', '1.5 N', '3 N', '6 N'],
      answer: 2,
      feedback: ['The marker is the same distance below the top in both phases. Relate that distance to the square of each speed.', '两个阶段的标记点到最高点的距离相同。用两个速率的平方分别表示这段距离。'],
      choiceFeedback: {
        0: ['The speeds at the marker have ratio 2 : 1. Over the same distance with zero velocity at the other endpoint, compare their squares.', '标记处的速率之比是 2 : 1。在另一端速度为零且经过相同距离时，应比较速率的平方。'],
        1: ['Check both force equations. The resistance adds to the downward force on the ascent and reduces it on the descent.', '核对两个受力方程。上升时阻力增大向下的合力，下降时阻力减小向下的合力。'],
        3: ['Check the units of $R/m$. The question asks for a force in newtons.', '检查 $R/m$ 的单位。题目要求的是以牛为单位的力。'],
      },
    }],
    hint: ['Let $h$ be the height of the top above the marker. Write one equation for $12^2$ and one for $6^2$ using the same $h$.', '设最高点比标记点高 $h$。用同一个 $h$ 分别写出含 $12^2$ 和 $6^2$ 的方程。'],
    steps: [
      { math: tex`c=\frac R{0.5}`, en: 'Let $c$ be the magnitude of the acceleration contribution from resistance.', zh: '设 $c$ 为阻力单独产生的加速度大小。' },
      { math: tex`a_\uparrow=-10-c,\quad a_\downarrow=-10+c`, en: 'Resistance acts downwards as the ball rises and upwards as it falls. Gravity acts downwards in both stages.', zh: '上升时阻力向下，下降时阻力向上。两个阶段的重力都向下。' },
      { math: tex`12^2=2(10+c)h,\qquad 6^2=2(10-c)h`, en: 'The rise from the marker and the descent back to it cover the same height difference $h$.', zh: '从标记点上升和再下降回标记点，经过相同的高度差 $h$。' },
      { math: tex`10+c=4(10-c)\quad\Rightarrow\quad c=6`, en: 'Divide the two equations to eliminate $h$.', zh: '将两式相除，消去 $h$。' },
      { math: tex`R=0.5(6)=\boxed{3\,\mathrm N}`, en: 'Convert the acceleration contribution back to a force.', zh: '将这个加速度分量换算回力。' },
    ],
  },
  {
    id: 'm1-forces-38',
    title: 'Find when two balls with common acceleration are level',
    prompt: 'Ball P is released from rest 40 m above level ground. At the same instant ball Q is projected up from the ground at 20 m s⁻¹. The balls move along nearby parallel vertical lines. Ignore air resistance. Take upwards as positive and $g=10$ m s⁻².',
    parts: [{
      prompt: 'When are the balls first at the same height, and what is this height above the ground?',
      choices: ['2 s and 40 m', '2 s and 20 m', '4 s and 0 m', '1 s and 35 m'],
      answer: 1,
      feedback: ['Measure both positions from ground level. Subtract the two position expressions before solving for the time.', '两球的位置都以地面为基准。用两个位置表达式相减，再解出时刻。'],
      choiceFeedback: {
        0: ['The time is right. At that time ball P has already fallen below its initial height.', '时刻正确。但此时 P 球已下降至初始高度以下。'],
        2: ['That is the time ball Q would take to return to the ground. Check when both position functions match.', '这是 Q 球返回地面所用的时间。检查两个位置函数何时相等。'],
        3: ['At 1 s, 35 m is ball P’s height alone. Compute ball Q’s height at the same instant to check.', '第 1 秒时，35 米只是 P 球的高度。请计算同一时刻 Q 球的高度来验证。'],
      },
    }],
    hint: ['The two position functions have the same term $-5t^2$. Use their difference.', '两个位置函数都有相同的 $-5t^2$ 项。考察两式之差。'],
    steps: [
      { math: tex`y_P=40-5t^2,\qquad y_Q=20t-5t^2`, en: 'Use ground level as the common origin. The accelerations are equal.', zh: '以地面为共同原点。两个球的加速度相同。' },
      { math: tex`y_P-y_Q=40-20t=0`, en: 'At the same height, the difference of the two positions is zero.', zh: '两个球在同一高度时，位置差为零。' },
      { math: tex`t=2\,\mathrm s`, en: 'The difference is linear, so this is the unique time at which the balls are level during their common flight.', zh: '位置差是时间的一次函数，因此这是两个球都在空中时唯一等高的时刻。' },
      { math: tex`y_P(2)=40-5(2)^2=20\,\mathrm m`, en: 'Substitute into either position function. Both balls are above the ground at this time.', zh: '代入任一位置函数即可求出高度。此时两个球都在地面上方。' },
    ],
  },
  {
    id: 'm1-forces-39',
    title: 'Find elapsed time between two points in free fall',
    prompt: 'A stone is released from rest down a vertical shaft. A first light beam is 5 m below the release point. A second beam is 45 m below the release point. Ignore air resistance. Take upwards as positive and use $g=10$ m s⁻².',
    parts: [{
      prompt: 'How much time passes between the stone crossing the first beam and crossing the second beam?',
      choices: ['3 s', tex`$2\sqrt{2}$ s`, '4 s', '2 s'],
      answer: 3,
      feedback: ['Find the two times from the common starting event. Take the difference to isolate the requested interval.', '以释放为共同计时起点，求出两个时刻，再相减得到所求时间间隔。'],
      choiceFeedback: {
        0: ['This is the time from release to the second beam. Exclude the time before the first beam.', '这是从释放到第二道光束的用时。要除去到达第一道光束之前的时间。'],
        1: ['This treats the 40 m interval as a new fall from rest. The stone has already gained speed by the first beam.', '你把这段 40 米当成从静止重新下落。石块经过第一道光束时已具有速率。'],
        2: ['This adds the two times from release. The requested interval is the later time minus the earlier time.', '你将两个从释放开始的时刻相加了。题目所求是较晚时刻减去较早时刻。'],
      },
    }],
    hint: ['Write $y=-5t^2$ with time measured from release and displacement measured upwards from the release point.', '以释放时刻为计时起点，以释放点为原点并取向上为正，写出 $y=-5t^2$。'],
    steps: [
      { math: tex`-5=-5t_1^2\quad\Rightarrow\quad t_1=1\,\mathrm s`, en: 'The first beam is 5 m below the origin. Keep the positive time.', zh: '第一道光束在原点下方 5 米。取正的时间值。' },
      { math: tex`-45=-5t_2^2\quad\Rightarrow\quad t_2=3\,\mathrm s`, en: 'Use the same origin and starting time for the second beam.', zh: '第二道光束使用相同的原点和计时起点。' },
      { math: tex`\Delta t=3-1=\boxed{2\,\mathrm s}`, en: 'Subtract to isolate the interval between crossings.', zh: '两时刻相减，得到经过两道光束之间的用时。' },
    ],
  },
  {
    id: 'm1-forces-40',
    title: 'Carry velocity into the second stage of a fall',
    prompt: 'A 3 kg payload is released from rest 42 m above level ground. During the first 20 m of its fall, only weight acts. At that point a braking device begins to apply a constant upward force of 18 N until impact. The change of force does not cause an instantaneous jump in velocity. Take upwards as positive and $g=10$ m s⁻².',
    workedForceDiagram: { positive: 'up', body: 'Payload',
      arrows: [{ direction: 'up', label: 'Braking force 18 N' }, { direction: 'down', label: 'Weight 30 N' }] },
    parts: [{
      prompt: 'Find the total time from release to impact.',
      answer: 3, unit: 's',
      feedback: ['The acceleration changes when the brake starts. Carry the final velocity from the first stage into the second.', '制动开始时加速度改变。第二阶段的初速度应采用第一阶段的末速度。'],
    }],
    hint: ['First find the time and velocity at the end of the initial 20 m fall. Then use the new resultant force for the remaining 22 m.', '先求下落 20 米时的用时与速度，再用新的合力计算剩余 22 米。'],
    steps: [
      { math: tex`-20=-5t_1^2\quad\Rightarrow\quad t_1=2\,\mathrm s`, en: 'The first stage is free fall from rest.', zh: '第一阶段从静止开始自由下落。' },
      { math: tex`v_1=-10(2)=-20\,\mathrm{m\,s^{-1}}`, en: 'This signed velocity carries over to the start of the second stage.', zh: '第二阶段的初速度沿用这个带符号的末速度。' },
      { math: tex`a_2=\frac{18-30}{3}=-4\,\mathrm{m\,s^{-2}}`, en: 'The braking force is upwards and the weight is downwards.', zh: '制动力向上，重力向下。' },
      { math: tex`-22=-20t_2-2t_2^2`, en: 'Use the remaining displacement and the second-stage elapsed time $t_2$.', zh: '这里只代入剩余位移和第二阶段的用时 $t_2$。' },
      { math: tex`(t_2-1)(t_2+11)=0`, en: 'Rearrange and factorise. The valid root is $t_2=1$ s, since the negative root precedes the start of this stage.', zh: '整理并因式分解。负根对应第二阶段开始前的时刻，故有效根为 $t_2=1$ 秒。' },
      { math: tex`t_1+t_2=2+1=\boxed{3\,\mathrm s}`, en: 'Add the two elapsed times to measure time from release.', zh: '将两个阶段的用时相加，得到从释放开始的总用时。' },
    ],
  },
]
