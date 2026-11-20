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
  exercise(21, 'Reflection followed by an upward shift', 'The graph of $y=f(x)$ is transformed to $y=7-f(x)$.', [
    select(transform, 'Which transformation comes first if the translation is upwards?', 'Reflection in the $x$-axis', ['Reflection in the $y$-axis', 'Stretch parallel to the $x$-axis', 'Stretch parallel to the $y$-axis'], 'Apply $y\\mapsto-y$ first, then $y\\mapsto y+7$.', 'Negating the output changes the sign of the vertical coordinate.'),
    vector('Enter the translation vector for the second transformation.', [0, 7], 'After reflection, add 7 to each output. The vector is $\\binom{0}{7}$.'),
  ]),
  exercise(22, 'Invert a radical quotient', 'Let $f(x)=x/\\sqrt{9-x^2}$ for $-3<x<3$, and $g(x)=3x$ for $-a<x<a$.', [
    select(inverse, 'Which line is the mirror line between $f$ and $f^{-1}$?', '$y=x$', ['$y=-x$', '$x=0$', '$y=0$'], 'The inverse interchanges input and output, so $(u,v)$ is reflected to $(v,u)$.', 'The inverse graph is obtained by swapping coordinates.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$3x/\\sqrt{1+x^2}$', ['$-3x/\\sqrt{1+x^2}$', '$3x/\\sqrt{1-x^2}$', '$3x^2/(1+x^2)$'], 'From $x=t/\\sqrt{9-t^2}$, squaring gives $t^2(1+x^2)=9x^2$. Since $t$ and $x$ have the same sign, $t=3x/\\sqrt{1+x^2}$.', 'Squaring loses the sign information. Recover it from the original relation.'),
    number(domain, 'Find the greatest $a$ for which $fg$ is defined throughout the domain of $g$.', 1, 'The image $(-3a,3a)$ must fit inside $(-3,3)$. At the limiting value, the open endpoints coincide, giving $a=1$.', 'Both intervals are open.'),
    select(compose, 'Using that $a$, simplify $fg(x)$.', '$x/\\sqrt{1-x^2}$', ['$3x/\\sqrt{1-x^2}$', '$x/\\sqrt{9-x^2}$', '$x/\\sqrt{1+x^2}$'], '$f(3x)=3x/\\sqrt{9-9x^2}=x/\\sqrt{1-x^2}$.', 'Taking the square root of 9 contributes a factor of 3.'),
  ]),
  exercise(23, 'Stretch then translate a standard parabola', 'Start with $y=x^2$ and aim for $y=3x^2+12x+17$.', [
    select(square, 'Choose the completed-square form of the target.', '$3(x+2)^2+5$', ['$3(x+2)^2+17$', '$3(x-2)^2+5$', '$3(x+4)^2+5$'], 'Expand $3(x+2)^2$ to get constant 12, then add 5.', 'Multiply the square correction by the leading coefficient.'),
    number(transform, 'If the stretch is applied first, find its scale factor parallel to the $y$-axis.', 3, 'Stretch $y=x^2$ vertically by factor 3 to obtain $y=3x^2$.', 'This sequence starts with a vertical stretch.'),
    vector('Enter the translation vector to apply after stretching.', [-2, 5], 'From $y=3x^2$, move left 2 and up 5 using $\\binom{-2}{5}$.'),
  ]),
  exercise(24, 'Treat a square root as the input variable', 'For $x\\ge0$, let $f(x)=x-6\\sqrt{x}+2$ and $h(x)=\\sqrt{x}-3$. Let $g(t)=mt^2+n$ for $t\\ge-3$.', [
    select(compose, 'Solve $f(x)=0$ exactly.', '$x=16\\pm6\\sqrt7$', ['$x=3\\pm\\sqrt7$', '$x=16\\pm2\\sqrt7$', '$x=16+6\\sqrt7\\text{ only}$'], 'Set $u=\\sqrt{x}$. Then $(u-3)^2=7$ and both $3\\pm\\sqrt7$ are positive. Squaring gives $x=16\\pm6\\sqrt7$.', 'The quadratic gives values of the square root of the original variable.'),
    select(compose, 'Find $m$ and $n$ if $gh(x)=f(x)$ for all $x\\ge0$.', '$m=1,\\ n=-7$', ['$m=1,\\ n=2$', '$m=3,\\ n=-7$', '$m=1,\\ n=7$'], 'Since $f(x)=(\\sqrt{x}-3)^2-7$, match the coefficient and constant in $m(h(x))^2+n$.', 'Completing the square introduces 9, so the outside constant changes.'),
  ]),
  exercise(25, 'Range of a quotient and why it cannot compose with itself', 'Let $f(x)=(x^2-9)/(x^2+9)$ for $x>3$.', [
    select(inverse, 'Choose $f^{-1}(x)$.', '$3\\sqrt{(1+x)/(1-x)}$', ['$3\\sqrt{(1-x)/(1+x)}$', '$-3\\sqrt{(1+x)/(1-x)}$', '$9(1+x)/(1-x)$'], '$x(t^2+9)=t^2-9$ gives $(1-x)t^2=9(1+x)$. Select the positive root because $t>3$.', 'Choose the root on the original domain.'),
    select(domain, 'Which rewrite and range are correct?', '$1-18/(x^2+9),\\ 0<f(x)<1$', ['$1-9/(x^2+9),\\ 0<f(x)<1$', '$1-18/(x^2+9),\\ 0\\le f(x)<1$', '$1+18/(x^2+9),\\ f(x)>1$'], 'Subtract 18 from the denominator to recover the numerator. The quotient $18/(x^2+9)$ lies strictly between 0 and 1.', 'Neither bound is attained.'),
    select(compose, 'Why is $ff$ undefined for all original inputs?', 'Every output of the inner function is less than 1, while the outer input must exceed 3.', ['The two functions have different formulas.', 'An inverse does not exist.', 'The inner function has negative outputs.'], 'The range $(0,1)$ and the required outer domain $(3,\\infty)$ are disjoint.', 'The test concerns the inner range and the outer domain.'),
  ]),
  exercise(26, 'Translate a quadratic and recognise a horizontal stretch', 'Start with $y=x^2-4x+1$.', [
    select(transform, 'Translate by $\\binom{2}{-3}$. Choose the expanded equation.', '$y=x^2-8x+10$', ['$y=x^2-8x+16$', '$y=x^2-4x-2$', '$y=x^2-6$'], 'Use $(x-2)^2-4(x-2)+1-3=x^2-8x+10$.', 'A rightward translation replaces $x$ with $x-2$.'),
    number(transform, 'What scale factor parallel to the $x$-axis produces $y=9x^2-12x+1$ instead?', 1/3, 'The target is $f(3x)$, so horizontal distances are multiplied by $1/3$.', 'Use the reciprocal of the input multiplier.'),
  ]),
  exercise(27, 'Open endpoint and a composite quadratic', 'Let $f(x)=3x^2-18x+23$ for $x<2$ and $g(x)=2x+6$ for $x<-2$.', [
    select(square, 'Choose the completed-square form.', '$3(x-3)^2-4$', ['$3(x-3)^2+23$', '$3(x+3)^2-4$', '$3(x-6)^2-4$'], '$3(x^2-6x)+23=3[(x-3)^2-9]+23$.', 'The term removed inside is multiplied by 3.'),
    select(domain, 'Choose the range of $f$.', '$f(x)>-1$', ['$f(x)\\ge-1$', '$f(x)>-4$', '$f(x)<-1$'], 'As $x$ approaches 2 from the left, the output decreases towards $-1$, which is excluded.', 'Use the boundary of the restricted domain.'),
    select(inverse, 'Choose the inverse formula.', '$3-\\sqrt{(x+4)/3}$', ['$3+\\sqrt{(x+4)/3}$', '$3-\\sqrt{x+4}/3$', '$-3-\\sqrt{(x+4)/3}$'], 'Solve $3(t-3)^2=x+4$ with $t-3<0$.', 'The left branch requires a negative square root.'),
    select(compose, 'Choose $fg(x)$ in expanded form.', '$12x^2+36x+23$', ['$12x^2+18x+23$', '$12x^2+36x-4$', '$3x^2+18x+23$'], '$fg(x)=3(2x+3)^2-4=12x^2+36x+23$.', 'Square the whole linear expression.'),
  ]),
  exercise(28, 'Compare two completed squares', 'Let $f(x)=x^2-6x+11$ and $g(x)=3x^2+12x+18$.', [
    select(square, 'Choose both completed-square forms.', '$f(x)=(x-3)^2+2,\\ g(x)=3(x+2)^2+6$', ['$f(x)=(x-3)^2+2,\\ g(x)=3(x+2)^2+18$', '$f(x)=(x+3)^2+2,\\ g(x)=3(x-2)^2+6$', '$f(x)=(x-3)^2+11,\\ g(x)=3(x+2)^2+6$'], 'Subtract 9 from the first constant and 12 from the second.', 'Scale the correction by the leading coefficient.'),
    select(compose, 'Choose $g$ in the form $kf(x+h)$.', '$3f(x+5)$', ['$3f(x-5)$', '$f(3x+5)$', '$3f(x+2)$'], '$3f(x+5)=3[(x+2)^2+2]$.', 'Shift the position of the vertex from 3 to $-2$.'),
    number(transform, 'Find the scale factor of the vertical stretch.', 3, 'The output of $f(x+5)$ is multiplied by 3.', 'The multiplier is outside the function.'),
    vector('Enter the translation vector.', [-5, 0], 'The input $x+5$ shifts the graph by $\\binom{-5}{0}$. This horizontal shift commutes with the vertical stretch.'),
  ]),
  exercise(29, 'Map the landmarks of a piecewise linear graph', 'The graph of $y=f(x)$ consists of line segments joining $(-9,2)$, $(0,-1)$ and $(6,3)$ in that order. Stretch horizontally by factor $1/3$, then translate by $\\binom{0}{2}$ to obtain $y=g(x)$.', [
    select(transform, 'Which three landmarks should you join on the sketch of $g$?', '$(-3,4),\\ (0,1),\\ (2,5)$', ['$(-27,4),\\ (0,1),\\ (18,5)$', '$(-3,0),\\ (0,-3),\\ (2,1)$', '$(-1,2),\\ (2,-1),\\ (4,3)$'], 'Map each $(u,v)$ to $(u/3,v+2)$ and join the transformed landmarks with line segments.', 'Scale horizontal coordinates and shift vertical coordinates.'),
    select(transform, 'Choose the equation of $g$ in terms of $f$.', '$g(x)=f(3x)+2$', ['$g(x)=f(x/3)+2$', '$g(x)=f(3x+2)$', '$g(x)=f(3x)-2$'], 'At a new horizontal coordinate $x=u/3$, the old coordinate is $u=3x$. Add 2 to its output.', 'The input multiplier is the reciprocal of the coordinate scale factor.'),
  ]),
  exercise(30, 'Compositions, symmetry and a failed domain condition', 'Let $f(x)=x+4/x$ for $x>0$ and $g(x)=ax-2$ for real $x$.', [
    select(compose, 'Choose $gf(x)$.', '$a(x+4/x)-2$', ['$ax-2+4/x$', '$ax-2+4/(ax-2)$', '$a(x+4)/x-2$'], 'Apply the linear function to the entire expression $x+4/x$.', 'The multiplication by $a$ applies to both terms.'),
    number(compose, 'Find $a$ if $gf(4)=13$.', 3, '$f(4)=5$ and $5a-2=13$.', 'Evaluate the inner function first.'),
    select(inverse, 'Why does $f$ have no inverse on this domain?', '$f(1)=f(4)=5$, so $f$ is not one-to-one.', ['$f(1)\\ne f(4)$, so $f$ is not one-to-one.', '$f$ is undefined at 0.', '$f(x)$ has a positive range.'], 'Two distinct permitted inputs have the same output, so an inverse would have to assign two values to 5.', 'A restricted domain alone does not guarantee a one-to-one function.'),
    select(compose, 'If $a=3$, choose $g^{-1}f(x)$.', '$(x^2+2x+4)/(3x)$', ['$(x^2-2x+4)/(3x)$', '$(x^2+4)/(3x)$', '$(3x^2-2x+12)/x$'], '$g^{-1}(t)=(t+2)/3$; substitute $f(x)$ and use common denominator $3x$.', 'Undo subtraction by adding 2.'),
    select(domain, 'For $a=3$, why can $fg$ not be formed for all real inputs?', 'For example $g(0)=-2$, which is outside the domain of $f$.', ['$g(0)$ is undefined.', '$f(1)=5$ is outside the range of $g$.', '$g$ is not one-to-one.'], 'A single inner output outside the outer domain suffices to disprove the condition.', 'Check the range of the inner function against the domain of the outer one.'),
  ]),
  exercise(31, 'Invert a strictly bounded left branch', 'Let $f(x)=-3x^2-12x-5$ for $x<-4$.', [
    select(square, 'Choose the completed-square form.', '$7-3(x+2)^2$', ['$-5-3(x+2)^2$', '$7-3(x-2)^2$', '$-7-3(x+2)^2$'], '$-3(x^2+4x)-5=-3[(x+2)^2-4]-5$.', 'Distribute the negative coefficient to the correction.'),
    select(domain, 'Choose the range of $f$.', '$f(x)<-5$', ['$f(x)\\le-5$', '$f(x)<7$', '$f(x)>-5$'], '$x<-4$ implies $(x+2)^2>4$, and the output tends to $-5$ without reaching it.', 'The cutoff is excluded.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-2-\\sqrt{(7-x)/3}$', ['$-2+\\sqrt{(7-x)/3}$', '$2-\\sqrt{(7-x)/3}$', '$-2-\\sqrt{(x-7)/3}$'], '$t+2$ is negative for $t<-4$, so take the negative root of $(7-x)/3$.', 'Use the original domain to choose the sign.'),
  ]),
  exercise(32, 'Recover a circle from its stretched image', 'A circle is translated by $\\binom{5}{-2}$, then stretched parallel to the $y$-axis. The resulting ellipse has horizontal endpoints $(2,4)$ and $(8,4)$, and vertical endpoints $(5,-8)$ and $(5,16)$.', [
    number(transform, 'Find the scale factor of the stretch.', 4, 'The vertical semi-axis is 12 and the horizontal semi-axis remains the original radius of 3. The factor is $12/3$.', 'Compare semi-axes, or compare the two full diameters.'),
    number(transform, 'Find the original circle radius.', 3, 'The horizontal width stays 6, giving radius 3.', 'A vertical stretch preserves horizontal lengths.'),
    select(transform, 'Find the centre after the translation, before the stretch.', '$(5,1)$', ['$(5,4)$', '$(5,16)$', '$(0,3)$'], 'The ellipse centre is $(5,4)$. Undo the stretch by dividing its vertical coordinate by 4.', 'The horizontal coordinate is unaffected.'),
    select(transform, 'Find the original circle centre.', '$(0,3)$', ['$(10,-1)$', '$(0,-1)$', '$(5,1)$'], 'Undo $\\binom{5}{-2}$ by applying $\\binom{-5}{2}$ to $(5,1)$.', 'Undo transformations in reverse order.'),
  ]),
  exercise(33, 'Combine three stretches and reflections', 'Let $f(x)=2x^2+3x-1$. Stretch its graph horizontally by factor $1/3$, reflect in the $y$-axis, then stretch vertically by factor 2. The result has equation $y=g(x)$.', [
    select(transform, 'Choose the expanded formula for $g(x)$.', '$36x^2-18x-2$', ['$36x^2+18x-2$', '$-36x^2-18x+2$', '$12x^2-18x-2$'], 'The horizontal operations replace the input with $-3x$. The final output is $2f(-3x)=36x^2-18x-2$.', 'The quadratic term remains positive after horizontal reflection.'),
  ]),
  exercise(34, 'Solve an equation involving both orders of composition', 'Let $f(x)=-2x^2+3$ and $g(x)=-x^2-2$, both for $x\\le-1$.', [
    select(domain, 'Choose the range of $f$.', '$f(x)\\le1$', ['$f(x)<1$', '$f(x)\\le3$', '$f(x)\\ge1$'], 'The endpoint $-1$ gives the largest output, equal to 1.', 'The vertex is outside the specified domain.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-\\sqrt{(3-x)/2}$', ['$\\sqrt{(3-x)/2}$', '$-\\sqrt{(x-3)/2}$', '$-\\sqrt{3-x}/2$'], 'For an allowed input $t$, the equation $x=-2t^2+3$ gives the negative root.', 'The inverse must return an input at most $-1$.'),
    select(compose, 'Solve $fg(x)-gf(x)+42=0$ on the common domain of the compositions.', '$x=-2\\text{ or }x=-\\sqrt6$', ['$x=2\\text{ or }x=\\sqrt6$', '$x=-2$ only', '$x=-\\sqrt2\\text{ or }x=-\\sqrt3$'], 'Put $u=x^2$. The common domain requires $f(x)\\le-1$, so $u\\ge2$. Here $fg=-2u^2-8u-5$ and $gf=-4u^2+12u-11$. Subtracting and adding 42 gives $2(u-4)(u-6)=0$. Both roots are admissible, giving $x=-2$ or $x=-\\sqrt6$.', 'Check the outer-domain conditions in both orders.'),
  ]),
  exercise(35, 'Read a vertical stretch and horizontal translation', 'Compare $y=f(x)$ with $y=5f(x-4)$.', [
    number(transform, 'Find the scale factor of the stretch parallel to the $y$-axis.', 5, 'The output of $f$ is multiplied by 5.', 'An outside multiplier acts on the vertical coordinate.'),
    vector('Enter the translation vector.', [4, 0], 'Replacing $x$ by $x-4$ shifts the graph right by 4, so the vector is $\\binom{4}{0}$.'),
  ]),
  exercise(36, 'Find parameters before inverting a reciprocal', 'Let $f(x)=2+3a/(x-a)$ for $x>a$ and $g(x)=bx+1$ on $\\mathbb R$. Given $f(8)=4$ and $gf(4)=37$.', [
    number(compose, 'Find $a$.', 16/5, '$3a/(8-a)=2$, so $5a=16$.', 'Multiply the entire difference $8-a$ by 2.'),
    number(compose, 'Find $b$.', 18/7, 'Using $a=16/5$, $f(4)=2+48/4=14$. Thus $14b+1=37$, which gives $b=18/7$.', 'Use the new value of $a$ to evaluate the inner function.'),
    select(domain, 'Choose the domain of $f^{-1}$.', '$x>2$', ['$x\\ge2$', '$x>16/5$', '$x<2$'], 'The positive reciprocal term has range $(0,\\infty)$. Hence the range of $f$ is $(2,\\infty)$.', 'The inverse domain comes from the original outputs.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$16/5+48/[5(x-2)]$', ['$16/5-48/[5(x-2)]$', '$2+48/[5(x-16/5)]$', '$48/[5(x-2)]-16/5$'], 'Rearrange $x-2=3a/(t-a)$ to $t=a+3a/(x-2)$.', 'Add back $a$ after isolating the denominator.'),
  ]),
  exercise(37, 'Recognise the horizontal stretch inside a function', 'Compare $y=f(x)$ and $y=f(x/4)+6$.', [
    number(transform, 'Find the scale factor parallel to the $x$-axis.', 4, 'An original input $u$ is reached at $x=4u$.', 'The scale factor is the reciprocal of the input coefficient.'),
    vector('Enter the translation vector.', [0, 6], 'The output increases by 6, so the vector is $\\binom{0}{6}$.'),
  ]),
  exercise(38, 'Invert and compose a shifted reciprocal', 'Let $f(x)=4-6/(x+1)$ for $x>-1$ and $g(x)=2x+2$ for $x>0$.', [
    select(domain, 'Choose the range of $f$.', '$f(x)<4$', ['$f(x)\\le4$', '$f(x)>4$', '$f(x)>-1$'], 'A positive quantity is subtracted from 4 and it can take any positive value.', 'The asymptote is excluded.'),
    select(inverse, 'Choose the inverse and its domain.', '$6/(4-x)-1,\\ x<4$', ['$6/(x-4)-1,\\ x<4$', '$6/(4-x)+1,\\ x<4$', '$6/(4-x)-1,\\ x>4$'], 'Solving $x=4-6/(t+1)$ gives $t+1=6/(4-x)$. The inverse domain is the range of $f$.', 'Preserve the sign when moving $x$ and 4 to the same side.'),
    select(compose, 'Write $fg(x)$ as a single quotient.', '$(8x+6)/(2x+3)$', ['$(8x+18)/(2x+3)$', '$(8x+6)/(2x+2)$', '$(4x+6)/(2x+3)$'], '$f(g(x))=4-6/(2x+3)=[4(2x+3)-6]/(2x+3)$.', 'Substitute for the whole input before combining fractions.'),
  ]),
  exercise(39, 'Why reflection and vertical translation do not commute', 'Let $R$ mean reflection in the $x$-axis and $T$ translation by $\\binom{-2}{3}$. Start with $y=x^2$.', [
    select(transform, 'Choose the equation after $R$ then $T$.', '$y=-(x+2)^2+3$', ['$y=-(x+2)^2-3$', '$y=-(x-2)^2+3$', '$y=(x+2)^2-3$'], 'Reflect to $-x^2$, then shift left 2 and up 3.', 'The translation is applied after the sign change.'),
    select(transform, 'Choose the equation after $T$ then $R$.', '$y=-(x+2)^2-3$', ['$y=-(x+2)^2+3$', '$y=-(x-2)^2-3$', '$y=(x+2)^2-3$'], 'Reflect the entire expression $(x+2)^2+3$ in the $x$-axis.', 'The sign changes on the constant as well.'),
    vector('Enter the translation mapping the first result to the second.', [0, -6], 'The vertices are $(-2,3)$ and $(-2,-3)$, so the vector is $\\binom{0}{-6}$.'),
  ]),
  exercise(40, 'Find the largest open interval for a composite', 'Let $f(x)=4x^2-16x+19$ on $p<x<q$. Let $g(x)=2x-1$ for $x<7$.', [
    select(square, 'Choose the completed-square form of $f$.', '$4(x-2)^2+3$', ['$4(x-2)^2+19$', '$4(x+2)^2+3$', '$4(x-4)^2+3$'], '$4(x-2)^2=4x^2-16x+16$, so add 3.', 'Check by expanding.'),
    { ...select(domain, 'Choose the widest interval for which $gf$ is defined on every input.', '$1<x<3$', ['$1\\le x\\le3$', '$x<1\\text{ or }x>3$', '$-1<x<1$'], 'Set $f(x)=7$ to find intersections at $x=1$ and $x=3$. The graph of $f(x)-7$ is an upward parabola and lies below the axis between them. Exclude the endpoints.', 'Match the required strict inequality to the part of the graph below the axis.'),
      signGraph: { roots: [1, 3], labels: ['1', '3'], variable: 'x', quantity: 'f(x) − 7', region: 'inside' } },
    select(compose, 'Choose the expanded expression for $gf(x)$.', '$8x^2-32x+37$', ['$8x^2-32x+39$', '$4x^2-16x+37$', '$8x^2-16x+37$'], '$gf(x)=2f(x)-1$.', 'Multiply the entire quadratic by 2.'),
    select(inverse, 'If $h(x)=4(x-2)^2+3$ for $x<0$, choose $h^{-1}(x)$.', '$2-\\sqrt{x-3}/2$', ['$2+\\sqrt{x-3}/2$', '$-2-\\sqrt{x-3}/2$', '$2-\\sqrt{(x-3)/2}$'], 'The original input satisfies $t-2<0$. Solve $4(t-2)^2=x-3$ on that branch.', 'Taking the square root of 4 gives 2.'),
  ]),
  exercise(41, 'Track the minimum through two transformations', 'For $y=x^2-6x+2$, apply a vertical stretch by factor 3, then translate by $\\binom{-2}{4}$.', [
    select(square, 'Find the original minimum point.', '$(3,-7)$', ['$(-3,-7)$', '$(3,2)$', '$(6,-7)$'], 'The original curve is $(x-3)^2-7$.', 'Set the squared bracket to zero.'),
    select(transform, 'Find the new minimum point.', '$(1,-17)$', ['$(5,-17)$', '$(1,-9)$', '$(1,-21)$'], 'Map $(3,-7)$ to $(3,-21)$, then to $(1,-17)$.', 'The vertical translation comes after multiplying the output by 3.'),
    select(transform, 'Choose the expanded equation of the new graph.', '$y=3x^2-6x-14$', ['$y=3x^2-6x-17$', '$y=3x^2+6x-14$', '$y=3x^2-18x-14$'], 'The new vertex form is $3(x-1)^2-17$. Expand it to obtain the result.', 'Include the constant contribution from expanding the square.'),
  ]),
  exercise(42, 'An inverse with parameter-dependent domain and range', 'Let $f(x)=(x+a)^2-2a$ for $x\\le-a$, where $a>0$. Let $g(x)=3x+6$ on $\\mathbb R$.', [
    select(inverse, 'Choose $f^{-1}(x)$.', '$-a-\\sqrt{x+2a}$', ['$-a+\\sqrt{x+2a}$', '$a-\\sqrt{x+2a}$', '$-a-\\sqrt{x-2a}$'], '$x+2a=(t+a)^2$ and $t+a\\le0$.', 'Choose the branch consistent with the original domain.'),
    select(domain, 'Choose the inverse domain and range, respectively.', '$x\\ge-2a,\\ f^{-1}(x)\\le-a$', ['$x\\le-a,\\ f^{-1}(x)\\ge-2a$', '$x>-2a,\\ f^{-1}(x)<-a$', '$x\\ge-2a,\\ f^{-1}(x)\\ge-a$'], 'The included vertex gives the minimum $-2a$ of $f$, and the original domain becomes the inverse range.', 'Swap domain and range, keeping the endpoints included.'),
    number(compose, 'For $a=3$, solve $gf(x)=0$.', -5, '$f(x)=-2$ implies $(x+3)^2=4$. Select $x=-5$ because $x\\le-3$.', 'Reject the value from the other branch.'),
  ]),
  exercise(43, 'Reciprocal range controls a linear composition', 'Let $f(x)=2+5/(x-3)$ for $x>3$ and $g(x)=3x-6$ for $x>1$.', [
    select(domain, 'Choose the range of $f$.', '$f(x)>2$', ['$f(x)\\ge2$', '$f(x)>3$', '$f(x)<2$'], 'The reciprocal term can take every positive value and never equals zero.', 'The asymptote is the excluded lower bound.'),
    select(inverse, 'Choose the inverse and its domain.', '$3+5/(x-2),\\ x>2$', ['$3+5/(x+2),\\ x>2$', '$3-5/(x-2),\\ x>2$', '$3+5/(x-2),\\ x>3$'], '$x-2=5/(t-3)$ leads to $t=3+5/(x-2)$. Use the range of $f$ as the new domain.', 'The inverse excludes inputs at and below 2.'),
    select(compose, 'Choose $gf(x)$ in simplified form.', '$15/(x-3)$', ['$15/(x-3)+6$', '$5/(3x-6)$', '$15/(x-3)-6$'], '$3(2+5/(x-3))-6=15/(x-3)$. All outputs of $f$ exceed 2, so they are permitted inputs to $g$.', 'Distribute 3 before subtracting 6.'),
  ]),
  exercise(44, 'Compare the ranges of two compositions', 'Let $f(x)=2(x-4)^2+k$ and $g(x)=3x-2$ on $\\mathbb R$.', [
    number(compose, 'The minimum of $gf$ is 19. Find $k$.', 7, '$gf(x)=6(x-4)^2+3k-2$. Its minimum is $3k-2=19$.', 'Apply $g$ to the minimum output of $f$ because $g$ is increasing.'),
    select(domain, 'For that value of $k$, choose the range of $fg$.', '$fg(x)\\ge7$', ['$fg(x)\\ge19$', '$fg(x)>7$', '$fg(x)\\le7$'], '$fg(x)=2(3x-6)^2+7$. The minimum is attained at $x=2$.', 'The inner linear function reaches every real number.'),
    select(inverse, 'Choose $g^{-1}(x)$.', '$(x+2)/3$', ['$(x-2)/3$', '$3x+2$', '$x/3+2$'], 'Solve $x=3t-2$ for $t$.', 'Undo the subtraction before dividing.'),
    select(compose, 'If $gh(x)=12x+13$, choose $h(x)$.', '$4x+5$', ['$4x+13/3$', '$4x+11/3$', '$36x+37$'], '$h(x)=g^{-1}(12x+13)=(12x+15)/3$.', 'Apply the inverse of the outer function.'),
  ]),
  exercise(45, 'Reflect and invert a restricted reciprocal square', 'Let $f(x)=3+9/x^2$ for $x<0$.', [
    select(inverse, 'On your sketch, which mirror line and point belong to the inverse construction?', '$y=x$ and $f^{-1}$ passes through $(4,-3)$.', ['$y=-x$ and $f^{-1}$ passes through $(4,-3)$.', '$y=x$ and $f^{-1}$ passes through $(-3,4)$.', '$x=0$ and $f^{-1}$ passes through $(3,4)$.'], 'Reflect $( -3,4)$ in $y=x$. The inverse is increasing for $x>3$, approaches the line $x=3$ downwards, and approaches $y=0$ from below to the right.', 'Swap the coordinates of points on the original graph.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-3/\\sqrt{x-3}$', ['$3/\\sqrt{x-3}$', '$-3/\\sqrt{3-x}$', '$-\\sqrt{x-3}/3$'], 'Isolate $t^2=9/(x-3)$ and take the negative root because $t<0$.', 'The inverse outputs must lie in the original domain.'),
    number(inverse, 'Solve $f(x)=7$.', -1.5, '$x^2=9/4$ and the original domain is negative.', 'Discard the positive root.'),
    select(domain, 'Why does $f(x)=f^{-1}(x)$ have no solution?', 'The two domains are disjoint.', ['The two formulas have the same domain.', 'The original graph is not one-to-one.', 'Both functions have only positive outputs.'], '$f$ needs $x<0$, while $f^{-1}$ needs $x>3$. No input belongs to both.', 'A common input is required before comparing the two outputs.'),
  ]),
  exercise(46, 'Order a vertical stretch and two offsets', 'Map $y=x^2$ to $y=5(x+4)^2-6$ using a vertical stretch followed by one translation.', [
    number(transform, 'Find the scale factor of the stretch parallel to the $y$-axis.', 5, 'The first transformation gives $y=5x^2$.', 'The outside multiplier multiplies vertical distances.'),
    vector('Enter the translation vector to apply second.', [-4,-6], 'From $y=5x^2$, shift left 4 and down 6, giving $5(x+4)^2-6$. The column vector is $\\binom{-4}{-6}$.'),
  ]),
  exercise(47, 'A square root selects only one branch', 'Let $f(x)=x-2$ for $x>2$, $g(x)=3x^2+2$ for real $x$, and $h(x)=3x^2+2$ for $x\\ge0$.', [
    select(inverse, 'Choose $f^{-1}(x)$.', '$x+2$', ['$x-2$', '$2-x$', '$1/(x-2)$'], 'Reverse the subtraction of 2 by adding 2, for inverse input $x>0$.', 'An inverse reverses the original operation.'),
    select(domain, 'Choose the range of $g$ and decide whether it has an inverse.', '$g(x)\\ge2$, and no inverse exists on $\\mathbb R$.', ['$g(x)>2$, and no inverse exists.', '$g(x)\\ge2$, and an inverse exists.', '$g(x)\\le2$, and an inverse exists.'], 'The vertex gives the included minimum 2. Also $g(1)=g(-1)$, so $g$ is not one-to-one.', 'The unrestricted graph has two branches.'),
    select(compose, 'Solve $hf(x)=f(19)$.', '$x=2+\\sqrt5$', ['$x=2-\\sqrt5$', '$x=\\sqrt5$', '$x=2+\\sqrt{17}$'], '$f(19)=17$, so $3(x-2)^2=15$. The condition $x>2$ selects the positive root of $(x-2)^2=5$.', 'The restriction on $f$ also limits the composite input.'),
  ]),
  exercise(48, 'Use a single intersection to recover a parameter', 'Let $f(x)=x^2-2x+3$ and $g(x)=2x+k$ for all real $x$.', [
    select(domain, 'Use completing the square to choose the range of $f$.', '$f(x)\\ge2$', ['$f(x)>2$', '$f(x)\\ge3$', '$f(x)\\le2$'], '$f(x)=(x-1)^2+2$, so the minimum is attained at $x=1$.', 'The new constant is 2 after completing the square.'),
    number(compose, 'The graphs $y=g^{-1}f(x)$ and $y=g(x)$ meet once. Find the horizontal coordinate of the intersection.', 3, 'Applying $g$ to both sides gives $f(x)=gg(x)=4x+3k$. The resulting quadratic is $(x-3)^2-6-3k=0$. A single root occurs at $x=3$ when the constant outside the square is zero.', 'One common point requires one real solution of the intersection equation.'),
    number(compose, 'Find the vertical coordinate of the intersection.', 4, 'The repeated-root condition gives $-6-3k=0$, hence $k=-2$. Substitute $x=3$ into $g(x)=2x-2$ to get 4.', 'Use the equation of the line after finding the parameter.'),
  ]),
  exercise(49, 'Turn a maximum into a minimum and restrict the graph', 'Let $f(x)=-3x^2+6x+2$ for real $x$. Let $g$ have the same formula for $x\\le0$.', [
    select(square, 'Choose the vertex form of $f$ and its range.', '$5-3(x-1)^2,\\ f(x)\\le5$', ['$5-3(x+1)^2,\\ f(x)\\le5$', '$5-3(x-1)^2,\\ f(x)\\ge5$', '$2-3(x-1)^2,\\ f(x)\\le2$'], '$-3(x^2-2x)+2=-3[(x-1)^2-1]+2$.', 'The graph opens downwards.'),
    select(transform, 'Which axis should you reflect in to turn the maximum into a minimum?', 'The $x$-axis', ['The $y$-axis', 'The line $y=x$', 'The line $y=-x$'], 'Negating $f(x)$ reverses vertical order, moving the vertex to $(1,-5)$.', 'A horizontal reflection does not reverse vertical order.'),
    vector('After reflection, enter the translation vector that puts the vertex at the origin.', [-1,5], 'Move the vertex $(1,-5)$ to $(0,0)$ using $\\binom{-1}{5}$.'),
    select(inverse, 'Describe the restricted graph and its inverse. Which inverse formula is correct?', '$g$ increases to $(0,2)$; $g^{-1}(x)=1-\\sqrt{(5-x)/3}$.', ['$g$ decreases to $(0,2)$; $g^{-1}(x)=1-\\sqrt{(5-x)/3}$.', '$g$ increases to $(0,2)$; $g^{-1}(x)=1+\\sqrt{(5-x)/3}$.', '$g$ increases to $(0,2)$; $g^{-1}(x)=1-\\sqrt{(x-5)/3}$.'], 'The left branch is strictly increasing, so it is one-to-one. Reflect it in $y=x$ to sketch the inverse with endpoint $(2,0)$. When solving $x=5-3(t-1)^2$, use $t-1<0$.', 'Choose the root on the restricted branch.'),
  ]),
  exercise(50, 'Reflect a fractional linear graph before composing', 'Let $f(x)=4+6/(x-2)$ for $x>2$ and $g(x)=2x+1$ on $\\mathbb R$.', [
    number(inverse, 'Find $f^{-1}(6)$.', 5, '$f(t)=6$ implies $6/(t-2)=2$ and $t=5$.', 'Inverse notation asks for the input that gives output 6.'),
    select(inverse, 'Choose the asymptotes of the inverse sketch.', '$x=4$ and $y=2$', ['$x=2$ and $y=4$', '$x=-4$ and $y=-2$', '$x=4$ and $y=-2$'], 'Reflect the original asymptotes $y=4$ and $x=2$ in $y=x$. Reflect $(5,6)$ to plot $(6,5)$ on the branch with $x>4$, $y>2$.', 'Reflect the asymptotes as well as the plotted points.'),
    select(inverse, 'Choose the inverse and its domain.', '$2+6/(x-4),\\ x>4$', ['$4+6/(x-2),\\ x>2$', '$2+6/(x-4),\\ x\\ne4$', '$2-6/(x-4),\\ x>4$'], 'Solve $x=4+6/(t-2)$. The original range is $(4,\\infty)$.', 'Use all of the original domain restriction to find the inverse domain.'),
    number(compose, 'Solve $fg(x)=f(7)$.', 3, 'Since $f$ is one-to-one, $g(x)=7$; solve $2x+1=7$. The inner output 7 is admissible.', 'Equal outputs imply equal inputs because $f$ is injective.'),
  ]),
  exercise(51, 'Recover three transformations from graph landmarks', 'A broken-line graph is formed by joining $(-2,1)$, $(0,0)$, $(3,2)$ on $y=f(x)$. A transformed graph joins $(-5,6)$, $(-2,0)$, $(0,3)$. Use a reflection in the $y$-axis, then a horizontal translation, then a vertical stretch.', [
    select(transform, 'Choose the axis of reflection.', 'The $y$-axis', ['The $x$-axis', 'The line $y=x$', 'The line $y=-x$'], 'The point at height 2 moves from the right of the zero-output point to its left. The reflection reverses horizontal order and preserves the signs of outputs.', 'A reflection in the horizontal axis reverses the signs of outputs.'),
    vector('Enter the translation after reflecting.', [-2,0], 'Reflection keeps $(0,0)$ fixed. Next move it to $(-2,0)$ by $\\binom{-2}{0}$.'),
    number(transform, 'Find the scale factor of the stretch parallel to the $y$-axis.', 3, 'The original output 2 now gives 6, and 1 now gives 3.', 'Use the ratio of the corresponding vertical coordinates.'),
    select(transform, 'Choose the transformed function.', '$3f(-x-2)$', ['$3f(-x+2)$', '$3f(x+2)$', '$f(-3x-2)$'], 'Reflection gives $f(-x)$. Translation left by 2 gives $f(-(x+2))$. Finally multiply the output by 3.', 'Apply the horizontal shift to the entire reflected expression.'),
  ]),
  exercise(52, 'Find the inverse at the least one-to-one cutoff', 'Let $f(x)=2x^2-12x+22$ for $x\\ge k$.', [
    select(square, 'Choose the completed-square form.', '$2(x-3)^2+4$', ['$2(x-3)^2+22$', '$2(x+3)^2+4$', '$2(x-6)^2+4$'], '$2(x-3)^2=2x^2-12x+18$. Add 4.', 'Halve the linear coefficient after factoring out 2.'),
    number(domain, 'Find the least $k$ for which $f$ has an inverse.', 3, 'The graph increases to the right of its vertex at $x=3$. A smaller cutoff would include points on both branches with equal outputs.', 'Use the vertex input as the boundary.'),
    select(inverse, 'With that $k$, choose $f^{-1}(x)$.', '$3+\\sqrt{(x-4)/2}$', ['$3-\\sqrt{(x-4)/2}$', '$-3+\\sqrt{(x-4)/2}$', '$3+\\sqrt{x-4}/2$'], 'Solve $2(t-3)^2=x-4$ with $t-3\\ge0$.', 'Take the square root of the entire quotient.'),
    number(compose, 'With the same $k$, solve $ff(x)=22$.', 4, 'Apply the inverse twice. First $f(x)=6$, then $x=4$. Both intermediate inputs are in the original domain.', 'Undo each application of $f$ separately.'),
  ]),
  exercise(53, 'Connect parameters through a transformed composite', 'Let $f(x)=2x^2-c$, $g(x)=3x+k$, with $c,k>0$. It is given that $g(c)=2k+5$.', [
    select(compose, 'Find the resulting formula for $gf(x)$.', '$6x^2-5$', ['$6x^2+5$', '$6x^2-k-5$', '$6x^2+k+5$'], '$3c+k=2k+5$ gives $3c=k+5$. Substitute into $gf(x)=6x^2-3c+k$.', 'Use the relation to eliminate $c$.'),
    select(transform, 'Translate $y=gf(x)$ by $\\binom{-1}{2}$, stretch vertically by factor $k$, then reflect in the $x$-axis. Find the new formula $h(x)$.', '$-6k(x+1)^2+3k$', ['$-6k(x-1)^2+3k$', '$-6k(x+1)^2-3k$', '$-6k(x+1)^2+5k+2$'], 'The translation gives $6(x+1)^2-3$. Scaling by $k$ and negating gives the result.', 'The vertical shift is scaled and then reflected along with the rest of the expression.'),
    select(domain, 'If the maximum of $h$ is 12, find $k$ and $c$.', '$k=4,\\ c=3$', ['$k=4,\\ c=9$', '$k=3,\\ c=4$', '$k=12,\\ c=3$'], '$3k=12$ gives $k=4$. Then $3c=k+5=9$.', 'Use the vertex output of the translated and scaled graph.'),
  ]),
  exercise(54, 'Transform a square-root graph and reverse it', 'Let $f(x)=\\sqrt{x}$ for $x\\ge0$ and $g(x)=4f(x-3)-2$ for $x\\ge3$. Let $h(x)=x-1$ for $x\\ge4$.', [
    number(transform, 'If the first operation is a vertical stretch, find its scale factor.', 4, 'Multiply the output of the square-root function by 4.', 'The stretch acts on $y$, not on $x$.'),
    vector('Enter the translation vector that follows the stretch.', [3,-2], 'The start of the graph moves from $(0,0)$ to $(3,-2)$ by $\\binom{3}{-2}$.'),
    select(inverse, 'Choose the mirror line and endpoint of the inverse sketch.', '$y=x$ and $(-2,3)$', ['$y=x$ and $(3,-2)$', '$y=-x$ and $(-2,3)$', '$y=x$ and $(2,3)$'], 'Swap the coordinates of $(3,-2)$ across $y=x$. The inverse rises to the right from $(-2,3)$, following the right-hand branch of a parabola.', 'The inverse graph swaps the endpoint coordinates.'),
    select(inverse, 'Choose the inverse formula.', '$3+(x+2)^2/16$', ['$3+(x-2)^2/16$', '$3+(x+2)^2/4$', '$3+\\sqrt{x+2}/4$'], 'For $x\\ge-2$, rearrange $(x+2)/4=\\sqrt{t-3}$ and square.', 'Squaring the factor 4 gives 16.'),
    select(domain, 'Choose the range of $g^{-1}$.', '$g^{-1}(x)\\ge3$', ['$g^{-1}(x)\\ge-2$', '$g^{-1}(x)>3$', '$g^{-1}(x)\\le3$'], 'The inverse range is the original domain, including the endpoint 3.', 'The inverse domain and range are different.'),
    number(compose, 'Find $g^{-1}h(7)$.', 7, '$h(7)=6$ and $g^{-1}(6)=3+64/16=7$.', 'The inverse is the outer function.'),
    select(domain, 'Why is $hg^{-1}$ undefined on part of the domain of $g^{-1}$?', '$g^{-1}(-2)=3$, but $h$ requires inputs at least 4.', ['$g^{-1}$ cannot take negative inputs.', '$h$ requires inputs less than 3.', '$g^{-1}$ has no value at $-2$.'], 'The range of $g^{-1}$ contains 3, which is outside the domain of $h$.', 'An endpoint in the inner range can invalidate the full composition.'),
  ]),
  exercise(55, 'Read a vertical stretch and shift from matching points', 'A graph is transformed by a vertical stretch followed by a vertical translation. The points $(-2,1)$ and $(4,4)$ become $(-2,-5)$ and $(4,4)$ respectively.', [
    number(transform, 'Find the scale factor of the stretch.', 3, 'The difference of the outputs changes from $4-1=3$ to $4-(-5)=9$. Thus the scale factor is 3.', 'Compare differences because the translation alters both output values equally.'),
    vector('Enter the translation vector for the second operation.', [0,-8], 'After stretching, the output 1 becomes 3. To reach $-5$, add $-8$. The vector is $\\binom{0}{-8}$.'),
  ]),
  exercise(56, 'Reverse the order to invert a composite', 'Let $f(x)=x^2+8x+12$ for $x\\le-4$ and $g(x)=2-x$ for $x\\ge-4$.', [
    select(square, 'Choose the completed-square form.', '$(x+4)^2-4$', ['$(x+4)^2+12$', '$(x-4)^2-4$', '$(x+8)^2-4$'], 'Subtract 16 after forming $(x+4)^2$.', 'The constant outside the square compensates for the square of 4.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-4-\\sqrt{x+4}$', ['$-4+\\sqrt{x+4}$', '$4-\\sqrt{x+4}$', '$-4-\\sqrt{x-4}$'], 'Since $t\\le-4$, use the negative root of $(t+4)^2=x+4$.', 'The inverse returns inputs on the left branch.'),
    select(compose, 'Choose $(gf)^{-1}(x)$.', '$-4-\\sqrt{6-x}$', ['$6+\\sqrt{x+4}$', '$-4+\\sqrt{6-x}$', '$-4-\\sqrt{x+6}$'], 'The range of $f$ fits into the domain of $g$. Invert in reverse order using $g^{-1}(x)=2-x$, then apply $f^{-1}$, for $x\\le6$.', 'The inverse of a composition reverses the order.'),
  ]),
  exercise(57, 'Find a quadratic parameter from a range or a nested value', 'Let $f(x)=x^2+2ax+a$ and define $g$ by $(g(x))^3=19x/2+8$, both on $\\mathbb R$.', [
    select(domain, 'If the minimum value of $f$ is $-6$, find the possible values of $a$.', '$a=-2\\text{ or }a=3$', ['$a=2\\text{ or }a=-3$', '$a=-6\\text{ or }a=1$', '$a=3\\text{ only}$'], '$f(x)=(x+a)^2+a-a^2$. Equating the minimum to $-6$ gives $(a-3)(a+2)=0$.', 'The minimum includes both the original constant and the square correction.'),
    number(compose, 'Instead, if $fgg(0)=37$, find $a$.', 4, '$g(0)=2$ and $g(2)=3$, so $f(3)=9+7a=37$.', 'Evaluate the two applications of $g$ from the inside out.'),
  ]),
  exercise(58, 'Complete the square before reflecting and translating', 'Map $y=x^2$ to $y=-x^2+8x-14$ using a reflection followed by a translation.', [
    select(square, 'Choose the completed-square form.', '$-(x-4)^2+2$', ['$-(x+4)^2+2$', '$-(x-4)^2-14$', '$-(x-4)^2-2$'], 'Expanding $-(x-4)^2$ gives $-x^2+8x-16$, so add 2.', 'Keep the negative sign in front of the entire square.'),
    select(transform, 'Choose the reflection.', 'Reflection in the $x$-axis', ['Reflection in the $y$-axis', 'Reflection in $y=x$', 'Reflection in $y=-x$'], 'Reflection in the $x$-axis changes $y=x^2$ to $y=-x^2$.', 'Change the sign of the output.'),
    vector('Enter the translation vector that follows the reflection.', [4,2], 'Move the maximum from $(0,0)$ to $(4,2)$ using $\\binom{4}{2}$.'),
  ]),
  exercise(59, 'Invert an increasing quadratic with a nonvertex endpoint', 'Let $f(x)=2(x+3)^2-5$ for $x\\ge0$ and $g(x)=3x-4$ on $\\mathbb R$.', [
    select(domain, 'Choose the range of $f$.', '$f(x)\\ge13$', ['$f(x)>13$', '$f(x)\\ge-5$', '$f(x)\\le13$'], 'The restricted graph increases from $f(0)=13$.', 'The unrestricted vertex is outside the domain.'),
    select(inverse, 'Choose $f^{-1}(x)$.', '$-3+\\sqrt{(x+5)/2}$', ['$-3-\\sqrt{(x+5)/2}$', '$3+\\sqrt{(x+5)/2}$', '$-3+\\sqrt{(x-5)/2}$'], 'Solve $2(t+3)^2=x+5$ with $t+3>0$.', 'Choose the root that can give $t\\ge0$.'),
    number(compose, 'Solve $gf(x)=131$.', 2, '$f(x)=45$ gives $(x+3)^2=25$. Keep $x=2$ because $x\\ge0$.', 'Apply the inverse of the outer function first.'),
  ]),
  exercise(60, 'Distinguish input scaling from output scaling', 'Consider two unrelated functions $f$ and $g$.', [
    number(transform, 'For $y=f(5x)-7$, enter the scale factor parallel to the $x$-axis.', 1/5, 'The same original input $u$ is reached at $x=u/5$.', 'Use the reciprocal of the coefficient inside the function.'),
    vector('Enter the translation vector in $y=f(5x)-7$.', [0,-7], 'A reduction of 7 in the output gives $\\binom{0}{-7}$.'),
    select(transform, 'Stretch $y=g(x)$ parallel to the $y$-axis by factor 4, then reflect in the $y$-axis. Choose the result.', '$y=4g(-x)$', ['$y=-4g(x)$', '$y=g(-4x)$', '$y=-g(x)/4$'], 'The stretch multiplies outputs by 4, then the reflection switches the sign of the input.', 'Reflection in the $y$-axis changes $x$, not $y$.'),
  ]),
  exercise(61, 'Use cubic landmarks to recover a transformation', 'A vertical stretch followed by a translation maps $y=x^3$ to $y=f(x)$. The landmarks $(0,0)$ and $(1,1)$ become $(-2,5)$ and $(-1,8)$.', [
    number(transform, 'Find the scale factor of the vertical stretch.', 3, 'The output difference increases from 1 to 3.', 'Compare differences to remove the effect of the shift.'),
    vector('Enter the translation vector after the stretch.', [-2,5], 'The stretched origin stays at $(0,0)$ and moves to $(-2,5)$ by $\\binom{-2}{5}$.'),
    select(transform, 'Choose $f(x)$ in the form $a(x+b)^3+c$.', '$3(x+2)^3+5$', ['$3(x-2)^3+5$', '$3(x+2)^3-5$', '$(3x+2)^3+5$'], 'Start with $3x^3$. Substitute $x+2$ and add 5.', 'A leftward shift adds to the original input.'),
  ]),
  exercise(62, 'Find when a reciprocal function equals its own inverse', 'Let $g(x)=2+12/(ax-4)$ for $x>4/a$, where $a>0$.', [
    select(inverse, 'Choose $g^{-1}(x)$ for $x>2$.', '$4/a+12/[a(x-2)]$', ['$2+12/(ax-4)$', '$4/a-12/[a(x-2)]$', '$4/a+12/[a(x+2)]$'], 'From $x-2=12/(at-4)$, obtain $at-4=12/(x-2)$ and divide by $a$.', 'Isolate the full denominator before solving for the input.'),
    select(inverse, 'Which statement verifies that $g^{-1}=g$ when $a=2$?', 'Both are $2+6/(x-2)$ on $x>2$.', ['Both are $2+6/(x-2)$ on all real inputs.', 'Both are $2-6/(x-2)$ on $x>2$.', 'The formulas coincide but the domains are disjoint.'], 'At $a=2$, the original denominator is $2(x-2)$ and the original domain is $x>2$. Both match the inverse.', 'Equality of functions requires equal formulas on the same domain.'),
  ]),
  exercise(63, 'Compose a fractional function with its scaled inverse', 'Let $f(x)=2+8/(x-3)$ for $x>3$.', [
    number(inverse, 'Given $f(a)=6$, find $a$.', 5, '$8/(a-3)=4$ gives $a-3=2$.', 'Solve for the denominator before adding 3.'),
    select(inverse, 'Choose the inverse and its domain.', '$3+8/(x-2),\\ x>2$', ['$3-8/(x-2),\\ x>2$', '$3+8/(x-2),\\ x>3$', '$2+8/(x-3),\\ x>3$'], 'Solve $x-2=8/(t-3)$. The original range is $(2,\\infty)$.', 'The inverse domain comes from the range, not from the original denominator restriction.'),
    number(compose, 'Let $g(x)=3+8/(4x-2)$ for $x>1/2$. If $fg(x)=kx$ for every allowed input, find $k$.', 4, 'Here $g(x)>3$ and $8/(g(x)-3)=4x-2$. Adding 2 gives $fg(x)=4x$.', 'The reciprocal cancels the full inner denominator.'),
  ]),
]
