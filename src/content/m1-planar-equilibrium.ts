import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const resolvingQuestions: MotionQuestion[] = [
  {
    id: 'm1-planar-01',
    title: 'Resolve a force measured from the vertical',
    prompt: 'The diagram shows a force on a particle. Use the angle marked between the force and the vertical axis.',
    planarDiagram: {
      axesAngle: 0, forces: [{ angle: 120, label: '20 N' }], angles: [{ from: 90, to: 120 }],
    },
    parts: [{
      prompt: 'What are the signed horizontal and vertical components of the force, respectively?',
      choices: [
        tex`$10\,\mathrm N$ and $10\sqrt3\,\mathrm N$`,
        tex`$-10\,\mathrm N$ and $10\sqrt3\,\mathrm N$`,
        tex`$-10\sqrt3\,\mathrm N$ and $10\,\mathrm N$`,
        tex`$-10\,\mathrm N$ and $-10\sqrt3\,\mathrm N$`,
      ],
      answer: 1,
      feedback: ['Check the axis the angle is measured from and the direction of each component.', '先确认角是从哪条轴量起的，再判断两个分量各自的方向。'],
      choiceFeedback: {
        0: ['The horizontal component points to the left of the origin. Use a sign that represents this direction.', '水平分量指向原点左侧。选择能表示这个方向的符号。'],
        2: ['The angle is measured from the vertical. Identify the adjacent side before selecting sine or cosine.', '该角从竖直轴量起。先找出邻边，再选择正弦或余弦。'],
        3: ['The force points above the horizontal axis. Check which sign represents a component pointing upwards.', '力的箭头指向水平轴上方。检查竖直向上的分量应该取什么符号。'],
      },
    }],
    hint: ['In the component triangle, the vertical side is adjacent to the marked angle. Read the signs from the force arrow.', '在分量三角形中，竖直边是所标角的邻边。根据力的箭头判断正负。'],
    steps: [
      { math: tex`F_x=-20\sin30^\circ=-10\,\mathrm N`, en: 'Use sine for the opposite side. The force has a leftward component.', zh: '对边用正弦。力的水平分量向左，因此取负。' },
      { math: tex`F_y=20\cos30^\circ=10\sqrt3\,\mathrm N`, en: 'Use cosine for the adjacent side. The vertical component points up.', zh: '邻边用余弦。竖直分量向上，因此取正。' },
    ],
  },
  {
    id: 'm1-planar-02',
    title: 'Determine both components of a balancing force',
    prompt: tex`A particle is acted on by a 16 N force directed at $30^\circ$ below the rightward horizontal, a 6 N force vertically upwards, and a third force $P$. The particle is in equilibrium. Take rightwards and upwards as positive.`,
    parts: [{
      prompt: 'Which pair gives the signed horizontal and vertical components of $P$, in that order?',
      choices: [
        tex`$8\sqrt3\,\mathrm N$ and $-2\,\mathrm N$`,
        tex`$-8\sqrt3\,\mathrm N$ and $-2\,\mathrm N$`,
        tex`$-8\,\mathrm N$ and $2\,\mathrm N$`,
        tex`$-8\sqrt3\,\mathrm N$ and $2\,\mathrm N$`,
      ],
      answer: 3,
      feedback: ['The third force cancels the combined components of the two given forces.', '第三个力的两个分量需要分别抵消前两个力在该方向上的合力。'],
      choiceFeedback: {
        0: ['These are the combined components of the first two forces. The balancing force has the opposite sign in each direction.', '这是前两个力的合力分量。平衡力在每个方向上的分量都应取相反符号。'],
        1: ['The downward component of the 16 N force exceeds the upward 6 N force. Which way must the remaining vertical component point?', '$16$ N 斜向力的竖直分量向下，且大于向上的 $6$ N。剩余的竖直分量应指向哪里？'],
        2: ['The angle is measured from the horizontal, so use the adjacent side for the horizontal component.', '该角从水平方向量起，所以水平分量对应邻边。'],
      },
    }],
    hint: ['Set the sum of horizontal components to zero. Then set the sum of vertical components to zero.', '先令水平方向的分量之和为零，再令竖直方向的分量之和为零。'],
    steps: [
      { math: tex`P_x+16\cos30^\circ=0`, en: 'The 6 N force has no horizontal component.', zh: '$6$ N 的力没有水平分量。' },
      { math: tex`P_x=-8\sqrt3\,\mathrm N`, en: 'The third force must act to the left in the horizontal direction.', zh: '第三个力的水平分量必须向左。' },
      { math: tex`P_y+6-16\sin30^\circ=0`, en: 'The vertical component of the 16 N force is downwards.', zh: '$16$ N 的力在竖直方向上的分量向下。' },
      { math: tex`P_y=8-6=2\,\mathrm N`, en: 'There must be a 2 N upward component to complete the balance.', zh: '还需一个向上的 $2$ N 分量才能平衡。' },
    ],
  },
  {
    id: 'm1-planar-03',
    title: 'Find a horizontal tension from a suspended load',
    prompt: 'A ring of negligible weight is in equilibrium. Two supporting strings exert tensions $H$ and $T$ as shown. The third arrow shows the downward force exerted by a suspended load.',
    planarDiagram: {
      axesAngle: 0,
      forces: [{ angle: 180, label: 'H' }, { angle: 60, label: 'T' }, { angle: 270, label: '18 N' }],
      angles: [{ from: 0, to: 60 }],
    },
    parts: [{
      prompt: 'What is the tension $H$ in the horizontal string?',
      choices: [
        tex`$18\sqrt3\,\mathrm N$`,
        tex`$18\,\mathrm N$`,
        tex`$6\sqrt3\,\mathrm N$`,
        tex`$9\,\mathrm N$`,
      ],
      answer: 2,
      feedback: ['Use vertical equilibrium first to find the slanted tension, then use horizontal equilibrium.', '先用竖直方向平衡求斜向张力，再用水平方向平衡求所需张力。'],
      choiceFeedback: {
        0: ['The quotient for the horizontal tension is cosine divided by sine. Check the order of the trigonometric factors.', '水平张力对应的比值是余弦除以正弦。检查三角函数因子的顺序。'],
        1: ['The 18 N force acts vertically. Find the horizontal component of the slanted tension to balance the horizontal string.', '$18$ N 的力竖直向下。要平衡水平细绳，需要求斜向张力的水平分量。'],
        3: ['The 18 N force is already vertical. Use it to find the full magnitude of $T$ before resolving $T$ horizontally.', '$18$ N 的力本身沿竖直方向。应先用它求出 $T$ 的大小，再分解 $T$ 的水平分量。'],
      },
    }],
    hint: ['The horizontal string contributes no vertical component. Only the slanted string supports the load vertically.', '水平细绳没有竖直分量。只有斜向细绳提供向上的分量。'],
    steps: [
      { math: tex`T\sin60^\circ=18`, en: 'Balance the upward component of $T$ against the vertical load.', zh: '用 $T$ 向上的分量平衡向下的拉力。' },
      { math: tex`T=\frac{18}{\sin60^\circ}=12\sqrt3\,\mathrm N`, en: 'Solve for the slanted tension.', zh: '求出斜向细绳的张力。' },
      { math: tex`H=T\cos60^\circ=6\sqrt3\,\mathrm N`, en: 'The horizontal string balances the rightward component of $T$.', zh: '水平细绳平衡 $T$ 向右的水平分量。' },
    ],
  },
  {
    id: 'm1-planar-04',
    title: 'Find the magnitude of an oblique balancing force',
    prompt: tex`A particle is in equilibrium under exactly three coplanar forces. A 25 N force acts above the rightward horizontal at an acute angle $\theta$, where $\cos\theta=3/5$ and $\sin\theta=4/5$. A second force of 12 N acts vertically downwards. Take rightwards and upwards as positive.`,
    parts: [{
      prompt: 'Find the magnitude of the third force.',
      answer: 17,
      unit: 'N',
      feedback: ['First combine the given forces component by component. Use both components to find the magnitude of the force that balances them.', '先分别合并两力的水平和竖直分量，再用两个分量求平衡力的大小。'],
    }],
    hint: ['Resolve the 25 N force. Subtract 12 N from its vertical component before finding the magnitude of the combined force.', '先分解 $25$ N 的力。求合力大小前，先在竖直分量中扣除 $12$ N。'],
    steps: [
      { math: tex`P_x=-25\left(\tfrac35\right)=-15\,\mathrm N`, en: 'The third force balances the rightward component of the 25 N force.', zh: '第三个力的水平分量平衡 $25$ N 的力向右的分量。' },
      { math: tex`P_y=12-25\left(\tfrac45\right)=-8\,\mathrm N`, en: 'The remaining vertical component must be downwards.', zh: '第三个力还需提供向下的竖直分量。' },
      { math: tex`P=\sqrt{15^2+8^2}=17\,\mathrm N`, en: 'Apply Pythagoras to the two perpendicular components.', zh: '用两个互相垂直的分量按勾股定理求力的大小。' },
    ],
  },
  {
    id: 'm1-planar-05',
    title: 'Select equilibrium equations without counting a force twice',
    prompt: tex`A ring is in equilibrium under three forces. A force of magnitude $P$ acts at $35^\circ$ above the rightward horizontal. A force of magnitude $H$ acts leftwards and a force of magnitude $W$ acts downwards.`,
    parts: [{
      prompt: 'Which pair of force equations models horizontal and vertical equilibrium?',
      choices: [
        tex`$P\cos35^\circ-H=0$ and $P\sin35^\circ-W=0$`,
        tex`$P\sin35^\circ-H=0$ and $P\cos35^\circ-W=0$`,
        tex`$P\cos35^\circ-H=0$ and $P+P\sin35^\circ-W=0$`,
        tex`$P-H=0$ and $P-W=0$`,
      ],
      answer: 0,
      feedback: ['Use one component of the slanted force in each equation. Check which component is adjacent to the angle.', '每条方程中只计入斜向力在该方向上的一个分量。检查哪个分量对应邻边。'],
      choiceFeedback: {
        1: ['The angle is measured above the horizontal. The horizontal component is adjacent to the marked angle.', '该角从水平轴量起，因此水平分量是邻边。'],
        2: ['The vertical component already accounts for the contribution of $P$ in the vertical equation. Adding $P$ again double counts the same force.', '竖直分量已经代表了 $P$ 在竖直方程中的贡献。再加 $P$ 会把同一个力算两次。'],
        3: ['$P$ is the magnitude of the whole slanted force. Each equation requires only its component in the chosen direction.', '$P$ 是整个斜向力的大小。每条方程只需要它在选定方向上的分量。'],
      },
    }],
    hint: [tex`The $35^\circ$ angle is between the force of magnitude $P$ and the horizontal axis.`, tex`$35^\circ$ 角位于大小为 $P$ 的力与水平轴之间。`],
    steps: [
      { math: tex`\sum F_x=P\cos35^\circ-H=0`, en: 'The horizontal component of $P$ points right and $H$ points left.', zh: '$P$ 的水平分量向右，$H$ 向左。' },
      { math: tex`\sum F_y=P\sin35^\circ-W=0`, en: 'The vertical component of $P$ points up and $W$ points down.', zh: '$P$ 的竖直分量向上，$W$ 向下。' },
    ],
  },
]

