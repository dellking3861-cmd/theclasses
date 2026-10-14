import { PageHeader } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Sub = ({ n }: { n: string }) => <sub>{n}</sub>;
const Sup = ({ n }: { n: string }) => <sup>{n}</sup>;

export default function CauchyEulerNotesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Cauchy–Euler Differential Equations"
        description="Integration techniques for variable-coefficient linear ODEs — notes with solved examples and exercises."
      />

      {/* Section 1 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">1</span>
            Introduction
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            A <strong className="text-slate-900">Cauchy–Euler equation</strong> (also called an <strong>equidimensional equation</strong>) is a linear ordinary differential equation whose coefficients are powers of the independent variable matching the order of the derivative. For an n-th order equation it has the form
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-center">
            <span className="text-slate-900 font-mono text-base">
              a<Sub n="n" />x<Sup n="n" />y<Sup n="(n)" /> + a<Sub n="n−1" />x<Sup n="n−1" />y<Sup n="(n−1)" /> + ··· + a<Sub n="1" />xy&apos; + a<Sub n="0" />y = f(x)
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            The key feature is that each term <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="k" />y<Sup n="(k)" /></code> is <em>equidimensional</em> — the power of x equals the order of the derivative. This structure allows a substitution that converts the equation into one with <strong>constant coefficients</strong>, which we can solve using standard techniques.
          </p>
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">2</span>
            The Key Substitution
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            For <strong>x &gt; 0</strong>, use the substitution
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 text-center">
            <span className="text-slate-900 font-mono text-lg">
              x = e<Sup n="t" />&nbsp;&nbsp;&nbsp;⟺&nbsp;&nbsp;&nbsp;t = ln x
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            Under this substitution, derivatives transform as follows:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-900 flex-shrink-0">xy&apos; = Dy</span>
              <span className="text-slate-500">where</span>
              <span className="font-mono text-sm text-slate-900">D = d/dt</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-900">x<Sup n="2"/>y&apos;&apos; = D(D − 1)y</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-900">x<Sup n="3"/>y<Sup n="&quot;,&quot;" /> = D(D − 1)(D − 2)y</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-900">x<Sup n="n"/>y<Sup n="(n)" /> = D(D − 1)···(D − n + 1)y</span>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            The original equation therefore becomes a linear ODE with <strong>constant coefficients</strong> in the new variable t. After solving for y(t), substitute back <strong>t = ln x</strong> to obtain y(x).
          </p>
          <p className="text-slate-700 leading-relaxed">
            For <strong>x &lt; 0</strong>, use the substitution <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x = −e<Sup n="t" /></code> (equivalently replace x by |x| throughout).
          </p>
        </CardContent>
      </Card>

      {/* Section 3 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">3</span>
            The Characteristic (Auxiliary) Equation
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Applying the substitution to the <strong>homogeneous</strong> Cauchy–Euler equation yields a polynomial in D:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-center">
            <span className="text-slate-900 font-mono text-base">
              a<Sub n="n" />D(D−1)···(D−n+1) + a<Sub n="n−1" />D(D−1)···(D−n+2) + ··· + a<Sub n="1" />D + a<Sub n="0" /> = 0
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            This is the <strong>characteristic equation</strong>. Its roots determine the form of the homogeneous solution exactly as in the constant-coefficient case:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Root Type</th>
                  <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Homogeneous Solution y<Sub n="h" />(x)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-900">Distinct real r<Sub n="1" />, r<Sub n="2" />, ..., r<Sub n="n" /></td>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-700">c<Sub n="1" />x<Sup n="r<sub>1</sub>" /> + c<Sub n="2" />x<Sup n="r<sub>2</sub>" /> + ··· + c<Sub n="n" />x<Sup n="r<sub>n</sub>" /></td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-900">Repeated real r (multiplicity m)</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-700">x<Sup n="r" />(c<Sub n="1" /> + c<Sub n="2" />ln x + ... + c<Sub n="m" />(ln x)<Sup n="m−1" />)</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-900">Complex α ± iβ</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono text-slate-700">x<Sup n="α" />[c<Sub n="1" />cos(β ln x) + c<Sub n="2" />sin(β ln x)]</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 4 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">4</span>
            Solved Examples
          </h2>

          {/* Example 1 */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Example 1 — Distinct Real Roots</h3>
            <p className="text-slate-700 mb-2">Solve&nbsp;<code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="2"/>y&apos;&apos; − 3xy&apos; + 4y = 0</code>,&nbsp;x &gt; 0.</p>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Step 1 — Substitute x = e<Sup n="t" />:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800 overflow-x-auto">
              x<Sup n="2"/>y&apos;&apos; → D(D−1)y, &nbsp; xy&apos; → Dy
              <br />
              [D(D−1) − 3D + 4]y = 0
              <br />
              (D<Sup n="2"/> − 4D + 4)y = 0
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Step 2 — Characteristic equation:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              r<Sup n="2"/> − 4r + 4 = 0 → (r − 2)<Sup n="2"/> = 0 → r = 2 (double root)
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Step 3 — Solution in t:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              y(t) = (c<Sub n="1" /> + c<Sub n="2" />t)e<Sup n="2t" />
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Step 4 — Back-substitute t = ln x:</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 font-mono text-sm text-slate-800">
              y(x) = (c<Sub n="1" /> + c<Sub n="2" />ln x) · x<Sup n="2" />
            </div>
          </div>

          {/* Example 2 */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Example 2 — Complex Roots</h3>
            <p className="text-slate-700 mb-2">Solve&nbsp;<code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="2"/>y&apos;&apos; + xy&apos; + y = 0</code>,&nbsp;x &gt; 0.</p>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Substitute x = e<Sup n="t" />:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800 overflow-x-auto">
              [D(D−1) + D + 1]y = 0
              <br />
              (D<Sup n="2"/> − D + D + 1)y = 0
              <br />
              D<Sup n="2"/>y + y = 0
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Characteristic equation:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              r<Sup n="2"/> + 1 = 0 → r = ±i &nbsp;(α = 0, β = 1)
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Solution:</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 font-mono text-sm text-slate-800">
              y(x) = c<Sub n="1" /> cos(ln x) + c<Sub n="2" /> sin(ln x)
            </div>
          </div>

          {/* Example 3 */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Example 3 — Third-Order Equation</h3>
            <p className="text-slate-700 mb-2">Solve&nbsp;<code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="3"/>y<Sup n="&quot;,&quot;" /> − 3x<Sup n="2"/>y&apos;&apos; + 6xy&apos; − 6y = 0</code>,&nbsp;x &gt; 0.</p>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Apply the substitution:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800 overflow-x-auto">
              x<Sup n="3"/>y<Sup n="&quot;,&quot;" /> → D(D−1)(D−2)y
              <br />
              x<Sup n="2"/>y&apos;&apos; → D(D−1)y
              <br />
              xy&apos; → Dy
              <br /><br />
              [D(D−1)(D−2) − 3D(D−1) + 6D − 6]y = 0
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Expand and simplify:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              (D<Sup n="3"/> − 3D<Sup n="2"/> + 2D) − 3(D<Sup n="2"/> − D) + 6D − 6
              <br />
              = D<Sup n="3"/> − 6D<Sup n="2"/> + 11D − 6 = 0
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Factor the characteristic polynomial:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              (r − 1)(r − 2)(r − 3) = 0 → r = 1, 2, 3
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Solution:</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 font-mono text-sm text-slate-800">
              y(x) = c<Sub n="1" />x + c<Sub n="2" />x<Sup n="2" /> + c<Sub n="3" />x<Sup n="3" />
            </div>
          </div>

          {/* Example 4 */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Example 4 — Initial Value Problem</h3>
            <p className="text-slate-700 mb-2">Solve&nbsp;<code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="2"/>y&apos;&apos; − 5xy&apos; + 8y = 0</code>,&nbsp;y(1) = 1,&nbsp;y&apos;(1) = 9.</p>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Substitute x = e<Sup n="t" />:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              [D(D−1) − 5D + 8]y = 0 → D<Sup n="2"/> − 6D + 8 = 0
              <br />
              (r − 2)(r − 4) = 0 → r = 2, 4
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">General solution:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              y(x) = c<Sub n="1" />x<Sup n="2" /> + c<Sub n="2" />x<Sup n="4" />
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Apply initial conditions:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              y(1) = c<Sub n="1" /> + c<Sub n="2" /> = 1
              <br />
              y&apos;(x) = 2c<Sub n="1" />x + 4c<Sub n="2" />x<Sup n="3" /> → y&apos;(1) = 2c<Sub n="1" /> + 4c<Sub n="2" /> = 9
              <br /><br />
              Solving: c<Sub n="1" /> = −1, c<Sub n="2" /> = 2
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 font-mono text-sm text-slate-800">
              y(x) = −x<Sup n="2" /> + 2x<Sup n="4" />
            </div>
          </div>

          {/* Example 5 */}
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 mb-2 text-base">Example 5 — Non-Homogeneous</h3>
            <p className="text-slate-700 mb-2">Solve&nbsp;<code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">x<Sup n="2"/>y&apos;&apos; − 3xy&apos; + 4y = x<Sup n="2"/>ln x</code>,&nbsp;x &gt; 0.</p>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Homogeneous part (same as Example 1):</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              y<Sub n="h" />(x) = (c<Sub n="1" /> + c<Sub n="2" />ln x)x<Sup n="2" />
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Transform to constant coefficients. With x = e<Sup n="t" />:</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              (D−2)<Sup n="2"/>y = te<Sup n="2t" />
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Particular solution via undetermined coefficients (resonance with double root):</p>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3 font-mono text-sm text-slate-800">
              (D−2)<Sup n="2"/>[At<Sup n="3" />e<Sup n="2t" />] = A·6te<Sup n="2t" /> → 6A = 1 → A = 1/6
            </div>
            <p className="font-semibold text-slate-900 mb-1 text-sm">Back-substitute:</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 font-mono text-sm text-slate-800">
              y<Sub n="p" />(x) = (1/6)x<Sup n="2" />(ln x)<Sup n="3" />
              <br /><br />
              y(x) = (c<Sub n="1" /> + c<Sub n="2" />ln x)x<Sup n="2" /> + 1/6·x<Sup n="2" />(ln x)<Sup n="3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">5</span>
            Exercise Questions
          </h2>
          <p className="text-slate-600 text-sm mb-4">Solve the following Cauchy–Euler equations. Assume x &gt; 0 unless stated otherwise.</p>

          <div className="space-y-4">
            {[
              { n: "A", q: "x^2 y'' − 3xy' + 4y = 0", hint: "Characteristic equation has a repeated root." },
              { n: "B", q: "x^2 y'' − 5xy' + 8y = 0", hint: "Two distinct real roots." },
              { n: "C", q: "x^2 y'' + xy' + 4y = 0", hint: "Complex conjugate roots." },
              { n: "D", q: "x^3 y''' + 6x^2 y'' + 7xy' + y = 0", hint: "Third-order — find the cubic characteristic equation." },
              { n: "E", q: "x^2 y'' − xy' + y = (ln x)^2,  y(1)=0, y'(1)=1", hint: "Non-homogeneous with initial conditions." },
              { n: "F", q: "x^2 y'' + 3xy' + y = 0", hint: "Repeated root scenario." },
              { n: "G", q: "2x^2 y'' − 5xy' + 2y = 0", hint: "Careful expansion of the characteristic polynomial." },
              { n: "H", q: "x^2 y'' − 5xy' + 9y = x^3,  x > 0", hint: "Use undetermined coefficients after substitution." },
            ].map((ex) => (
              <div key={ex.n} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex-shrink-0 mt-0.5">{ex.n}</span>
                  <div className="flex-1">
                    <p className="font-mono text-slate-900 text-sm mb-1">{ex.q}</p>
                    <p className="text-xs text-slate-500 italic">Hint: {ex.hint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 6 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">6</span>
            Solutions to Exercises
          </h2>

          <div className="space-y-6">
            {[
              {
                n: "A",
                answer: "y(x) = (c1 + c2 ln x) · x^2",
                steps: "D(D−1) − 3D + 4 = D^2 − 4D + 4 = (D−2)^2 → r = 2 (double root)."
              },
              {
                n: "B",
                answer: "y(x) = c1 x^2 + c2 x^4",
                steps: "D^2 − 6D + 8 = (D−2)(D−4) → r = 2, 4."
              },
              {
                n: "C",
                answer: "y(x) = c1 cos(2 ln x) + c2 sin(2 ln x)",
                steps: "D^2 + 1 = 0 → r = ±2i → α = 0, β = 2."
              },
              {
                n: "D",
                answer: "y(x) = (c1 + c2 ln x + c3 (ln x)^2) / x",
                steps: "D(D−1)(D−2) + 6D(D−1) + 7D + 1 = D^3 + 3D^2 + 3D + 1 = (D+1)^3 → r = −1 (triple root)."
              },
              {
                n: "E",
                answer: "y(x) = x[1 + (ln x)^4 / 12]",
                steps: "Homogeneous: D(D−1) → r = 0, 1. For RHS (ln x)^2 → t^2 e^t: shift gives D^2 u = t^2 → u = t^4/12. Apply ICs y(1)=0, y'(1)=1."
              },
              {
                n: "F",
                answer: "y(x) = x^(−1)(c1 + c2 ln x)",
                steps: "D(D−1) + 3D + 1 = D^2 + 2D + 1 = (D+1)^2 → r = −1 (double root)."
              },
              {
                n: "G",
                answer: "y(x) = c1 x^(1/2) + c2 x^2",
                steps: "2D(D−1) − 5D + 2 = 2D^2 − 7D + 2 = (2D−1)(D−2) → r = 1/2, 2."
              },
              {
                n: "H",
                answer: "y(x) = (c1 + c2 ln x)x^3 + 1/2 x^3 (ln x)^2",
                steps: "Homogeneous: D^2 − 6D + 9 = (D−3)^2 → r = 3 (double). RHS x^3 → e^{3t}; resonance of order 2, try y_p = At^2 e^{3t}: 2A = 1 → A = 1/2."
              },
            ].map((sol) => (
              <div key={sol.n} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/50">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex-shrink-0 mt-0.5">{sol.n}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm mb-1">Solution:</p>
                    <p className="font-mono text-slate-800 text-sm mb-2">{sol.answer}</p>
                    <p className="text-xs text-slate-600">Steps: {sol.steps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 7 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">7</span>
            Quick Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Root r</th>
                  <th className="border border-slate-200 px-3 py-2 text-left text-slate-700 font-semibold">Term in y(x)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono">r (simple)</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono">x^r</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono">r (multiplicity m)</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono">{`x^r, x^r ln x, ..., x^r (ln x)^{m-1}`}</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-3 py-2 font-mono">α ± iβ</td>
                  <td className="border border-slate-200 px-3 py-2 font-mono">x^α cos(β ln x),&nbsp; x^α sin(β ln x)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-slate-700">
            <strong>Remember:</strong> Always check the domain. For x &lt; 0, replace every x with |x| and every ln x with ln|x|.
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-slate-400 py-4">
        Linear Algebra &amp; Differential Equations — Integration Techniques
      </div>
    </div>
  );
}
