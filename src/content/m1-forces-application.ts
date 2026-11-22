import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const verticalMotionApplication: MotionQuestion[] = [
  {
    id: 'm1-forces-11',
    title: 'Compare free fall for balls moving in opposite directions',
    prompt: tex`Ball P has mass $0.4\,\mathrm{kg}$ and is moving vertically upwards after being thrown. Ball Q has mass $0.7\,\mathrm{kg}$ and is falling vertically. Ignore air resistance. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    workedForceDiagram: {
      positive: 'up', body: 'Ball P', arrows: [{ direction: 'down', label: 'Weight 4 N' }],
    },
    parts: [{
      prompt: 'What are the signed accelerations of balls P and Q, in that order? Both are in m s⁻².',
      choices: [
        '$-10$ and $+10$',
        '$-10$ and $-10$',
        '$+10$ and $-10$',
        '$-4$ and $-7$',
      ],
      answer: 1,
      feedback: ['Each acceleration depends on the resultant force divided by the ball’s mass. Identify the only force on each ball.', '各球的加速度等于其合力除以质量。先找出各球所受的唯一一个力。'],
      choiceFeedback: {
        0: ['Gravity still acts downwards as Q falls. Its acceleration follows the force, which need not oppose its velocity.', 'Q 下降时，重力仍然向下。它的加速度方向跟随合力，不一定与速度反向。'],
        2: ['P has upward velocity after release. Check the direction of its only force at that moment.', 'P 离手后速度向上。请判断此时唯一一个力的方向。'],
        3: ['These are the signed weight components in newtons. Divide each by its own mass to find acceleration.', '这两个数是带符号的重力分量，单位为牛。分别除以各球的质量才能得到加速度。'],
      },
    }],
    hint: ['For either ball, put the downward weight into the equation of motion. Check which factor cancels.', '对任一球，在运动方程中代入向下的重力，观察哪个因子可约去。'],
    steps: [
      { math: tex`F_P=-0.4(10)=-4\,\mathrm N`, en: 'After release, ball P has no upward applied force. Its resultant is its downward weight.', zh: '离手后没有继续向上推 P 的力。P 的合力就是向下的重力。' },
      { math: tex`F_Q=-0.7(10)=-7\,\mathrm N`, en: 'Ball Q’s weight is greater in magnitude and also points downwards.', zh: 'Q 的重力大小更大，方向也向下。' },
      { math: tex`a_P=\frac{-4}{0.4}=-10\,\mathrm{m\,s^{-2}}`, en: 'Divide P’s resultant by its mass.', zh: '用 P 的合力除以其质量。' },
      { math: tex`a_Q=\frac{-7}{0.7}=-10\,\mathrm{m\,s^{-2}}`, en: 'Divide Q’s resultant by its mass. The accelerations are equal even though the velocities point in opposite directions.', zh: '用 Q 的合力除以其质量。两球的速度方向相反，但加速度相同。' },
    ],
  },
  {
    id: 'm1-forces-12',
    title: 'Use two equal-height times to find launch speed',
    prompt: tex`A ball is projected vertically upwards from a platform. It passes the same marker at $t=1\,\mathrm s$ and $t=4\,\mathrm s$, where $t$ is measured from launch. Ignore air resistance. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    parts: [{
      prompt: 'Find the launch speed of the ball.',
      answer: 25,
      unit: 'm s⁻¹',
      feedback: ['The two times give equal displacements from the platform. They do not both give zero displacement.', '两个时刻相对平台的位移相等，但这两个位移不一定为零。'],
    }],
    hint: ['Write the displacement from the platform in terms of the launch speed and time. Equate the values at the two times.', '用初速率和时间表示球相对平台的位移，再令两个时刻的位移相等。'],
    steps: [
      { math: tex`s(t)=ut-5t^2`, en: 'The acceleration is constant and equals $-g$. Let $u$ be the launch speed because launch is upwards.', zh: '加速度恒为 $-g$。由于竖直向上发射，初速度的数值 $u$ 等于初速率。' },
      { math: tex`u-5=4u-80`, en: 'Both times describe the same position, so the two displacements from the platform are equal.', zh: '两次经过同一位置，所以相对平台的两次位移相等。' },
      { math: tex`3u=75\quad\Rightarrow\quad u=\boxed{25\,\mathrm{m\,s^{-1}}}`, en: 'Solve for $u$. The resulting displacement is 20 m at both times.', zh: '解出 $u$。代回后两个时刻的位移均为 20 米。' },
    ],
  },
  {
    id: 'm1-forces-13',
    title: 'Reassign resistance after a change of direction',
    prompt: tex`A ball of mass $0.8\,\mathrm{kg}$ moves vertically. Whenever it is moving, the air resistance has magnitude $2.4\,\mathrm N$ and acts opposite to its motion. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    workedForceDiagram: {
      positive: 'up', body: 'Falling ball',
      arrows: [{ direction: 'up', label: 'Resistance 2.4 N' }, { direction: 'down', label: 'Weight 8 N' }],
    },
    parts: [{
      prompt: 'What are the signed accelerations while rising and while falling, in that order? Both are in m s⁻².',
      choices: ['$-13$ and $-13$', '$-7$ and $-13$', '$-13$ and $+7$', '$-13$ and $-7$'],
      answer: 3,
      feedback: ['Draw the forces separately for each direction of motion. Gravity retains its direction throughout.', '分别画出两个阶段的受力图。重力方向在整个过程中保持不变。'],
      choiceFeedback: {
        0: ['The force calculation for the rising phase has been reused. Reconsider the direction of resistance once the ball is falling.', '这是重复使用了上升阶段的合力。球开始下降后，应重新判断阻力方向。'],
        1: ['Resistance acts opposite to velocity. Check which phase has weight and resistance pointing in the same direction.', '阻力方向与速度方向相反。判断哪个阶段重力与阻力同向。'],
        2: ['During the fall, compare the magnitudes of the upward and downward forces. Decide the sign of the resultant.', '下降时比较向上与向下两力的大小，再判断合力的符号。'],
      },
    }],
    hint: ['Use a downward arrow for weight in both diagrams. In each phase, draw the resistance arrow opposite to the velocity.', '两幅受力图中，重力均向下。每一阶段把阻力箭头画在速度的反方向。'],
    steps: [
      { math: tex`W=mg=0.8(10)=8\,\mathrm N`, en: 'The weight points downwards throughout.', zh: '重力始终竖直向下。' },
      { math: tex`0.8a_{\mathrm{up}}=-8-2.4`, en: 'While the ball rises, resistance and weight both act downwards.', zh: '球上升时，阻力和重力均向下。' },
      { math: tex`0.8a_{\mathrm{down}}=-8+2.4`, en: 'While the ball falls, resistance acts upwards.', zh: '球下降时，阻力改为向上。' },
      { math: tex`a_{\mathrm{up}}=-13,\quad a_{\mathrm{down}}=-7`, en: 'Both accelerations are in m s⁻² and both point downwards.', zh: '两个加速度的单位均为米每二次方秒，方向都向下。' },
    ],
  },
  {
    id: 'm1-forces-14',
    title: 'Find the return velocity when resistance reverses',
    prompt: tex`A ball of mass $2\,\mathrm{kg}$ is launched vertically upwards at $24\,\mathrm{m\,s^{-1}}$. The diagram shows all the forces while it rises. The resistance keeps the same magnitude while the ball is moving and opposes the motion. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', body: 'Rising ball',
      arrows: [{ direction: 'down', label: 'Weight 20 N' }, { direction: 'down', label: 'Resistance 12 N' }],
    },
    workedForceDiagram: {
      positive: 'up', body: 'Falling ball',
      arrows: [{ direction: 'up', label: 'Resistance 12 N' }, { direction: 'down', label: 'Weight 20 N' }],
    },
    parts: [{
      prompt: 'What is its signed velocity when it returns to the launch height?',
      choices: [
        tex`$-12\,\mathrm{m\,s^{-1}}$`, tex`$-24\,\mathrm{m\,s^{-1}}$`,
        tex`$+12\,\mathrm{m\,s^{-1}}$`, tex`$-6\,\mathrm{m\,s^{-1}}$`,
      ],
      answer: 0,
      feedback: ['Treat the rising and falling parts as separate stages. They cover the same height difference with different acceleration magnitudes.', '把上升和下降分成两个阶段。两阶段跨越的高度差相同，但加速度大小不同。'],
      choiceFeedback: {
        1: ['The launch and return speeds at the same height would match in the absence of resistance. Here, the two stages have different accelerations.', '没有阻力时，返回发射高度的速率等于发射速率。本题两阶段的加速度不同。'],
        2: ['The magnitude agrees with the calculation. Assign a sign that matches the direction when the ball returns.', '速率正确。再按球返回发射高度时的运动方向确定速度的符号。'],
        3: ['The return speed depends on the square root of the acceleration ratio, because the formula uses the square of the velocity.', '速度公式包含速度的平方，因此速率之比要取加速度大小之比的平方根。'],
      },
    }],
    hint: ['Find the rise from the launch point to the top using the forces shown. Start the descent with zero velocity and reverse the resistance direction.', '先用图示的力求上升高度。下降阶段以零速度为初速度，将阻力改为向上。'],
    steps: [
      { math: tex`2a_{\mathrm{up}}=-20-12=-32`, en: 'Resolve the two downward forces shown for the rising stage.', zh: '上升阶段的两个力均向下，按向上为正列式。' },
      { math: tex`0=24^2+2(-16)h`, en: 'The rising acceleration is $-16$ m s⁻². At the highest point the velocity is zero.', zh: '上升阶段加速度为 $-16$ 米每二次方秒。最高点速度为零。' },
      { math: tex`h=18\,\mathrm m`, en: 'This is the height gained above the launch point.', zh: '这是相对发射点上升的高度。' },
      { math: tex`2a_{\mathrm{down}}=-20+12=-8`, en: 'Reverse the resistance arrow when the ball descends.', zh: '球下降时，阻力改为向上。' },
      { math: tex`v^2=0^2+2(-4)(-18)=144`, en: 'Start from rest at the top. The downward displacement back to the launch level is $-18$ m.', zh: '从最高点以零速度开始下降。回到发射高度的位移为 $-18$ 米。' },
      { math: tex`v=\boxed{-12\,\mathrm{m\,s^{-1}}}`, en: 'The negative root represents the downward motion.', zh: '球向下运动，所以取负根。' },
    ],
  },
]