export const resolvingDirectionQuestions: MotionQuestion[] = [
  {
    id: 'm1-planar-06',
    title: 'Choose an axis that eliminates the normal reaction',
    prompt: 'A block is in equilibrium on a smooth plane, with the three forces shown. You want to write one force equation that contains the horizontal push $P$ and the weight $W$ but has no term involving the unknown reaction $R$.',
    planarDiagram: {
      slope: 25, forces: [{ angle: 0, label: 'P' }, { angle: 115, label: 'R' }, { angle: 270, label: 'W' }],
    },
    parts: [{
      prompt: 'Which direction should you resolve along to write that equation?',
      choices: ['Horizontally to the right.', 'Vertically upwards.', 'Up the slope, parallel to the plane.', 'Perpendicular to the plane and away from it.'],
      answer: 2,
      feedback: ['Choose a resolving direction perpendicular to the force you want to eliminate.', '要消去某个力，选择与该力垂直的分解方向。'],
      choiceFeedback: {
        0: ['$R$ is tilted away from the vertical on this slope. It therefore has a horizontal component.', '在这道斜面题中，$R$ 偏离竖直方向，因此有水平分量。'],
        1: ['$R$ has an upward component. It would still appear in a vertical equation.', '$R$ 有一个向上的分量，所以仍会出现在竖直方程中。'],
        3: ['This direction is parallel to $R$. The full reaction would appear in the equation.', '该方向与 $R$ 平行，整个支持力都会出现在方程中。'],
      },
    }],
    hint: ['The normal reaction is perpendicular to the surface. Which direction makes its projection zero?', '支持力垂直于接触面。沿哪个方向投影会得到零分量？'],
    steps: [
      { math: tex`R_\parallel=R\cos90^\circ=0`, en: 'Resolve uphill along the plane. The reaction is perpendicular to this axis.', zh: '沿斜面向上分解受力。支持力与这条轴垂直。' },
      { math: tex`P\cos25^\circ-W\sin25^\circ=0`, en: 'Only the along-plane components of the push and weight are needed.', zh: '只需计入推力和重力沿斜面的分量。' },
    ],
  },
  {
    id: 'm1-planar-07',
    title: 'Compare the normal reactions for two directions of push',
    prompt: tex`A block of weight 24 N is held in equilibrium on a smooth plane inclined at $45^\circ$ to the horizontal. In trial 1 a horizontal push to the right holds the block. In trial 2 a push directly up the plane holds it. The plane rises to the right. Denote the normal reactions by $R_1$ and $R_2$.`,
    workedPlanarDiagram: {
      body: 'Trial 1', slope: 45, axesAngle: 0,
      forces: [{ angle: 0, label: 'Push' }, { angle: 135, label: 'R₁' }, { angle: 270, label: '24 N' }],
    },
    parts: [{
      prompt: 'What is the ratio $R_1:R_2$?',
      choices: ['$2:1$', '$1:2$', '$1:1$', tex`$\sqrt2:1$`],
      answer: 0,
      feedback: ['Resolve perpendicular to the plane. The horizontal push contributes a component into the plane.', '沿垂直斜面的方向列式。水平推力有一个指向斜面内侧的分量。'],
      choiceFeedback: {
        1: ['The horizontal push presses into the plane. Check which trial needs the larger normal reaction.', '水平推力朝斜面内侧挤压。检查哪个情形需要更大的支持力。'],
        2: ['The two pushes are in different directions. Only one of them has a nonzero component perpendicular to the plane.', '两次推力方向不同，其中只有一次的推力在垂直斜面方向上有分量。'],
        3: ['Compare the two normal reactions. The weight of 24 N is a separate quantity and is not the reaction in trial 2.', '应比较两次的支持力。$24$ N 是重力大小，并非第二次的支持力。'],
      },
    }],
    hint: ['In trial 1, resolve vertically to eliminate the horizontal push. In trial 2, resolve perpendicular to the plane to eliminate the push.', '第一次沿竖直方向分解以消去水平推力，第二次沿垂直斜面方向分解以消去推力。'],
    steps: [
      { math: tex`R_1\cos45^\circ=24`, en: 'Trial 1. The push has no vertical component, so the vertical component of the reaction balances the weight.', zh: '第一次。水平推力没有竖直分量，因此支持力的竖直分量平衡重力。' },
      { math: tex`R_1=24\sqrt2\,\mathrm N`, en: 'Divide by the cosine of the angle from the upward vertical to the reaction.', zh: '除以支持力与竖直向上方向夹角的余弦。' },
      { math: tex`R_2=24\cos45^\circ=12\sqrt2\,\mathrm N`, en: 'Trial 2. The push is parallel to the plane, so it contributes nothing to the normal equation.', zh: '第二次。推力平行于斜面，因此不参与垂直斜面方向的方程。' },
      { math: tex`R_1:R_2=24\sqrt2:12\sqrt2=2:1`, en: 'Compare the two reaction magnitudes.', zh: '比较两次支持力的大小。' },
    ],
  },
  {
    id: 'm1-planar-08',
    title: 'Find the reaction when an extra normal force acts',
    prompt: tex`A 4 kg block is held in equilibrium in contact with a smooth plane inclined at $60^\circ$ to the horizontal. A string pulls directly up the plane. An additional 12 N force acts perpendicular to the plane, away from it. Take $g=10\,\mathrm{m\,s^{-2}}$.`,
    parts: [{
      prompt: 'Find the magnitude of the normal reaction of the plane on the block.',
      answer: 8,
      unit: 'N',
      feedback: ['Resolve perpendicular to the plane. The normal reaction and the 12 N force both act away from the plane.', '沿垂直斜面的方向列式。支持力与 $12$ N 的外力都指向斜面外侧。'],
    }],
    hint: ['The string acts along the plane. Which part of the weight balances the two forces acting away from the plane?', '细绳平行于斜面。重力的哪个分量平衡两个指向斜面外侧的力？'],
    steps: [
      { math: tex`W=4(10)=40\,\mathrm N`, en: 'The full weight acts vertically downwards.', zh: '整个重力竖直向下。' },
      { math: tex`R+12=40\cos60^\circ`, en: 'The block has zero acceleration normal to the plane. The string has zero component in this direction.', zh: '物块在垂直斜面方向上的加速度为零。沿斜面张力在这个方向上的分量为零。' },
      { math: tex`R=20-12=8\,\mathrm N`, en: 'The applied force supplies part of the outward force. The calculated reaction is positive, consistent with contact.', zh: '外力已提供了一部分向外的力。求得的支持力为正，符合保持接触的条件。' },
    ],
  },
  {
    id: 'm1-planar-09',
    title: 'Resolve with the positive axis pointing downhill',
    prompt: 'The diagram shows a horizontal force of magnitude $P$ acting to the left on a block. The $x$-axis is along the plane and points downhill. The $y$-axis points away from the plane.',
    planarDiagram: {
      slope: -30, axesAngle: -30, forces: [{ angle: 180, label: 'P' }],
    },
    parts: [{
      prompt: 'What are the signed $x$- and $y$-components of this horizontal force, respectively?',
      choices: [
        tex`$P\cos30^\circ$ and $P\sin30^\circ$`,
        tex`$-P\cos30^\circ$ and $-P\sin30^\circ$`,
        tex`$-P\cos30^\circ$ and $P\sin30^\circ$`,
        tex`$-P\sin30^\circ$ and $-P\cos30^\circ$`,
      ],
      answer: 1,
      feedback: ['Use the axes in the diagram. Decide whether the force acts uphill or downhill, and into or away from the plane.', '使用图中给出的坐标轴。分别判断力沿斜面向上还是向下、指向斜面内侧还是外侧。'],
      choiceFeedback: {
        0: ['Both signs are reversed. The two axis arrowheads mark the positive directions.', '两个符号都反了。两个坐标轴的箭头标出各自的正方向。'],
        2: ['The negative $x$-component is correct. Find whether the leftward force has a projection into or away from the plane.', '$x$ 分量确实为负。再判断向左的力沿法向的分量是指向斜面内侧还是外侧。'],
        3: ['The leftward horizontal direction is closer to the uphill direction than to the normal. Check which component uses cosine.', '水平向左更接近沿斜面向上的方向。检查哪个分量对应余弦。'],
      },
    }],
    hint: ['The direction uphill is opposite the positive $x$-axis. Compare the force with that uphill direction first.', '沿斜面向上与 $x$ 轴正方向相反。先将力的方向与沿斜面向上比较。'],
    steps: [
      { math: tex`P_x=-P\cos30^\circ`, en: 'The angle between the leftward horizontal and the uphill direction is 30°. Uphill is negative $x$.', zh: '水平向左与沿斜面向上的夹角为 30°。沿斜面向上是 $x$ 轴的负方向。' },
      { math: tex`P_y=-P\sin30^\circ`, en: 'The normal component of the leftward force points into the plane, opposite the positive $y$-axis.', zh: '向左的力在法向的分量指向斜面内侧，与 $y$ 轴正方向相反。' },
    ],
  },
  {
    id: 'm1-planar-10',
    title: 'Find the limiting horizontal pull for contact',
    prompt: 'A block is in equilibrium on a smooth plane that rises to the right. The diagram shows a string pulling up the plane and an adjustable horizontal force of magnitude $P$ pulling to the left. The string can be adjusted to keep equilibrium.',
    planarDiagram: {
      slope: 45,
      forces: [{ angle: 45, label: 'T' }, { angle: 135, label: 'R' }, { angle: 180, label: 'P' }, { angle: 270, label: '20 N' }],
    },
    parts: [{
      prompt: 'What is the greatest value of $P$ consistent with contact, including the limiting case of zero reaction?',
      choices: [tex`$10\sqrt2\,\mathrm N$`, tex`$20\sqrt2\,\mathrm N$`, 'There is no upper limit.', '$20$ N'],
      answer: 3,
      feedback: ['The surface can push the block away but cannot pull it in. Set the normal reaction to zero to find the limit.', '斜面只能推开物块，不能拉住物块。令支持力为零即可求出极限值。'],
      choiceFeedback: {
        0: ['This is the magnitude of the normal component of weight. Use the normal component of $P$ as well.', '这是重力垂直于斜面的分量大小。还需要用 $P$ 在垂直斜面方向上的分量。'],
        1: ['Use the normal components of both forces. The full weight is vertical, so only its projection acts into the plane.', '需要用两个力的法向分量。重力竖直向下，指向斜面内侧的只是它的投影。'],
        2: ['The horizontal pull has an outward component. If that component were too large, the equation would require a negative reaction.', '水平拉力有指向斜面外侧的分量。若该分量过大，方程将要求支持力为负。'],
      },
    }],
    hint: ['Resolve perpendicular to the plane. The string does not enter this equation. What is the lowest possible reaction?', '沿垂直斜面的方向分解。细绳张力不参与此方程。支持力的最小可能值是多少？'],
    steps: [
      { math: tex`R+P\sin45^\circ=20\cos45^\circ`, en: 'The leftward pull has an outward component. The weight has a component into the plane.', zh: '向左的拉力有一个向外的分量。重力有一个指向斜面内侧的分量。' },
      { math: tex`R=\frac{20-P}{\sqrt2}\ge0`, en: 'For contact, the plane can exert a nonnegative reaction.', zh: '保持接触时，斜面对物块的支持力不能为负。' },
      { math: tex`P\le20\,\mathrm N`, en: 'The maximum is 20 N, attained at zero reaction. The string can still provide the required uphill tension.', zh: '最大值是 $20$ N，此时支持力为零。细绳仍可提供所需的沿斜面向上的张力。' },
    ],
  },
]
