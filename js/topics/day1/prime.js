/* ---------- 3. PRIME ---------- */
const TOPIC_PRIME = {
  id: 'prime',
  num: '04',
  title: 'Prime Number Check',
  tag: 'Math',
  intuition: 'A number n is prime if nothing from 2 to √n divides it evenly. We only need to check up to √n because factors always come in pairs (i, n/i) — one of every pair is ≤ √n.',
  time: 'O(√n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>n</label><input type="number" id="pr-n" value="47"><button class="primary" id="pr-apply">Apply</button><button id="pr-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [];
    function build(n) {
      steps = [];
      const bound = Math.floor(Math.sqrt(n));
      steps.push({ phase: 'start', n, bound });
      let isPrime = n > 1;
      let divisor = null;
      for (let i = 2; i <= bound; i++) {
        const rem = n % i;
        const found = rem === 0;
        steps.push({ phase: 'check', n, bound, i, rem, found });
        if (found) {
          isPrime = false;
          divisor = i;
          break;
        }
      }
      steps.push({ phase: 'result', n, bound, isPrime, divisor });
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_PRIME.id;
      if (s.phase === 'start') {
        stage.innerHTML = `<div class="equation"><div class="eq-box hl">n = ${s.n}</div></div><div class="decision">We only need to test divisors from 2 up to √${s.n} ≈ <b>${s.bound}</b></div>`;
        $(`#desc-${id}`).textContent = `Checking whether ${s.n} is prime. Boundary = √${s.n} ≈ ${s.bound}.`;
      } else if (s.phase === 'check') {
        stage.innerHTML = `<div class="equation">
          <div class="eq-box hl">${s.n}</div><span class="op">%</span><div class="eq-box hl">${s.i}</div>
          <span class="op">=</span><div class="eq-box ${s.found ? 'res' : ''}">${s.rem}</div>
        </div>`;
        $(`#desc-${id}`).textContent = s.found ? `${s.i} divides ${s.n} evenly → ${s.n} is NOT prime.` : `${s.i} does not divide ${s.n} evenly. Try next divisor.`;
      } else {
        stage.innerHTML = `<div class="equation"><div class="eq-box ${s.isPrime ? 'res' : 'hl'}">${s.n} is ${s.isPrime ? 'PRIME' : 'NOT PRIME'}${s.divisor ? ` (divisible by ${s.divisor})` : ''}</div></div>`;
        $(`#desc-${id}`).textContent = s.isPrime ? `No divisor found up to √${s.n} — it's prime!` : `Stopped early at divisor ${s.divisor} — no need to check further.`;
      }
      $(`#vars-${id}`).innerHTML = varsHTML({ n: s.n, bound: s.bound, i: s.i ?? '—', checked: i });
    }
    let player;
    function rebuild() {
      const n = Number($('#pr-n').value) || 2;
      build(n);
      $(`#player-mount-${TOPIC_PRIME.id}`).innerHTML = '';
      $(`#desc-${TOPIC_PRIME.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_PRIME.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#pr-apply').addEventListener('click', rebuild);
    $('#pr-random').addEventListener('click', () => {
      $('#pr-n').value = randomInt(10, 120);
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function isPrime(n):
    if n <= 1: return false
    for i from 2 to sqrt(n):
        if n % i == 0: return false
    return true`)}
      ${cppPanel(this.id,
`bool isPrime(int n){
    if(n <= 1) return false;
    for(int i=2; i*i<=n; i++){
        if(n % i == 0) return false;
    }
    return true;
}`)}
      ${pythonPanel(this.id,
`# Prime Check — O(sqrt(n))
def is_prime(n):
    if n <= 1:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

# Sieve of Eratosthenes — primes up to n
def sieve(n):
    is_p = [True] * (n + 1)
    is_p[0] = is_p[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_p[i]:
            for j in range(i*i, n+1, i):
                is_p[j] = False
    return [i for i in range(n+1) if is_p[i]]`)}
      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Prime Factors — Sorted Unique Prime Factors', slug: 'prime-factors5052', track: 'mathematics-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Trial division up to sqrt(n) extracting powers of prime factors.' },
        { lvl: 'easy', title: 'All Divisors of a Number', slug: 'all-divisors-of-a-number', track: 'mathematics-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Find all factor pairs (i, n/i) in O(sqrt(n)) time.' },
        { lvl: 'medium', title: 'Sieve of Eratosthenes (Primes up to N)', slug: 'sieve-of-eratosthenes5242', track: 'mathematics-siddhartha', isBatch: true, company: 'VMWare, MAQ Software, SAP Labs', hint: 'Compute primes in O(N log log N) by marking composite multiples.' },
        { lvl: 'medium', title: 'Nine Divisors', slug: 'nine-divisors3751', track: 'mathematics-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Numbers with 9 divisors take forms p^8 or p^2 * q^2 for prime p, q.' },
        { lvl: 'easy', title: 'Prime Number Check (O(sqrt(n)) Trial Division)', slug: 'prime-number2314', isBatch: false, company: 'Amazon, Samsung', hint: 'Basic primality test checking factors up to sqrt(n).' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
