import type { Exercise, Task } from './questions'

type Step = Omit<Task, 'id' | 'difficulty'>
const transform = 'Describe a graph transformation'
const inverse = 'Find an inverse function'
const domain = 'Determine a domain or range'
const compose = 'Use composite functions'
const square = 'Complete the square'
const select = (skill: string, prompt: string, correct: string, wrong: [string, string, string], solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'single', choices: [correct, ...wrong], correct: [0] }, solution, misconception })
const number = (skill: string, prompt: string, correct: number, solution: string, misconception: string): Step =>
  ({ skill, prompt, answer: { type: 'number', correct }, solution, misconception })
const vector = (prompt: string, correct: [number, number], solution: string): Step =>
  ({ skill: transform, prompt, answer: { type: 'vector', correct }, solution, misconception: 'Write the horizontal displacement above the vertical displacement.' })
const exercise = (position: number, title: string, context: string, steps: Step[]): Exercise => {
  const id = 'p1-fn-' + String(position).padStart(2, '0')
  return {
    id, title, context,
    tasks: steps.map((step, i) => {
      // Rotate the displayed answer so the correct option has no fixed position.
      const { answer } = step
      if (answer.type !== 'single') return { ...step, id: id + '-' + (i + 1), difficulty: 'standard' }
      const shift = (position + i) % answer.choices.length
      const choices = [...answer.choices.slice(shift), ...answer.choices.slice(0, shift)]
      return { ...step, id: id + '-' + (i + 1), difficulty: 'standard',
        answer: { ...answer, choices, correct: [(choices.length - shift) % choices.length] } }
    }),
  }
}

