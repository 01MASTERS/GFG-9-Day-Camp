/* ============================================================
   DAY 5 — TOPIC 01: PREFIX SUM
   Build a prefix sum array and answer range-sum queries in O(1).
   ============================================================ */

const TOPIC_PREFIX_SUM = {
  id: 'prefix-sum',
  num: '01',
  title: 'Prefix Sum — Range Sum Queries in O(1)',
  tag: 'Prefix Sum',
  intuition: 'Precompute a running total array prefix[] where prefix[i] = sum of arr[0..i]. Then any range sum(l..r) = prefix[r] − prefix[l−1]. Building costs O(n), but every query after that is O(1).',
  time: 'O(n) build + O(1) per query',
  space: 'O(n)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Array</label>
        <input type="text" class="arr-input" id="ps-arr" value="2, 4, 1, 3, 5, 2, 6">
        <label>L</label>
        <input type="number" id="ps-l" value="1" style="width:55px;" min="0">
        <label>R</label>
        <input type="number" id="ps-r" value="4" style="width:55px;" min="0">
        <button class="primary" id="ps-apply">Apply</button>
        <button id="ps-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, l, r) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], prefix: [], phase: 'Empty', desc: 'Array is empty.', marks: {}, pMarks: {}, vars: {} });
        return;
      }

      l = Math.max(0, Math.min(l, n - 1));
      r = Math.max(l, Math.min(r, n - 1));

      // Step 1: Show original array
      steps.push({
        arr: [...arr], prefix: [],
        phase: 'Original Array',
        desc: `Original array of ${n} elements. We will build prefix[].`,
        marks: {}, pMarks: {}, vars: { n }
      });

      // Build prefix step by step
      const prefix = [];
      for (let i = 0; i < n; i++) {
        prefix.push(i === 0 ? arr[0] : prefix[i - 1] + arr[i]);
        const marks = {};
        for (let j = 0; j <= i; j++) marks[j] = { cls: 'active' };
        marks[i] = { cls: 'good', tag: `i=${i}` };
        const pMarks = {};
        for (let j = 0; j < prefix.length; j++) pMarks[j] = { cls: 'active' };
        pMarks[i] = { cls: 'good', tag: `p[${i}]` };

        const formula = i === 0
          ? `prefix[0] = arr[0] = ${arr[0]}`
          : `prefix[${i}] = prefix[${i - 1}] + arr[${i}] = ${prefix[i - 1]} + ${arr[i]} = ${prefix[i]}`;

        steps.push({
          arr: [...arr], prefix: [...prefix],
          phase: `Build prefix[${i}]`,
          desc: formula,
          marks, pMarks,
          vars: { i, [`arr[${i}]`]: arr[i], [`prefix[${i}]`]: prefix[i] }
        });
      }

      // Show completed prefix array
      const allGood = {};
      const allPGood = {};
      for (let i = 0; i < n; i++) { allGood[i] = { cls: 'good' }; allPGood[i] = { cls: 'good' }; }
      steps.push({
        arr: [...arr], prefix: [...prefix],
        phase: 'Prefix Array Complete',
        desc: `prefix[] = [${prefix.join(', ')}]. Now we can answer any range query in O(1).`,
        marks: allGood, pMarks: allPGood,
        vars: { prefix: `[${prefix.join(', ')}]` }
      });

      // Range query
      const qMarks = {};
      const qpMarks = {};
      for (let i = l; i <= r; i++) qMarks[i] = { cls: 'active' };
      qMarks[l] = { cls: 'active', tag: 'L' };
      qMarks[r] = { cls: 'active', tag: 'R' };
      if (l > 0) qpMarks[l - 1] = { cls: 'bad', tag: 'l-1' };
      qpMarks[r] = { cls: 'good', tag: 'r' };

      const rangeSum = l === 0 ? prefix[r] : prefix[r] - prefix[l - 1];
      const formula = l === 0
        ? `sum(${l}..${r}) = prefix[${r}] = ${prefix[r]}`
        : `sum(${l}..${r}) = prefix[${r}] − prefix[${l - 1}] = ${prefix[r]} − ${prefix[l - 1]} = ${rangeSum}`;

      steps.push({
        arr: [...arr], prefix: [...prefix],
        phase: `Query sum(${l}..${r})`,
        desc: formula,
        marks: qMarks, pMarks: qpMarks,
        vars: { L: l, R: r, result: rangeSum }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_PREFIX_SUM.id;
      const prefixRow = s.prefix.length
        ? `<div class="equation" style="font-size:14px;margin-top:8px;"><span class="op">prefix[]:</span> ${s.prefix.map((v, i) => {
            const m = s.pMarks[i];
            const cls = m && m.cls ? ' ' + m.cls : '';
            const tag = m && m.tag ? `<div class="box-tag">${m.tag}</div>` : '';
            return `<div class="box${cls}" style="min-width:38px;"><div class="box-val">${v}</div>${tag}</div>`;
          }).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        ${prefixRow}
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#ps-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [2, 4, 1, 3, 5, 2, 6];
      $('#ps-arr').value = a.join(', ');
      const l = Math.max(0, parseInt($('#ps-l').value) || 0);
      const r = Math.max(l, parseInt($('#ps-r').value) || 0);
      $('#ps-l').value = l;
      $('#ps-r').value = r;
      buildSteps(a, l, r);
      $(`#player-mount-${TOPIC_PREFIX_SUM.id}`).innerHTML = '';
      $(`#desc-${TOPIC_PREFIX_SUM.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_PREFIX_SUM.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ps-apply').addEventListener('click', rebuild);
    $('#ps-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, 1, 15);
      $('#ps-arr').value = arr.join(', ');
      const l = randomInt(0, Math.floor(len / 3));
      const r = randomInt(l + 1, len - 1);
      $('#ps-l').value = l;
      $('#ps-r').value = r;
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function buildPrefix(arr):
    prefix[0] = arr[0]
    for i from 1 to n-1:
        prefix[i] = prefix[i-1] + arr[i]
    return prefix

function rangeSum(prefix, l, r):
    if l == 0: return prefix[r]
    return prefix[r] - prefix[l-1]`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Build prefix sum — O(n) time, O(n) space
vector<int> buildPrefix(vector<int>& arr) {
    int n = arr.size();
    vector<int> prefix(n);
    prefix[0] = arr[0];
    for (int i = 1; i < n; i++)
        prefix[i] = prefix[i - 1] + arr[i];
    return prefix;
}

// Range sum query — O(1)
int rangeSum(vector<int>& prefix, int l, int r) {
    if (l == 0) return prefix[r];
    return prefix[r] - prefix[l - 1];
}`)}

      ${pythonPanel(this.id,
`# Build prefix sum — O(n) time, O(n) space
def build_prefix(arr):
    n = len(arr)
    prefix = [0] * n
    prefix[0] = arr[0]
    for i in range(1, n):
        prefix[i] = prefix[i - 1] + arr[i]
    return prefix

# Range sum query — O(1)
def range_sum(prefix, l, r):
    if l == 0:
        return prefix[r]
    return prefix[r] - prefix[l - 1]`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Prefix Sum Array', slug: 'prefix-sum-array-5765', isBatch: false, company: 'TCS, Infosys', statement: 'Given an array arr[] of size n, compute the prefix sum of the array. The prefix sum array is an array where the ith element is the sum of all elements from index 0 to i.', hint: 'Iterate once, keep running total: prefix[i] = prefix[i-1] + arr[i].' },
        { lvl: 'easy', title: 'Equilibrium Point', slug: 'equilibrium-point-1587115620', isBatch: false, company: 'Amazon, Microsoft, TCS', statement: 'Given an array arr[] of n non-negative integers, find the first equilibrium point in the array. Equilibrium point is an index such that the sum of elements at lower indexes equals the sum of elements at higher indexes.', hint: 'Use total sum and running left sum. At each index check if leftSum == totalSum - leftSum - arr[i].' },
        { lvl: 'medium', title: 'Longest Subarray with Sum K', slug: 'longest-sub-array-with-sum-k0809', isBatch: false, company: 'Amazon, Microsoft', statement: 'Given an array arr[] containing integers and an integer k, find the length of the longest subarray with sum equal to k.', hint: 'Use prefix sum + hash map. Store first occurrence of each prefix sum.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
