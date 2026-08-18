/* ---------- 2. GCD ---------- */
const TOPIC_GCD = {
  id: 'gcd',
  num: '03',
  title: 'GCD — Euclidean Algorithm',
  tag: 'Math',
  intuition: 'GCD(a,b) = GCD(b, a % b). We keep replacing the bigger number with the remainder until the remainder is 0 — whatever is left is the answer.',
  time: 'O(log(min(a,b)))',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>a</label><input type="number" id="gcd-a" value="48">
        <label>b</label><input type="number" id="gcd-b" value="18">
        <button class="primary" id="gcd-apply">Apply</button>
        <button id="gcd-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [];
    function build(a, b) {
      steps = [{ a, b, mod: null, done: false }];
      let x = a, y = b;
      while (y !== 0) {
        const mod = x % y;
        steps.push({ a: x, b: y, mod, done: false });
        x = y;
        y = mod;
      }
      steps.push({ a: x, b: 0, mod: null, done: true, answer: x });
      return steps;
    }
    let player;
    function draw(i) {
      const s = steps[i];
      if (s.done) {
        stage.innerHTML = `<div class="equation"><div class="eq-box res">GCD = ${s.answer}</div></div>`;
        $(`#desc-${TOPIC_GCD.id}`).textContent = `Remainder reached 0. The last non-zero value, ${s.answer}, is the GCD.`;
      } else if (s.mod === null) {
        stage.innerHTML = `<div class="equation"><div class="eq-box hl">${s.a}</div><span class="op">and</span><div class="eq-box hl">${s.b}</div></div>`;
        $(`#desc-${TOPIC_GCD.id}`).textContent = `Starting values a = ${s.a}, b = ${s.b}.`;
      } else {
        stage.innerHTML = `<div class="equation">
          <div class="eq-box hl">${s.a}</div><span class="op">%</span><div class="eq-box hl">${s.b}</div>
          <span class="op">=</span><div class="eq-box res">${s.mod}</div>
        </div>`;
        $(`#desc-${TOPIC_GCD.id}`).textContent = `${s.a} % ${s.b} = ${s.mod} → next: a = ${s.b}, b = ${s.mod}`;
      }
      $(`#vars-${TOPIC_GCD.id}`).innerHTML = varsHTML({ a: s.a, b: s.b, remainder: s.mod === null ? '—' : s.mod });
    }
    function rebuild() {
      const a = Number($('#gcd-a').value) || 1, b = Number($('#gcd-b').value) || 1;
      build(a, b);
      $(`#player-mount-${TOPIC_GCD.id}`).innerHTML = '';
      $(`#desc-${TOPIC_GCD.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_GCD.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#gcd-apply').addEventListener('click', rebuild);
    $('#gcd-random').addEventListener('click', () => {
      $('#gcd-a').value = randomInt(20, 99);
      $('#gcd-b').value = randomInt(4, 60);
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function gcd(a, b):
    while b != 0:
        remainder = a % b
        a = b
        b = remainder
    return a`)}
      ${cppPanel(this.id,
`int gcd(int a, int b){
    while(b != 0){
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}
// Recursive version
int gcdRec(int a, int b){
    if(b==0) return a;
    return gcdRec(b, a%b);
}`)}
      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'GCD of Two Numbers (Euclidean Algorithm)', slug: 'gcd-of-two-numbers3459', track: 'mathematics-siddhartha', isBatch: true, company: 'Amazon, Infosys, TCS', hint: 'Euclidean reduction: gcd(a, b) = gcd(b, a % b).' },
        { lvl: 'easy', title: 'Modular Multiplication — (a * b) % m', slug: 'modular-multiplication', track: 'mathematics-siddhartha', isBatch: true, company: 'TCS, Wipro', hint: 'Prevent overflow by computing (a % m * b % m) % m.' },
        { lvl: 'easy', title: 'Modular Multiplicative Inverse', slug: 'modular-multiplicative-inverse-1587115620', track: 'mathematics-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Find integer x such that (a * x) % m = 1 using Extended Euclidean algorithm.' },
        { lvl: 'medium', title: 'Last Digit of a^b for Large Numbers', slug: 'find-last-digit-of-ab-for-large-numbers1936', track: 'mathematics-siddhartha', isBatch: true, company: 'Samsung, Directi', hint: 'Find cyclicity pattern of powers modulo 10.' },
        { lvl: 'medium', title: 'LCM and GCD Combined', slug: 'lcm-and-gcd4515', isBatch: false, company: 'Accolite, Morgan Stanley', hint: 'Utilize relationship: a * b = GCD(a, b) * LCM(a, b).' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