export const functionsCompanions: Exercise[] = [
  exercise(1, 'Horizontal enlargement and vertical shift', 'Compare $y=f(x)$ with $y=f(x/3)-4$.', [
    number(transform, 'Find the scale factor of the stretch parallel to the $x$-axis.', 3,
      'The same input to $f$ is reached at $x=3u$, so horizontal distances are multiplied by 3.', 'Use the reciprocal of the coefficient multiplying the input.'),
    vector('Enter the translation as a column vector.', [0, -4], 'The output is reduced by 4, with no additional horizontal displacement. The translation vector is $\\binom{0}{-4}$.'),
  ]),
  exercise(2, 'Restricted quadratic followed by a linear input', 'Let $f(x)=3x^2+12x+7$ for $x\\le-3$, and $g(x)=2x-1$ for $x\\le k$.', [
    select(square, 'Choose the completed-square form of $f(x)$.', '$3(x+2)^2-5$', ['$3(x+2)^2+7$', '$3(x+4)^2-5$', '$3(x-2)^2-5$'],
      '$3(x^2+4x)+7=3[(x+2)^2-4]+7=3(x+2)^2-5$.', 'The 4 removed inside the bracket is multiplied by 3.'),
    select(inverse, 'Choose the inverse and its domain.', '$-2-\\sqrt{(x+5)/3},\\ x\\ge-2$', ['$-2+\\sqrt{(x+5)/3},\\ x\\ge-2$', '$-2-\\sqrt{(x+5)/3},\\ x\\ge-5$', '$2-\\sqrt{(x+5)/3},\\ x\\le-2$'],
      'With $t\\le-3$, solving $x=3(t+2)^2-5$ requires the negative square root. The least output is $f(-3)=-2$.', 'Use the endpoint of the restricted domain to find the inverse domain.'),
    number(compose, 'When $k=-2$, solve $fg(x)=70$.', -3,
      '$g(x)+2=2x+1<0$. Hence $3(2x+1)^2=75$ gives $2x+1=-5$, so $x=-3$.', 'Keep only the root compatible with the composite domain.'),
    number(domain, 'Find the largest $k$ for which $fg$ is defined for every $x\\le k$.', -1,
      'The greatest output of $g$ is $2k-1$. Requiring $2k-1=-3$ gives the boundary $k=-1$; the increasing straight line lies below that boundary to its left.', 'The whole range of the inner function must be in the outer domain.'),
  ]),
  exercise(3, 'Recover two constants before composing', 'Let $f(x)=x/3-a$ and $g(x)=2x+b$, on $\\mathbb R$. Also $gg(3)=24$ and $f^{-1}(4)=21$.', [
    number(compose, 'Find $b$.', 4, '$gg(3)=2(6+b)+b=12+3b$. Equating to 24 gives $b=4$.', 'The constant occurs in both applications of $g$.'),
    number(inverse, 'Find $a$.', 3, '$f^{-1}(4)=21$ is equivalent to $f(21)=4$. Hence $7-a=4$.', 'Apply $f$ to both sides first.'),
    select(compose, 'Choose $gf(x)$.', '$2x/3-2$', ['$2x/3+1$', '$2x/3-5/3$', '$x/6-2$'],
      '$g(f(x))=2(x/3-3)+4=2x/3-2$.', 'Apply the outer function $g$ last.'),
  ]),
  exercise(4, 'When a self-composition meets an inverse', 'The function $f(x)=a-3x$ is defined on $\\mathbb R$.', [
    select(compose, 'Choose $ff(x)$.', '$9x-2a$', ['$9x+2a$', '$-9x-2a$', '$a-9x$'], '$a-3(a-3x)=9x-2a$.', 'Distribute the negative multiplier to both terms.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$(a-x)/3$', ['$(x-a)/3$', '$a-x/3$', '$(a+x)/3$'], 'Solving $x=a-3t$ for $t$ gives $(a-x)/3$.', 'Keep the entire numerator over 3.'),
    select(compose, 'Solve $ff(x)=f^{-1}(x)$.', '$x=a/4$', ['$x=a/3$', '$x=-a/4$', '$x=7a/26$'], '$27x-6a=a-x$, so $28x=7a$.', 'Multiply every term by 3 before collecting.'),
  ]),
  exercise(5, 'Read transformations from corresponding points', 'A landmark at $(2,3)$ on $y=f(x)$ is matched to a point on each transformed graph. All stretches are relative to the coordinate axes.', [
    select(transform, 'Which horizontal reflection takes the landmark to $(-2,3)$?', '$y=f(-x)$', ['$y=-f(x)$', '$y=f(x-4)$', '$y=f(x)+6$'], 'Reflection in the $y$-axis sends each $(x,y)$ to $(-x,y)$.', 'Identify which coordinate changes sign.'),
    select(transform, 'Which vertical stretch takes it to $(2,9)$?', '$y=3f(x)$', ['$y=f(3x)$', '$y=f(x/3)$', '$y=f(x)/3$'], 'The output becomes three times the original output at the same input.', 'A multiplier inside the input changes horizontal distances.'),
    select(transform, 'Which reflection and vertical stretch take it to $(2,-6)$?', '$y=-2f(x)$', ['$y=2f(-x)$', '$y=-f(2x)$', '$y=-f(x)/2$'], 'Multiply the output by 2 and reflect in the $x$-axis.', 'The input is unchanged under both operations.'),
  ]),
  exercise(6, 'Domain restriction before inverse and reciprocal', 'Let $f(x)=x^2-6x+8$ for $x>c$ and $g(x)=1/(x+2)$ for $x>-2$.', [
    select(square, 'Choose the completed-square form.', '$(x-3)^2-1$', ['$(x-3)^2+8$', '$(x+3)^2-1$', '$(x-6)^2-1$'],
      '$x^2-6x=(x-3)^2-9$.', 'Use half the linear coefficient.'),
    number(domain, 'Find the least $c$ for which $f$ is one-to-one.', 3,
      'A cutoff below 3 leaves inputs on both sides of the vertex with the same output.', 'Use the turning-point input.'),
    select(inverse, 'For $c=5$, choose $f^{-1}(x)$ and its domain.', '$3+\\sqrt{x+1},\\ x>3$', ['$3-\\sqrt{x+1},\\ x>3$', '$3+\\sqrt{x+1},\\ x\\ge3$', '$3+\\sqrt{x-1},\\ x>5$'],
      'The input is on the right branch. The excluded endpoint $5$ would give $f(5)=3$.', 'Exchanging domain and range preserves strict endpoints.'),
    select(compose, 'For $c=5$, choose $gf(x)$ and its range.', '$1/((x-3)^2+1),\\ 0<gf(x)<1/5$', ['$1/((x-3)^2+1),\\ 0<gf(x)\\le1/5$', '$1/((x-3)^2-1),\\ 0<gf(x)<1/3$', '$1/((x-3)^2+1),\\ gf(x)>1/5$'],
      'Since $f(x)>3$, the denominator $f(x)+2$ runs through all values greater than 5. Its reciprocal lies strictly between 0 and $1/5$.', 'Taking positive reciprocals reverses the order.'),
  ]),
  exercise(7, 'Compare the two orders of composition', 'Let $f(x)=x^2+2$ for $x>0$ and $g(x)=3x+2$ for $x>-2/3$.', [
    select(compose, 'Choose $fg(x)$.', '$(3x+2)^2+2$', ['$3x^2+8$', '$(3x+2)^2$', '$3(x^2+2)+2$'], 'Replace the input of $f$ with all of $g(x)$.', 'Square the entire inner expression.'),
    select(inverse, 'Choose $(fg)^{-1}(x)$ and its domain.', '$(\\sqrt{x-2}-2)/3,\\ x>2$', ['$(\\sqrt{x-2}-2)/3,\\ x\\ge2$', '$(-\\sqrt{x-2}-2)/3,\\ x>2$', '$\\sqrt{(x-2)/3}-2,\\ x>2$'],
      'The inner expression $3t+2$ is positive. After taking the positive root, subtract 2 and divide by 3.', 'The inverse domain is the range of the composite.'),
    select(compose, 'Solve $fg(x)-2=gf(x)$.', '$x=(\\sqrt{15}-3)/3$', ['$x=(3-\\sqrt{15})/3$', '$x=(-3-\\sqrt{15})/3$', '$x=(\\sqrt{15}-3)/6$'],
      'The common domain is $x>0$. Thus $(3x+2)^2=3x^2+8$, giving $3x^2+6x-2=0$. Its only positive root is $-1+\\sqrt{15}/3$.', 'Check the domains of both compositions before accepting roots.'),
  ]),
  exercise(8, 'Intersection of two inverse functions', 'Let $f(x)=3x-6$ on $\\mathbb R$ and $g(x)=9/(x+2)$ for $x\\ne-2$.', [
    number(compose, 'Find $fg(7)$.', -3, '$g(7)=1$, then $f(1)=-3$.', 'Evaluate the inner function first.'),
    select(inverse, 'Choose the solutions of $f^{-1}(x)=g^{-1}(x)$.', '$x=-6\\pm3\\sqrt7$', ['$x=\\pm3\\sqrt3$', '$x=6\\pm3\\sqrt7$', '$x=-6\\pm\\sqrt7$'],
      '$f^{-1}(x)=(x+6)/3$ and $g^{-1}(x)=9/x-2$. For $x\\ne0$, equating gives $x^2+12x-27=0$. Both roots are nonzero.', 'Remember the vertical offset in the inverse of the reciprocal function.'),
  ]),
  exercise(9, 'Complete the square and translate a parabola', 'Compare $y=x^2$ and $y=x^2-10x+18$.', [
    select(square, 'Choose the completed-square form of the second curve.', '$(x-5)^2-7$', ['$(x-5)^2+18$', '$(x+5)^2-7$', '$(x-10)^2-7$'], 'Half of $-10$ is $-5$, and $18-25=-7$.', 'Subtract the square of the half-coefficient.'),
    vector('Enter the translation vector from the first curve to the second.', [5, -7], 'The vertex moves from $(0,0)$ to $(5,-7)$, so the translation is $\\binom{5}{-7}$.'),
  ]),
  exercise(10, 'Fractional linear inverse and asymptote', 'Let $f(x)=3x/(2x-1)$ for $x>1/2$.', [
    select(inverse, 'Choose $f^{-1}(x)$.', '$x/(2x-3)$', ['$x/(3-2x)$', '$3x/(2x+1)$', '$(2x-1)/(3x)$'], 'Rearrange $x(2t-1)=3t$ to $(2x-3)t=x$.', 'Collect both terms containing the unknown input.'),
    select(domain, 'Which identity and range are correct?', '$f(x)=3/2+3/[2(2x-1)],\\ f(x)>3/2$', ['$f(x)=3/2-3/[2(2x-1)],\\ f(x)<3/2$', '$f(x)=3/2+3/[2(2x-1)],\\ f(x)\\ge3/2$', '$f(x)=3/2+3/(2x-1),\\ f(x)>3/2$'],
      'Writing $3x=(3/2)(2x-1)+3/2$ gives the identity. The reciprocal term takes all positive values as $x$ ranges over $(1/2,\\infty)$.', 'The horizontal asymptote is approached and never reached.'),
  ]),
  exercise(11, 'Read a stretch and shift from landmarks', 'A graph is transformed by a vertical stretch and a horizontal translation. Corresponding points are $(0,1)\\mapsto(-3,4)$ and $(2,2)\\mapsto(-1,8)$.', [
    number(transform, 'Find the scale factor of the stretch.', 4, 'Both outputs are multiplied by 4.', 'Use the change in output for a vertical stretch.'),
    vector('Enter the horizontal translation vector.', [-3, 0], 'Each input coordinate decreases by 3. The vector is $\\binom{-3}{0}$.'),
    select(transform, 'Choose the transformed equation in terms of $f$.', '$y=4f(x+3)$', ['$y=4f(x-3)$', '$y=f(4x+3)$', '$y=f(x+3)+4$'], 'The input $x+3$ shifts the graph left, and the outside multiplier stretches it vertically.', 'The sign inside the input is opposite to the horizontal displacement.'),
  ]),
  exercise(12, 'Left-hand branch and linear outer function', 'Let $f(x)=x^2+6x+11$ for $x\\le-3$ and $g(x)=3x-2$ for $x\\ge0$.', [
    select(square, 'Choose the completed-square form and range.', '$(x+3)^2+2,\\ f(x)\\ge2$', ['$(x+3)^2+2,\\ f(x)>2$', '$(x+3)^2+11,\\ f(x)\\ge11$', '$(x-3)^2+2,\\ f(x)\\ge2$'],
      '$f(x)=(x+3)^2+2$, with equality in the range at the included endpoint $-3$.', 'Include the endpoint because it is in the domain.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-3-\\sqrt{x-2}$', ['$-3+\\sqrt{x-2}$', '$3-\\sqrt{x-2}$', '$-3-\\sqrt{x+2}$'], 'The condition $t+3\\le0$ determines the negative square root.', 'The original function uses the left branch.'),
    number(compose, 'Solve $gf(x)=16$.', -5, '$3f(x)-2=16$ implies $f(x)=6$. Then $x=f^{-1}(6)=-5$.', 'Invert the outer operation first.'),
  ]),
  exercise(13, 'Inverse evaluation inside a repeated linear map', 'Let $f(x)=(x-3)^2-8$ for $x\\ge3$ and $g(x)=ax+1$ on $\\mathbb R$.', [
    select(domain, 'Choose the range of $f$.', '$f(x)\\ge-8$', ['$f(x)>-8$', '$f(x)\\le-8$', '$f(x)\\ge3$'], 'The minimum occurs at $x=3$ and equals $-8$.', 'The range describes outputs.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$3+\\sqrt{x+8}$', ['$3-\\sqrt{x+8}$', '$-3+\\sqrt{x+8}$', '$3+\\sqrt{x-8}$'], 'Since the input is at least 3, use $t-3=\\sqrt{x+8}$.', 'Use the right-hand branch.'),
    number(compose, 'For $a=-1$, solve $f(x)=g(x)$.', 5,
      'Equating gives $(x-5)x=0$. The root $x=0$ is outside the domain.', 'Only roots with $x\\ge3$ can solve the original equation.'),
    select(compose, 'Instead, if $ggf^{-1}(8)=31$, find the possible values of $a$.', '$a=2\\text{ or }a=-15/7$', ['$a=2\\text{ or }a=15/7$', '$a=3\\text{ or }a=-10/7$', '$a=-2\\text{ or }a=15/7$'],
      '$f^{-1}(8)=7$. Therefore $g(g(7))=7a^2+a+1=31$, giving $(a-2)(7a+15)=0$.', 'Apply $g$ twice, keeping its constant in both applications.'),
  ]),
  exercise(14, 'Identify and combine axis transformations', 'Start with $y=f(x)$ in the first two steps.', [
    number(transform, 'In $y=4f(x+2)$, find the scale factor of the vertical stretch.', 4, 'The multiplier 4 is applied to the entire output.', 'A change inside the bracket acts horizontally.'),
    vector('Enter the horizontal translation vector for $y=4f(x+2)$.', [-2, 0], 'The input $x+2$ shifts the graph left by 2, so the vector is $\\binom{-2}{0}$.'),
    select(transform, 'Reflect $y=\\cos x+2x$ in the $y$-axis and stretch horizontally by factor $1/4$. Choose the equation.', '$y=\\cos(4x)-8x$', ['$y=\\cos(4x)+8x$', '$y=\\cos(x/4)-x/2$', '$y=-\\cos(4x)-8x$'],
      'The input becomes $-4x$. Cosine is even, and the linear term changes to $-8x$.', 'Apply the changed input to both terms.'),
  ]),
  exercise(15, 'A quartic hidden in a self-composition', 'Let $f(x)=2x^2+1$ for $x\\ge0$.', [
    select(compose, 'Choose the expanded form of $ff(x)$.', '$8x^4+8x^2+3$', ['$8x^4+3$', '$4x^4+4x^2+2$', '$8x^4+8x^2+1$'],
      '$ff(x)=2(2x^2+1)^2+1=8x^4+8x^2+3$.', 'Include the cross term when squaring the bracket.'),
    number(compose, 'Solve $ff(x)=32x^2+35$.', 2,
      'Set $u=x^2$. The equation becomes $u^2-3u-4=(u-4)(u+1)=0$. Only $u=4$ is admissible, giving $x=2$.', 'The original domain also excludes the negative square root of 4.'),
  ]),
  exercise(16, 'Use two vertices to find the translation', 'Let $f(x)=x^2-6x+11$ and $g(x)=x^2+4x+1$.', [
    select(square, 'Choose the correct pair of completed-square forms.', '$f(x)=(x-3)^2+2,\\ g(x)=(x+2)^2-3$', ['$f(x)=(x-3)^2+11,\\ g(x)=(x+2)^2+1$', '$f(x)=(x+3)^2+2,\\ g(x)=(x-2)^2-3$', '$f(x)=(x-3)^2-2,\\ g(x)=(x+2)^2+3$'],
      'Subtract 9 from the constant for $f$ and 4 from the constant for $g$.', 'Keep track of the correction term in each square.'),
    select(transform, 'Write $g$ in terms of $f$.', '$g(x)=f(x+5)-5$', ['$g(x)=f(x-5)-5$', '$g(x)=f(x+5)+5$', '$g(x)=f(x-1)-5$'],
      '$f(x+5)=(x+2)^2+2$, which must be decreased by 5.', 'Check the new bracket after substitution.'),
    vector('Enter the translation vector from $y=f(x)$ to $y=g(x)$.', [-5, -5], 'The vertex moves from $(3,2)$ to $(-2,-3)$. The vector is $\\binom{-5}{-5}$.'),
  ]),
  exercise(17, 'A reciprocal input on a negative branch', 'Let $f(x)=x^2+2$ for $x<0$ and $g(x)=1/(3x+2)$ for $x<-2/3$.', [
    number(compose, 'Solve $fg(x)=3$.', -1, 'The reciprocal is negative, so $(g(x))^2=1$ implies $g(x)=-1$. Hence $3x+2=-1$.', 'The positive square root is inadmissible.'),
    select(inverse, 'Choose $(fg)^{-1}(x)$ for $x>2$.', '$(-2-1/\\sqrt{x-2})/3$', ['$(-2+1/\\sqrt{x-2})/3$', '$(-2-\\sqrt{x-2})/3$', '$(2-1/\\sqrt{x-2})/3$'],
      'Solve $1/(3t+2)=-\\sqrt{x-2}$, then take the reciprocal before isolating $t$.', 'Undo the square and reciprocal in reverse order.'),
  ]),
  exercise(18, 'Left branch of a downward parabola', 'Let $f(x)=-2x^2+12x-11$ for $x\\le k$.', [
    select(square, 'Choose the completed-square form.', '$7-2(x-3)^2$', ['$-11-2(x-3)^2$', '$7-2(x+3)^2$', '$-7-2(x-3)^2$'],
      '$-2(x-3)^2=-2x^2+12x-18$, so add 7.', 'Check the constant by re-expanding.'),
    number(domain, 'Find the greatest $k$ making $f$ one-to-one.', 3, 'The left branch is increasing until the vertex at $x=3$. Continuing past it repeats outputs.', 'Use the input at the vertex.'),
    select(domain, 'For $k=1$, choose the range of $f$.', '$f(x)\\le-1$', ['$f(x)<-1$', '$f(x)\\le7$', '$f(x)\\ge-1$'], '$f$ is increasing on the restricted domain and its maximum is $f(1)=-1$.', 'The unrestricted vertex is outside the domain.'),
    select(inverse, 'For $k=1$, choose $f^{-1}(x)$.', '$3-\\sqrt{(7-x)/2}$', ['$3+\\sqrt{(7-x)/2}$', '$3-\\sqrt{(x-7)/2}$', '$-3-\\sqrt{(7-x)/2}$'],
      'Solving $x=7-2(t-3)^2$ for $t\\le1$ requires the negative branch.', 'The inside of the square root must be nonnegative.'),
    select(transform, 'Translate $y=f(x)$ by $\\binom{2}{-3}$. Choose the expanded equation.', '$y=-2x^2+20x-46$', ['$y=-2x^2+4x+2$', '$y=-2x^2+20x-40$', '$y=-2x^2+12x-14$'],
      'The translated formula is $f(x-2)-3=4-2(x-5)^2=-2x^2+20x-46$.', 'Apply the horizontal shift inside the input before expanding.'),
  ]),
  exercise(19, 'Trace a point backwards through a transformation', 'The point $(3,2)$ is on $y=f(4x)+5$.', [
    select(transform, 'Identify the stretch used on $y=f(x)$.', 'Parallel to the $x$-axis, scale factor $1/4$', ['Parallel to the $x$-axis, scale factor $4$', 'Parallel to the $y$-axis, scale factor $1/4$', 'Parallel to the $y$-axis, scale factor $4$'],
      'Input $4x$ means the same value is reached at one quarter of the original horizontal coordinate.', 'Inside multipliers have a reciprocal scale factor.'),
    vector('Enter the translation vector.', [0, 5], 'The term $+5$ moves the graph up. The vector is $\\binom{0}{5}$.'),
    select(transform, 'Find the corresponding point on $y=f(x)$.', '$(12,-3)$', ['$(3/4,7)$', '$(12,7)$', '$(3/4,-3)$'],
      'Set $x=3$ in the transformed equation. Then $2=f(12)+5$, so $f(12)=-3$.', 'Undo the changes to both coordinates.'),
  ]),
  exercise(20, 'Compose and invert a fractional linear function', 'Let $f(x)=(2x+1)/(x-3)$ for $x>3$.', [
    number(compose, 'Find $ff(4)$.', 19/6, '$f(4)=9$, which is in the domain. Then $f(9)=19/6$.', 'Check that the first result is an allowed input for the second application.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$(3x+1)/(x-2)$', ['$(3x-1)/(x-2)$', '$(3x+1)/(2-x)$', '$(2x+1)/(x-3)$'],
      'From $x(t-3)=2t+1$ obtain $(x-2)t=3x+1$. The inverse is valid for $x>2$.', 'Distribute the input variable through the denominator.'),
  ]),
]