export const liftQuestions: MotionQuestion[] = [
  {
    id: 'm1-forces-15',
    title: 'Read the resultant in a lift that is moving upwards',
    prompt: 'A passenger stands on a scale in a lift. The lift is travelling upwards at the instant shown. The diagram shows the two forces on the passenger. Take upwards as positive.',
    forceDiagram: {
      positive: 'up', surface: 'lift', body: 'Passenger',
      arrows: [{ direction: 'up', label: 'Reaction 480 N' }, { direction: 'down', label: 'Weight 640 N' }],
    },
    parts: [{
      prompt: 'How is the passenger moving at this instant?',
      choices: [
        'Upwards and speeding up.',
        'Downwards and speeding up.',
        'Upwards and slowing down.',
        'Upwards at constant velocity.',
      ],
      answer: 2,
      feedback: ['Use the given direction for velocity and the diagram for the direction of acceleration.', '由题干确定速度方向，由受力图确定加速度方向。'],
      choiceFeedback: {
        0: ['An upward velocity does not establish the direction of acceleration. Compare the two force magnitudes.', '向上运动不能确定加速度方向。请比较两个力的大小。'],
        1: ['A downward resultant describes the acceleration. The lift is currently travelling upwards.', '向下的合力决定加速度的方向。题中给出的当前运动方向是向上。'],
        3: ['Constant velocity would require zero resultant force. Check whether the forces in the diagram are balanced.', '匀速时合力应为零。检查图示两力是否平衡。'],
      },
    }],
    hint: ['Subtract the downward force magnitude from the upward force magnitude. Compare the sign of the result with the direction of travel.', '用向上的力减去向下的力，比较结果的符号与当前运动方向。'],
    steps: [
      { math: tex`\sum F=480-640=-160\,\mathrm N`, en: 'The weight is greater than the upward reaction, so the resultant is downwards.', zh: '重力大于向上的支持力，因此合力向下。' },
      { math: tex`v>0,\qquad a<0`, en: 'The passenger travels upwards with the lift. The opposite directions of velocity and acceleration mean that the passenger slows down.', zh: '乘客随电梯向上运动。速度与加速度方向相反，因此速率减小。' },
    ],
  },
  {
    id: 'm1-forces-16',
    title: 'Find acceleration from a scale reading',
    prompt: tex`A passenger stands on a scale on the floor of a lift. The mass and the scale reading are shown in the diagram. The only vertical forces on the passenger are the normal reaction and the weight. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: '72 kg',
      arrows: [{ direction: 'up', label: 'Reaction 612 N' }, { direction: 'down', label: 'Weight mg' }],
    },
    parts: [{
      prompt: 'Find the signed acceleration of the passenger.',
      answer: -1.5,
      unit: 'm s⁻²',
      feedback: ['Use the signed resultant in the equation of motion. The scale reading is just the upward reaction.', '在运动方程里使用有符号的合力。秤的读数只表示向上的支持力。'],
    }],
    hint: ['Calculate the weight from the mass shown. Subtract that downward force magnitude from the scale reading.', '由图示质量求出重力大小，再用秤的读数减去它。'],
    steps: [
      { math: tex`W=72(10)=720\,\mathrm N`, en: 'The weight acts downwards.', zh: '重力方向竖直向下。' },
      { math: tex`612-720=72a`, en: 'The upward reaction minus the weight gives the resultant.', zh: '向上的支持力减去重力大小，得到合力。' },
      { math: tex`a=\boxed{-1.5\,\mathrm{m\,s^{-2}}}`, en: 'The negative sign means the acceleration is downwards.', zh: '负号表示加速度方向向下。' },
    ],
  },
  {
    id: 'm1-forces-17',
    title: 'Test whether the floor can maintain contact',
    prompt: tex`A parcel of mass $52\,\mathrm{kg}$ initially rests on a horizontal floor in a lift. It is not attached to the floor. The lift then begins accelerating downwards at $12\,\mathrm{m\,s^{-2}}$. Ignore air resistance and any contact with other surfaces. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    workedForceDiagram: {
      positive: 'up', body: 'Parcel', arrows: [{ direction: 'down', label: 'Weight 520 N' }],
    },
    parts: [{
      prompt: 'What happens to the parcel just after the lift starts to accelerate?',
      choices: [
        'It stays on the floor with an upward reaction of 104 N.',
        'It stays on the floor with zero reaction and shares the lift acceleration.',
        'It loses contact with the floor and accelerates downwards at 10 m s⁻².',
        'It loses contact with the floor and accelerates downwards at 12 m s⁻².',
      ],
      answer: 2,
      feedback: ['Check the reaction required for shared motion. If contact cannot be maintained, find the acceleration from the forces still acting.', '先检验同加速度运动所需的支持力。若无法保持接触，再由实际仍存在的力求加速度。'],
      choiceFeedback: {
        0: ['Under the assumed shared motion, the reaction comes out negative. A floor cannot pull an unattached parcel downwards.', '假设两者一起运动，解出来的支持力为负。地板不能向下拉一个没有固定的包裹。'],
        1: ['With zero reaction, the weight alone determines the acceleration. Compare that acceleration with the lift acceleration.', '支持力为零时，加速度由重力单独决定。请与电梯的加速度比较。'],
        3: ['After contact is lost, the floor exerts no force. Use the remaining force on the parcel to determine its acceleration.', '脱离接触后，地板不再施力。根据包裹剩余的受力判断加速度。'],
      },
    }],
    hint: ['Suppose the parcel shares the lift acceleration. Check whether the resulting value of the normal reaction satisfies the contact condition.', '先假设包裹与电梯具有相同加速度，检查求得的法向支持力是否满足接触条件。'],
    steps: [
      { math: tex`R-520=52(-12)`, en: 'If the parcel stayed on the floor, it would share the lift acceleration.', zh: '若包裹保持与地板接触，它就应与电梯具有相同的加速度。' },
      { math: tex`R=-104\,\mathrm N`, en: 'This value would require the floor to pull downwards. Contact is lost because an ordinary supporting floor can only push.', zh: '这个值要求地板向下拉，但普通承托面只能推，因此接触会失去。' },
      { math: tex`R=0,\quad a=-g=\boxed{-10\,\mathrm{m\,s^{-2}}}`, en: 'Just after the parcel loses contact, only its weight acts.', zh: '包裹刚失去接触时，只受重力作用。' },
    ],
  },
  {
    id: 'm1-forces-18',
    title: 'Compare weight and reading at the start of a ride',
    prompt: tex`A passenger of mass $49\,\mathrm{kg}$ stands on a scale in a lift. The lift starts from rest with an upward acceleration of $2\,\mathrm{m\,s^{-2}}$. Consider the instant the acceleration begins, when the velocity is still zero. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    parts: [{
      prompt: 'Which pair gives the passenger’s weight and the scale reading, in that order?',
      choices: ['490 N and 588 N', '490 N and 490 N', '588 N and 588 N', '490 N and 392 N'],
      answer: 0,
      feedback: ['Find the true weight from mass and gravity. The scale reading is the normal reaction needed for the given acceleration.', '由质量和重力加速度求重力，再用给出的加速度求秤读数对应的支持力。'],
      choiceFeedback: {
        1: ['At this instant the velocity is zero, but the acceleration is given and nonzero. Check whether the forces balance.', '此时速度为零，但题设的加速度不为零。检查两力能否平衡。'],
        2: ['The weight is the gravitational force. A change in the scale reading does not change the weight.', '重力是由引力产生的。秤读数改变时，重力大小仍不变。'],
        3: ['This reading would make the resultant downwards. The given acceleration is upwards.', '这个读数会使合力向下，而题设加速度方向向上。'],
      },
    }],
    hint: ['First calculate $mg$. In the equation $R-mg=ma$, give the acceleration its upward sign even though the velocity is zero.', '先求 $mg$。虽然速度为零，但在 $R-mg=ma$ 中仍应按向上为正代入加速度。'],
    steps: [
      { math: tex`W=mg=490\,\mathrm N`, en: 'The passenger’s weight depends on mass and gravity.', zh: '乘客的重力大小由质量和重力加速度决定。' },
      { math: tex`R-490=49(2)`, en: 'Use the nonzero upward acceleration in the force equation.', zh: '在受力方程中代入不为零的向上加速度。' },
      { math: tex`R=490+98=\boxed{588\,\mathrm N}`, en: 'The scale reads the upward reaction.', zh: '秤读数等于向上的支持力。' },
    ],
  },
  {
    id: 'm1-forces-19',
    title: 'Find the acceleration allowed by a minimum reading',
    prompt: tex`A container rests on a horizontal scale in a lift. The diagram shows the two forces on it. A test requires the reading of the scale to be at least $360\,\mathrm N$. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    forceDiagram: {
      positive: 'up', surface: 'lift', body: 'Container',
      arrows: [{ direction: 'up', label: 'Reaction R' }, { direction: 'down', label: 'Weight 480 N' }],
    },
    parts: [{
      prompt: 'Which inequality must the signed acceleration satisfy? Use m s⁻².',
      choices: ['$a\\le -2.5$', '$a\\ge -7.5$', '$a\\ge 2.5$', '$a\\ge -2.5$'],
      answer: 3,
      feedback: ['Put the minimum reaction into the equation of motion. Keep track of the inequality when you divide by the mass.', '将最小支持力代入运动方程。除以质量时判断不等号方向。'],
      choiceFeedback: {
        0: ['Dividing by a positive mass preserves the inequality. Consider whether no acceleration should pass the test.', '除以正的质量不改变不等号方向。可用加速度为零的情况检验。'],
        1: ['Use the difference between the minimum reading and the weight. Dividing the reading alone by mass misses the contribution of gravity.', '先用最小读数减去重力大小。只把读数除以质量会漏掉重力。'],
        2: ['The minimum reaction is smaller than the weight, so a small downward acceleration can satisfy the requirement.', '最小支持力比重力小，因此较小的向下加速度也能满足要求。'],
      },
    }],
    hint: ['Use the weight shown to find the mass. Rewrite the scale limit as an inequality for $R-W$.', '由图示重力大小求质量，再把秤的读数限制写成关于 $R-W$ 的不等式。'],
    steps: [
      { math: tex`m=480\div10=48\,\mathrm{kg}`, en: 'The diagram gives the weight. Divide by $g$ to find the mass.', zh: '由图示的重力大小除以 $g$，求得质量。' },
      { math: tex`48a=R-480\ge360-480=-120`, en: 'An allowed reading is at least 360 N.', zh: '符合要求的秤读数不少于 360 牛。' },
      { math: tex`\boxed{a\ge-2.5\,\mathrm{m\,s^{-2}}}`, en: 'The mass is positive. A downward acceleration greater in magnitude than 2.5 m s⁻² would make the reading too low or cause contact to be lost.', zh: '质量为正。若向下加速度的大小超过 2.5 米每二次方秒，读数就会低于要求，或失去接触。' },
    ],
  },
  {
    id: 'm1-forces-20',
    title: 'Use slopes to find when a lift scale reads less',
    prompt: tex`A passenger of mass $58\,\mathrm{kg}$ stands on a scale in a lift. The graph shows the lift’s velocity for the whole ten-second period. Ignore the instants where the gradient changes. Take upwards as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    plot: {
      kind: 'v', points: [[0, -4], [2, -4], [6, 4], [8, 4], [10, 0]],
      tTicks: [0, 2, 4, 6, 8, 10], yTicks: [-4, -2, 0, 2, 4],
      analysis: { gradient: [8, 10] },
    },
    parts: [{
      prompt: 'How long is the scale reading below the passenger’s weight, and what is the reading during that stage?',
      choices: [
        '4 s at 696 N',
        '2 s at 464 N',
        '4 s at 464 N',
        '2 s at 696 N',
      ],
      answer: 1,
      feedback: ['Compare the scale reading with the weight using the gradient of the velocity graph. Its height gives velocity instead.', '用速度图像的斜率判断秤读数与重力的大小关系。图线的高度表示速度。'],
      choiceFeedback: {
        0: ['A reading of 696 N is above the weight. Check which gradient gives a lower reading and how long that gradient lasts.', '696 牛的读数高于重力。检查哪一段的斜率会使读数较小，再读出该段时长。'],
        2: ['Four seconds is the time for which the velocity is negative. The reaction is below the weight while the acceleration is negative.', '四秒是速度为负的持续时间。支持力小于重力发生在加速度为负的阶段。'],
        3: ['The duration agrees. Use the signed acceleration in the resultant force equation.', '时长正确。把带正负号的加速度代入合力方程。'],
      },
    }],
    hint: ['A reading below $mg$ means a negative acceleration. Find the falling line segment and use its endpoints to calculate the gradient.', '读数小于 $mg$ 时，加速度为负。找出图线下降的一段，用两个端点计算斜率。'],
    steps: [
      { math: tex`R<mg\quad\Longleftrightarrow\quad a<0`, en: 'From $R-mg=ma$, the scale reads below the weight only when the acceleration is downwards.', zh: '由 $R-mg=ma$，加速度向下时，秤的读数才小于重力大小。' },
      { math: tex`\Delta t=10-8=2\,\mathrm s`, en: 'The only falling line segment runs from 8 s to 10 s.', zh: '图线仅在第 8 秒到第 10 秒之间下降。' },
      { math: tex`a=\frac{0-4}{10-8}=-2\,\mathrm{m\,s^{-2}}`, en: 'Compute the signed gradient of that segment.', zh: '计算这一段带符号的斜率。' },
      { math: tex`R=58(10-2)=\boxed{464\,\mathrm N}`, en: 'Use the signed acceleration to obtain the scale reading for those two seconds.', zh: '代入有符号的加速度，求出这两秒内的秤读数。' },
    ],
  },
]
