import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const smoothSlopeQuestions: MotionQuestion[] = [
  {
    id: 'm1-planar-11',
    title: 'Distinguish uphill velocity from downhill acceleration',
    prompt: tex`A $2\,\mathrm{kg}$ crate is sliding uphill on the smooth plane shown. The diagram shows all the forces on the crate. Take uphill as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    planarDiagram: { body: 'Crate', slope: 30, forces: [{ angle: 120, label: 'R' }, { angle: 270, label: 'Weight' }] },
    parts: [{
      prompt: 'What is the signed acceleration along the plane?',
      choices: [tex`$+5\,\mathrm{m\,s^{-2}}$`, tex`$-5\,\mathrm{m\,s^{-2}}$`, tex`$-5\sqrt{3}\,\mathrm{m\,s^{-2}}$`, tex`$0\,\mathrm{m\,s^{-2}}$`],
      answer: 1,
      feedback: ['Find the component of weight along the slope and give it the sign of its direction.', '先求重力沿斜面的分量，再根据分量方向确定正负号。'],
      choiceFeedback: {
        0: ['The magnitude is right. Gravity pulls downhill while the crate is still moving uphill.', '大小正确。小箱仍在向上滑，但重力沿斜面的分量向下。'],
        2: ['The cosine component goes into the plane. Resolve the weight parallel to the slope.', '余弦分量指向斜面内侧。题目需要重力沿斜面的分量。'],
        3: ['The normal reaction has zero component along the plane. Check which force still acts along it.', '支持力在沿斜面方向的分量为零。检查沿斜面方向还有哪个力的分量。'],
      },
    }],
    hint: ['Use the angle between the slope and the horizontal to find how much of the weight acts downhill.', '用斜面与水平线的夹角，求重力沿斜面向下的分量。'],
    steps: [
      { math: tex`\sum F_{\parallel}=-20\sin30^\circ=-10\,\mathrm N`, en: 'The plane angle is 30°. Weight contributes a negative force along the plane, and the reaction is perpendicular to it.', zh: '斜面倾角为 30°。重力沿斜面的分量为负，支持力垂直于斜面。' },
      { math: tex`2a=-10\quad\Rightarrow\quad a=-5\,\mathrm{m\,s^{-2}}`, en: 'The acceleration is downhill, so the crate slows down while its velocity is uphill.', zh: '加速度沿斜面向下，因此小箱向上滑时速率减小。' },
    ],
  },
  {
    id: 'm1-planar-12',
    title: 'Resolve perpendicular to a smooth slope',
    prompt: tex`A $3\,\mathrm{kg}$ block slides down a fixed smooth plane inclined at $60^\circ$ to the horizontal. It remains in contact with the plane and is acted on only by its weight and the plane’s reaction. Take $g=10\,\mathrm{m\,s^{-2}}$.`,
    workedPlanarDiagram: { body: 'Block', slope: 60, axesAngle: 60, forces: [{ angle: 150, label: 'R' }, { angle: 270, label: '30 N' }] },
    parts: [{
      prompt: 'What are the magnitude of the normal reaction and the acceleration component perpendicular to the plane, respectively?',
      choices: [tex`$30\,\mathrm N$ and $0\,\mathrm{m\,s^{-2}}$`, tex`$15\sqrt{3}\,\mathrm N$ and $0\,\mathrm{m\,s^{-2}}$`, tex`$15\,\mathrm N$ and $-5\,\mathrm{m\,s^{-2}}$ (outward positive)`, tex`$15\,\mathrm N$ and $0\,\mathrm{m\,s^{-2}}$`],
      answer: 3,
      feedback: ['Resolve perpendicular to the plane, using the fixed plane to determine the acceleration in that direction.', '沿垂直斜面的方向列式，并根据斜面固定这一条件判断该方向的加速度。'],
      choiceFeedback: {
        0: ['The reaction balances the perpendicular component of the weight. Resolve the weight before comparing magnitudes.', '支持力平衡的是重力垂直于斜面的分量。先分解重力，再比较大小。'],
        1: ['That is the downhill component of the weight. The normal reaction is perpendicular to the slope.', '这是重力沿斜面向下的分量。支持力垂直于斜面。'],
        2: ['The reaction is right, but the fixed plane keeps the block at a constant perpendicular distance from it.', '支持力大小正确。在固定斜面上滑动时，物体到斜面的垂直距离保持不变。'],
      },
    }],
    hint: ['Consider how much of the weight points into the plane. Then ask whether the block accelerates into or away from the plane.', '考虑重力朝斜面内的分量，再判断物体是否沿垂直斜面的方向加速。'],
    steps: [
      { math: tex`a_{\perp}=0`, en: 'The block stays on a fixed straight slope, so it does not accelerate perpendicular to the slope.', zh: '物体始终贴着固定的直斜面运动，垂直斜面的加速度为零。' },
      { math: tex`R-30\cos60^\circ=3(0)`, en: 'Take away from the plane as positive and resolve the two forces in that direction.', zh: '以垂直斜面向外为正，沿此方向分解并列出受力方程。' },
      { math: tex`R=30\cos60^\circ=15\,\mathrm N`, en: 'There is no normal acceleration even though the block can accelerate down the slope.', zh: '垂直斜面的加速度为零，但物体仍能沿斜面向下加速。' },
    ],
  },
  {
    id: 'm1-planar-13',
    title: 'Find when a block returns to the position where its pull was removed',
    prompt: tex`A pull keeps a block moving uphill at $9\,\mathrm{m\,s^{-1}}$ on a fixed smooth plane inclined at angle $\theta$ to the horizontal, where $\sin\theta=\tfrac35$ and $0^\circ<\theta<90^\circ$. The pull is then removed. After removal, only weight and the plane’s reaction act. The plane is long enough for the block to return. Take uphill as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    parts: [{
      prompt: 'How long after the pull is removed does the block first return to its position at removal?',
      choices: [tex`$3\,\mathrm s$`, tex`$1.5\,\mathrm s$`, tex`$2.25\,\mathrm s$`, 'The block stays at its highest position.'],
      answer: 0,
      feedback: ['The velocity at removal is still uphill. Find the next time at which the signed displacement from that position is zero.', '撤去拉力时，物体仍有沿斜面向上的速度。求相对撤力位置的有符号位移下一次为零的时刻。'],
      choiceFeedback: {
        1: ['This is the time to reach zero velocity. The block then slides downhill before returning to the removal position.', '这是速度变为零的时刻。物体随后沿斜面下滑，再回到撤力位置。'],
        2: ['Using cosine gives a perpendicular component of weight. Use the downhill component for the motion along the plane.', '用余弦算出的是重力垂直斜面的分量。沿斜面的运动需要用重力沿斜面向下的分量。'],
        3: ['At the highest position the speed is momentarily zero, but there is still a downhill resultant.', '在最高处速率瞬间为零，但合力仍沿斜面向下。'],
      },
    }],
    hint: ['Start a new timing interval at removal, using the speed the block already has. Express its displacement from that point as a function of time.', '从撤力时刻重新计时，保留物体原有的速度。用时间表示自撤力位置起的位移。'],
    steps: [
      { math: tex`a=-g\sin\theta=-6\,\mathrm{m\,s^{-2}}`, en: 'After removal the only force component along the slope is the downhill component of weight.', zh: '撤力后，沿斜面方向只有重力沿斜面向下的分量。' },
      { math: tex`u=9\,\mathrm{m\,s^{-1}},\qquad s=9t-3t^2`, en: 'There is no instantaneous change in velocity at removal. Use the uphill velocity as the initial velocity.', zh: '撤力不会令速度瞬间突变，初速度仍沿斜面向上。' },
      { math: tex`s=0\quad\Rightarrow\quad 3t(3-t)=0`, en: 'Returning to the removal position gives zero signed displacement.', zh: '回到撤力位置时，有符号位移为零。' },
      { math: tex`t=0\quad\text{or}\quad t=3\,\mathrm s`, en: 'The zero root is the instant of removal. The later root gives the return time.', zh: '零根是撤力时刻。较晚的根给出返回所需的时间。' },
    ],
  },
  {
    id: 'm1-planar-14',
    title: 'Infer an uphill force from a velocity graph',
    prompt: tex`A $4\,\mathrm{kg}$ cart moves on a smooth plane inclined at $30^\circ$ to the horizontal. A constant force $P$ acts parallel to the plane in the uphill direction throughout the interval shown. The cart stays on the plane. Take uphill as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    plot: { kind: 'v', points: [[0, -2], [3, 1]], tTicks: [0, 1, 2, 3], yTicks: [-2, -1, 0, 1], analysis: { gradient: [0, 3] } },
    workedPlanarDiagram: { body: 'Cart', slope: 30, forces: [{ angle: 30, label: 'P' }, { angle: 120, label: 'R' }, { angle: 270, label: '40 N' }] },
    parts: [{
      prompt: 'Find the magnitude of $P$.',
      answer: 24,
      unit: 'N',
      feedback: ['Use the signed gradient for acceleration. Include the downhill component of weight when finding the applied force.', '用带符号的斜率求出加速度。求外力时，还要考虑重力沿斜面向下的分量。'],
    }],
    hint: ['Find the gradient across the whole interval, then write the force equation along the slope.', '求整段图像的斜率，再沿斜面列出受力方程。'],
    steps: [
      { math: tex`a=\frac{1-(-2)}{3-0}=1\,\mathrm{m\,s^{-2}}`, en: 'The graph has one positive gradient, even though the cart changes its direction of travel.', zh: '图像的斜率始终为正，即使小车的运动方向发生改变。' },
      { math: tex`P-40\sin30^\circ=4(1)`, en: 'The pull acts uphill and the weight component acts downhill throughout the interval.', zh: '在整段时间内，拉力沿斜面向上，重力沿斜面的分量向下。' },
      { math: tex`P=4+20=24\,\mathrm N`, en: 'The applied force supplies the 4 N resultant while overcoming the 20 N weight component.', zh: '外力抵消 20 牛的重力分量后，还需提供 4 牛的合力。' },
    ],
  },
  {
    id: 'm1-planar-15',
    title: 'Compare acceleration and reaction with an oblique pull',
    prompt: tex`A $4\,\mathrm{kg}$ block is sliding uphill on the fixed smooth plane shown. The diagram shows all its forces. The block stays on the plane. Take uphill as positive and $g=10\,\mathrm{m\,s^{-2}}$.`,
    planarDiagram: { body: 'Block', slope: 30, forces: [{ angle: 60, label: 'Pull 20 N' }, { angle: 120, label: 'R' }, { angle: 270, label: 'Weight' }], angles: [{ from: 30, to: 60 }] },
    parts: [{
      prompt: 'What is the acceleration direction, and how does the normal reaction compare with its value if the same pull acted directly uphill along the plane?',
      choices: ['Uphill, with a smaller normal reaction.', 'Downhill, with the same normal reaction.', 'Downhill, with a smaller normal reaction.', 'Downhill, with a greater normal reaction.'],
      answer: 2,
      feedback: ['Resolve the pull in two directions. The parallel component determines its contribution to acceleration, and the outward component changes the reaction.', '把拉力分解到两个方向。沿斜面分量影响加速度，垂直斜面向外的分量影响支持力。'],
      choiceFeedback: {
        0: ['Check the signed resultant. The uphill component of the pull is smaller than the downhill component of weight.', '检查带符号的合力。拉力向上的分量小于重力沿斜面向下的分量。'],
        1: ['An oblique pull has a component away from the plane. Include it when balancing perpendicular components.', '斜向拉力有一个垂直斜面向外的分量。列垂直方向的平衡方程时要计入它。'],
        3: ['The pull partly supports the block away from the plane. Check whether the plane has to provide more or less support.', '拉力有向外托起物体的作用。检查斜面需要提供的支持力是增大还是减小。'],
      },
    }],
    hint: ['The angle between the pull and the plane is labelled in the diagram. Use that angle for both pull components.', '图上标出了拉力与斜面之间的夹角。用这个角分解拉力的两个分量。'],
    steps: [
      { math: tex`4a=20\cos30^\circ-40\sin30^\circ`, en: 'The force component of the pull is uphill. The weight component is downhill.', zh: '拉力沿斜面的分量向上，重力沿斜面的分量向下。' },
      { math: tex`4a=10\sqrt{3}-20<0`, en: 'The resultant is downhill, so the block accelerates downhill while still sliding uphill.', zh: '合力沿斜面向下，因此物体仍向上滑时，加速度沿斜面向下。' },
      { math: tex`R+20\sin30^\circ=40\cos30^\circ`, en: 'The outward component of the pull helps balance the weight component into the plane.', zh: '拉力垂直斜面向外的分量，与支持力共同平衡重力垂直斜面向内的分量。' },
      { math: tex`R=(20\sqrt{3}-10)\,\mathrm N`, en: 'The normal reaction is 10 N smaller than with the parallel pull, which contributes no perpendicular component.', zh: '拉力若平行于斜面，垂直分量为零。因此现在的支持力比平行拉力时小 10 牛。' },
    ],
  },
]
