import type { MotionQuestion } from './m1-motion-types.ts'

const latex = String.raw
const speed = 'm s⁻¹'

export const motionBasics: MotionQuestion[] = [
  {
    id: 'm1-motion-01',
    title: 'Choose the direction of motion',
    prompt: 'The diagram shows two positions on an east–west track. A trolley moves directly from $P$ to $Q$.',
    plot: {
      kind: 'line',
      ticks: [-4, -3, -2, -1, 0, 1, 2, 3],
      markers: [{ label: 'P', position: -3 }, { label: 'Q', position: 2 }],
      positiveLabel: 'East →',
    },
    parts: [{
      prompt: 'In which direction does the trolley move?',
      choices: ['East', 'West'],
      answer: 0,
      feedback: [
        'Read the positions in the order $P$, then $Q$. The sign of the starting position alone does not tell you which way the trolley moves.',
        '按先 $P$ 后 $Q$ 的顺序读位置。起点的位置带负号，单凭这一点无法判断运动方向。',
      ],
    }],
    hint: ['Compare the two positions with the arrow for the positive direction.', '比较两个位置，并留意正方向箭头。'],
    steps: [{
      math: latex`x_Q-x_P=2-(-3)=+5\,\mathrm{m}`,
      en: 'The position increases from $-3$ m to $2$ m, so the trolley moves in the positive direction, east.',
      zh: '位置从 $-3$ m 增大到 $2$ m，所以小车沿正方向向东运动。',
    }],
  },
  {
    id: 'm1-motion-02',
    title: 'Find a signed displacement',
    prompt: 'A robot travels along a straight track from $P$ to $Q$. The diagram uses a fixed origin.',
    plot: {
      kind: 'line',
      ticks: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
      markers: [{ label: 'P', position: 4 }, { label: 'Q', position: -5 }],
    },
    parts: [{
      prompt: 'Find the displacement from $P$ to $Q$.',
      answer: -9,
      unit: 'm',
      feedback: [
        'Use final position minus initial position. Keep the sign of the result to show the direction of the displacement.',
        '用末位置减去初位置，并保留结果的正负号，以表示位移的方向。',
      ],
    }],
    hint: ['Read the coordinate of $Q$ first, then the coordinate of $P$.', '先读出 $Q$ 的坐标，再读出 $P$ 的坐标。'],
    steps: [{
      math: latex`\Delta s=x_Q-x_P=-5-4=-9\,\mathrm{m}`,
      en: 'The negative sign means the final position is 9 m from the start in the negative direction.',
      zh: '负号表示终点位于起点的负方向一侧，相距 9 m。',
    }],
  },
  {
    id: 'm1-motion-03',
    title: 'One outward leg and one return leg',
    prompt: 'A runner goes straight from $A$ to $B$, changes direction at $B$, and goes straight to $C$. Read the positions from the diagram.',
    plot: {
      kind: 'line',
      ticks: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7],
      markers: [{ label: 'A', position: -2 }, { label: 'B', position: 6 }, { label: 'C', position: 1 }],
    },
    parts: [{
      prompt: 'Find the total distance travelled.',
      answer: 13,
      unit: 'm',
      feedback: [
        'The runner travels some of the track twice. Add the lengths of $AB$ and $BC$ instead of comparing only $A$ and $C$.',
        '跑者有一段路走了两次。把 $AB$ 和 $BC$ 的长度相加。',
      ],
    }, {
      prompt: 'Find the displacement for the whole journey.',
      answer: 3,
      unit: 'm',
      feedback: [
        'The overall displacement depends on where the runner starts and finishes. The negative return leg partly cancels the positive outward leg.',
        '总位移由初位置和末位置决定。返回一段的位移为负，抵消了去程的部分位移。',
      ],
    }],
    hint: [
      'For distance, measure the two legs separately. For displacement, compare the start and finish.',
      '求路程时分别量出两段长度。求位移时比较初位置和末位置。',
    ],
    steps: [
      {
        math: latex`AB=|6-(-2)|=8\,\mathrm{m}`,
        en: 'The first leg is the separation from $A$ to $B$.',
        zh: '第一段路程是 $A$、$B$ 两个位置之间的距离。',
      },
      {
        math: latex`BC=|1-6|=5\,\mathrm{m}`,
        en: 'The return leg contributes another 5 m of distance.',
        zh: '折返后又走了 5 m，计入总路程。',
      },
      {
        math: latex`AB+BC=8+5=13\,\mathrm{m}`,
        en: 'Add the two lengths to find the total distance travelled.',
        zh: '两段的长度相加，得到总路程。',
      },
      {
        math: latex`\Delta s=1-(-2)=+3\,\mathrm{m}`,
        en: 'The finish is 3 m from the start in the positive direction.',
        zh: '终点位于起点的正方向一侧，相距 3 m。',
      },
    ],
  },
  {
    id: 'm1-motion-04',
    title: 'Average speed and average velocity',
    prompt: 'A cyclist travels 18 m east in 6 s, then 8 m west in 4 s along the same straight road. Take east as positive.',
    parts: [{
      prompt: 'Find the average speed for the whole journey.',
      answer: 2.6,
      unit: speed,
      feedback: [
        'Both legs contribute to the distance. Divide their combined length by the total time.',
        '两段运动都计入总路程。用两段长度之和除以总用时。',
      ],
    }, {
      prompt: 'Find the average velocity for the whole journey.',
      answer: 1,
      unit: speed,
      feedback: [
        'The westward leg has negative displacement. Use the net displacement over the total time.',
        '向西一段的位移为负。用总位移除以总用时。',
      ],
    }],
    hint: [
      'Write down the total time, total distance and signed displacement separately.',
      '分别写出总时间、总路程和带符号的总位移。',
    ],
    steps: [
      {
        math: latex`\Delta t=6+4=10\,\mathrm{s}`,
        en: 'Both legs are within the time interval being averaged.',
        zh: '计算全程平均量，时间要计入两段。',
      },
      {
        math: latex`\frac{18+8}{10}=2.6\,\mathrm{m\,s^{-1}}`,
        en: 'Average speed uses the total distance of 26 m.',
        zh: '平均速率的分子是总路程 26 m。',
      },
      {
        math: latex`\frac{18-8}{10}=+1\,\mathrm{m\,s^{-1}}`,
        en: 'Average velocity uses the displacement of $+10$ m. The positive sign indicates east.',
        zh: '平均速度的分子是总位移 $+10$ m。正号表示向东。',
      },
    ],
  },
]

