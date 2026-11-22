import type { MotionQuestion, Point } from './m1-motion-types.ts'

const tex = String.raw

function stageGraph(points: readonly Point[]) {
  return {
    kind: 'v' as const,
    points,
    tTicks: [0, 1, 2, 3, 4, 5, 6],
    yTicks: [-4, 0, 4, 8, 12],
  }
}

export const extraLiftQuestions: MotionQuestion[] = [
  {
    id: 'm1-forces-41',
    title: 'Read a scale during a reversal of direction',
    prompt: tex`A passenger of mass $65\,\mathrm{kg}$ remains on a scale in a lift. The graph shows the lift's velocity during a direction change. The only vertical forces on the passenger are weight and the normal reaction. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    plot: {
      kind: 'v', points: [[0, -3], [2, 1]],
      tTicks: [0, 0.5, 1, 1.5, 2], yTicks: [-3, -2, -1, 0, 1],
      analysis: { gradient: [0, 2] },
    },
    parts: [{
      prompt: 'What is the scale reading throughout this interval?',
      choices: ['650 N', '520 N', '780 N', '130 N'],
      answer: 2,
      feedback: ['Find the gradient and use the signed acceleration in the vertical force equation.', '先求速度图像的斜率，再把带符号的加速度代入竖直方向的受力方程。'],
      choiceFeedback: {
        0: ['This is the passenger’s weight. Check the slope even where the velocity momentarily reaches zero.', '这是乘客的重力大小。即使速度瞬间为零，也要看当时的图像斜率。'],
        1: ['This uses a downward acceleration. The line rises from left to right, including while the velocity is negative.', '这相当于用了向下的加速度。图线从左向右上升，速度为负的阶段也是如此。'],
        3: ['This is the resultant force. The scale must also support the passenger’s weight.', '这是合力大小。秤还必须提供抵消重力的那部分支持力。'],
      },
    }],
    hint: ['Compare the sign of the graph’s gradient before and after the reversal. The scale reading depends on acceleration.', '比较电梯改变运行方向前后图像斜率的符号。秤的读数由加速度决定。'],
    steps: [
      { math: tex`a=\frac{1-(-3)}{2}=2\,\mathrm{m\,s^{-2}}`, en: 'The straight line has the same positive gradient on both sides of the time axis.', zh: '时间轴两侧都是同一条直线，斜率始终为正。' },
      { math: tex`R-65(10)=65(2)`, en: 'Resolve vertically, taking the upward normal reaction as positive.', zh: '沿竖直方向列式，向上的支持力取正。' },
      { math: tex`R=650+130=\boxed{780\,\mathrm N}`, en: 'The reading stays constant as the lift changes direction.', zh: '电梯改变运行方向时，秤的读数保持不变。' },
    ],
  },
  {
    id: 'm1-forces-42',
    title: 'Infer mass from two symmetric acceleration tests',
    prompt: tex`A passenger stays on the same scale during two tests in a lift. In one test the lift accelerates downwards and the diagram shows the forces. In the other it accelerates upwards with the same acceleration magnitude and the scale reads $792\,\mathrm N$. The only vertical forces on the passenger are shown. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: 'Passenger',
      arrows: [{ direction: 'up', label: 'Reaction 528 N' }, { direction: 'down', label: 'Weight mg' }],
    },
    parts: [{
      prompt: 'Find the mass of the passenger.',
      answer: 66,
      unit: 'kg',
      feedback: ['The two readings differ from the true weight by equal amounts in opposite directions. Use both readings.', '两次秤读数与真实重力大小相差相同，但一高一低。要同时使用两次读数。'],
    }],
    hint: ['Call the acceleration magnitude $a$. Add the force equations for the two tests to eliminate $a$.', '设加速度大小为 $a$。把两次试验的受力方程相加，消去 $a$。'],
    steps: [
      { math: tex`528-10m=-ma`, en: 'Read the reaction in the downward-acceleration test from the diagram.', zh: '从图中读出加速度向下时的支持力。' },
      { math: tex`792-10m=ma`, en: 'The upward test reverses the sign of the acceleration.', zh: '第二次试验加速度向上，符号相反。' },
      { math: tex`20m=528+792=1320`, en: 'Adding the two equations cancels the acceleration terms.', zh: '两式相加，加速度项抵消。' },
      { math: tex`m=\frac{1320}{20}=\boxed{66\,\mathrm{kg}}`, en: 'The passenger’s weight is 660 N, halfway between the two readings.', zh: '乘客的重力大小为 660 牛，正好是两次读数的中点。' },
    ],
  },
  {
    id: 'm1-forces-43',
    title: 'Find the time-average scale reading over unequal stages',
    prompt: tex`A passenger stays on a scale in a lift for an eight-second observation. The scale reads $840\,\mathrm N$ for the first $2\,\mathrm s$ and $560\,\mathrm N$ for the next $6\,\mathrm s$.`,
    parts: [{
      prompt: 'What is the time-average scale reading over the full observation?',
      choices: ['630 N', '700 N', '560 N', '770 N'],
      answer: 0,
      feedback: ['Each reading contributes in proportion to how long it lasts. The stages last for different durations.', '各个读数的权重取决于它持续的时间。两段持续时间并不相同。'],
      choiceFeedback: {
        1: ['The ordinary mean of the two readings would apply if both stages had equal durations. The lower reading lasts three times as long.', '只有两段持续时间相等时，才能直接对两次读数取算术平均。较低读数持续的时间是较高读数的三倍。'],
        2: ['This is the reading for the longer stage only. The first two seconds also affect the full average.', '这只是较长一段的读数。前两秒同样计入全程平均。'],
        3: ['Check which reading lasts for six seconds. The time average should be closer to the reading that lasts longer.', '检查哪个读数持续了六秒。时间平均值应更接近持续时间较长的读数。'],
      },
    }],
    hint: ['Multiply each reading by its duration, add the products and divide by the total time.', '分别将每个读数乘以持续时间，累加后除以总时间。'],
    steps: [
      { math: tex`R_1t_1=840(2)=1680\,\mathrm{N\,s}`, en: 'The first reading contributes for only two seconds.', zh: '第一个读数只持续两秒。' },
      { math: tex`R_2t_2=560(6)=3360\,\mathrm{N\,s}`, en: 'The lower reading carries three times the time weight.', zh: '较低的读数具有三倍的时间权重。' },
      { math: tex`\overline R=\frac{1680+3360}{8}=\boxed{630\,\mathrm N}`, en: 'Divide by all eight seconds to obtain the time-average reading.', zh: '除以完整的八秒，得到秤读数的时间平均值。' },
    ],
  },
  {
    id: 'm1-forces-44',
    title: 'Distinguish zero reaction from immediate separation',
    prompt: tex`A $12\,\mathrm{kg}$ box sits on the floor of a lift. At the start of an interval the box and floor have the same velocity and there is no gap. Throughout the interval the floor accelerates downwards at exactly $10\,\mathrm{m\,s^{-2}}$. The box is unattached. Neglect air resistance, take upwards as positive and use $g=10\,\mathrm{m\,s^{-2}}$.`,
    workedForceDiagram: {
      positive: 'up', surface: 'lift', body: '12 kg',
      arrows: [{ direction: 'down', label: 'Weight 120 N' }],
    },
    parts: [{
      prompt: 'Which statement describes the box during this idealised interval?',
      choices: [
        'It accelerates downwards at 10 m s⁻² and immediately separates from the floor.',
        'It moves with the floor and the upward reaction remains 120 N.',
        'It has zero acceleration and the downward-moving floor leaves a gap.',
        'The reaction is zero and no gap opens between the box and the floor.',
      ],
      answer: 3,
      feedback: ['Find the reaction required for the box to share the floor acceleration. Then compare the relative motion from the specified initial conditions.', '先求箱子与地板同加速度所需的支持力，再根据给出的初始条件比较相对运动。'],
      choiceFeedback: {
        0: ['Compare the floor and box accelerations. Both start with the same position and velocity in the vertical direction.', '比较地板与箱子的加速度。两者的竖直初始位置和速度均相同。'],
        1: ['An upward reaction of 120 N would balance the weight. The box would then have zero acceleration.', '向上的 120 牛支持力会与重力平衡，箱子的加速度就会为零。'],
        2: ['With zero reaction, gravity still acts. Compare the resulting downward acceleration with that of the floor.', '支持力为零时仍有重力作用。比较由此产生的向下加速度与地板的加速度。'],
      },
    }],
    hint: ['Use the floor acceleration in $R-mg=ma$. Check whether zero initial gap and zero initial relative velocity can change when the two accelerations agree.', '将地板的加速度代入 $R-mg=ma$。若加速度相同，检查初始间距和初始相对速度均为零时会不会产生间距。'],
    steps: [
      { math: tex`R-120=12(-10)\quad\Rightarrow\quad R=0`, en: 'Zero reaction is the boundary case at which the box can share the downward floor acceleration.', zh: '支持力为零是箱子能够与地板同加速度下降的临界情形。' },
      { math: tex`a_{\mathrm{box}}=a_{\mathrm{floor}}=-g`, en: 'The box falls under gravity alone. Its acceleration equals that of the floor.', zh: '箱子只受重力作用，加速度与地板相同。' },
      { math: tex`v_{\mathrm{rel}}=0,\qquad s_{\mathrm{rel}}=0`, en: 'The two start with no gap and no relative velocity. Their equal accelerations maintain those conditions throughout the interval.', zh: '初始没有间距和相对速度。两者加速度相同，所以全程都保持这一状态。' },
    ],
  },
  {
    id: 'm1-forces-45',
    title: 'Include an extra upwards force when finding the scale reading',
    prompt: tex`A passenger stands on a scale in a lift while a taut strap pulls vertically upwards on the passenger. The force diagram gives the strap force and the passenger’s mass. The passenger remains in contact with the scale as the lift accelerates upwards at $1.5\,\mathrm{m\,s^{-2}}$. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: '60 kg',
      arrows: [
        { direction: 'up', label: 'Reaction R' },
        { direction: 'up', label: 'Strap 150 N' },
        { direction: 'down', label: 'Weight mg' },
      ],
    },
    parts: [{
      prompt: 'What does the scale read?',
      choices: ['690 N', '540 N', '840 N', '450 N'],
      answer: 1,
      feedback: ['Include both upward forces. The scale measures one of them, the normal reaction.', '列式时计入两个向上的力。秤只测量其中的法向支持力。'],
      choiceFeedback: {
        0: ['This is the sum of the two upward forces. Some of the upward support comes from the strap.', '这是两个向上的力之和。其中一部分向上的支持由安全带提供。'],
        2: ['The strap acts upwards, in the same direction as the scale reaction. Check its sign in the force equation.', '安全带的拉力向上，与秤的支持力方向相同。检验它在受力方程中的符号。'],
        3: ['This would apply with zero acceleration. The resultant force must point upwards here.', '这是加速度为零时的读数。本题的合力必须向上。'],
      },
    }],
    hint: ['List the two upward forces and the single downward force before applying Newton’s second law to the passenger.', '在对乘客使用牛顿第二定律前，先列出两个向上的力和一个向下的力。'],
    steps: [
      { math: tex`W=60(10)=600\,\mathrm N`, en: 'The weight is the only downward force.', zh: '重力是唯一向下的力。' },
      { math: tex`R+150-600=60(1.5)`, en: 'The reaction and the strap force both contribute to the upward side of the equation.', zh: '秤的支持力和安全带的拉力都计入向上的力。' },
      { math: tex`R=90+600-150=\boxed{540\,\mathrm N}`, en: 'The positive result agrees with continued contact with the scale.', zh: '读数为正，与乘客保持接触的条件一致。' },
    ],
  },
  {
    id: 'm1-forces-46',
    title: 'Find the distance travelled during an above-weight reading',
    prompt: tex`A passenger remains on a scale in a lift. The graph shows the signed velocity of the lift over an eight-second trip. Weight and the vertical reaction of the scale are the only vertical forces on the passenger. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$. Ignore the instants at the stage boundaries.`,
    plot: {
      kind: 'v', points: [[0, 0], [2, -6], [5, -6], [8, 0]],
      tTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8], yTicks: [-6, -4, -2, 0],
      analysis: { gradient: [5, 8] },
    },
    parts: [{
      prompt: 'How far does the passenger travel while the scale reading is greater than the weight?',
      choices: ['33 m', '6 m', '9 m', '0 m'],
      answer: 2,
      feedback: ['The gradient locates the relevant stage. Use the magnitude of the area under the graph on that stage to find distance.', '用斜率找出符合条件的阶段，再用这一段图像与时间轴所围面积的大小求路程。'],
      choiceFeedback: {
        0: ['This counts the entire trip. Restrict the area calculation to stages with upward acceleration.', '这算的是全程路程。求面积时，只取加速度向上的阶段。'],
        1: ['This is the distance during the initial falling segment of the graph. Look for a rising segment to find when the scale reading is above the weight.', '这是图像最初下降阶段的路程。秤读数高于重力时，应找图像上升的那一段。'],
        3: ['The velocity stays nonpositive, but the graph has a positive slope near the end. Upward acceleration is possible during downward motion.', '速度始终非正，但图像最后一段斜率为正。向下运动时也可能有向上的加速度。'],
      },
    }],
    hint: ['Translate $R>mg$ into a condition on the velocity graph’s slope. Then find the triangular area for that interval.', '把 $R>mg$ 转化成速度图像斜率的条件，再求对应时间段的三角形面积。'],
    steps: [
      { math: tex`R-mg=ma`, en: 'The mass is positive, so the reaction exceeds the weight only on a rising segment of the velocity graph.', zh: '质量为正，所以只有速度图像上升时，秤的读数才高于重力。' },
      { math: tex`5<t<8`, en: 'Only the final segment rises. The passenger travels downwards while slowing.', zh: '只有最后一段图像上升。此时乘客仍向下运动，速率减小。' },
      { math: tex`d=\tfrac12(8-5)(6)=\boxed{9\,\mathrm m}`, en: 'Use the magnitude of the triangular area below the time axis for the distance.', zh: '路程等于时间轴下方这个三角形面积的大小，取正值。' },
    ],
  },
  {
    id: 'm1-forces-47',
    title: 'Use the ratio of two scale readings in the same lift',
    prompt: tex`Two passengers A and B stand on separate scales in the same lift and remain in contact with them. The diagram shows the forces on A during an accelerating stage. At the same instant B’s scale reads $657\,\mathrm N$. Weight and scale reaction are the only vertical forces on either passenger. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: 'A',
      arrows: [{ direction: 'up', label: 'Reaction 438 N' }, { direction: 'down', label: 'Weight 360 N' }],
    },
    parts: [{
      prompt: 'What is B’s true weight?',
      choices: ['657 N', '579 N', '438 N', '540 N'],
      answer: 3,
      feedback: ['Both passengers share the same acceleration. Their readings are proportional to their masses, as are their true weights.', '两位乘客的加速度相同。秤读数与各自的质量成正比，重力大小也与质量成正比。'],
      choiceFeedback: {
        0: ['This is B’s scale reading during the acceleration. A’s two forces show that the acceleration is nonzero.', '这是加速阶段 B 的秤读数。A 的两力不相等，说明此时加速度不为零。'],
        1: ['This subtracts A’s 78 N excess from B’s reading. The excess equals mass times acceleration, so it can differ between passengers.', '这是从 B 的读数中减去 A 多出的 78 牛。读数与重力之差等于质量乘加速度，所以两人的差值可以不同。'],
        2: ['This is the reaction on A shown in the diagram. Use the ratio between the two readings to transfer A’s weight to B.', '这是图中 A 所受的支持力。用两次读数的比，把 A 的重力换算为 B 的重力。'],
      },
    }],
    hint: ['Write each scale reading as $m(g+a)$. Since the two passengers share the same $a$, compare the ratio of their readings with the ratio of their weights.', '把两位乘客的秤读数分别写成 $m(g+a)$。两人的 $a$ 相同，比较读数比与重力比。'],
    steps: [
      { math: tex`R_A=m_A(g+a),\qquad R_B=m_B(g+a)`, en: 'Both passengers share the same lift acceleration.', zh: '两位乘客与电梯具有相同的加速度。' },
      { math: tex`\frac{W_B}{W_A}=\frac{m_B}{m_A}=\frac{657}{438}=\frac32`, en: 'The common factor cancels from the ratio of the readings. The weight ratio also equals the mass ratio.', zh: '秤读数的比值中共同因子抵消。重力之比也等于质量之比。' },
      { math: tex`W_B=\tfrac32(360)=\boxed{540\,\mathrm N}`, en: 'Multiply A’s true weight from the diagram by the ratio.', zh: '将图中 A 的重力大小乘以质量之比。' },
    ],
  },
  {
    id: 'm1-forces-48',
    title: 'Carry forward velocity between two scale readings',
    prompt: tex`A lift starts from rest and accelerates for $5\,\mathrm s$. The diagram shows the forces on a passenger during this first stage. The scale reading then changes to $558\,\mathrm N$ and stays constant until the lift first comes to rest. The passenger remains on the scale and is acted on vertically only by the forces shown. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: '62 kg',
      arrows: [{ direction: 'up', label: 'Reaction 744 N' }, { direction: 'down', label: 'Weight mg' }],
    },
    parts: [{
      prompt: 'Find the total upward displacement from the start to the stop.',
      answer: 75,
      unit: 'm',
      feedback: ['The second stage starts with the velocity reached in the first stage. Find both displacements and add them.', '第二阶段的初速度等于第一阶段的末速度。分别求两个阶段的位移后相加。'],
    }],
    hint: ['Use the two readings to find the two accelerations. The first stage gives the starting velocity for the second stage, which ends at zero velocity.', '用两个秤读数分别求加速度。第一阶段末速度是第二阶段初速度，第二阶段末速度为零。'],
    steps: [
      { math: tex`a_1=\frac{744-620}{62}=2\,\mathrm{m\,s^{-2}}`, en: 'The passenger’s weight is 620 N. Use the first diagram reading to find the upward acceleration.', zh: '乘客的重力大小为 620 牛。用图中第一阶段的读数求向上的加速度。' },
      { math: tex`v_1=2(5)=10\,\mathrm{m\,s^{-1}}`, en: 'The lift starts from rest and gains upward velocity for five seconds.', zh: '电梯从静止开始，向上加速五秒。' },
      { math: tex`s_1=\tfrac12(0+10)(5)=25\,\mathrm m`, en: 'The average velocity in the first stage multiplied by time gives its displacement.', zh: '第一阶段的平均速度乘以时间，得到这一段的位移。' },
      { math: tex`a_2=\frac{558-620}{62}=-1\,\mathrm{m\,s^{-2}}`, en: 'The lower reading gives downward acceleration while the lift is still moving up.', zh: '读数降低后，加速度向下，但电梯此时仍向上运动。' },
      { math: tex`0=10^2+2(-1)s_2`, en: 'The second stage begins at 10 m s⁻¹ and ends at rest, so solving gives a further 50 m.', zh: '第二阶段以每秒 10 米开始，在速度为零时结束。解得这一段的位移为 50 米。' },
      { math: tex`s=s_1+s_2=25+50=\boxed{75\,\mathrm m}`, en: 'Both stages produce upward displacement.', zh: '两个阶段的位移均向上，因此相加。' },
    ],
  },
  {
    id: 'm1-forces-49',
    title: 'Find a reversal time and displacement using a constant reaction',
    prompt: tex`A lift is moving downwards at $3\,\mathrm{m\,s^{-1}}$ at the start of a four-second interval. Throughout that interval the forces on a passenger who remains on a scale are as shown. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: 'Passenger',
      arrows: [{ direction: 'up', label: 'Reaction 650 N' }, { direction: 'down', label: 'Weight 500 N' }],
    },
    parts: [{
      prompt: 'When does the lift reverse, and what is its signed displacement over the four seconds?',
      choices: ['After 1 s, with displacement +12 m.', 'After 1 s, with displacement +15 m.', 'After 1 s, with displacement +13.5 m.', 'It does not reverse, and its displacement is −12 m.'],
      answer: 0,
      feedback: ['Use the force diagram to find the signed acceleration. For the net displacement keep the sign of the initial velocity.', '由受力图求带符号的加速度。计算净位移时，保留初速度的符号。'],
      choiceFeedback: {
        1: ['This adds the distances on both sides of the reversal. The initial downward movement contributes negatively to displacement.', '这是把折返前后的路程相加。计算位移时，最初向下的一段要取负。'],
        2: ['This measures the upward movement starting at the reversal. The question uses the position at the start of the four seconds as its reference.', '这是从折返点开始计算的向上路程。题目以四秒区间开始位置为参考。'],
        3: ['The reaction exceeds the weight and the acceleration is upwards. Check whether that acceleration brings the velocity to zero within the interval.', '支持力大于重力，所以加速度向上。检查这段时间内速度能否减小到零。'],
      },
    }],
    hint: ['Find the mass from the weight shown, then calculate the acceleration. Use $v=0$ for the reversal and use the original starting point for the displacement.', '用图示重力大小求质量，再计算加速度。求折返时令 $v=0$，求位移时以区间开始位置为参考。'],
    steps: [
      { math: tex`m=500\div10=50\,\mathrm{kg}`, en: 'The diagram gives the true weight.', zh: '图中给出的是乘客重力的大小。' },
      { math: tex`a=\frac{650-500}{50}=3\,\mathrm{m\,s^{-2}}`, en: 'The resultant and acceleration are both upwards.', zh: '合力与加速度均向上。' },
      { math: tex`0=-3+3t\quad\Rightarrow\quad t=1\,\mathrm s`, en: 'The velocity changes from negative to positive at this time, so the lift reverses.', zh: '速度在这一时刻由负转正，电梯改变运动方向。' },
      { math: tex`s=-3(4)+\tfrac12(3)(4^2)=\boxed{+12\,\mathrm m}`, en: 'The signed displacement is upwards despite the initial downward motion.', zh: '尽管最初向下运动，整个区间的有符号位移仍为正，表示净位移向上。' },
    ],
  },
  {
    id: 'm1-forces-50',
    title: 'Select a velocity graph from two scale-reading stages',
    prompt: tex`A lift starts from rest. A $50\,\mathrm{kg}$ passenger stays on a scale that reads $600\,\mathrm N$ for the first $2\,\mathrm s$, then $400\,\mathrm N$ for the next $4\,\mathrm s$. Only the scale reaction and weight act vertically on the passenger. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    candidates: [
      stageGraph([[0, 0], [2, 4], [6, 0]]),
      stageGraph([[0, 0], [2, 4], [6, -4]]),
      stageGraph([[0, 0], [2, -4], [6, 4]]),
      stageGraph([[0, 0], [2, 4], [6, 12]]),
    ],
    parts: [{
      prompt: 'Which velocity–time graph represents the lift?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 1,
      feedback: ['Convert each scale reading into a signed acceleration. The acceleration sets the slope of the corresponding segment.', '将每段秤读数换算为有符号的加速度。加速度决定速度图像相应阶段的斜率。'],
      choiceFeedback: {
        0: ['This shows a second slope of −1 m s⁻². Check the difference between the second reading and the weight, and use the full four seconds.', '该图第二段斜率为 −1 米每二次方秒。核对第二个读数与重力的差，再使用完整的四秒。'],
        2: ['During the first stage the scale reading is greater than the weight. Check the sign this gives for the first slope.', '第一阶段的秤读数大于重力。检查这意味着第一段斜率应取什么符号。'],
        3: ['The second reading is below the weight, giving a downward acceleration. Check whether the second segment rises or falls.', '第二个读数低于重力，说明加速度向下。检查图中第二段应上升还是下降。'],
      },
    }],
    hint: ['The passenger weighs 500 N. Compute $R-500$ for each stage and divide by the mass to obtain each slope.', '乘客的重力大小为 500 牛。分别求各段的 $R-500$，再除以质量，得到各段斜率。'],
    steps: [
      { math: tex`a_1=\frac{600-500}{50}=2\,\mathrm{m\,s^{-2}}`, en: 'The first reading is above the weight, so the graph must rise.', zh: '第一阶段读数高于重力，速度图像上升。' },
      { math: tex`a_2=\frac{400-500}{50}=-2\,\mathrm{m\,s^{-2}}`, en: 'The second reading is below the weight, so the graph must fall with the same slope magnitude.', zh: '第二阶段读数低于重力，速度图像下降，斜率绝对值与第一阶段相同。' },
      { math: tex`v(2)=0+2(2)=4\,\mathrm{m\,s^{-1}}`, en: 'The first segment starts from rest and ends at a positive velocity.', zh: '第一段从静止开始，结束时速度为正。' },
      { math: tex`v(6)=4+(-2)(4)=-4\,\mathrm{m\,s^{-1}}`, en: 'The second segment crosses the time axis and ends at a negative velocity. Only graph B does this with the required slopes.', zh: '第二段穿过时间轴，结束时速度为负。只有图 B 符合上述两个阶段的斜率。' },
    ],
  },
]
