/* ---------- 8. MISSING NUMBER (XOR) ---------- */
const TOPIC_MISSING = {
  id: 'missing',
  num: '09',
  title: 'Missing Number — XOR Trick',
  tag: 'Arrays',
  intuition: 'x ^ x = 0. If we XOR every number from 0..n with every number actually present in the array, every present number cancels out with its twin — only the missing number survives.',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>Array (0..n, one missing)</label><input type="text" class="arr-input" id="ms-arr" value="0,1,3,4,5"><button class="primary" id="ms-apply">Apply</button><button id="ms-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [], arr = [], n = 0;
    function build(a) {
      arr = a;
      n = arr.length;
      steps = [];
      let xorRange = 0, xorArr = 0;
      const total = Math.max(n + 1, arr.length);
      steps.push({ phase: 'start', xorRange, xorArr });
      for (let k = 0; k < total; k++) {
        if (k <= n) xorRange ^= k;
        if (k < arr.length) xorArr ^= arr[k];
        steps.push({ phase: 'step', k, xorRange, xorArr, usedRange: k <= n, usedArr: k < arr.length });
      }
      steps.push({ phase: 'result', missing: xorRange ^ xorArr });
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_MISSING.id;
      if (s.phase === 'start') {
        stage.innerHTML = `<div class="equation"><div class="eq-box">range 0..${n}</div><span class="op">vs</span><div class="eq-box">array [${arr.join(', ')}]</div></div>`;
        $(`#desc-${id}`).textContent = `We'll XOR 0..${n} together, then XOR every array element together, then combine the two totals.`;
        $(`#vars-${id}`).innerHTML = varsHTML({ xorOfRange: 0, xorOfArray: 0 });
      } else if (s.phase === 'step') {
        stage.innerHTML = `<div class="equation" style="font-size:16px;">
          <div class="eq-box ${s.usedRange ? 'hl' : 'dim'}">rangeXOR →${s.xorRange}</div>
          <span class="op">|</span>
          <div class="eq-box ${s.usedArr ? 'hl' : 'dim'}">arrXOR →${s.xorArr}</div>
        </div>`;
        $(`#desc-${id}`).textContent = `Step k=${s.k}: ${s.usedRange ? `rangeXOR ^= ${s.k}` : ''}${s.usedRange && s.usedArr ? ' · ' : ''}${s.usedArr ? `arrXOR ^= ${arr[s.k]}` : ''}`;
        $(`#vars-${id}`).innerHTML = varsHTML({ k: s.k, xorOfRange: s.xorRange, xorOfArray: s.xorArr });
      } else {
        stage.innerHTML = `<div class="equation"><div class="eq-box res">Missing number = ${s.missing}</div></div>`;
        $(`#desc-${id}`).textContent = `rangeXOR ^ arrXOR = missing number — everything else cancelled out in pairs.`;
      }
    }
    let player;
    function rebuild() {
      const a = $('#ms-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      build(a);
      $(`#player-mount-${TOPIC_MISSING.id}`).innerHTML = '';
      $(`#desc-${TOPIC_MISSING.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_MISSING.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#ms-apply').addEventListener('click', rebuild);
    $('#ms-random').addEventListener('click', () => {
      const n2 = randomInt(5, 9);
      let full = Array.from({ length: n2 + 1 }, (_, k) => k);
      full.splice(randomInt(0, n2), 1);
      for (let k = full.length - 1; k > 0; k--) {
        const j = randomInt(0, k);
        [full[k], full[j]] = [full[j], full[k]];
      }
      $('#ms-arr').value = full.join(',');
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`xorRange = 0
for k from 0 to n: xorRange ^= k
xorArr = 0
for each x in array: xorArr ^= x
return xorRange ^ xorArr`)}
      ${cppPanel(this.id,
`int missingNumber(vector<int>& arr, int n){
    int xorRange = 0, xorArr = 0;
    for(int k=0; k<=n; k++) xorRange ^= k;
    for(int x : arr) xorArr ^= x;
    return xorRange ^ xorArr;
}

// Alternate: sum formula n*(n+1)/2 - actualSum (watch for overflow on large n)
int missingNumberSum(vector<int>& arr, int n){
    long long expected = (long long)n*(n+1)/2;
    long long actual = 0;
    for(int x : arr) actual += x;
    return (int)(expected - actual);
}`)}
      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Find Repetitive Element from 1 to N-1', slug: 'find-repetitive-element-from-1-to-n-1', track: 'bit-magic-siddhartha', isBatch: true, company: 'TCS, Infosys, Cognizant', hint: 'XOR all array elements with 1..N-1 to isolate the duplicate value.' },
        { lvl: 'easy', title: 'XOR of Numbers in a Range (L to R)', slug: 'find-xor-of-numbers-from-l-to-r', track: 'bit-magic-siddhartha', isBatch: true, company: 'Amazon, Adobe', hint: 'Compute XOR 1..R and XOR 1..(L-1) using O(1) modulo 4 pattern.' },
        { lvl: 'medium', title: 'Two Numbers with Odd Occurrences', slug: 'two-numbers-with-odd-occurrences5846', track: 'bit-magic-siddhartha', isBatch: true, company: 'Amazon, Microsoft, MakeMyTrip', hint: 'XOR all numbers, isolate the rightmost set bit (x & -x), partition into two buckets.' },
        { lvl: 'medium', title: 'Count Total Set Bits from 1 to N', slug: 'count-total-set-bits-1587115620', track: 'bit-magic-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Analyze bit frequencies at each power-of-2 bit position in O(log N) time.' },
        { lvl: 'medium', title: 'Power Set — Generate All Subsequences via Bits', slug: 'power-set4302', track: 'bit-magic-siddhartha', isBatch: true, company: 'Microsoft, Snapdeal, Amazon', hint: 'Loop mask from 0 to (1<<n)-1 checking which bits are set.' },
        { lvl: 'easy', title: 'Missing Number in Array (1 to N)', slug: 'missing-number-in-array1416', isBatch: false, company: 'Amazon, Flipkart, Microsoft', hint: 'XOR all array elements with 1..N so duplicate pairs cancel.' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
