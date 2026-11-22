import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const extraResultantForceQuestions: MotionQuestion[] = [
  {
    id: 'm1-forces-21',
    title: 'Find the reaction when an extra vertical force acts',
    prompt: 'A 2.8 kg crate moves along a horizontal track. The diagram shows all the forces on the crate, including an upward pull. The crate remains in contact with the track. Take $g=10$ m s⁻².',
    forceDiagram: {
      positive: 'up', surface: 'floor', body: 'Crate',
      arrows: [
        { direction: 'up', label: 'Reaction R' }, { direction: 'up', label: 'Pull 9 N' },
        { direction: 'down', label: 'Weight W' },
        { direction: 'right', label: '10 N' }, { direction: 'left', label: '4 N' },
      ],
    },
    parts: [{
      prompt: 'What is the magnitude of the normal reaction of the track on the crate?',
      choices: ['$19$ N', '$28$ N', '$37$ N', '$22$ N'],
      answer: 0,
      feedback: ['Write a vertical force equation. Both upward forces contribute to the balance.', '列出竖直方向的受力方程。两个向上的力都参与平衡。'],
      choiceFeedback: {
        1: ['That is the weight. Here the upward pull also helps balance the weight.', '这个数值是重力大小。本题还有一个向上的拉力，共同平衡重力。'],
        2: ['The pull and the reaction act in the same direction. Their total balances the weight.', '拉力与支持力方向相同，两者之和等于重力大小。'],
        3: ['The 10 N and 4 N forces act horizontally. Leave them out of the vertical equation.', '$10$ N 与 $4$ N 的力沿水平方向，不参与竖直方向的受力方程。'],
      },
    }],
    hint: ['Take upwards as positive. Use the fact that the crate has zero vertical acceleration.', '取向上为正。小箱在竖直方向的加速度为零。'],
    steps: [
      { math: tex`W=2.8(10)=28\,\mathrm N`, en: 'The weight acts vertically downwards.', zh: '重力方向竖直向下。' },
      { math: tex`R+9-28=0`, en: 'The crate stays at the height of the horizontal track, so the vertical resultant is zero.', zh: '小箱保持在水平轨道的高度，因此竖直方向合力为零。' },
      { math: tex`R=28-9=19\,\mathrm N`, en: 'The upward pull reduces the reaction needed from the track.', zh: '向上的拉力使轨道所需提供的支持力减小。' },
    ],
  },
  {
    id: 'm1-forces-22',
    title: 'Identify the force paired with a rope pull',
    prompt: 'A rope pulls a crate to the right across a horizontal floor. The diagram shows the forces on the crate. The 18 N force is exerted by the rope and the 7 N force is exerted by the floor.',
    forceDiagram: {
      positive: 'right', surface: 'floor', body: 'Crate',
      arrows: [
        { direction: 'right', label: '18 N' }, { direction: 'left', label: '7 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'Which force forms a third-law pair with the 18 N force?',
      choices: [
        'The floor exerts a leftward force of 7 N on the crate.',
        'The crate pulls the rope to the right with a force of 18 N.',
        'The crate pulls the rope to the left with a force of 18 N.',
        'The crate pulls the rope to the left with a force of 11 N.',
      ],
      answer: 2,
      feedback: ['The paired force comes from the same interaction. Exchange the two objects and reverse the direction.', '一对作用力与反作用力来自同一次相互作用。交换两个物体，再反转方向。'],
      choiceFeedback: {
        0: ['The 7 N and 18 N forces both act on the crate. The paired force acts on a different object.', '$7$ N 和 $18$ N 的力都作用在箱子上。第三定律中的另一个力作用在不同物体上。'],
        1: ['The crate and rope are the right objects. Reverse the direction of the force when you swap the objects.', '箱子和绳子是正确的两个物体。交换施力物体和受力物体后，力的方向要反转。'],
        3: ['11 N is the horizontal resultant on the crate. The paired force matches the rope’s 18 N pull in magnitude.', '$11$ N 是箱子所受的水平合力。与绳子的 $18$ N 拉力配对的力，大小也为 $18$ N。'],
      },
    }],
    hint: ['Read who pulls whom in the question. In the paired force, the original recipient becomes the source.', '先看清谁对谁施力。配对的另一个力由原来的受力物体施加。'],
    steps: [
      { math: tex`F_{\text{rope on crate},\,x}=+18\,\mathrm N`, en: 'The given force acts on the crate to the right.', zh: '已知绳子对箱子施加向右的力。' },
      { math: tex`F_{\text{crate on rope},\,x}=-18\,\mathrm N`, en: 'The partner force acts on the rope to the left and has the same magnitude.', zh: '配对的力作用在绳子上，方向向左，大小相同。' },
    ],
  },
  {
    id: 'm1-forces-23',
    title: 'Infer a change in resistance from a velocity graph',
    prompt: 'A 6 kg cart moves to the right on a horizontal track under a steady 19 N pull to the right. At $t=2$ s the setting of its brake changes. The opposing force is constant within each stage. The graph shows the cart’s signed velocity, taking rightwards as positive.',
    plot: {
      kind: 'v', points: [[0, 2], [2, 5], [5, 6.5]],
      tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 5, 6.5],
    },
    parts: [{
      prompt: 'How does the magnitude of the opposing force change at $t=2$ s?',
      choices: ['It decreases by 6 N.', 'It increases by 1 N.', 'It increases by 16 N.', 'It increases by 6 N.'],
      answer: 3,
      feedback: ['Calculate both accelerations from the slopes. The forward pull stays the same, so a smaller resultant means a larger opposing force.', '从斜率求出两段加速度。向前的拉力不变，合力减小表示反向的力增大。'],
      choiceFeedback: {
        0: ['The resultant decreases by 6 N. Check how the opposing force must change when the driving pull stays the same.', '合力减小 $6$ N。向前的拉力不变时，再想想反向的力如何变化。'],
        1: ['1 is the size of the acceleration change in m s⁻². Multiply by the mass to find the corresponding force change.', '$1$ 是加速度变化的大小，单位为 m s⁻²。乘以质量才能求出力的变化大小。'],
        2: ['16 N is the new opposing force. Subtract its original value to find the increase.', '$16$ N 是改变后的反向力。要得到增加量，还需减去原来的大小。'],
      },
    }],
    hint: ['Use the gradient of each straight segment to find the acceleration. Then use $19-B=6a$, where $B$ is the magnitude of the opposing force.', '分别用每段直线的斜率求加速度，再用 $19-B=6a$，其中 $B$ 是反向力的大小。'],
    steps: [
      { math: tex`a_1=\frac{5-2}{2}=1.5\,\mathrm{m\,s^{-2}}`, en: 'Use the velocity change over the first two seconds.', zh: '用前两秒的速度变化除以用时。' },
      { math: tex`a_2=\frac{6.5-5}{3}=0.5\,\mathrm{m\,s^{-2}}`, en: 'The second segment has the smaller gradient.', zh: '第二段图线的斜率较小。' },
      { math: tex`B_1=19-6(1.5)=10\,\mathrm N`, en: 'Subtract the first resultant from the applied pull.', zh: '从拉力中减去第一段的合力。' },
      { math: tex`B_2=19-6(0.5)=16\,\mathrm N`, en: 'Repeat using the second acceleration.', zh: '用第二段的加速度重复计算。' },
      { math: tex`B_2-B_1=16-10=6\,\mathrm N`, en: 'The opposing force increases by 6 N.', zh: '反向力的大小增加了 $6$ N。' },
    ],
  },
  {
    id: 'm1-forces-24',
    title: 'Compare removing two balanced pulls with removing one',
    prompt: 'A cart is moving rightwards on a smooth horizontal track. A 12 N horizontal pull acts rightwards and another 12 N horizontal pull acts leftwards. There are no other horizontal forces. In trial I both pulls are switched off together. In trial II only the rightward pull is switched off. Compare the motion in the short period after each switch while the cart still moves to the right.',
    parts: [{
      prompt: 'What happens to the speed in trial I and trial II?',
      choices: [
        'It decreases in both trials.',
        'It stays constant in trial I and decreases in trial II.',
        'It stays constant in both trials.',
        'It decreases in trial I and stays constant in trial II.',
      ],
      answer: 1,
      feedback: ['Work out the remaining horizontal resultant separately for each trial.', '分别求两个试验中剩余的水平合力。'],
      choiceFeedback: {
        0: ['In trial I there is no remaining horizontal force, so the cart has no horizontal acceleration.', '试验 I 中没有剩余的水平力，所以小车没有水平加速度。'],
        2: ['In trial II the leftward pull remains and is no longer balanced by the rightward pull.', '试验 II 中向左的拉力仍然存在，已没有向右的拉力与它平衡。'],
        3: ['Check which trial leaves a leftward force acting on the cart.', '检查哪个试验中仍有一个向左的力作用在小车上。'],
      },
    }],
    hint: ['For each trial, list the horizontal forces still acting after the switch.', '分别列出每个试验中切换后仍然作用在小车上的水平力。'],
    steps: [
      { math: tex`\Sigma F_{x,\mathrm I}=0\quad\Rightarrow\quad a_{\mathrm I}=0`, en: 'In trial I the cart continues moving at the same speed.', zh: '试验 I 中，小车以原来的速率继续运动。' },
      { math: tex`\Sigma F_{x,\mathrm{II}}=-12\,\mathrm N`, en: 'In trial II the remaining force points left. The resulting acceleration opposes the rightward velocity, so the speed decreases.', zh: '试验 II 中剩余力向左。由此产生的加速度与向右的速度反向，因此速率减小。' },
    ],
  },
  {
    id: 'm1-forces-25',
    title: 'Find the total distance while the resistive force reverses',
    prompt: 'A 4 kg cart has initial velocity 6 m s⁻¹ to the left on a horizontal track. A constant 12 N driving force acts rightwards. While the cart is moving, a resistance of magnitude 4 N acts opposite to its direction of motion. The cart reverses without a pause, and these are the only horizontal forces.',
    workedForceDiagram: {
      positive: 'right', surface: 'floor', body: 'After turn',
      arrows: [
        { direction: 'right', label: 'Drive 12 N' }, { direction: 'left', label: 'Drag 4 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'Find the total distance travelled in the first 4.5 s.',
      answer: 13.5, unit: 'm',
      feedback: ['Use the turning instant to divide the motion into two stages. Reverse the sign of the resistive force and add the magnitudes of the two displacements.', '以掉头时刻为界分成两段。改变阻力的符号，再把两段位移的大小相加。'],
    }],
    hint: ['Take rightwards as positive. During the first stage both horizontal forces point rightwards. Find when the velocity first reaches zero.', '取向右为正。第一段的两个水平力都向右。先求速度第一次达到零的时刻。'],
    steps: [
      { math: tex`a_1=\frac{12+4}{4}=4\,\mathrm{m\,s^{-2}}`, en: 'During leftward motion the resistance and the drive both act rightwards.', zh: '小车向左运动时，阻力与驱动力均向右。' },
      { math: tex`0=-6+4t_1\quad\Rightarrow\quad t_1=1.5\,\mathrm s`, en: 'The first stage ends when the cart reverses.', zh: '小车掉头时，第一段结束。' },
      { math: tex`d_1=\frac{6+0}{2}(1.5)=4.5\,\mathrm m`, en: 'The cart moves left throughout this stage. Use the mean of its initial and final speeds.', zh: '这一段始终向左运动。用初末速率的平均值乘以时间。' },
      { math: tex`a_2=\frac{12-4}{4}=2\,\mathrm{m\,s^{-2}}`, en: 'During rightward motion the resistance acts leftwards, as shown in the diagram.', zh: '小车向右运动时，阻力改为向左，如图所示。' },
      { math: tex`d_2=\tfrac12(2)(4.5-1.5)^2=9\,\mathrm m`, en: 'Start this stage from zero speed and use its duration of 3 s.', zh: '第二段从速度为零开始，用时 $3$ s。' },
      { math: tex`d=4.5+9=13.5\,\mathrm m`, en: 'Add the distance travelled in each direction.', zh: '将两个运动方向上的路程相加。' },
    ],
  },
  {
    id: 'm1-forces-26',
    title: 'Compare signed resultant forces on different masses',
    prompt: 'Trolley A has mass $2m$ and accelerates to the right with acceleration of magnitude $a$. Trolley B has mass $3m$ and accelerates to the left with acceleration of magnitude $2a$. Here $m>0$ and $a>0$. Take rightwards as positive, and let $F_A$ and $F_B$ be their signed horizontal resultant forces.',
    parts: [{
      prompt: 'Which relation between the resultant forces is correct?',
      choices: ['$F_B=3F_A$', '$F_B=-2F_A$', '$F_B=-\\frac{3}{2}F_A$', '$F_B=-3F_A$'],
      answer: 3,
      feedback: ['Use each trolley’s own mass and signed acceleration when applying Newton’s second law.', '应用牛顿第二定律时，分别用每辆小车的质量和带符号的加速度。'],
      choiceFeedback: {
        0: ['The magnitude ratio is correct. The resultant forces act in opposite directions, so their signs must differ.', '大小之比正确。两个合力的方向相反，因此符号也相反。'],
        1: ['This uses the ratio of accelerations alone. The two masses are also different.', '这个关系只用了加速度之比。两辆小车的质量也不同。'],
        2: ['This uses the ratio of masses alone. B also has twice A’s acceleration magnitude.', '这个关系只用了质量之比。B 的加速度大小还是 A 的两倍。'],
      },
    }],
    hint: ['Write $F_A$ and $F_B$ in terms of $m$ and $a$, with the signs taken from their acceleration directions.', '分别把 $F_A$ 与 $F_B$ 写成含 $m$ 和 $a$ 的式子，依据加速度方向确定正负号。'],
    steps: [
      { math: tex`F_A=(2m)(+a)=2ma`, en: 'A’s acceleration is positive.', zh: 'A 的加速度为正。' },
      { math: tex`F_B=(3m)(-2a)=-6ma`, en: 'B’s acceleration is negative and has magnitude $2a$.', zh: 'B 的加速度为负，大小为 $2a$。' },
      { math: tex`F_B=-3F_A`, en: 'B’s resultant has three times A’s magnitude and points in the opposite direction.', zh: 'B 的合力大小是 A 的三倍，方向与 A 相反。' },
    ],
  },
  {
    id: 'm1-forces-27',
    title: 'Recover the resistance from trials in opposite directions',
    prompt: 'The same 3 kg trolley receives a constant pull $P$ to the right in two trials. The only other horizontal force is resistance of constant magnitude $D$, which acts opposite to the motion. Its acceleration is 1.5 m s⁻² rightwards while it moves right in trial I, and 2.5 m s⁻² rightwards while it moves left in trial II.',
    parts: [{
      prompt: 'Find the magnitude $D$ of the resistance.',
      answer: 1.5, unit: 'N',
      feedback: ['The resistance term changes sign between trials. Subtract the two equations to eliminate the unchanged pull.', '阻力项在两个试验中取值符号相反。将两个方程相减以消去不变的拉力。'],
    }],
    hint: ['Take rightwards as positive in both trials. Assign a sign to the resistance using the direction of motion in each trial.', '两个试验都取向右为正。根据每个试验的运动方向确定阻力的符号。'],
    steps: [
      { math: tex`P-D=3(1.5)=4.5\,\mathrm N`, en: 'In trial I, resistance acts leftwards.', zh: '试验 I 中阻力向左。' },
      { math: tex`P+D=3(2.5)=7.5\,\mathrm N`, en: 'In trial II, resistance acts rightwards. The acceleration is still rightwards.', zh: '试验 II 中阻力向右，加速度仍然向右。' },
      { math: tex`2D=7.5-4.5=3\,\mathrm N`, en: 'Subtract the first equation from the second to eliminate $P$.', zh: '用第二个方程减去第一个方程，消去 $P$。' },
      { math: tex`D=1.5\,\mathrm N`, en: 'Divide by 2 to find the resistance in either trial.', zh: '除以 $2$，得到两个试验中阻力的大小。' },
    ],
  },
  {
    id: 'm1-forces-28',
    title: 'Match a velocity graph to a motor cut-off',
    prompt: 'A 4 kg cart is initially moving rightwards at 2 m s⁻¹. A motor pulls rightwards with a force of 12 N for the first 2 s, then is switched off. A 4 N resistance opposes the motion throughout. The cart moves rightwards for all 5 s shown.',
    candidates: [
      { kind: 'v', points: [[0, 2], [2, 4], [5, 1]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4, 6, 8] },
      { kind: 'v', points: [[0, 2], [2, 6], [5, 6]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4, 6, 8] },
      { kind: 'v', points: [[0, 2], [2, 6], [5, 3]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4, 6, 8] },
      { kind: 'v', points: [[0, 2], [2, 8], [5, 5]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 2, 4, 6, 8] },
    ],
    parts: [{
      prompt: 'Which graph shows the cart’s signed velocity with rightwards positive?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 2,
      feedback: ['Use the resultant force in each stage to predict the slope of that part of the graph.', '用各阶段的合力推断相应图线的斜率。'],
      choiceFeedback: {
        0: ['Check the first segment. A 2 m s⁻² acceleration changes the velocity by 2 m s⁻¹ every second.', '检查第一段。加速度为 $2$ m s⁻² 时，速度每秒增加 $2$ m s⁻¹。'],
        1: ['The resistance still acts after 2 s, so the velocity graph cannot stay horizontal.', '$2$ s 后阻力仍然存在，所以速度图线不可能保持水平。'],
        3: ['The initial 12 N pull is not the resultant. The 4 N resistance acts during the first stage as well.', '最初的 $12$ N 拉力不是合力。第一段同样受到 $4$ N 的阻力。'],
      },
    }],
    hint: ['First calculate the acceleration with the motor on. Then calculate it again using only the resistance after the motor is switched off.', '先求电机工作时的加速度，再在电机关闭后只用阻力求新的加速度。'],
    steps: [
      { math: tex`a_1=\frac{12-4}{4}=2\,\mathrm{m\,s^{-2}}`, en: 'The first segment rises with this gradient.', zh: '第一段以这个斜率上升。' },
      { math: tex`v(2)=2+2(2)=6\,\mathrm{m\,s^{-1}}`, en: 'The velocity at the switch starts the second segment.', zh: '切换时的速度是第二段图线的起点。' },
      { math: tex`a_2=\frac{-4}{4}=-1\,\mathrm{m\,s^{-2}}`, en: 'The second segment falls because only the leftward resistance remains.', zh: '第二段只有向左的阻力，因此图线下降。' },
      { math: tex`v(5)=6-1(3)=3\,\mathrm{m\,s^{-1}}`, en: 'The three vertices match graph C.', zh: '三个端点与图 C 一致。' },
    ],
  },
  {
    id: 'm1-forces-29',
    title: 'Find a minimum driving force for a distance requirement',
    prompt: 'A 3 kg cart travels to the right along a horizontal track. Its initial speed is 4 m s⁻¹. A constant driving force of magnitude $F$ acts to the right and a constant resistance of 3 N acts to the left. The cart must cover at least 12 m in the first 2 s and continues rightwards throughout.',
    parts: [{
      prompt: 'Which condition on the driving force meets the requirement?',
      choices: ['$F\\geq 9$ N', '$F\\geq 6$ N', '$F\\leq 9$ N', '$F=9$ N only'],
      answer: 0,
      feedback: ['Find the minimum acceleration from the distance requirement, then convert it to a driving force.', '根据路程要求求出最小加速度，再把它换算为驱动力。'],
      choiceFeedback: {
        1: ['6 N is the minimum resultant. The driving force must also overcome the 3 N resistance.', '$6$ N 是最小合力。驱动力还需要克服 $3$ N 的阻力。'],
        2: ['A larger driving force gives a larger acceleration and a greater distance in the same time.', '驱动力越大，加速度越大，相同用时内的路程也越大。'],
        3: ['9 N gives exactly 12 m. The phrase ‘at least’ also allows larger distances.', '$9$ N 恰好使小车走过 $12$ m。题目要求“至少”，因此更大的路程也符合要求。'],
      },
    }],
    hint: ['Use $s=ut+\\frac12at^2$ for the first 2 s. Turn “at least” into an inequality before substituting $F-3=3a$.', '对前 $2$ s 使用 $s=ut+\\frac12at^2$。先把“至少”写成不等式，再代入 $F-3=3a$。'],
    steps: [
      { math: tex`s=4(2)+\tfrac12a(2^2)=8+2a`, en: 'Use constant acceleration and take rightwards as positive.', zh: '取向右为正，应用匀加速位移公式。' },
      { math: tex`8+2a\geq12\quad\Rightarrow\quad a\geq2\,\mathrm{m\,s^{-2}}`, en: 'The distance must be at least 12 m.', zh: '路程至少为 $12$ m。' },
      { math: tex`F-3=3a\geq6\,\mathrm N`, en: 'The resultant is the driving force minus resistance.', zh: '合力为驱动力减去阻力。' },
      { math: tex`F\geq 9\,\mathrm N`, en: 'A 9 N drive is just enough. A larger drive also meets the requirement.', zh: '驱动力为 $9$ N 恰好满足要求。更大的驱动力也符合要求。' },
    ],
  },
  {
    id: 'm1-forces-30',
    title: 'Reconcile two different choices of positive direction',
    prompt: 'Two students study a 5 kg platform on a smooth horizontal rail. The diagram shows the forces. One student measures the signed acceleration $a_R$ with rightwards positive, as drawn. The other measures the signed acceleration $a_L$ with leftwards positive.',
    forceDiagram: {
      positive: 'right', surface: 'floor', body: 'Platform',
      arrows: [
        { direction: 'right', label: '11 N' }, { direction: 'left', label: '26 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'Which pair of horizontal force equations is correct?',
      choices: [
        '$26-11=5a_R$ and $11-26=5a_L$',
        '$11-26=5a_R$ and $26-11=5a_L$',
        '$11-26=5a_R$ and $11-26=5a_L$',
        '$11+26=5a_R$ and $-11-26=5a_L$',
      ],
      answer: 1,
      feedback: ['Reversing the axis reverses the sign of each force and of the signed acceleration.', '正方向反转后，各力分量的符号以及加速度的符号都要反转。'],
      choiceFeedback: {
        0: ['Check the subscripts. In the right-positive equation, the 26 N leftward force must be negative.', '检查下标。取向右为正时，向左的 $26$ N 力必须取负号。'],
        2: ['The right-positive equation is correct. Reverse both force signs when you use leftwards positive.', '向右为正的方程正确。改取向左为正时，两个力分量的符号都要反转。'],
        3: ['The two horizontal forces point in opposite directions. In either convention their signed terms have opposite signs.', '两个水平力方向相反。无论怎样规定正方向，它们的分量符号总是相反的。'],
      },
    }],
    hint: ['For each student, give the force along that student’s positive direction a positive sign.', '对每位学生，沿其规定正方向的力取正号。'],
    steps: [
      { math: tex`11-26=5a_R\quad\Rightarrow\quad a_R=-3\,\mathrm{m\,s^{-2}}`, en: 'The 11 N rightward force is positive in the first convention.', zh: '第一种取法中，向右的 $11$ N 力取正号。' },
      { math: tex`26-11=5a_L\quad\Rightarrow\quad a_L=+3\,\mathrm{m\,s^{-2}}`, en: 'The 26 N leftward force is positive in the second convention. Both results describe acceleration to the left.', zh: '第二种取法中，向左的 $26$ N 力取正号。两种结果均表示加速度向左。' },
    ],
  },
]
