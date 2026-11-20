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
  exercise(11, 'Locate the second circle on a common tangent', 'Line $l$ has gradient $-3/4$ and passes through $A=(2,1)$. The first circle has centre $C=(5,5)$ and radius 5.', [
    choice(tangent, 'Which calculation verifies tangency at $A$?', ['CA=5,\\ m_{CA}=3/4','CA=5,\\ m_{CA}=4/3','CA=25,\\ m_{CA}=4/3','CA=5,\\ m_{CA}=-4/3'], 1,
      '$CA^2=3^2+4^2=25$, so $A$ lies on the circle. The gradient $4/3$ is the negative reciprocal of $-3/4$. The radius is perpendicular to $l$.', 'Check that the contact point belongs to the circle and that the line is perpendicular to the radius.'),
    choice(circle, 'Find the equation of the other circle of radius 5 tangent to $l$ at $A$.', ['(x-5)^2+(y-5)^2=25','(x+1)^2+(y+3)^2=5','(x+1)^2+(y+3)^2=25','(x-1)^2+(y-3)^2=25'], 2,
      'The centres lie on opposite sides of $A$ on the same perpendicular. The second centre is $2A-C=(-1,-3)$ and the radius stays 5.', 'Reflect the centre in the tangent, keeping the point of contact fixed.'),
  ]),
  exercise(12, 'Use a right angle to find the diameter', 'A circle passes through $A=(-2,1)$, $B=(1,-2)$ and $C=(5,2)$. The segment $BE$ is another diameter.', [
    choice(tangent, 'Choose the gradients of $BA$ and $BC$, respectively.', ['-1,1','1,-1','-1,-1','1,1'], 0, '$m_{BA}=3/(-3)=-1$ and $m_{BC}=4/4=1$. Their product is $-1$, so angle $ABC$ is $90^\\circ$.', 'Use $B$ as the common vertex.'),
    choice(circle, 'Find the centre of the circle.', ['(1,-2)','(3/2,-3/2)','(2,5)','(3/2,3/2)'], 3, 'The right angle subtends diameter $AC$, so its midpoint $(3/2,3/2)$ is the centre.', 'The endpoints of the diameter are opposite the right angle.'),
    choice(circle, 'Choose the circle equation.', ['(x-3/2)^2+(y-3/2)^2=25','(x-3/2)^2+(y-3/2)^2=25/2','(x-3/2)^2+(y+3/2)^2=25/2','(x-1)^2+(y+2)^2=25/2'], 1, 'The squared distance from the centre to $B$ is $(-1/2)^2+(-7/2)^2=25/2$.', 'Use the distance from the centre to a point on the circle.'),
    choice(tangent, 'Choose the tangent at $E$.', ['x-7y=-33','7x+y=19','x+7y=37','x+7y=-13'], 2, 'Reflect $B$ through the centre to get $E=(2,5)$. The gradient of $BE$ is 7. The tangent is $y-5=-(x-2)/7$.', 'Find the opposite endpoint before substituting into the tangent equation.'),
  ]),
  exercise(13, 'Calculate the exact length of a chord', 'A circle with centre $(1,2)$ passes through $(4,6)$. It intersects $y=2x+5$ at $A$ and $B$.', [
    choice(circle, 'Choose the equation of the circle.', ['(x-1)^2+(y-2)^2=5','(x-1)^2+(y-2)^2=25','(x+1)^2+(y+2)^2=25','(x-4)^2+(y-6)^2=25'], 1, 'The horizontal and vertical differences to the given point are 3 and 4. Thus $r^2=9+16=25$.', 'The right side is the squared radius.'),
    choice(intersection, 'Find the two points of intersection.', ['(-3,-1),(1,7)','(-3,1),(1,-7)','(-1,3),(7,1)','(-1,3),(3,11)'], 0, 'Substitute the line to obtain $(x-1)^2+(2x+3)^2=25$. This reduces to $5(x+3)(x-1)=0$. Use the line to find both ordinates.', 'Substitute the roots into the line to pair each abscissa with its ordinate.'),
    choice(intersection, 'Choose the exact length of $AB$.', ['4\\sqrt{2}','8','80','4\\sqrt{5}'], 3, 'The coordinate differences are 4 and 8. Thus $AB=\\sqrt{4^2+8^2}=4\\sqrt5$.', 'Take the square root after adding the squared coordinate differences.'),
  ]),
  exercise(14, 'Compare a tangent intercept triangle and an inscribed triangle', 'A circle with centre $(2,1)$ has equation $(x-2)^2+(y-1)^2=25$. The tangent at $P=(5,5)$ meets the axes at $A$ and $B$. Points $Q$ and $R$ lie on the circle so $PQR$ is equilateral.', [
    choice(tangent, 'Choose the equation of the tangent at $P$.', ['3x+4y=35','4x+3y=35','3x-4y=-5','3x+4y=25'], 0, 'The radius gradient is $4/3$, so the tangent gradient is $-3/4$. Substituting $P$ gives $3x+4y=35$.', 'Find the gradient of the tangent before using the point of contact.'),
    numeric(intersection, 'Find the area of triangle $OAB$, where $O$ is the origin.', 1225/24, 'The intercepts have lengths $35/3$ and $35/4$, found by setting the other coordinate to zero. The area is $\\frac12(35/3)(35/4)=1225/24$.', 'Use half the product of the intercept lengths.'),
    choice(circle, 'Find the exact area of $PQR$.', ['25\\sqrt3/4','75/4','75\\sqrt3/4','25\\sqrt3/2'], 2, 'Each side subtends $120^\\circ$ at the centre, so its length is $2(5)\\sin60^\\circ=5\\sqrt3$. The area is $\\frac{\\sqrt3}{4}(5\\sqrt3)^2$.', 'The circumradius is smaller than the triangle side.'),
  ]),
  exercise(15, 'Combine surd intersections with a pair of tangents', 'The line $y=2x+1$ intersects $x^2+y^2=25$ at $A$ and $B$. A different line passes through $(13,0)$ with gradient $m$ and is tangent to the circle.', [
    choice(intersection, 'Find the two abscissae of $A$ and $B$.', ['(-2\\pm2\\sqrt{31})/5','(-2\\pm\\sqrt{31})/5','(2\\pm2\\sqrt{31})/5','(-2\\pm2\\sqrt{31})/10'], 0, '$x^2+(2x+1)^2=25$ gives $5x^2+4x-24=0$. The quadratic formula gives $x=(-4\\pm\\sqrt{496})/10$.', 'Simplify the whole quadratic-formula numerator and denominator.'),
    choice(intersection, 'Use the line to find the corresponding ordinates.', ['(1\\pm2\\sqrt{31})/5','(1\\pm4\\sqrt{31})/5','(-1\\pm4\\sqrt{31})/5','(1\\pm4\\sqrt{31})/10'], 1, 'Substitute each root into $2x+1$, pairing the same sign in $x$ and $y$.', 'The signs in the two coordinates come from the same root.'),
    choice(intersection, 'Find the exact chord length.', ['4\\sqrt{31}/5','8\\sqrt{31}/5','4\\sqrt{155}/5','4\\sqrt{155}'], 2, 'The horizontal difference is $4\\sqrt{31}/5$. The vertical difference is twice as large. Therefore $AB=\\sqrt5(4\\sqrt{31}/5)$.', 'Use both coordinate differences in the distance formula.'),
    choice(tangent, 'Choose the two possible gradients $m$.', ['\\pm5/13','\\pm12/5','\\pm5/12','\\pm12/13'], 2, 'Substitute $y=m(x-13)$ into the circle to get $(1+m^2)x^2-26m^2x+169m^2-25=0$. Tangency makes its discriminant $100-576m^2=0$. Thus $m=\\pm5/12$.', 'For tangency the intersection equation must have a repeated root.'),
  ]),
  exercise(16, 'Find a concentric circle touching a secant', 'The circle $(x-1)^2+(y-2)^2=20$ has centre $C=(1,2)$. The line $y=x+3$ cuts the circle at $A$ and $B$.', [
    choice(intersection, 'Find the points $A$ and $B$.', ['(-3,0),(3,6)','(-3,0),(6,3)','(-2,1),(2,5)','(0,-3),(6,3)'], 0, 'Substitute to get $(x-1)^2+(x+1)^2=20$. This gives $2x^2+2=20$, hence $x=\\pm3$.', 'Use the ordinate from $y=x+3$ for each solution.'),
    choice(circle, 'Choose the equation of the circle centred at $C$ that is tangent to the line.', ['(x-1)^2+(y-2)^2=20','(x-1)^2+(y-2)^2=\\sqrt2','x^2+(y-3)^2=2','(x-1)^2+(y-2)^2=2'], 3, 'The perpendicular from $C$ has equation $y=-x+3$ and meets the line at $(0,3)$. Its squared length is $1^2+1^2=2$, the new squared radius.', 'The point of contact is the foot of the perpendicular from the centre.'),
  ]),
  exercise(17, 'Use a discriminant to find the secant gradients', 'The circle has equation $x^2+y^2+2x-3=0$. Consider the family of lines $y=kx-3$.', [
    choice(circle, 'Choose the centre and the radius.', ['(1,0),\\ r=2','(-1,0),\\ r=2','(-1,0),\\ r=4','(-1,0),\\ r=\\sqrt3'], 1, 'Completing the square gives $(x+1)^2+y^2=4$.', 'Take the square root of the constant on the right.'),
    numeric(circle, 'Enter the ordinate of the lowest point on the circle.', -2, 'Move vertically down by the radius from the centre. The lowest point is $(-1,-2)$.', 'Keep the abscissa of the centre.'),
    { ...choice(tangent, 'Let $a=1-2\\sqrt6/3$ and $b=1+2\\sqrt6/3$. For which gradients are there two distinct intersections?', ['a<k<b','k\\le a\\text{ or }k\\ge b','k<a\\text{ or }k>b','k=a\\text{ or }k=b'], 2, 'Substitution gives $(1+k^2)x^2+(2-6k)x+6=0$, with discriminant $4(3k^2-6k-5)$. Set the discriminant equal to zero for the boundary gradients $a$ and $b$. The upward graph lies above zero to the left of $a$ and to the right of $b$, so those are the required ranges.', 'Tangency is at the boundary, where there is only one point.'),
      signGraph: { roots: [1-2*Math.sqrt(6)/3, 1+2*Math.sqrt(6)/3], labels: ['1 − 2√6/3', '1 + 2√6/3'], variable: 'k', region: 'outside' } },
  ]),
  exercise(18, 'Find unknown circle coefficients and the tangent', 'Points $A=(5,3)$ and $B=(-2,2)$ lie on the circle $x^2+y^2+ax+by-20=0$.', [
    choice(circle, 'Find $a$ and $b$.', ['a=4,\\ b=-2','a=-2,\\ b=4','a=-4,\\ b=2','a=-4,\\ b=-2'], 2, 'Substitute $A$ to get $5a+3b=-14$. Substituting $B$ gives $-2a+2b=12$. Solving gives $a=-4$ and $b=2$.', 'Keep the sign of the point with negative abscissa when substituting.'),
    choice(circle, 'Find the centre.', ['(-2,1)','(2,-1)','(4,-2)','(-4,2)'], 1, 'The centre is $(-a/2,-b/2)=(2,-1)$.', 'Halve the linear coefficients and change their signs.'),
    choice(tangent, 'Choose the tangent equation at $A$.', ['4x+3y=29','3x-4y=3','3x+4y=25','3x+4y=27'], 3, 'The radius to $A$ has gradient $4/3$. Use $y-3=-\\frac34(x-5)$ and rearrange.', 'Anchor the tangent at $A$, rather than at the centre.'),
  ]),
  exercise(19, 'Select the circle intersection on a line segment', 'A circle has centre $C=(1,-2)$ and radius $\\sqrt{20}$. The segment from $C$ to $B=(7,6)$ intersects the circle at $P$.', [
    choice(intersection, 'Choose the equation of $BC$.', ['4x-3y=10','3x-4y=11','4x+3y=-2','4x-3y=-10'], 0, 'The gradient is $(6-(-2))/(7-1)=4/3$. Use $y+2=\\frac43(x-1)$ and rearrange.', 'Use the rise divided by the run.'),
    choice(intersection, 'Find $P$ exactly.', ['(1-6\\sqrt5/5,-2-8\\sqrt5/5)','(1+6\\sqrt5/5,-2+8\\sqrt5/5)','(1+3\\sqrt5/5,-2+4\\sqrt5/5)','(1+6\\sqrt5/5,-2-8\\sqrt5/5)'], 1, 'Points on $BC$ are $(1+6t,-2+8t)$. On the circle, $100t^2=20$. Since $P$ is between $C$ and $B$, take $t=\\sqrt5/5$ and substitute.', 'Reject the intersection on the extension past the centre.'),
  ]),
  exercise(20, 'Recover contact points from two tangent gradients', 'Tangents from $A=(0,13)$ touch the circle $x^2+y^2=25$ at $B$ and $C$. Point $D=(5,0)$ lies on the same circle.', [
    choice(tangent, 'Using $y=mx+13$, choose the possible values of $m$.', ['\\pm5/12','\\pm12/13','\\pm13/5','\\pm12/5'], 3, 'The intersection quadratic is $(1+m^2)x^2+26mx+144=0$. Set the discriminant $100m^2-576$ equal to zero.', 'Use a repeated root for each tangent.'),
    choice(tangent, 'Choose the two points of contact.', ['(\\pm60/13,25/13)','(\\pm25/13,60/13)','(\\pm60/13,-25/13)','(\\pm12/5,13)'], 0, 'For either tangent the repeated root is $x=-13m/(1+m^2)$, giving $x=\\pm60/13$. The tangent equation then gives $y=25/13$.', 'Pair each repeated root with its own tangent gradient.'),
    choice(circle, 'Choose the size of angle $BDC$ to one decimal place.', ['22.6^\\circ','45.2^\\circ','67.4^\\circ','134.8^\\circ'], 2, 'Let $O$ be the origin. The radius to either point of contact makes an angle $\\cos^{-1}(5/13)$ with $OA$ by the right triangle at the contact point. The minor central angle $BOC$ is twice this, and $D$ lies outside that minor arc, so $\\angle BDC=\\cos^{-1}(5/13)=67.4^\\circ$ to one decimal place.', 'The angle at the circumference is half the central angle subtending the same arc.'),
  ]),
  exercise(21, 'Find a bisector and a circle rooted at one endpoint', 'The endpoints of a segment are $A=(2,4)$ and $B=(8,0)$.', [
    choice(bisector, 'Choose the equation of the perpendicular bisector of $AB$.', ['3x+2y=19','3x-2y=11','2x-3y=4','3x-2y=19'], 1, 'The midpoint is $(5,2)$ and the gradient of $AB$ is $-2/3$. The bisector has equation $y-2=\\frac32(x-5)$.', 'Use the midpoint and the negative reciprocal gradient.'),
    choice(circle, 'Choose the circle with centre $A$ through $B$.', ['(x-8)^2+y^2=52','(x+2)^2+(y+4)^2=52','(x-2)^2+(y-4)^2=52','(x-2)^2+(y-4)^2=\\sqrt{52}'], 2, 'The squared radius is $(8-2)^2+(0-4)^2=52$.', 'Use $A$ for the centre and $B$ to calculate the radius.'),
  ]),
  exercise(22, 'Move a point to create equal distances or a right angle', 'Let $A=(-2,0)$, $B=(7,-7)$ and $C=(2p,p)$.', [
    numeric(bisector, 'Find $p$ when $AC=BC$.', 47/11, 'Equate $(2p+2)^2+p^2$ and $(2p-7)^2+(p+7)^2$. Cancelling the squared terms gives $22p=94$.', 'Equate the squared distances; no square roots are needed.'),
    numeric(tangent, 'Now assume instead that $AC$ and $BC$ are perpendicular and $p$ is an integer. Find $p$.', 2, 'The dot product of $(2p+2,p)$ and $(2p-7,p+7)$ is zero. This gives $5p^2-3p-14=(p-2)(5p+7)=0$. Only 2 is an integer.', 'Set the product of the perpendicular gradients to `$-1`$ and apply the integer condition.'),
    choice(circle, 'In the perpendicular case, find the expanded equation of the circle through $A$, $B$ and $C$.', ['x^2+y^2+5x-7y-14=0','x^2+y^2-5x+7y+14=0','x^2+y^2-5x-7y-14=0','x^2+y^2-5x+7y-14=0'], 3, 'The angle at $C$ is right, so $AB$ is a diameter. Its midpoint is $(5/2,-7/2)$, and $r^2=(9^2+7^2)/4=65/2$. Expand the circle equation to get the result.', 'The segment opposite the right angle is the diameter.'),
  ]),
]
