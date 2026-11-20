import type { Exercise, Task } from './questions'

type Step = Omit<Task, 'id' | 'difficulty'>
const math = (value: string) => '$' + value + '$'
const number = (skill: string, prompt: string, correct: number, solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'number', correct }, solution, misconception })
const select = (skill: string, prompt: string, choices: string[], correct: number, solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'single', choices: choices.map(math), correct: [correct] }, solution, misconception })
const make = (position: number, title: string, context: string, steps: Step[]): Exercise => {
  const id = 'p1-quad-' + String(position).padStart(2, '0')
  return { id, title, context, tasks: steps.map((step, index) => ({
    ...step, id: id + '-' + (index + 1), difficulty: 'standard',
    signGraph: signGraphs[id + '-' + (index + 1)],
  })) }
}
const intersection = 'Count intersections with the discriminant'
const tangent = 'Use a repeated root for tangency'
const square = 'Complete the square'
const substitution = 'Solve by substitution'
const signGraphs: Record<string, NonNullable<Task['signGraph']>> = {
  'p1-quad-01-2': { roots: [-6, 6], labels: ['-6', '6'], variable: 'c', region: 'outside' },
  'p1-quad-03-1': { roots: [-7, 1], labels: ['-7', '1'], variable: 'm', region: 'outside' },
  'p1-quad-04-1': { roots: [-8, 8], labels: ['-8', '8'], variable: 'm', region: 'inside' },
  'p1-quad-06-1': { roots: [-2-2*Math.sqrt(2), -2+2*Math.sqrt(2)], labels: ['−2 − 2√2', '−2 + 2√2'], variable: 'm', region: 'outside' },
  'p1-quad-08-1': { roots: [6-2*Math.sqrt(6), 6+2*Math.sqrt(6)], labels: ['6 − 2√6', '6 + 2√6'], variable: 'k', region: 'outside' },
  'p1-quad-12-1': { roots: [-4-2*Math.sqrt(3), -4+2*Math.sqrt(3)], labels: ['−4 − 2√3', '−4 + 2√3'], variable: 'k', region: 'inside' },
  'p1-quad-13-1': { roots: [0, 4], labels: ['0', '4'], variable: 'k', region: 'outside' },
  'p1-quad-29-1': { roots: [-4, 12], labels: ['-4', '12'], variable: 'k', region: 'inside' },
  'p1-quad-30-2': { roots: [-6, 2], labels: ['-6', '2'], variable: 'k', region: 'inside' },
}

