import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const resultantForceQuestions: MotionQuestion[] = [
  {
    id: 'm1-forces-01',
    title: 'Read the sign of acceleration from a force diagram',
    prompt: 'A 5 kg trolley is moving to the right along a horizontal track. The arrows show all its forces. Take rightwards as positive.',
    forceDiagram: {
      positive: 'right', surface: 'floor', body: 'Trolley',
      arrows: [
        { direction: 'left', label: '17 N' }, { direction: 'right', label: '7 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'What is the signed horizontal acceleration of the trolley, in m s⁻²?',
      choices: ['$+2$', '$-2$', '$-4.8$', '$0$'],
      answer: 1,
      feedback: ['Add the horizontal forces with their signs, then divide the resultant by the mass.', '按正负号合并各水平力，再用水平合力除以质量。'],
      choiceFeedback: {
        0: ['The magnitude is correct. Look at which horizontal arrow represents the larger force.', '加速度大小正确。再看两个水平箭头中，哪一个表示的力更大。'],
        2: ['The horizontal forces act in opposite directions. Subtract their magnitudes before dividing by mass.', '两个水平力方向相反。先求两者大小之差，再除以质量。'],
        3: ['The vertical forces balance. That does not give the horizontal resultant.', '竖直方向的力平衡。水平方向仍要单独求合力。'],
      },
    }],
    hint: ['Write the rightward force with a plus sign and the leftward force with a minus sign.', '向右的力取正，向左的力取负。'],
    steps: [
      { math: tex`\Sigma F_x = 7-17=-10\,\mathrm N`, en: 'With rightwards positive, the larger leftward force gives a negative resultant.', zh: '规定向右为正。向左的力较大，故合力为负。' },
      { math: tex`a=\frac{-10}{5}=-2\,\mathrm{m\,s^{-2}}`, en: 'Apply Newton’s second law. The trolley accelerates leftwards while it is still moving rightwards.', zh: '用牛顿第二定律。小车仍向右运动，但加速度向左。' },
    ],
  },
  {
    id: 'm1-forces-02',
    title: 'Compare mass and weight in different gravitational fields',
    prompt: 'An object weighs 15 N where the gravitational acceleration is 10 m s⁻². It is taken to a place where the gravitational acceleration is 8 m s⁻².',
    parts: [{
      prompt: 'What are its mass and weight at the second place, respectively?',
      choices: ['$1.875$ kg and $15$ N', '$1.5$ kg and $15$ N', '$1.5$ kg and $12$ N', '$1.2$ kg and $12$ N'],
      answer: 2,
      feedback: ['Find the mass using the first value of gravitational acceleration, then use that same mass to calculate the new weight.', '用第一个地点的重力加速度求质量，再用同一质量计算新地点的重量。'],
      choiceFeedback: {
        0: ['The 15 N value is measured at the first place. Its weight at the second place has not been given.', '$15$ N 是该物体在第一个地点的重量。第二个地点的重量并未给出。'],
        1: ['The mass is correct. At the second place use its local gravitational acceleration to calculate the weight.', '质量正确。在第二个地点，要用当地的重力加速度计算重量。'],
        3: ['The weight is correct. The quantity measured in kilograms stays the same when the object is moved.', '重量正确。物体换到另一个地点后，以千克计量的质量保持不变。'],
      },
    }],
    hint: ['Use $W=mg$ at both places. Only $g$ and $W$ can change here.', '两个地点都用 $W=mg$。本题中只有 $g$ 与 $W$ 可以改变。'],
    steps: [
      { math: tex`m=\frac{15}{10}=1.5\,\mathrm{kg}`, en: 'Use the measured weight and the gravitational acceleration at the first place.', zh: '用第一个地点的已知重量除以当地的重力加速度。' },
      { math: tex`W=1.5(8)=12\,\mathrm N`, en: 'The mass is unchanged. Multiply it by the new local gravitational acceleration.', zh: '质量保持不变，再乘以第二个地点的重力加速度。' },
    ],
  },
  {
    id: 'm1-forces-03',
    title: 'Use horizontal and vertical balance separately',
    prompt: 'A 2.5 kg parcel slides to the right at constant velocity along a horizontal conveyor. The force diagram shows the forces on the parcel. Take $g=10$ m s⁻².',
    forceDiagram: {
      positive: 'right', surface: 'floor', body: 'Parcel',
      arrows: [
        { direction: 'left', label: 'F' }, { direction: 'right', label: '11 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'What are the magnitudes of $R$ and $F$, respectively?',
      choices: ['$25$ N and $11$ N', '$36$ N and $11$ N', '$25$ N and $0$ N', '$11$ N and $25$ N'],
      answer: 0,
      feedback: ['Acceleration is zero in both directions. Write one balance equation for each axis.', '两个方向的加速度都为零。分别写出水平和竖直方向的平衡方程。'],
      choiceFeedback: {
        1: ['The 11 N force is horizontal. It has no component along the line of the normal reaction.', '$11$ N 的力沿水平方向，在法向反作用力所在的方向上没有分量。'],
        2: ['Zero horizontal acceleration means zero horizontal resultant. A leftward force is required to balance the 11 N force.', '水平加速度为零，说明水平合力为零。需要向左的力来平衡向右的 $11$ N。'],
        3: ['$R$ balances the weight in the vertical direction. $F$ balances the applied force in the horizontal direction.', '$R$ 在竖直方向上平衡重力，$F$ 在水平方向上平衡施加的力。'],
      },
    }],
    hint: ['Identify the two opposite arrows on each axis. Work with one pair of forces at a time.', '找出每条轴上方向相反的两个箭头。每次分析一对力。'],
    steps: [
      { math: tex`R-2.5(10)=0\quad\Rightarrow\quad R=25\,\mathrm N`, en: 'There is no vertical acceleration, so the normal reaction balances the weight.', zh: '竖直加速度为零，法向反作用力与重力平衡。' },
      { math: tex`11-F=0\quad\Rightarrow\quad F=11\,\mathrm N`, en: 'Constant horizontal velocity gives zero horizontal acceleration.', zh: '水平速度保持不变，因此水平加速度为零。' },
    ],
  },
  {
    id: 'm1-forces-04',
    title: 'Assign the sign of resistance from the direction of motion',
    prompt: 'At a particular instant a 6 kg sled is moving to the left on a horizontal track. An applied force of 8 N acts to the left, and the resistance to motion has magnitude 14 N. Take rightwards as positive.',
    workedForceDiagram: {
      positive: 'right', surface: 'floor', body: 'Sled',
      arrows: [
        { direction: 'left', label: '8 N' }, { direction: 'right', label: '14 N' },
        { direction: 'up', label: 'R' }, { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'Which equation correctly models the horizontal motion at that instant?',
      choices: ['$8-14=6a$', '$14+8=6a$', '$14=6a$', '$14-8=6a$'],
      answer: 3,
      feedback: ['Use the actual motion to decide the direction of resistance, then take signs using the stated positive direction.', '根据实际运动方向判断阻力方向，再按题目规定的正方向给每个力取正负号。'],
      choiceFeedback: {
        0: ['This assigns a positive sign to the leftward applied force. Rightwards is the positive direction.', '这个式子把向左的外力取为正值。题目规定向右为正。'],
        1: ['The two forces oppose each other while the sled moves leftwards. Give them opposite signs.', '滑橇向左运动时，这两个力的方向相反，因此符号也应相反。'],
        2: ['The 8 N applied force also contributes to the horizontal resultant.', '水平合力也要计入 $8$ N 的外力。'],
      },
    }],
    hint: ['Draw the applied force and resistance as separate arrows. Ask which arrow points right.', '分别画出外力和阻力，判断哪个箭头向右。'],
    steps: [
      { math: tex`F_{\text{resistance},x}=+14\,\mathrm N`, en: 'The sled is moving leftwards, so resistance acts rightwards at this instant.', zh: '此刻滑橇向左运动，因此阻力向右。' },
      { math: tex`14-8=6a\quad\Rightarrow\quad a=+1\,\mathrm{m\,s^{-2}}`, en: 'The applied force is leftwards. The positive acceleration opposes the present velocity.', zh: '外力向左。算出的正加速度与此时的速度方向相反。' },
    ],
  },
  {
    id: 'm1-forces-05',
    title: 'Carry the final speed into a new driving stage',
    prompt: 'A 4 kg cart moves to the right at 1 m s⁻¹ on a horizontal track. A driving force of 16 N acts to the right for 2 s. It is then reduced to 6 N for the next 4 s. A constant 4 N resistance acts throughout.',
    parts: [{
      prompt: 'Find the distance travelled during the second stage.',
      answer: 32,
      unit: 'm',
      feedback: ['Recalculate the acceleration after the driving force changes. Start the second stage at the speed reached at the end of the first.', '驱动力改变后要重新求加速度。第二阶段的初速度等于第一阶段的末速度。'],
    }],
    hint: ['Find the speed when the driving force changes. Use this speed and the new force balance for the following 4 s.', '先求驱动力改变时的速度，再用这个速度和第二阶段的受力方程处理接下来的 4 秒。'],
    steps: [
      { math: tex`a_1=\frac{16-4}{4}=3\,\mathrm{m\,s^{-2}}`, en: 'While the cart moves rightwards, resistance acts to the left.', zh: '小车向右运动，阻力向左。' },
      { math: tex`u_2=1+3(2)=7\,\mathrm{m\,s^{-1}}`, en: 'The first stage ends at the speed that starts stage two.', zh: '第一阶段的末速度就是第二阶段的初速度。' },
      { math: tex`a_2=\frac{6-4}{4}=0.5\,\mathrm{m\,s^{-2}}`, en: 'The smaller driving force gives a new positive acceleration.', zh: '驱动力减小后，重新列式得到新的正加速度。' },
      { math: tex`s_2=7(4)+\tfrac12(0.5)(4^2)=32\,\mathrm m`, en: 'The cart continues in the same direction, so this displacement is also the distance travelled.', zh: '小车继续沿同一方向运动，因此这一段的位移大小等于路程。' },
    ],
  },
  {
    id: 'm1-forces-06',
    title: 'Infer the braking force in the second stage',
    prompt: 'A 6 kg cart moves to the right at 9 m s⁻¹ on a smooth horizontal track. The diagram shows the forces while the first brake acts for 3 s. At that moment a second constant braking force replaces the first and brings the cart to rest in 1 s. The brake is the only horizontal force in each stage.',
    forceDiagram: {
      positive: 'right', surface: 'floor', body: 'Cart',
      arrows: [
        { direction: 'left', label: '12 N' }, { direction: 'up', label: 'R' },
        { direction: 'down', label: 'W' },
      ],
    },
    parts: [{
      prompt: 'What is the magnitude of the braking force during the second stage?',
      choices: ['$6$ N', '$12$ N', '$54$ N', '$18$ N'],
      answer: 3,
      feedback: ['Use the first braking force to find the speed when the brakes change. Then work backwards from the stopping time.', '用第一阶段的制动力算出切换到第二阶段时的速度，再根据停车时间反求第二阶段的制动力。'],
      choiceFeedback: {
        0: ['This describes the increase in braking force. The question asks for the full braking force in the second stage.', '这是制动力增加的量。题目问第二阶段制动力的大小。'],
        1: ['This is the force shown for the first stage only. The second braking force has to produce the stated stopping time.', '图中给出的是第一阶段的力。第二阶段的制动力要根据题给的停车时间求出。'],
        2: ['This would stop the cart from its original speed in 1 s. The cart has already slowed down before the second brake starts.', '这是从最初速度在 $1$ 秒内停住所需的力。第二阶段开始前，小车已经减速。'],
      },
    }],
    hint: ['Find the first acceleration using the diagram. Use the resulting final velocity as the second initial velocity.', '根据图示求第一阶段的加速度，再把算出的末速度作为第二阶段的初速度。'],
    steps: [
      { math: tex`a_1=\frac{-12}{6}=-2\,\mathrm{m\,s^{-2}}`, en: 'The force in the diagram points opposite to the positive direction.', zh: '图示制动力指向负方向。' },
      { math: tex`u_2=9-2(3)=3\,\mathrm{m\,s^{-1}}`, en: 'The cart is still moving rightwards when the braking force changes.', zh: '制动力改变时，小车仍在向右运动。' },
      { math: tex`a_2=\frac{0-3}{1}=-3\,\mathrm{m\,s^{-2}}`, en: 'The velocity falls from 3 m s⁻¹ to zero in 1 s.', zh: '速度在 1 秒内由 3 m s⁻¹ 降至零。' },
      { math: tex`|F_2|=|6(-3)|=18\,\mathrm N`, en: 'The negative resultant acts leftwards. The question asks for its magnitude.', zh: '合力为负，方向向左。题目要求的是它的大小。' },
    ],
  },
  {
    id: 'm1-forces-07',
    title: 'Distinguish what can change when a force changes',
    prompt: 'A trolley is travelling at constant nonzero velocity on a horizontal rail. Its forward driving force suddenly increases to a larger finite value and then stays constant. The resistance remains constant. The trolley has constant mass and does not collide with anything.',
    parts: [{
      prompt: 'What happens to the velocity and acceleration across this change?',
      choices: [
        'Both velocity and acceleration jump to new values.',
        'Velocity jumps and acceleration stays zero.',
        'Velocity stays continuous and acceleration changes.',
        'Velocity and acceleration both stay unchanged.',
      ],
      answer: 2,
      feedback: ['A change in resultant force changes acceleration immediately. A change in velocity accumulates over time.', '合力的变化会立即改变加速度。速度变化需要经过一段时间。'],
      choiceFeedback: {
        0: ['There is a finite change in the resultant force, so the acceleration can jump. That finite acceleration cannot produce a finite velocity change in zero time.', '合力发生有限的突变，所以加速度可以突变。有限的加速度不能在零用时内产生有限的速度变化。'],
        1: ['The increased driving force is no longer balanced by the unchanged resistance. This affects the acceleration.', '驱动力增大后，原来的阻力无法与之平衡，因此加速度会改变。'],
        3: ['The trolley keeps the same velocity at the transition, but a larger driving force changes the horizontal resultant.', '在过渡的瞬间，小车的速度保持连续，但较大的驱动力会改变水平合力。'],
      },
    }],
    hint: ['Compare the resultant force on the two sides of the transition. Then ask whether any time has elapsed at the transition itself.', '比较改变前后的合力，再考虑改变的瞬间是否经历了一段时间。'],
    steps: [
      { math: tex`a_1=0,\qquad a_2=\frac{F_2-R}{m}>0`, en: 'The forces balance before the change. The new driving force exceeds the resistance $R$.', zh: '驱动力改变前，各力平衡。改变后，新的驱动力大于阻力 $R$。' },
      { math: tex`\Delta v=a_2\Delta t\to 0\quad(\Delta t\to 0)`, en: 'At the transition the acceleration changes, but the velocity is continuous.', zh: '改变的瞬间，加速度发生变化，而速度保持连续。' },
    ],
  },
]

export const verticalMotionFoundation: MotionQuestion[] = [
  {
    id: 'm1-forces-08',
    title: 'Resolve weight at the highest point',
    prompt: 'A 0.35 kg parcel is thrown vertically upwards and moves freely under gravity. Take upwards as positive and $g=10$ m s⁻².',
    workedForceDiagram: {
      positive: 'up', body: 'Parcel',
      arrows: [{ direction: 'down', label: '3.5 N' }],
    },
    parts: [{
      prompt: 'What are the signed vertical component of its weight and its acceleration at the highest point?',
      choices: [
        '$-3.5$ N and $-10$ m s⁻²', '$+3.5$ N and $-10$ m s⁻²',
        '$-3.5$ N and $0$ m s⁻²', '$0$ N and $0$ m s⁻²',
      ],
      answer: 0,
      feedback: ['At the highest point the velocity is zero. Use the force still acting there to determine the acceleration.', '最高点的速度为零。用此刻仍然存在的力判断加速度。'],
      choiceFeedback: {
        1: ['3.5 N is the positive magnitude. The question asks for the signed component with upwards positive.', '$3.5$ N 是力的大小。题目要求的是向上为正时带符号的分量。'],
        2: ['The signed force is correct. A nonzero resultant on a constant mass gives a nonzero acceleration.', '重力的带符号分量正确。质量恒定时，非零合力会产生非零加速度。'],
        3: ['The parcel is instantaneously at rest, but gravity still acts on it.', '物体在这一瞬间静止，但仍然受到重力。'],
      },
    }],
    hint: ['Draw weight downwards even at the highest point. Write the vertical equation of motion with upwards positive.', '即使在最高点，也要画出向下的重力。取向上为正，写出竖直运动方程。'],
    steps: [
      { math: tex`W=0.35(10)=3.5\,\mathrm N`, en: 'The magnitude of weight is $mg$ at every point of the flight.', zh: '整个飞行过程中，重力大小都等于 $mg$。' },
      { math: tex`\Sigma F_y=-3.5=0.35a`, en: 'Weight acts downwards and is the only force in flight.', zh: '飞行中只有重力作用，方向向下。' },
      { math: tex`a=-10\,\mathrm{m\,s^{-2}}`, en: 'At the highest point the velocity is zero but the acceleration remains downwards.', zh: '在最高点，速度为零，但加速度仍然向下。' },
    ],
  },
  {
    id: 'm1-forces-09',
    title: 'Use a return time to find the highest point',
    prompt: 'A ball is projected vertically upwards and returns to its launch height 3.6 s later. Neglect air resistance and take $g=10$ m s⁻².',
    parts: [{
      prompt: 'Find the greatest height reached above the launch point.',
      answer: 16.2,
      unit: 'm',
      feedback: ['The 3.6 s is the time for the complete trip back to the launch level. Find the shorter time from launch to the highest point.', '$3.6$ 秒是回到发射高度的全程用时。先确定从发射到最高点的用时。'],
    }],
    hint: ['On this free flight, the ascent and descent between launch level and the highest point take equal times.', '在本题的自由飞行中，发射高度与最高点之间的上升和下降用时相同。'],
    steps: [
      { math: tex`t_{\text{top}}=\frac{3.6}{2}=1.8\,\mathrm s`, en: 'The velocity decreases at a constant rate. The ascent takes half the total time in flight.', zh: '速度随时间均匀减小。回到同一高度时，上升用时是往返用时的一半。' },
      { math: tex`0=u-10(1.8)\quad\Rightarrow\quad u=18\,\mathrm{m\,s^{-1}}`, en: 'Take upwards as positive and use zero velocity at the highest point.', zh: '取向上为正，最高点速度为零，据此求初速度。' },
      { math: tex`h=\tfrac12(18+0)(1.8)=16.2\,\mathrm m`, en: 'Multiply the mean velocity on the ascent by its duration.', zh: '上升阶段的平均速度乘以上升用时，得到最大高度差。' },
    ],
  },
  {
    id: 'm1-forces-10',
    title: 'Select the physical root when the launch level is above the ground',
    prompt: 'A ball is launched vertically upwards from a platform 9 m above horizontal ground with initial speed 12 m s⁻¹. Air resistance is negligible. Take upwards as positive and $g=10$ m s⁻².',
    workedForceDiagram: {
      positive: 'up', body: 'Ball',
      arrows: [{ direction: 'down', label: 'W' }],
    },
    parts: [{
      prompt: 'What are the time from launch to impact and the signed velocity just before impact?',
      choices: [
        '$2.4$ s and $-12$ m s⁻¹', '$3$ s and $-18$ m s⁻¹',
        '$3$ s and $+18$ m s⁻¹', '$0.6$ s and $-18$ m s⁻¹',
      ],
      answer: 1,
      feedback: ['Use the displacement from the launch point to the ground. Keep the positive time and check the direction of the ball at impact.', '用从发射点到地面的有符号位移列式。保留正的用时，并判断球撞地前的运动方向。'],
      choiceFeedback: {
        0: ['These values describe the return to launch level. The ground lies below that level.', '这是返回发射高度时的结果。地面比发射点更低。'],
        2: ['The time is correct. The ball is descending just before impact, so its signed velocity must be negative.', '用时正确。球撞地前正在下降，有符号速度应为负。'],
        3: ['The equation gives a negative root whose magnitude is 0.6 s. That root does not describe any time after launch.', '方程有一个绝对值为 $0.6$ 秒的负根。它不表示发射后的时刻。'],
      },
    }],
    hint: ['Set the displacement equal to $-9$ m. Use the elapsed time to determine the sign of the final velocity.', '令位移等于 $-9$ m，再用求得的用时算末速度并保留符号。'],
    steps: [
      { math: tex`-9=12t-5t^2`, en: 'The ground is 9 m below the launch point, and the acceleration is $-g$.', zh: '地面在发射点下方 9 米，加速度为 $-g$。' },
      { math: tex`(5t+3)(t-3)=0`, en: 'Rearrange the displacement equation and factorise.', zh: '整理位移方程并因式分解。' },
      { math: tex`t=3\,\mathrm s\quad\text{or}\quad t=-0.6\,\mathrm s`, en: 'Keep $t=3$ s because the impact occurs after launch.', zh: '撞地发生在发射之后，所以只保留 $t=3$ 秒。' },
      { math: tex`v=12-10(3)=-18\,\mathrm{m\,s^{-1}}`, en: 'The negative sign shows that the ball is moving downwards just before impact.', zh: '负号说明球撞地前的运动方向向下。' },
    ],
  },
]
