import type { MotionQuestion } from './m1-motion-types.ts'

const tex = String.raw

export const planarResultantQuestions: MotionQuestion[] = [
  {
    id: 'm1-planar-16',
    title: 'Find signed components and the magnitude of a resultant',
    prompt: 'The diagram shows three forces acting on a ring. Take rightwards and upwards as positive.',
    planarDiagram: {
      body: 'Ring', axesAngle: 0,
      forces: [{ angle: 0, label: '11 N' }, { angle: 180, label: '6 N' }, { angle: -90, label: '12 N' }],
    },
    parts: [{
      prompt: 'Find the signed horizontal component, signed vertical component and magnitude of the resultant, in that order. All values are in newtons.',
      choices: [
        '$+5$, $+12$, $13$',
        '$+5$, $-12$, $17$',
        '$+5$, $-12$, $13$',
        tex`$+17$, $-12$, $\sqrt{433}$`,
      ],
      answer: 2,
      feedback: ['Find the two signed components separately. Then combine the perpendicular components to find the magnitude.', '分别求出两个带符号的分量，再用两个互相垂直的分量求合力大小。'],
      choiceFeedback: {
        0: ['The force supplying the vertical component points downwards. Check its sign against the chosen axis.', '产生竖直分量的力向下。按选定的正方向检查它的符号。'],
        1: ['The components are correct. They act along perpendicular axes, so use Pythagoras to find the magnitude.', '两个分量正确。它们所在的坐标轴相互垂直，应使用勾股定理求合力大小。'],
        3: ['The two horizontal forces point in opposite directions. Their signed contributions have different signs.', '两个水平力的方向相反。它们的带符号分量应使用不同的符号。'],
      },
    }],
    hint: ['Add the rightward and leftward contributions along the horizontal axis. Treat the downward force separately.', '先沿水平方向把向右和向左的分量带符号相加，再单独处理向下的力。'],
    steps: [
      { math: tex`F_x=11-6=+5\,\mathrm N`, en: 'Subtract the leftward force from the rightward force.', zh: '用向右的力减去向左的力。' },
      { math: tex`F_y=-12\,\mathrm N`, en: 'The downward arrow gives a negative vertical component.', zh: '向下的箭头对应负的竖直分量。' },
      { math: tex`F=\sqrt{5^2+(-12)^2}=13\,\mathrm N`, en: 'The two components form the perpendicular sides of a right triangle.', zh: '两个分量构成直角三角形的两条直角边。' },
    ],
  },
  {
    id: 'm1-planar-17',
    title: 'Measure a resultant direction from due south',
    prompt: 'Take eastwards and northwards as the positive x and y directions. A resultant force has signed components $F_x=-4$ N and $F_y=-9$ N.',
    parts: [{
      prompt: 'Give the direction using the acute angle from a north–south axis. Round the angle to the nearest degree.',
      choices: ['66° west of south', '24° east of south', '24° west of north', '24° west of south'],
      answer: 3,
      feedback: ['Use the signs to locate the quadrant. Choose the adjacent side using the specified reference axis.', '根据分量符号确定象限，再按指定的参考轴选出邻边。'],
      choiceFeedback: {
        0: ['This is the angle from due west. The question measures the angle from a north–south axis.', '这是从正西量起的角。题目要求从南北方向的轴量起。'],
        1: ['The eastward component is negative. Check which side of the south direction contains the resultant.', '向东的分量是负数。检查合力在正南方向的哪一侧。'],
        2: ['The northward component is negative. The reference ray must be the one that gives an acute angle.', '向北的分量是负数。参考射线应选能与合力形成锐角的方向。'],
      },
    }],
    hint: ['Draw a right triangle in the southwest quadrant. For an angle measured from south, which length is opposite the angle?', '在西南象限画直角三角形。若角从正南量起，哪条边是这个角的对边？'],
    steps: [
      { math: tex`F_x=-4\,\mathrm N,\quad F_y=-9\,\mathrm N`, en: 'The resultant points westwards and southwards.', zh: '合力既向西又向南。' },
      { math: tex`\tan\theta=\frac{4}{9}`, en: 'From due south, the westward length 4 is opposite the angle and the southward length 9 is adjacent.', zh: '从正南量起，向西的长度 4 是对边，向南的长度 9 是邻边。' },
      { math: tex`\theta=\tan^{-1}(4/9)\approx24^\circ`, en: 'The direction is 24° west of south to the nearest degree.', zh: '取到最接近的整数度，方向为南偏西 24°。' },
    ],
  },
  {
    id: 'm1-planar-18',
    title: 'Identify an axial acceleration after one component cancels',
    prompt: 'A 2 kg puck starts from rest on a smooth horizontal table. The diagram is a view from above and shows all its horizontal forces. Positive x is east and positive y is north.',
    planarDiagram: {
      body: 'Top view', axesAngle: 0,
      forces: [{ angle: 60, label: '18 N' }, { angle: -90, label: '9√3 N' }, { angle: 180, label: '13 N' }],
      angles: [{ from: 0, to: 60 }],
    },
    parts: [{
      prompt: 'What is the magnitude and direction of the puck’s acceleration?',
      choices: ['2 m s⁻² due east', '2 m s⁻² due west', '4 m s⁻² due west', 'The acceleration is zero.'],
      answer: 1,
      feedback: ['Resolve the oblique force along the two axes. Find which component cancels before using the mass to determine the acceleration.', '沿两条轴分解斜向力。先确定哪个分量抵消，再结合质量求加速度。'],
      choiceFeedback: {
        0: ['Check which horizontal contribution is larger. The westward force must be subtracted from the eastward component.', '比较东西方向分量的大小。应从向东分量中减去向西的力。'],
        2: ['The magnitude of the westward resultant is 4 N. Use the mass to convert it to an acceleration.', '向西合力的大小为 4 牛。还要根据质量换算为加速度。'],
        3: ['The north and south contributions cancel. Check the east and west contributions separately.', '南北方向的分量抵消。还要单独检查东西方向的分量。'],
      },
    }],
    hint: ['The angle is measured from positive x. Resolve 18 N along x and y before adding the other two forces.', '角从 x 轴正向量起。先将 18 牛的力沿 x、y 轴分解，再加上另外两个力。'],
    steps: [
      { math: tex`F_y=18\sin60^\circ-9\sqrt3=0`, en: 'The oblique force has a northward component that cancels the southward force exactly.', zh: '斜向力的向北分量恰好与向南的力抵消。' },
      { math: tex`F_x=18\cos60^\circ-13=-4\,\mathrm N`, en: 'The 13 N westward force exceeds the eastward component of the oblique force.', zh: '13 牛的向西力大于斜向力的向东分量。' },
      { math: tex`a_x=\frac{-4}{2}=-2\,\mathrm{m\,s^{-2}}`, en: 'The acceleration has magnitude 2 m s⁻² and is due west.', zh: '加速度大小为 2 米每二次方秒，方向为正西。' },
    ],
  },
  {
    id: 'm1-planar-19',
    title: 'Separate an oblique push into the normal and motion equations',
    prompt: 'A 6 kg crate is sliding to the right along a horizontal floor and stays in contact with it. All the forces on the crate are shown. Take rightwards and upwards as positive and use $g=10$ m s⁻².',
    planarDiagram: {
      body: 'Crate', axesAngle: 0,
      forces: [{ angle: -30, label: '20 N' }, { angle: 180, label: '8 N' }, { angle: 90, label: 'R' }, { angle: -90, label: 'Weight' }],
      angles: [{ from: 0, to: -30 }],
    },
    parts: [{
      prompt: 'What values do you obtain for the normal reaction $R$ in newtons and the signed horizontal acceleration in m s⁻², respectively?',
      choices: [
        tex`$70$ and $\dfrac{10\sqrt3-8}{6}$`,
        tex`$50$ and $\dfrac{10\sqrt3-8}{6}$`,
        tex`$70$ and $\dfrac{10-8}{6}$`,
        tex`$70$ and $\dfrac{10\sqrt3+8}{6}$`,
      ],
      answer: 0,
      feedback: ['Use a separate equation for each direction. The vertical component of the push affects the normal reaction and the horizontal component affects the acceleration.', '分别对两个方向列方程。推力的竖直分量影响支持力，水平分量影响加速度。'],
      choiceFeedback: {
        1: ['The push has a downward component, so the support must balance an extra downward force.', '推力有向下分量，支持力还需要平衡这个额外的向下力。'],
        2: ['The marked angle is measured from the horizontal, so the horizontal projection is the adjacent side.', '所标角度从水平方向量起，所以水平投影对应邻边。'],
        3: ['The 8 N force points to the left. It has a negative horizontal component.', '8 牛的力向左，其水平分量为负。'],
      },
    }],
    hint: ['Resolve the 20 N push along and perpendicular to the floor. The vertical acceleration is zero.', '沿着地面及垂直于地面分解 20 牛的推力。竖直加速度为零。'],
    steps: [
      { math: tex`R-6(10)-20\sin30^\circ=0`, en: 'The weight and the vertical component of the push are both downward.', zh: '重力和推力的竖直分量均向下。' },
      { math: tex`R=60+10=\boxed{70\,\mathrm N}`, en: 'The reaction balances both downward contributions.', zh: '支持力平衡两个向下的分量。' },
      { math: tex`20\cos30^\circ-8=6a_x`, en: 'The rightward component of the push is reduced by the leftward force.', zh: '向右的推力分量减去向左的力。' },
      { math: tex`a_x=\frac{10\sqrt3-8}{6}\,\mathrm{m\,s^{-2}}`, en: 'This value is positive, so the acceleration is to the right.', zh: '结果为正，因此加速度向右。' },
    ],
  },
  {
    id: 'm1-planar-20',
    title: 'Infer a horizontal acceleration from a measured reaction',
    prompt: 'A 3 kg crate moves on a smooth horizontal floor. A rope of tension 13 N pulls it upwards and to the right at an unknown angle above the horizontal. The crate stays in contact with the floor and its normal reaction is 25 N. The rope, weight and normal reaction are the only forces. Take rightwards and upwards as positive and use $g=10$ m s⁻².',
    parts: [{
      prompt: 'Find the signed horizontal acceleration of the crate.',
      answer: 4,
      unit: 'm s⁻²',
      feedback: ['Use vertical balance to recover the upward component of the tension. Then recover its horizontal component from its given magnitude.', '利用竖直平衡求拉力的竖直分量，再利用已知的拉力大小求水平分量。'],
    }],
    hint: ['Start with the difference between the weight and the normal reaction. The components of the tension are the perpendicular sides of a right triangle.', '先求重力和支持力之差。拉力的两个分量是直角三角形的两条直角边。'],
    steps: [
      { math: tex`25+T_y-3(10)=0`, en: 'There is no vertical acceleration as the crate remains in contact with the floor.', zh: '木箱始终与地面接触，竖直加速度为零。' },
      { math: tex`T_y=30-25=5\,\mathrm N`, en: 'This is the upward component of the tension.', zh: '这是拉力向上的分量。' },
      { math: tex`T_x=\sqrt{13^2-5^2}=12\,\mathrm N`, en: 'Use the positive root because the rope pulls to the right.', zh: '拉力方向偏右，所以取正根。' },
      { math: tex`a_x=\frac{12}{3}=\boxed{4\,\mathrm{m\,s^{-2}}}`, en: 'The tension’s horizontal component is the only horizontal force.', zh: '拉力的水平分量是唯一的水平力。' },
    ],
  },
]
