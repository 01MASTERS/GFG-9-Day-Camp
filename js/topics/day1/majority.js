/* ---------- 6. MAJORITY ELEMENT ---------- */
const TOPIC_MAJORITY = {
  id: 'majority',
  num: '07',
  title: "Majority Element — Boyer-Moore Voting",
  tag: 'Arrays',
  intuition: 'If one value appears more than n/2 times, think of matches vs non-matches as votes that cancel out. Whatever survives all the cancellations is the majority element.',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>Array</label><input type="text" class="arr-input" id="mj-arr" value="2,2,1,1,1,2,2"><button class="primary" id="mj-apply">Apply</button><button id="mj-random">🎲 Random (guaranteed majority)</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [], arr = [];
    function build(a) {
      arr = a;
      steps = [];
      let candidate = null, count = 0;
      steps.push({ i: -1, candidate, count, action: 'Start with no candidate, count = 0' });
      for (let i = 0; i < arr.length; i++) {
        let action;
        if (count === 0) {
          candidate = arr[i];
          count = 1;
          action = `Count hit 0 → new candidate = ${arr[i]}`;
        } else if (arr[i] === candidate) {
          count++;
          action = `${arr[i]} matches candidate (${candidate}) → count++`;
        } else {
          count--;
          action = `${arr[i]} ≠ candidate (${candidate}) → cancel, count--`;
        }
        steps.push({ i, candidate, count, action });
      }
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_MAJORITY.id;
      const marks = {};
      if (s.i >= 0) {
        const cls = arr[s.i] === s.candidate ? 'active good' : 'active bad';
        marks[s.i] = { cls, tag: 'i' };
      }
      stage.innerHTML = `<div class="boxes">${boxesHTML(arr, marks)}</div>
        <div class="equation" style="font-size:16px;"><span class="op">candidate →</span><div class="eq-box res">${s.candidate === null ? '—' : s.candidate}</div><span class="op">count →</span><div class="eq-box hl">${s.count}</div></div>`;
      $(`#desc-${id}`).textContent = s.action;
      $(`#vars-${id}`).innerHTML = varsHTML({ i: s.i < 0 ? '—' : s.i, candidate: s.candidate === null ? '—' : s.candidate, count: s.count });
      if (i === steps.length - 1) {
        $(`#desc-${id}`).textContent += ` — Final candidate: ${s.candidate}. (In real code, verify by counting occurrences to confirm it truly exceeds n/2.)`;
      }
    }
    let player;
    function rebuild() {
      const a = $('#mj-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      build(a.length ? a : [1]);
      $(`#player-mount-${TOPIC_MAJORITY.id}`).innerHTML = '';
      $(`#desc-${TOPIC_MAJORITY.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_MAJORITY.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#mj-apply').addEventListener('click', rebuild);
    $('#mj-random').addEventListener('click', () => {
      const n = randomInt(7, 11);
      const majVal = randomInt(1, 9);
      let a = Array.from({ length: Math.ceil(n / 2) + 1 }, () => majVal);
      while (a.length < n) a.push(randomInt(1, 9) === majVal ? majVal + 1 : randomInt(1, 9));
      for (let k = a.length - 1; k > 0; k--) {
        const j = randomInt(0, k);
        [a[k], a[j]] = [a[j], a[k]];
      }
      $('#mj-arr').value = a.join(',');
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`candidate = null, count = 0
for each x in array:
    if count == 0: candidate = x
    count += (x == candidate) ? 1 : -1
return candidate   // verify by re-counting if majority is not guaranteed`)}
      ${cppPanel(this.id,
`int majorityElement(vector<int>& arr){
    int candidate = 0, count = 0;
    for(int x : arr){
        if(count == 0) candidate = x;
        count += (x == candidate) ? 1 : -1;
    }
    // Optional verification pass:
    // int freq = count(arr.begin(), arr.end(), candidate);
    // if (freq <= arr.size()/2) return -1; // no majority
    return candidate;
}`)}
      ${pythonPanel(this.id,
`# Majority Element — Boyer-Moore Voting O(n)
def majority_element(arr):
    candidate, count = 0, 0
    for x in arr:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate

# With verification
def majority_element_verified(arr):
    candidate = majority_element(arr)
    if arr.count(candidate) > len(arr) // 2:
        return candidate
    return -1  # no majority`)}
      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Majority Element — Boyer-Moore Algorithm (> n/2 Times)', slug: 'majority-element-1587115620', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google, Flipkart', hint: 'Boyer-Moore voting algorithm with count cancellation in O(N) time and O(1) space.' },
        { lvl: 'medium', title: 'Majority Vote — Elements Occurring > n/3 Times', slug: 'majority-vote', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Google, Microsoft', hint: 'Extended Boyer-Moore tracking 2 potential candidates with 2 counters.' },
        { lvl: 'basic', title: 'Distinct Adjacent Elements (Frequency & Placement)', slug: 'distinct-adjacent-element2121', track: 'array-practice-siddhartha', isBatch: true, company: 'TCS, Wipro, Infosys', hint: 'Check if maximum element frequency is <= ceil(N / 2).' },
        { lvl: 'medium', title: 'Find Missing and Repeating Element', slug: 'find-missing-and-repeating2512', isBatch: false, company: 'Amazon, Microsoft, Goldman Sachs', hint: 'Find the repeating and missing elements using index negation or XOR.' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