export const quadratics: Exercise[] = [
  make(1, 'Tangent to a reciprocal curve', 'A line $y=mx+c$ meets the reciprocal curve $y=9/x$, where $x\\ne0$.', [
    select(tangent, 'If the line is tangent, express $m$ in terms of $c$.', ['m=c^2/36','m=-c^2/36','m=-c^2/9','m=-36/c^2'], 1,
      'Multiplication by $x$ gives $mx^2+cx-9=0$. Its discriminant is $c^2+36m$. Set it equal to zero, with $m\\ne0$.', 'The constant term is −9, so the discriminant includes +36m.'),
    select(intersection, 'For $m=-1$, choose the values of $c$ giving two distinct intersections.', ['-6<c<6','c\\le-6\\text{ or }c\\ge6','c<-6\\text{ or }c>6','c=\\pm6'], 2,
      'Here $\\Delta=c^2-36$. Its graph crosses the axis at $c=\\pm6$, and is above the axis outside the two roots.', 'Two distinct intersections require a strictly positive discriminant.'),
  ]),
  make(2, 'A fixed line and a moving parabola', 'The parabola $y=x^2+kx+k$ is compared with the line $y=2x-3$.', [
    select(tangent, 'Select the possible values of $k$ for tangency.', ['k=4\\pm2\\sqrt6','k=4\\pm\\sqrt6','k=8\\pm2\\sqrt6','k=-4\\pm2\\sqrt6'], 0,
      'Equating gives $x^2+(k-2)x+k+3=0$. Then $\\Delta=k^2-8k-8=(k-4)^2-24$. Tangency gives $k=4\\pm2\\sqrt6$.', 'Calculate the constant term before expanding the discriminant.'),
    select(square, 'For $k=-4$, state the vertex of the parabola.', ['(-2,-8)','(2,-4)','(2,-8)','(-2,0)'], 2,
      '$x^2-4x-4=(x-2)^2-8$, so the vertex is $(2,-8)$.', 'Set the squared bracket equal to zero.'),
  ]),
  make(3, 'Two intersections and a variable gradient', 'Compare $y=2x^2-3x+7$ with $y=mx+5$.', [
    select(intersection, 'For which gradients are there two distinct intersections?', ['-7<m<1','m<-7\\text{ or }m>1','m\\le-7\\text{ or }m\\ge1','-1<m<7'], 1,
      '$\\Delta=(m+3)^2-16$. It is zero at $m=-7,1$ and its upward parabola is above the axis outside those points.', 'Read the two exterior intervals and exclude the tangency values.'),
  ]),
  make(4, 'A line that misses a parabola', 'Compare $y=x^2+13$ with $y=mx-3$.', [
    select(intersection, 'For which gradients are there no common points?', ['-8<m<8','-8\\le m\\le8','m<-8\\text{ or }m>8','m=\\pm8'], 0,
      'Equating gives $x^2-mx+16=0$ with $\\Delta=m^2-64$. This discriminant crosses zero at $m=-8,8$. The graph is below the axis between those values.', 'At the two endpoints, the line touches the parabola.'),
  ]),
  make(5, 'Prove two crossings for every parameter', 'A family of curves is given by $y=x^2+2kx+2k-7$. Compare each with the line $y=0$.', [
    select(intersection, 'Which completed-square form of the discriminant proves that the intersections are always distinct?', ['4(k-1)^2+24','4(k-1)^2-24','4(k-1)^2+28','4(k+1)^2+24'], 0,
      '$\\Delta=4k^2-8k+28=4(k-1)^2+24>0$. Its minimum is positive.', 'Apply the discriminant to the equation after equating the curve and line.'),
  ]),
  make(6, 'A line whose slope and intercept vary', 'Let $y=x^2+2$ and $y=mx+m+1$.', [
    select(intersection, 'Choose the values of $m$ giving two distinct crossings.', ['-2-2\\sqrt2<m<-2+2\\sqrt2','m<-2-2\\sqrt2\\text{ or }m>-2+2\\sqrt2','m>0','m\\ge-2+2\\sqrt2'], 1,
      'The intersection equation is $x^2-mx+1-m=0$, giving $\\Delta=(m+2)^2-8$. Its zeros are $-2\\pm2\\sqrt2$ and the graph is above zero outside them.', 'Both the slope and intercept affect the discriminant.'),
  ]),
  make(7, 'Substitution into a reciprocal square', 'Let $u=(x-1)^2$. Solve $(x-1)^2-9/(x-1)^2=8$, with $x\\ne1$.', [
    number(substitution, 'Which value of $u$ satisfies the equation and the restriction?', 9,
      '$u-9/u=8$ gives $u^2-8u-9=(u-9)(u+1)=0$. Since $u>0$, keep $u=9$.', 'The square appears in a denominator, so u must be strictly positive.'),
    select(substitution, 'Find both values of $x$.', ['-2,4','-4,2','-2,3','1,4'], 0,
      'From $(x-1)^2=9$, $x-1=\\pm3$. Thus $x=-2$ or $x=4$.', 'Take both signs of the square root, then add 1.'),
  ]),
  make(8, 'Intersect with a parameter in both equations', 'Compare $y=x^2+kx+1$ with $y=4x-k$.', [
    select(intersection, 'For which $k$ do the graphs meet at two distinct points?', ['k<6-2\\sqrt6\\text{ or }k>6+2\\sqrt6','6-2\\sqrt6<k<6+2\\sqrt6','k<4-2\\sqrt6\\text{ or }k>4+2\\sqrt6','k=6\\pm2\\sqrt6'], 0,
      'The discriminant of $x^2+(k-4)x+k+1=0$ is $k^2-12k+12=(k-6)^2-24$. Read its positive intervals outside $k=6\\pm2\\sqrt6$.', 'Use k+1 as the constant after subtracting the line.'),
  ]),
  make(9, 'Tangency with a changing leading coefficient', 'Compare $y=kx^2+(k-1)x+1$ with $y=3$, given $k\\ne0$.', [
    select(tangent, 'Choose all possible values of $k$ as a pair.', ['-3\\pm2\\sqrt2','3\\pm2\\sqrt2','-3\\pm\\sqrt2','-1\\pm2\\sqrt2'], 0,
      '$kx^2+(k-1)x-2=0$ has $\\Delta=(k-1)^2+8k=k^2+6k+1$. Solve $\\Delta=0$ to get $k=-3\\pm2\\sqrt2$.', 'Keep the factor k in 4ac.'),
  ]),
  make(10, 'The only solution at the turning point', 'Consider $9x^2-12x+7=h$.', [
    select(square, 'Choose the completed-square form of the left-hand side.', ['(3x-2)^2+3','(3x-2)^2+7','(3x+2)^2+3','(9x-2)^2+3'], 0,
      'Expanding $(3x-2)^2$ gives $9x^2-12x+4$. Add $3$.', 'Subtract the square of the constant in the bracket when finding the remainder.'),
    number(square, 'When there is exactly one solution, find that value of $x$.', 2/3,
      'The unique solution occurs when $h=3$. Then $3x-2=0$, giving $x=2/3$.', 'The question asks for x, the horizontal coordinate of the turning point.'),
  ]),
  make(11, 'Two tangents through a fixed point', 'The lines $y=mx-3$ are drawn through $(0,-3)$. The parabola is $y=x^2-2x+1$.', [
    select(tangent, 'Select the two gradients that produce tangency.', ['-2\\text{ and }2','-6\\text{ and }2','-2\\text{ and }6','-6\\text{ and }6'], 1,
      '$x^2-(m+2)x+4=0$. A repeated root gives $(m+2)^2=16$, so $m=-6$ or $m=2$.', 'Take both signs when solving the squared equation.'),
    select(tangent, 'Match the points of contact to $m=-6$ and $m=2$, in that order.', ['(-2,9),(2,1)','(-2,1),(2,9)','(-2,9),(2,9)','(2,1),(-2,9)'], 0,
      'The repeated root is $x=(m+2)/2$. Substituting $x=-2$ and $x=2$ in the parabola gives $9$ and $1$.', 'Use the repeated root for x before evaluating y.'),
  ]),
  make(12, 'Check the degenerate parameter', 'Compare $y=kx^2+2x+1$ with $y=kx+4$.', [
    select(intersection, 'Choose the set of $k$ for which the graphs have no common point.', ['-4-2\\sqrt3<k<-4+2\\sqrt3','-4-2\\sqrt3\\le k\\le-4+2\\sqrt3','k<-4-2\\sqrt3\\text{ or }k>-4+2\\sqrt3','k=0'], 0,
      'For $k\\ne0$ the equation is $kx^2+(2-k)x-3=0$. Its discriminant is $(k+4)^2-12$, negative between its zeros. At $k=0$ the equation is linear and has a solution.', 'Check k=0 separately because the equation is no longer quadratic.'),
  ]),
  make(13, 'Parameter in two coefficients', 'Compare $y=x^2+2kx+1$ and $y=2x-2k$.', [
    select(intersection, 'Choose the values of $k$ giving two intersections.', ['k<0\\text{ or }k>4','0<k<4','k<1\\text{ or }k>3','k\\le0\\text{ or }k\\ge4'], 0,
      'The discriminant of $x^2+(2k-2)x+2k+1=0$ is $4k(k-4)$. The discriminant graph is above zero outside $0$ and $4$.', 'Use an open interval because tangency does not count as two intersections.'),
  ]),
  make(14, 'Use a completed square to solve exactly', 'Consider $x^2+10x+14$.', [
    select(square, 'Choose its completed-square form.', ['(x+5)^2-11','(x-5)^2-11','(x+5)^2+11','(x+10)^2-86'], 0,
      '$x^2+10x=(x+5)^2-25$, so adding $14$ gives $(x+5)^2-11$.', 'Halve 10 before squaring it.'),
    select(square, 'Hence solve $x^2+10x+14=2$ exactly.', ['x=5\\pm\\sqrt{13}','x=-5\\pm13','x=-5\\pm\\sqrt{13}','x=-5\\pm\\sqrt{11}'], 2,
      'Rearrange to $(x+5)^2=13$. Both signs of the square root are possible.', 'Take the square root before subtracting 5.'),
  ]),
  make(15, 'Use known intersections, then find tangency', 'A curve $y=2x^2-kx+3k^2$ meets the line $y=2x-a$.', [
    number(substitution, 'When the intersections have $x$-coordinates $0$ and $2$, find $k$.', 2,
      'At $x=0$, $a=-3k^2$. After substituting this, the intersection equation is $2x^2-(k+2)x=0$. The nonzero root is $(k+2)/2$, so $k=2$.', 'Use the zero root to eliminate the constant term.'),
    number(substitution, 'For those intersections, find $a$.', -12, '$a=-3k^2=-12$.', 'Use the sign in the line equation y = 2x − a.'),
    select(tangent, 'If instead $a=-3$, choose the values of $k$ for tangency.', ['k=\\dfrac{2\\pm18\\sqrt2}{23}','k=\\dfrac{2\\pm2\\sqrt{46}}{23}','k=\\dfrac{-2\\pm2\\sqrt{46}}{23}','k=2\\pm\\sqrt{46}'], 0,
      'Then $2x^2-(k+2)x+3k^2-3=0$. Its discriminant is $-23k^2+4k+28$. Solving $23k^2-4k-28=0$ gives $k=(2\\pm18\\sqrt2)/23$.', 'Set the discriminant of the equation in x equal to zero before solving for k.'),
  ]),
  make(16, 'Clear the denominator', 'Solve $2x+1=9/(x+2)$, where $x\\ne-2$.', [
    select(substitution, 'Which pair satisfies the original equation?', ['1,-7/2','-1,7/2','1,-2','-1,-7/2'], 0,
      'Multiply by $x+2$ to get $2x^2+5x-7=(x-1)(2x+7)=0$. Both roots $1$ and $-7/2$ are permitted.', 'Check the denominator restriction after finding the quadratic roots.'),
  ]),
  make(17, 'Complete the square and identify the sketch', 'The curve is $y=9x^2+18x+1$.', [
    select(square, 'Choose its completed-square form.', ['9(x+1)^2-8','9(x-1)^2-8','9(x+1)^2+1','(9x+1)^2-8'], 0,
      '$9(x+1)^2$ expands to $9x^2+18x+9$. Subtract $8$.', 'Factor the coefficient of x squared before completing the square.'),
    select(square, 'Solve $9x^2+18x+1=28$.', ['x=-3\\text{ or }1','x=-2\\text{ or }0','x=3\\text{ or }-1','x=-3\\text{ or }3'], 0,
      '$9(x+1)^2=36$, so $x+1=\\pm2$ and $x=-3$ or $1$.', 'Divide by 9 before taking both square roots.'),
    select(square, 'Pick the vertex and sign of the leading coefficient for the sketch.', ['(-1,-8),\\ a>0','(1,-8),\\ a>0','(-1,8),\\ a>0','(-1,-8),\\ a<0'], 0,
      'The square is smallest at $x=-1$, where $y=-8$. Since the leading coefficient is positive, the parabola opens upwards.', 'The sign inside the completed-square bracket is opposite to the horizontal coordinate.'),
  ]),
  make(18, 'Show a parabola always meets a line', 'Compare $y=x^2-kx-3$ and $y=2x-2k$.', [
    select(intersection, 'Which form establishes there are intersections for every real $k$?', ['(k-2)^2+12','(k+2)^2-12','(k-2)^2-12','(k+2)^2+12'], 0,
      'Equating gives $x^2-(k+2)x+2k-3=0$. Its discriminant is $(k+2)^2-4(2k-3)=(k-2)^2+12$, which is always positive.', 'A square plus a positive constant cannot reach zero or become negative.'),
  ]),
  make(19, 'Tangent to a negative reciprocal graph', 'A line $y=kx-2k$, with $k>0$, is tangent to $y=-8/x$.', [
    number(tangent, 'Find $k$.', 8, 'The intersection equation is $kx^2-2kx+8=0$. Hence $4k^2-32k=0$. Since $k>0$, $k=8$.', 'Use k > 0 after factoring the discriminant equation.'),
    select(tangent, 'Find the point of contact.', ['(1,-8)','(1,8)','(-1,-8)','(2,-4)'], 0,
      'The repeated root is $x=1$. On the curve, $y=-8/x=-8$.', 'Use the repeated root of the intersection equation.'),
  ]),
  make(20, 'A vertical shift with no real root', 'Study $9x^2+18x+p$.', [
    select(square, 'Choose its completed-square form.', ['9(x+1)^2+p-9','9(x-1)^2+p-9','9(x+1)^2+p+9','9(x+2)^2+p-36'], 0,
      '$9x^2+18x=9(x+1)^2-9$. Adding $p$ gives the stated form.', 'Account for the leading coefficient when subtracting the extra constant.'),
    select(intersection, 'For which $p$ does $9x^2+18x+p=0$ have no real root?', ['p<9','p\\ge9','p>9','p=9'], 2,
      'The graph has minimum $p-9$. It misses the horizontal axis when that minimum is strictly positive, so $p>9$.', 'At p=9 the parabola touches the axis.'),
  ]),
  make(21, 'Solve an equation in powers of three', 'Consider $x^6+7x^3-8=0$.', [
    select(substitution, 'Choose the complete set of real roots.', ['x=-8\\text{ or }1','x=-2\\text{ or }1','x=-1\\text{ or }2','x=2\\text{ or }1'], 1,
      'Set $u=x^3$. Then $(u+8)(u-1)=0$. Take the real cube root of each value to get $-2$ and $1$.', 'A cube root keeps the sign. Do not add a ± sign.'),
  ]),
  make(22, 'Keep a whole parabola above a height', 'Let $f(x)=2x^2+8x+c$ for all real $x$.', [
    select(square, 'When is $f(x)>3$ for every real $x$?', ['c>8','c\\ge11','c>11','c<11'], 2,
      'The graph of $f(x)=2(x+2)^2+c-8$ has minimum $c-8$. It lies entirely above $y=3$ exactly when $c-8>3$.', 'Compare the minimum, not the y-intercept, with the required height.'),
  ]),
  make(23, 'Check an all-parameter claim', 'Compare the curves $y=kx^2+x-2k$ and $y=3kx$.', [
    select(intersection, 'Which statement is true, including when $k=0$?', ['\\text{They meet for every real }k.','\\text{They meet exactly when }k>0.','\\text{They never meet.}','\\text{They fail to meet only at }k=0.'], 0,
      'For $k\\ne0$, the discriminant of $kx^2+(1-3k)x-2k=0$ is $(1-3k)^2+8k^2>0$. At $k=0$, $x=0$ has a solution.', 'A formula for quadratic roots assumes the leading coefficient is nonzero.'),
  ]),
  make(24, 'Two parameter values and two contacts', 'A curve $y=cx^2+3x-4$ is tangent to the line $y=7x-c$, where $c\\ne0$.', [
    select(tangent, 'Find the possible values of $c$.', ['c=2\\pm2\\sqrt2','c=-2\\pm2\\sqrt2','c=2\\pm\\sqrt2','c=4\\pm2\\sqrt2'], 0,
      '$cx^2-4x+c-4=0$ has discriminant $16-4c(c-4)$. Setting it to zero gives $c^2-4c-4=0$ and $c=2\\pm2\\sqrt2$.', 'The constant term after subtracting the line is c − 4.'),
    select(tangent, 'Give the contact coordinates in terms of $c$.', ['(2/c,14/c-c)','(-2/c,-14/c-c)','(4/c,28/c-c)','(2/c,14/c+c)'], 0,
      'The repeated root has $x=4/(2c)=2/c$. Substitute in the line to get $y=14/c-c$.', 'At contact, either equation gives the same y-coordinate.'),
  ]),
  make(25, 'A single contact on a quadratic curve', 'The line $y=x+2$ meets $x^2+2y^2=k$ in exactly one point.', [
    number(tangent, 'Find $k$.', 8/3, 'Substitute to get $3x^2+8x+8=k$. Completing the square gives $3(x+4/3)^2+8/3=k$. Exactly one solution requires $k=8/3$.', 'A single solution occurs at the minimum of the substituted quadratic.'),
    select(tangent, 'Find the contact point.', ['(-4/3,2/3)','(4/3,10/3)','(-4/3,-2/3)','(2/3,-4/3)'], 0,
      'At the minimum $x=-4/3$. The line gives $y=2/3$.', 'Use the line to recover y after finding x.'),
  ]),
  make(26, 'Complete the square before substituting', 'Consider $2u^2+12u+13$.', [
    select(square, 'Choose its completed-square form.', ['2(u-3)^2-5','2(u+3)^2-5','2(u+3)^2+5','2(u+6)^2-5'], 1,
      '$2(u+3)^2=2u^2+12u+18$. Subtract $5$.', 'Check the middle coefficient on expansion.'),
    select(substitution, 'Hence solve $2x^4+12x^2-14=0$ for real $x$.', ['x=\\pm1','x=\\pm\\sqrt7','x=\\pm\\sqrt{-7}','x=\\pm1\\text{ or }x=\\pm\\sqrt7'], 0,
      'With $u=x^2$, $2u^2+12u+13=27$. Then $(u+3)^2=16$, so $u=1$ or $-7$. Only $u=1$ is non-negative.', 'Keep only non-negative values of u.'),
  ]),
  make(27, 'An intercept condition that always holds', 'Compare $y=x^2-2kx-4$ with $y=2x-2k$.', [
    select(intersection, 'What does the discriminant establish for all real $k$?', ['\\text{No intersections}','\\text{At least one intersection}','\\text{One point only when }k=0','\\text{Two intersections only for }k>0'], 1,
      '$x^2-(2k+2)x+2k-4=0$ gives $\\Delta=(2k+2)^2-4(2k-4)=4k^2+20>0$. Thus the graphs always intersect.', 'Look for a square plus a positive constant.'),
  ]),
  make(28, 'Recover a parameter from one crossing', 'Compare $y=x^2-2kx+3$ and $y=kx+p$. In the first case, $k>0$ and $(1,0)$ is a common point.', [
    number(substitution, 'Find $k$ using the curve equation.', 2, '$0=1-2k+3$ gives $k=2$.', 'The point satisfies the curve and the line.'),
    number(substitution, 'Find $p$ in this case.', -2, 'The line gives $0=2(1)+p$, so $p=-2$.', 'Substitute both coordinates into the line.'),
    select(substitution, 'Find the other point of intersection.', ['(5,8)','(5,12)','(-5,-12)','(1,5)'], 0,
      'Equating gives $x^2-6x+5=(x-1)(x-5)=0$. The other root is $5$ and $y=2(5)-2=8$.', 'The second factor gives the other intersection.'),
    select(intersection, 'With $k=2$ fixed and $p$ free, when do the graphs not intersect?', ['p<-6','p\\le-6','p>-6','p<-3'], 0,
      '$x^2-6x+3-p=(x-3)^2-6-p$. Its minimum is positive exactly when $p<-6$.', 'Exclude equality: at p=−6 the graphs touch.'),
  ]),
  make(29, 'Find the gradients that miss a curve', 'Compare $y=2x^2+4x+10$ with $y=kx+2$.', [
    select(intersection, 'When are there no intersection points?', ['-12<k<4','-4<k<12','-4\\le k\\le12','k<-4\\text{ or }k>12'], 1,
      '$\\Delta=(k-4)^2-64$. Its zeros are $-4$ and $12$. The upward-opening discriminant graph is below zero between the zeros.', 'The interior interval gives a negative discriminant.'),
  ]),
  make(30, 'Read two crossings, then vary a parameter', 'Compare $y=x^2-kx$ with $y=2x+p$.', [
    select(substitution, 'For $k=1$ and $p=4$, find both intersection points.', ['(-1,2),(4,12)','(-1,2),(4,8)','(-4,-4),(1,6)','(1,6),(4,12)'], 0,
      '$x^2-3x-4=(x+1)(x-4)=0$. The line $y=2x+4$ gives the two ordinates.', 'Find both roots, then substitute each one into the line.'),
    select(intersection, 'If $p=-4$ instead, when do the graphs fail to meet?', ['-6<k<2','-2<k<6','k<-6\\text{ or }k>2','-6\\le k\\le2'], 0,
      '$\\Delta=(k+2)^2-16$. Its zeros are $-6$ and $2$. Its upward graph lies below zero between the two values.', 'A repeated root at either endpoint gives one common point.'),
  ]),
  make(31, 'Substitute into a curve written in x and y', 'Consider the curve $x^2+2y^2=6$ and the line $y=x-1$.', [
    select(substitution, 'Give both points of intersection.', ['(-\\tfrac23,-\\tfrac53),(2,2)','(-\\tfrac23,-\\tfrac53),(2,1)','(-\\tfrac23,\\tfrac53),(2,1)','(-2,-3),(\\tfrac23,-\\tfrac13)'], 1,
      'Substitute $y=x-1$ to get $3x^2-4x-4=(3x+2)(x-2)=0$. Substituting the roots into the line gives $y=-5/3$ and $y=1$.', 'Square the entire expression x−1.'),
  ]),
  make(32, 'Two real roots with a parameter condition', 'Consider $kx^2+(k+1)x+2=0$.', [
    select(intersection, 'For which $k$ are there exactly two distinct real roots?', ['k<3-2\\sqrt2\\text{ or }k>3+2\\sqrt2','k<3-2\\sqrt2\\text{ or }k>3+2\\sqrt2,\\ k\\ne0','3-2\\sqrt2<k<3+2\\sqrt2','k\\ne0'], 1,
      'For $k\\ne0$, $\\Delta=k^2-6k+1=(k-3)^2-8$. Read the two outside intervals. At $k=0$ there is one linear root, so exclude it.', 'A positive discriminant cannot be used at a value that makes the leading coefficient zero.'),
  ]),
  make(33, 'Use a vertex to compare levels', 'Let $f(x)=4x^2+8x+5$.', [
    select(square, 'Choose the completed-square form.', ['4(x-1)^2+1','4(x+1)^2+1','4(x+1)^2-1','(4x+1)^2+1'], 1,
      '$4(x+1)^2$ expands to $4x^2+8x+4$. Add $1$.', 'Do not change the sign of the middle coefficient.'),
    select(intersection, 'For which $k$ has $f(x)=k$ no real root?', ['k\\le1','k<1','k>1','k\\ge1'], 1,
      'The horizontal line $y=k$ lies below the turning point when $k<1$.', 'The minimum value itself gives one repeated root.'),
    select(square, 'Solve $f(x)=7$ exactly.', ['x=-1\\pm\\tfrac{\\sqrt6}{2}','x=1\\pm\\tfrac{\\sqrt6}{2}','x=-1\\pm\\sqrt6','x=-1\\pm\\tfrac32'], 0,
      '$4(x+1)^2=6$, so $x+1=\\pm\\sqrt6/2$.', 'Divide by 4 before taking square roots.'),
  ]),
  make(34, 'Find a range, then recover scaled roots', 'Let $f(x)=px^2+6x+q$ for every real $x$.', [
    select(square, 'When $p=3$ and $q=7$, choose the completed-square form.', ['3(x+1)^2+4','3(x-1)^2+4','3(x+2)^2-5','3(x+1)^2+7'], 0,
      '$3x^2+6x+7=3(x+1)^2+4$.', 'Subtract the constant added by expanding the square.'),
    select(square, 'State the range in that case.', ['[4,\\infty)','(4,\\infty)','[-1,\\infty)','(-\\infty,4]'], 0,
      'The square is non-negative and reaches zero at $x=-1$, so $4$ is included.', 'The minimum is an attained output.'),
    number(substitution, 'If instead $q=-8$ and the roots are $m$ and $-4m$, find $m$.', 1,
      'The sum and product give $3pm=6$ and $-4pm^2=-8$. Hence $pm=2$ and $pm^2=2$, giving $m=1$.', 'Use both the sum and the product of the roots.'),
    number(substitution, 'Find the corresponding $p$.', 2, '$pm=2$ and $m=1$ give $p=2$.', 'Use the relation from the sum or the product.'),
  ]),
  make(35, 'Complete a square with a fractional shift', 'Consider $4x^2-12x+11$.', [
    select(square, 'Choose its completed-square form.', ['4(x-\\tfrac32)^2+2','4(x+\\tfrac32)^2+2','4(x-\\tfrac32)^2-2','4(x-3)^2+2'], 0,
      '$4(x-3/2)^2=4x^2-12x+9$. Add $2$.', 'Halve −3 after factoring out 4.'),
    number(square, 'Find the minimum value.', 2, 'The square is zero at $x=3/2$, where the value is $2$.', 'Give the minimum output, not the input where it occurs.'),
  ]),
  make(36, 'Use substitution with a reciprocal power', 'Solve $x^3+8/x^3=6$ for real $x\\ne0$.', [
    select(substitution, 'Choose the complete set of exact real solutions.', ['x=2,4','x=\\sqrt[3]2,\\sqrt[3]4','x=-\\sqrt[3]2,\\sqrt[3]4','x=\\pm\\sqrt[3]2'], 1,
      'Set $u=x^3\\ne0$. Multiplication by $u$ gives $u^2-6u+8=(u-2)(u-4)=0$. Take real cube roots.', 'Solve for u first, then take a cube root for each value.'),
  ]),
]

