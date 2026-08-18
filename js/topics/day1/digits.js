/* ---------- 4. DIGIT MANIPULATION ---------- */
const TOPIC_DIGITS = {
  id: 'digits',
  num: '05',
  title: 'Digit Manipulation — Sum / Palindrome / Armstrong',
  tag: 'Math',
  intuition: 'Almost every digit problem uses the same two moves: n % 10 pulls off the last digit, n / 10 drops it. Repeat until n becomes 0.',
  time: 'O(log₁₀ n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Mode</label>
        <select id="dg-mode">
          <option value="sum">Sum of Digits</option>
          <option value="pal">Palindrome Check</option>
          <option value="arm">Armstrong Number</option>
        </select>
        <label>n</label><input type="number" id="dg-n" value="153">
        <button class="primary" id="dg-apply">Apply</button>
        <button id="dg-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [];
    function build(n, mode) {
      const original = n;
      const digitCount = String(n).length;
      steps = [{ phase: 'start', n, mode, plate: [] }];
      let temp = n, sum = 0, rev = 0, powerSum = 0, plate = [];
      while (temp > 0) {
        const d = temp % 10;
        temp = Math.floor(temp / 10);
        sum += d;
        rev = rev * 10 + d;
        powerSum += Math.pow(d, digitCount);
        plate.unshift(d);
        steps.push({ phase: 'extract', n: original, mode, d, temp, sum, rev, powerSum, plate: [...plate] });
      }
      if (n === 0) {
        steps.push({ phase: 'extract', n: 0, mode, d: 0, temp: 0, sum: 0, rev: 0, powerSum: 0, plate: [0] });
      }
      let resultText = '';
      if (mode === 'sum') resultText = `Sum of digits of ${original} = ${sum}`;
      else if (mode === 'pal') resultText = `${original} reversed is ${rev} → ${rev === original ? 'PALINDROME ✅' : 'NOT a palindrome ❌'}`;
      else resultText = `${original}: sum of digits^${digitCount} = ${powerSum} → ${powerSum === original ? 'ARMSTRONG ✅' : 'NOT Armstrong ❌'}`;
      steps.push({ phase: 'result', text: resultText });
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_DIGITS.id;
      if (s.phase === 'start') {
        stage.innerHTML = `<div class="equation"><div class="eq-box hl">${s.n}</div></div><div class="decision">Extracting digits one at a time using <b>% 10</b> and <b>/ 10</b>.</div>`;
        $(`#desc-${id}`).textContent = `Starting with n = ${s.n}.`;
        $(`#vars-${id}`).innerHTML = varsHTML({ n: s.n });
      } else if (s.phase === 'extract') {
        stage.innerHTML = `<div class="boxes">${boxesHTML(s.plate, { 0: { cls: 'active' } })}</div>
        <div class="equation" style="font-size:16px;"><span class="op">digit extracted →</span><div class="eq-box res">${s.d}</div><span class="op">remaining n →</span><div class="eq-box">${s.temp}</div></div>`;
        $(`#desc-${id}`).textContent = `n % 10 = ${s.d} (digit), then n / 10 = ${s.temp}.`;
        const vars = s.mode === 'sum' ? { digit: s.d, remaining: s.temp, runningSum: s.sum }
          : s.mode === 'pal' ? { digit: s.d, remaining: s.temp, reversedSoFar: s.rev }
          : { digit: s.d, remaining: s.temp, powerSumSoFar: s.powerSum };
        $(`#vars-${id}`).innerHTML = varsHTML(vars);
      } else {
        stage.innerHTML = `<div class="equation"><div class="eq-box res" style="font-size:16px;">${s.text}</div></div>`;
        $(`#desc-${id}`).textContent = 'Final result computed from the digits we extracted.';
      }
    }
    let player;
    function rebuild() {
      const n = Number($('#dg-n').value) || 0;
      const mode = $('#dg-mode').value;
      build(n, mode);
      $(`#player-mount-${TOPIC_DIGITS.id}`).innerHTML = '';
      $(`#desc-${TOPIC_DIGITS.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_DIGITS.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#dg-apply').addEventListener('click', rebuild);
    $('#dg-mode').addEventListener('change', rebuild);
    $('#dg-random').addEventListener('click', () => {
      const mode = $('#dg-mode').value;
      $('#dg-n').value = mode === 'pal' ? [121, 1331, 45654, 909][randomInt(0, 3)] : mode === 'arm' ? [153, 370, 371, 407, 9474][randomInt(0, 4)] : randomInt(10, 9999);
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`temp = n
while temp > 0:
    digit = temp % 10
    temp = temp / 10
    // use digit: add to sum / build reverse / add digit^k`)}
      ${cppPanel(this.id,
`// Sum of digits
int sumOfDigits(int n){
    int sum=0;
    while(n>0){ sum += n%10; n/=10; }
    return sum;
}

// Palindrome check
bool isPalindrome(int n){
    int original=n, rev=0;
    while(n>0){ rev = rev*10 + n%10; n/=10; }
    return rev==original;
}

// Armstrong number
bool isArmstrong(int n){
    int original=n, sum=0, digits=to_string(n).size();
    while(n>0){
        int d=n%10;
        sum += pow(d, digits);
        n/=10;
    }
    return sum==original;
}`)}
      ${practicePanel(this.id, [
        { lvl: 'basic', title: 'Total Digits in 1 to N (Count Digits)', slug: 'total-digits4030', track: 'mathematics-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Count total digits across all integers from 1 to n.' },
        { lvl: 'easy', title: 'Trailing Zeroes in Factorial', slug: 'trailing-zeroes-in-factorial5134', track: 'mathematics-siddhartha', isBatch: true, company: 'Microsoft, MakeMyTrip, Amazon', hint: 'Count factors of 5 in n!: n/5 + n/25 + n/125 + ...' },
        { lvl: 'easy', title: 'Digital Root (Recursive Sum of Digits until Single Digit)', slug: 'digital-root', track: 'mathematics-siddhartha', isBatch: true, company: 'Accolite, Facebook, Adobe, Amazon', hint: 'Repeatedly sum digits until single digit (O(1) digital root formula: 1 + (n-1)%9).' },
        { lvl: 'easy', title: 'Digits in Factorial — Floor(log10(n!)) + 1', slug: 'digits-in-factorial', track: 'mathematics-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Use Kamenetsky formula or sum of log10(i) for 1..n.' },
        { lvl: 'easy', title: 'Palindrome Number (Reverse & Compare)', slug: 'palindrome0447', isBatch: false, company: 'Cisco, Payu, TCS', hint: 'Reverse digits mathematically with rev = rev * 10 + n % 10.' },
        { lvl: 'easy', title: 'Armstrong Numbers (Narcissistic Number Check)', slug: 'armstrong-numbers2727', isBatch: false, company: 'Wipro, Cognizant', hint: 'Sum of d^k where k is total number of digits equals original number.' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