const candidateTimes = [0, 1, 2, 3, 4, 5]
const candidatePositions = [-2, 0, 2, 4, 6, 8, 10]

export const motionDisplacement: MotionQuestion[] = [
  {
    id: 'm1-motion-05',
    title: 'Read a position and a rest interval',
    prompt: 'The displacement–time graph shows the motion of a carriage on a straight track.',
    plot: { kind: 's', points: [[0, 2], [2, 6], [5, 6], [6, 8]], tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [0, 2, 4, 6, 8] },
    parts: [{
      prompt: 'Read the position at $t=1$.',
      answer: 4,
      unit: 'm',
      feedback: ['Trace up from 1 second to the line, then across to the position axis.', '从横轴上的 1 秒向上找到图线，再水平读出纵轴上的位置。'],
    }, {
      prompt: 'For how long is the carriage at rest?',
      answer: 3,
      unit: 's',
      feedback: [
        'At rest, the position stays constant. Find the time difference between the two ends of the horizontal segment.',
        '静止时位置不变。用水平线段右端的时刻减去左端的时刻。',
      ],
    }],
    hint: ['Look for the only interval where the position does not change.', '找出位置保持不变的时间段。'],
    steps: [
      {
        math: latex`s(1)=4\,\mathrm{m}`,
        en: 'Read the vertical coordinate of the line at $t=1$.',
        zh: '在 $t=1$ 处读出图线的纵坐标。',
      },
      {
        math: latex`\Delta t=5-2=3\,\mathrm{s}`,
        en: 'The horizontal segment from $t=2$ to $t=5$ has zero gradient, so the carriage is at rest throughout it.',
        zh: '$t=2$ 到 $t=5$ 之间的线段斜率为零，小车在这段时间内一直静止。',
      },
    ],
  },
  {
    id: 'm1-motion-06',
    title: 'Pass through the origin',
    prompt: 'The displacement–time graph shows a particle moving past a fixed origin.',
    plot: {
      kind: 's',
      points: [[0, 6], [6, -6]], tTicks: [0, 1, 2, 3, 4, 5, 6], yTicks: [-6, -4, -2, 0, 2, 4, 6],
    },
    parts: [{
      prompt: 'When does the particle pass through the origin?',
      answer: 3,
      unit: 's',
      feedback: ['The origin of the track is where $s=0$. Read the time coordinate of that crossing.', '轨道原点对应 $s=0$。找到该交点并读出横坐标。'],
    }, {
      prompt: 'What happens to the direction at that instant?',
      choices: ['It continues in the negative direction.', 'It reverses into the positive direction.', 'It stops and remains at rest.'],
      answer: 0,
      feedback: [
        'A crossing of $s=0$ gives the position at that instant. The sign of the gradient tells you the direction on either side.',
        '经过 $s=0$ 说明这一刻在原点。判断经过原点前后的运动方向，要看斜率的正负。',
      ],
    }],
    hint: ['Compare the gradients just before and just after the line crosses $s=0$.', '比较图线穿过 $s=0$ 前后的斜率。'],
    steps: [
      {
        math: latex`s(3)=0\,\mathrm{m}\quad\Rightarrow\quad t=3\,\mathrm{s}`,
        en: 'The line meets the time axis at 3 seconds.',
        zh: '图线与时间轴在 3 秒处相交。',
      },
      {
        math: latex`v=\frac{-6-6}{6-0}=-2\,\mathrm{m\,s^{-1}}`,
        en: 'The same straight segment slopes down before and after the crossing. The particle continues in the negative direction.',
        zh: '交点前后属于同一条向下倾斜的直线，粒子一直沿负方向运动。',
      },
    ],
  },
  {
    id: 'm1-motion-07',
    title: 'Find a turning point',
    prompt: 'A cart moves along a straight rail. Its displacement–time graph consists of two straight segments.',
    plot: {
      kind: 's',
      points: [[0, 3], [3, 9], [5, 3]], tTicks: [0, 1, 2, 3, 4, 5], yTicks: [0, 3, 6, 9],
    },
    parts: [{
      prompt: 'At what time does the cart change direction?',
      answer: 3,
      unit: 's',
      feedback: [
        'Look for the time when the gradient switches from positive to negative. Compare motion on either side of the corner.',
        '找出斜率由正变负的时刻。观察折点左右两侧的运动方向。',
      ],
    }, {
      prompt: 'Find the position at which the cart changes direction.',
      answer: 9,
      unit: 'm',
      feedback: [
        'Read the position at the corner where the slope changes sign. The cart can turn at a position other than zero.',
        '读出斜率变号的折点的纵坐标。小车可以在原点以外的位置折返。',
      ],
    }],
    hint: ['Find where an upward segment meets a downward segment.', '找出上升线段与下降线段的连接点。'],
    steps: [
      {
        math: latex`v_{\mathrm{before}}=\frac{9-3}{3-0}=+2\,\mathrm{m\,s^{-1}}`,
        en: 'Before the corner the cart moves in the positive direction.',
        zh: '折点之前，小车沿正方向运动。',
      },
      {
        math: latex`v_{\mathrm{after}}=\frac{3-9}{5-3}=-3\,\mathrm{m\,s^{-1}}`,
        en: 'After the corner the cart moves in the negative direction.',
        zh: '折点之后，小车沿负方向运动。',
      },
      {
        math: latex`t=3\,\mathrm{s},\qquad s=9\,\mathrm{m}`,
        en: 'The opposite signs show a reversal, so read the time and position at the corner.',
        zh: '斜率变号说明小车折返。读出折点的时间和位置。',
      },
    ],
  },
  {
    id: 'm1-motion-08',
    title: 'Compare speeds using gradients',
    prompt: 'A particle has the displacement–time graph shown. Compare its speeds during the first and final moving segments.',
    plot: {
      kind: 's',
      points: [[0, -4], [4, 4], [5, 4], [7, -2]], tTicks: [0, 1, 2, 3, 4, 5, 6, 7], yTicks: [-4, -2, 0, 2, 4, 6],
    },
    parts: [{
      prompt: 'During which segment is the particle faster?',
      choices: ['The first moving segment', 'The final moving segment', 'The speeds are equal.'],
      answer: 1,
      feedback: [
        'Compare the magnitudes of the gradients. A smaller change in position can occur in a much shorter time.',
        '比较两段斜率的绝对值。即使位置变化量的绝对值较小，用时短得多也可能使速率更大。',
      ],
    }],
    hint: [
      'For each segment, divide the magnitude of the change in position by the elapsed time.',
      '分别用每段位置变化量的绝对值除以这一段所用的时间。',
    ],
    steps: [
      {
        math: latex`v_1=\frac{4-(-4)}{4-0}=+2\,\mathrm{m\,s^{-1}}`,
        en: 'The first segment has a positive gradient.',
        zh: '第一段斜率为正。',
      },
      {
        math: latex`v_2=\frac{-2-4}{7-5}=-3\,\mathrm{m\,s^{-1}}`,
        en: 'The final segment slopes down more steeply.',
        zh: '最后一段向下倾斜，且更陡。',
      },
      {
        math: latex`|v_2|=3\,\mathrm{m\,s^{-1}}>2\,\mathrm{m\,s^{-1}}=|v_1|`,
        en: 'The final segment has the greater speed. The negative velocity indicates the direction.',
        zh: '最后一段的速率更大。速度为负表示沿负方向运动。',
      },
    ],
  },
  {
    id: 'm1-motion-09',
    title: 'Calculate velocity from a gradient',
    prompt: 'The displacement–time graph shows a cart travelling along a straight rail.',
    plot: {
      kind: 's',
      points: [[0, 6], [2, 4], [6, -4], [8, -4]],
      tTicks: [0, 1, 2, 3, 4, 5, 6, 7, 8], yTicks: [-4, -2, 0, 2, 4, 6],
      analysis: { gradient: [2, 6] },
    },
    parts: [{
      prompt: 'Find the velocity during the interval from $t=2$ to $t=6$.',
      answer: -2,
      unit: speed,
      feedback: [
        'Subtract the initial position from the final position, and divide by the elapsed time. A downward slope gives negative velocity.',
        '用末位置减去初位置，再除以所用时间。向下倾斜的图线对应负速度。',
      ],
    }],
    hint: ['Read the positions at both times before finding the gradient.', '先读出两个时刻对应的位置，再求斜率。'],
    steps: [
      {
        math: latex`\Delta s=-4-4=-8\,\mathrm{m}`,
        en: 'At 2 s the position is 4 m. At 6 s the position is $-4$ m.',
        zh: '2 秒时位置为 4 m，6 秒时位置为 $-4$ m。',
      },
      {
        math: latex`v=\frac{\Delta s}{\Delta t}=\frac{-8}{6-2}=-2\,\mathrm{m\,s^{-1}}`,
        en: 'The gradient gives the velocity. The negative sign indicates motion in the negative direction.',
        zh: '斜率等于速度。负号表示小车沿负方向运动。',
      },
    ],
  },
  {
    id: 'm1-motion-10',
    title: 'Choose a graph from a motion description',
    prompt: 'A particle is at rest 4 m from the origin in the positive direction for the first 2 s. It then moves at constant velocity and reaches $s=-2$ m at $t=5$ s.',
    candidates: [
      { kind: 's', points: [[0, 0], [2, 0], [5, -2]], tTicks: candidateTimes, yTicks: candidatePositions },
      { kind: 's', points: [[0, 4], [2, 4], [5, -2]], tTicks: candidateTimes, yTicks: candidatePositions },
      { kind: 's', points: [[0, 4], [2, -2], [5, -2]], tTicks: candidateTimes, yTicks: candidatePositions },
      { kind: 's', points: [[0, 4], [2, 4], [5, 10]], tTicks: candidateTimes, yTicks: candidatePositions },
    ],
    parts: [{
      prompt: 'Which displacement–time graph represents the motion?',
      choices: ['Graph A', 'Graph B', 'Graph C', 'Graph D'],
      answer: 1,
      feedback: [
        'At rest, the position stays at 4 m. After 2 s the graph needs a constant negative gradient to reach the final position.',
        '静止时位置保持在 4 m。2 秒之后要到达负的末位置，图线必须保持恒定的负斜率。',
      ],
    }],
    hint: ['Check the height of the first segment, then the slope and endpoint of the second segment.', '先看第一段的高度，再看第二段的斜率和终点。'],
    steps: [
      {
        math: latex`s=4\,\mathrm{m}\quad(0\le t\le2)`,
        en: 'The graph is horizontal for the first 2 s at the given position of 4 m.',
        zh: '前 2 秒静止，所以图线在 4 m 处水平。',
      },
      {
        math: latex`v=\frac{-2-4}{5-2}=-2\,\mathrm{m\,s^{-1}}`,
        en: 'The second segment is a straight line with negative gradient and ends at $(5,-2)$.',
        zh: '第二段斜率恒定且为负，是一条向下倾斜的线段，终点为 $(5,-2)$。',
      },
      {
        math: latex`\boxed{\text{Graph B}}`,
        en: 'Graph B combines the correct rest interval with the correct moving segment.',
        zh: '图 B 的静止时间段、运动方向和末位置都与描述一致。',
      },
    ],
  },
]
