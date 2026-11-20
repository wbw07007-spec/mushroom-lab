import type { Exercise, Task } from './questions'

type Step = Omit<Task, 'id' | 'difficulty'>
const circle = 'Find a circle equation'
const tangent = 'Use a radius and tangent'
const intersection = 'Find intersections'
const bisector = 'Use a perpendicular bisector'
const numeric = (skill: string, prompt: string, correct: number, solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'number', correct }, solution, misconception })
const choice = (skill: string, prompt: string, choices: [string, string, string, string], correct: number, solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'single', choices: choices.map(item => '$' + item + '$'), correct: [correct] }, solution, misconception })
function exercise(position: number, title: string, context: string, steps: Step[]): Exercise {
  const id = 'p1-cg-' + String(position).padStart(2, '0')
  return { id, title, context, tasks: steps.map((step, index) => ({ ...step, id: id + '-' + (index + 1), difficulty: 'standard' })) }
}

export const coordinateGeometry: Exercise[] = [
  exercise(1, 'Translate a circle and find its common chord', 'A diameter of $C_1$ has endpoints $(-2,-2)$ and $(4,6)$. Translate $C_1$ by $\\binom{4}{2}$ to obtain $C_2$. The circles meet at $R$ and $S$.', [
    choice(circle, 'Choose the equation of $C_1$.', ['(x-1)^2+(y-2)^2=100','(x-1)^2+(y-2)^2=25','(x+1)^2+(y+2)^2=25','(x-1)^2+(y-2)^2=5'], 1,
      'The centre is the midpoint $(1,2)$. The squared radius is $(4-1)^2+(6-2)^2=25$.', 'Use half the diameter and put the squared radius on the right.'),
    choice(circle, 'Choose the equation of $C_2$.', ['(x-5)^2+(y-4)^2=25','(x+3)^2+y^2=25','(x-3)^2+(y-6)^2=25','(x-5)^2+(y-4)^2=29'], 0,
      'Add $\\binom{4}{2}$ to the centre coordinates. Translation preserves the radius.', 'Translate the centre without changing the radius.'),
    choice(bisector, 'Choose the equation of the line $RS$.', ['y=2x-3','y=-2x+7','y=-2x+9','y=-x/2+9'], 2,
      'Both common points are equally distant from the centres. The midpoint of the centres is $(3,3)$ and the line between them has gradient $1/2$. The perpendicular bisector is $y-3=-2(x-3)$. Equivalently, subtract the two circle equations.', 'Use the midpoint of the centres and the negative reciprocal gradient.'),
    choice(intersection, 'Choose the equation satisfied by the two intersection abscissae.', ['5x^2-30x+50=0','3x^2-30x+25=0','5x^2-20x+25=0','5x^2-30x+25=0'], 3,
      'Substitute $y=9-2x$ into $C_1$. Expand $(x-1)^2+(7-2x)^2=25$ and collect terms.', 'Subtract the original centre ordinate before squaring.'),
  ]),
  exercise(2, 'Reflect a circle in a tangent', 'Points $A(-1,-3)$ and $B(5,5)$ are the endpoints of a diameter of $C$. The line $T$ is tangent at $B$.', [
    choice(circle, 'Choose the equation of $C$.', ['(x-2)^2+(y-1)^2=25','(x-2)^2+(y-1)^2=100','(x+2)^2+(y+1)^2=25','(x-5)^2+(y-5)^2=25'], 0,
      'The centre is $M=(2,1)$. Then $MB^2=3^2+4^2=25$.', 'The endpoint of a diameter lies on the circle.'),
    numeric(tangent, 'Enter the gradient of $T$.', -3/4, 'The radius $MB$ has gradient $4/3$. The tangent is perpendicular to this radius, so its gradient is $-3/4$.', 'Take the negative reciprocal of the radius gradient.'),
    choice(tangent, 'Choose the equation of $T$.', ['3x+4y=21','4x+3y=35','3x+4y=35','3x-4y=-5'], 2,
      'Use the point of contact: $y-5=-\\frac34(x-5)$. Multiply through by 4 and rearrange.', 'Use the point of contact as the point on the tangent.'),
    choice(circle, 'Choose the equation of the reflected circle.', ['(x-5)^2+(y-5)^2=25','(x-8)^2+(y-9)^2=25','(x-8)^2+(y-9)^2=100','(x-9)^2+(y-8)^2=25'], 1,
      '$MB$ is perpendicular to the mirror line and $B$ is fixed. Thus $B$ is the midpoint of $M$ and its image $(8,9)$. Reflection preserves the radius.', 'Reflect the centre across the tangent through the point of contact.'),
  ]),
  exercise(3, 'Find where two tangents intersect', 'A circle has equation $x^2+y^2-4x+2y-20=0$. Point $P=(-2,2)$ lies on it. The horizontal chord through $P$ meets the circle again at $Q$.', [
    choice(circle, 'Choose the centre and radius.', ['(2,1),\\ r=5','(-2,1),\\ r=5','(2,-1),\\ r=25','(2,-1),\\ r=5'], 3,
      'Completing both squares gives $(x-2)^2+(y+1)^2=25$.', 'Read the signs of the centre coordinates from the squared brackets.'),
    choice(tangent, 'Choose the tangent at $P$.', ['3y=-4x+14','3y=4x+14','4y=3x+14','3y=4x-2'], 1,
      'The radius from $(2,-1)$ to $P$ has gradient $-3/4$. The tangent gradient is $4/3$, so $y-2=\\frac43(x+2)$.', 'The radius and tangent have different gradients.'),
    numeric(intersection, 'Enter the $x$-coordinate of $Q$.', 6, 'Reflect $P$ across the vertical diameter $x=2$. The ordinate stays at 2 and the abscissa becomes 6.', 'Use the circle centre as the axis of symmetry for the horizontal chord.'),
    choice(intersection, 'Find the intersection of the tangents at $P$ and $Q$.', ['(2,22/3)','(2,14/3)','(0,14/3)','(6,22/3)'], 0,
      'Reflection swaps the two tangent lines, so their intersection lies on $x=2$. Substitute into $3y=4x+14$ to get $y=22/3$.', 'The symmetry line gives the abscissa; use either tangent to find the ordinate.'),
  ]),
  exercise(4, 'Find a circle whose centre lies on a given line', 'A circle passes through $A(-2,1)$ and $B(4,9)$. Its centre lies on $y=2x-8$.', [
    choice(bisector, 'Choose the perpendicular bisector of $AB$.', ['3x+4y=23','4x+3y=19','3x-4y=-17','3x+4y=20'], 0,
      'The midpoint is $(1,5)$ and the gradient of $AB$ is $4/3$. Hence the perpendicular bisector is $y-5=-\\frac34(x-1)$.', 'The bisector passes through the midpoint and is perpendicular to the chord.'),
    choice(intersection, 'Choose the circle centre.', ['(1,5)','(2,-4)','(5,2)','(5,-2)'], 2,
      'The centre lies on the bisector. Substituting $y=2x-8$ gives $11x-32=23$, so $(x,y)=(5,2)$.', 'Find the intersection of the two lines, rather than using either line alone.'),
    choice(circle, 'Choose the circle equation.', ['(x-5)^2+(y-2)^2=25','(x-5)^2+(y-2)^2=50','(x+5)^2+(y+2)^2=50','(x-1)^2+(y-5)^2=50'], 1,
      'Use point $A$ to get $r^2=(-2-5)^2+(1-2)^2=50$.', 'Use the distance from the centre to a point on the circumference.'),
  ]),
  exercise(5, 'A tangent shared with a line through a second circle', 'A circle with centre $A=(1,1)$ passes through $B=(4,5)$. A second circle has centre $B$ and passes through $A$. The tangent to the first circle at $B$ crosses the second circle.', [
    choice(tangent, 'Choose the equation of the tangent at $B$.', ['4x+3y=31','3x-4y=-8','3x+4y=32','3x+4y=7'], 2,
      '$AB$ has gradient $4/3$. The tangent has gradient $-3/4$ and passes through $(4,5)$, giving $y-5=-\\frac34(x-4)$.', 'Use $B$ as the point on the tangent, since $A$ is the centre of the first circle.'),
    choice(circle, 'Choose the equation of the second circle.', ['(x-1)^2+(y-1)^2=25','(x-4)^2+(y-5)^2=5','(x-4)^2+(y-5)^2=25','(x-5)^2+(y-4)^2=25'], 2,
      'The centre is $B=(4,5)$ and the radius is $BA=5$.', 'Use the centre of the second circle and square its radius.'),
    choice(intersection, 'Find the two points where the tangent crosses the second circle.', ['(1,1),(7,9)','(0,8),(8,2)','(0,2),(8,8)','(4,0),(4,10)'], 1,
      'The line passes through $B$, so the intersections are endpoints of a diameter. The displacements $(-4,3)$ and $(4,-3)$ both have length 5 and lie parallel to the tangent.', 'The displacements must follow the tangent gradient and have length equal to the radius.'),
  ]),
  exercise(6, 'Verify a tangent and locate its reflected point of contact', 'A circle has centre $B=(1,2)$ and passes through $A=(-3,-1)$. The segment $AC$ is a diameter. Let $D=(1,31/3)$.', [
    choice(circle, 'Choose the circle equation.', ['(x-1)^2+(y-2)^2=5','(x+1)^2+(y+2)^2=25','(x-1)^2+(y-2)^2=25','(x+3)^2+(y+1)^2=25'], 2,
      '$BA^2=(-3-1)^2+(-1-2)^2=25$.', 'Use the given centre, not the point on the circumference.'),
    choice(tangent, 'Which point and gradients verify that $DC$ is tangent?', ['C=(5,5),\\ m_{BC}=3/4,\\ m_{DC}=4/3','C=(5,5),\\ m_{BC}=3/4,\\ m_{DC}=-4/3','C=(-3,5),\\ m_{BC}=3/4,\\ m_{DC}=-4/3','C=(5,5),\\ m_{BC}=-3/4,\\ m_{DC}=-4/3'], 1,
      '$C=2B-A=(5,5)$. Then $m_{BC}=3/4$ and $m_{DC}=(5-31/3)/(5-1)=-4/3$. Their product is $-1$. Since $C$ lies on the circle, $DC$ is tangent there.', 'Verify both perpendicularity and that the point of contact is on the circle.'),
    choice(tangent, 'Find the other point of contact of a tangent from $D$.', ['(-5,5)','(-3,-1)','(5,-1)','(-3,5)'], 3,
      'The line $BD$ is $x=1$ and reflects one tangent into the other. Reflect $C=(5,5)$ in $x=1$ to obtain $(-3,5)$.', 'Reflect across the line through the centre and the external point.'),
  ]),
  exercise(7, 'Find the chord of contact of two tangents', 'A circle has centre $C=(2,1)$ and radius 5. The point $T=(9,2)$ is the origin of tangents touching the circle at $A$ and $B$.', [
    numeric(tangent, 'Find $CT^2$.', 50, 'The coordinate differences are 7 and 1, so $CT^2=7^2+1^2=50>25$. Thus $T$ is outside the circle.', 'Compare squared distance to squared radius.'),
    numeric(tangent, 'Find the angle in degrees between $TC$ and either tangent from $T$.', 45, 'Triangle $TAC$ is right-angled at $A$. Since $\\sin\\angle ATC=5/\\sqrt{50}=1/\\sqrt2$, the acute angle is $45^\\circ$.', 'Use the radius as the side opposite the angle at $T$.'),
    choice(bisector, 'Choose the equation of the line $AB$.', ['y=7x-40','y=-7x+40','y=-x/7+40','y=-7x+25'], 1,
      'The right triangle is isosceles, so $A$ lies on the perpendicular bisector of $CT$. The same holds for $B$. This bisector passes through $(11/2,3/2)$ and has gradient $-7$.', 'The chord goes through the midpoint of $CT$ here because the two legs of each right triangle are equal.'),
    choice(intersection, 'Find the two possible $x$-coordinates of the points of contact.', ['2,9','-5,-6','5,6','4,7'], 2,
      'Substitute $y=40-7x$ into $(x-2)^2+(y-1)^2=25$. After expansion and division by 50, the equation is $x^2-11x+30=0$.', 'Use the original circle and the chord equation together.'),
  ]),
  exercise(8, 'Find a circle through three points and its tangent', 'Points $A=(6,-1)$, $B=(6,5)$ and $C=(-2,5)$ lie on the same circle.', [
    choice(bisector, 'Find the intersection of the perpendicular bisectors of $AB$ and $BC$.', ['(6,2)','(2,5)','(4,3)','(2,2)'], 3,
      'Segment $AB$ is vertical, so its bisector is $y=2$. Segment $BC$ is horizontal, so its bisector is $x=2$.', 'A perpendicular bisector of a horizontal segment is vertical.'),
    choice(circle, 'Choose the equation of the circle.', ['(x-2)^2+(y-2)^2=25','(x-2)^2+(y-2)^2=50','(x-2)^2+(y+2)^2=25','(x-6)^2+(y-5)^2=25'], 0,
      'The centre is $(2,2)$. Using point $B$, the squared radius is $4^2+3^2=25$.', 'Use either given point only after finding the centre.'),
    choice(tangent, 'Choose the tangent equation at $B$.', ['4x-3y=9','3x+4y=38','4x+3y=39','4x+3y=25'], 2,
      'The radius to $B$ has gradient $3/4$. Hence $y-5=-\\frac43(x-6)$, giving $4x+3y=39$.', 'Use the negative reciprocal and substitute the point of contact.'),
  ]),
  exercise(9, 'Find where the tangents at the axis crossings meet', 'A circle has equation $x^2+y^2-2x-6y-15=0$. It crosses the $x$-axis at $A$ and $B$, with $A$ to the left of $B$.', [
    choice(intersection, 'Choose the abscissae of $A$ and $B$.', ['-5,3','-3,5','-1,15','-4,4'], 1,
      'Set $y=0$ and factor $x^2-2x-15=(x+3)(x-5)$.', 'For an $x$-axis intersection the ordinate is zero.'),
    choice(tangent, 'Choose the tangent equations at $A$ and $B$, respectively.', ['y=-4(x+3)/3,\\ y=4(x-5)/3','y=-3(x+3)/4,\\ y=3(x-5)/4','y=4(x-3)/3,\\ y=-4(x+5)/3','y=4(x+3)/3,\\ y=-4(x-5)/3'], 0,
      'The centre is $(1,3)$. Radius gradients to $A$ and $B$ are $3/4$ and $-3/4$, so the respective tangent gradients are $-4/3$ and $4/3$.', 'Carefully keep track of signs for the left and right points.'),
    choice(intersection, 'Find the intersection of these tangents.', ['(0,-4)','(1,16/3)','(1,-16/3)','(-1,-8/3)'], 2,
      'The tangents are reflections in $x=1$. At $x=1$ the first tangent has ordinate $-4(1+3)/3=-16/3$.', 'Use the symmetry line or solve the tangent equations simultaneously.'),
  ]),
  exercise(10, 'Recover the opposite endpoint from a perpendicular bisector', 'Let $A=(5,2)$ and $B=(p,q)$. The perpendicular bisector of $AB$ is $y=-2x+7$.', [
    numeric(bisector, 'Find the gradient of $AB$.', 1/2, 'The gradient of $AB$ is the negative reciprocal of $-2$.', 'Use the fact that $AB$ and its bisector are perpendicular.'),
    numeric(intersection, 'Find the $x$-coordinate of the midpoint of $AB$.', 3, 'The line $AB$ through $A$ is $y=x/2-1/2$. Equating it to the bisector gives $5x/2=15/2$, so the midpoint is $(3,1)$.', 'The midpoint lies on both the segment line and the bisector.'),
    numeric(bisector, 'Enter the horizontal coordinate $p$ of $B$.', 1, 'The midpoint gives $(5+p)/2=3$.', 'Double the midpoint coordinate before subtracting the coordinate of $A$.'),
    numeric(bisector, 'Enter the vertical coordinate $q$ of $B$.', 0, 'The ordinate of the midpoint is 1, so $(2+q)/2=1$. Thus $B=(1,0)$.', 'Use the midpoint ordinate, which comes from the bisector.'),
  ]),
]
