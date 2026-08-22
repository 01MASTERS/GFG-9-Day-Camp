/* ============================================================
   DAY 5 — TOPIC 07: COUNT NICE SUBARRAYS
   Transform odd→1, even→0, then apply "subarray sum = k" technique
   to count subarrays with exactly k odd numbers.
   ============================================================ */

const TOPIC_COUNT_NICE_SUBARRAYS = {
  id: 'count-nice-subarrays',
  num: '07',
  title: 'Count Nice Subarrays — Prefix Sum Trick',
  tag: 'Prefix Sum + Hashing',
  intuition: 'A "nice" subarray has exactly k odd numbers. Replace each element: odd → 1, even → 0. Now the problem reduces to "count subarrays with sum exactly k" — which we solve with prefix sum + hash map.',
  time: 'O(n)',
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
        <input type="text" class="arr-input" id="cns-arr" value="1, 1, 2, 1, 1">
        <label>k (odds)</label>
        <input type="number" id="cns-k" value="3" style="width:65px;" min="0">
        <button class="primary" id="cns-apply">Apply</button>
        <button id="cns-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, k) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], transformed: [], phase: 'Empty', desc: 'Array is empty.', marks: {}, tMarks: {}, vars: {}, prefixMap: {} });
        return;
      }

      // Step 1: Show original
      steps.push({
        arr: [...arr], transformed: [],
        phase: 'Original Array',
        desc: `Array of ${n} elements, k = ${k}. We want subarrays with exactly ${k} odd numbers.`,
        marks: {}, tMarks: {},
        vars: { n, k },
        prefixMap: {}
      });

      // Step 2: Transform
      const t = arr.map(x => x % 2 === 0 ? 0 : 1);
      const tMarks = {};
      const origMarks = {};
      for (let i = 0; i < n; i++) {
        origMarks[i] = t[i] === 1 ? { cls: 'good', tag: 'odd' } : { cls: 'bad', tag: 'even' };
        tMarks[i] = t[i] === 1 ? { cls: 'good' } : { cls: 'bad' };
      }
      steps.push({
        arr: [...arr], transformed: [...t],
        phase: 'Transform: odd→1, even→0',
        desc: `Transform: [${t.join(', ')}]. Now count subarrays with sum = ${k}.`,
        marks: origMarks, tMarks,
        vars: { transformed: `[${t.join(', ')}]`, k },
        prefixMap: {}
      });

      // Step 3..N: Prefix sum + hash map (same as subarray sum k)
      const prefixMap = { 0: 1 };
      let prefixSum = 0;
      let count = 0;

      for (let i = 0; i < n; i++) {
        prefixSum += t[i];
        const need = prefixSum - k;
        const marks = {};
        const tm = {};
        for (let j = 0; j < i; j++) {
          marks[j] = { cls: 'bad' };
          tm[j] = { cls: 'bad' };
        }
        marks[i] = { cls: 'active', tag: `i=${i}` };
        tm[i] = { cls: 'active', tag: `i=${i}` };

        if (need >= 0 && need in prefixMap) {
          const found = prefixMap[need];
          count += found;
          marks[i] = { cls: 'good active', tag: `+${found}` };
          tm[i] = { cls: 'good active', tag: `+${found}` };

          steps.push({
            arr: [...arr], transformed: [...t],
            phase: `Found ${found} nice subarray(s)`,
            desc: `prefixSum = ${prefixSum}, need = ${prefixSum} − ${k} = ${need}. map[${need}] = ${found}. count = ${count}.`,
            marks, tMarks: tm,
            vars: { i, prefixSum, need, count },
            prefixMap: { ...prefixMap }
          });
        } else {
          steps.push({
            arr: [...arr], transformed: [...t],
            phase: `Scan i=${i}`,
            desc: `prefixSum = ${prefixSum}, need = ${prefixSum} − ${k} = ${need}. ${need < 0 ? 'Negative, skip.' : 'Not in map.'} count = ${count}.`,
            marks, tMarks: tm,
            vars: { i, prefixSum, need, count },
            prefixMap: { ...prefixMap }
          });
        }

        prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;
      }

      // Final
      const fMarks = {};
      const ftMarks = {};
      for (let i = 0; i < n; i++) {
        fMarks[i] = { cls: 'good' };
        ftMarks[i] = { cls: 'good' };
      }
      steps.push({
        arr: [...arr], transformed: [...t],
        phase: 'Result',
        desc: `Total nice subarrays (with exactly ${k} odd numbers): ${count}.`,
        marks: fMarks, tMarks: ftMarks,
        vars: { k, result: count },
        prefixMap: { ...prefixMap }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_COUNT_NICE_SUBARRAYS.id;

      const transformedRow = s.transformed.length
        ? `<div class="equation" style="font-size:14px;margin-top:8px;"><span class="op">binary[]:</span> ${s.transformed.map((v, i) => {
            const m = s.tMarks[i];
            const cls = m && m.cls ? ' ' + m.cls : '';
            const tag = m && m.tag ? `<div class="box-tag">${m.tag}</div>` : '';
            return `<div class="box${cls}" style="min-width:32px;"><div class="box-val">${v}</div>${tag}</div>`;
          }).join(' ')}</div>`
        : '';

      const mapRow = s.prefixMap && Object.keys(s.prefixMap).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Prefix map:</span> ${Object.entries(s.prefixMap).map(([k, v]) => `<div class="eq-box" style="min-width:45px;">${k}:${v}</div>`).join(' ')}</div>`
        : '';

      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        ${transformedRow}
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
        ${mapRow}
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#cns-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 1, 2, 1, 1];
      $('#cns-arr').value = a.join(', ');
      const k = Math.max(0, parseInt($('#cns-k').value) || 3);
      $('#cns-k').value = k;
      buildSteps(a, k);
      $(`#player-mount-${TOPIC_COUNT_NICE_SUBARRAYS.id}`).innerHTML = '';
      $(`#desc-${TOPIC_COUNT_NICE_SUBARRAYS.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_COUNT_NICE_SUBARRAYS.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#cns-apply').addEventListener('click', rebuild);
    $('#cns-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, 1, 20);
      $('#cns-arr').value = arr.join(', ');
      const oddCount = arr.filter(x => x % 2 !== 0).length;
      $('#cns-k').value = randomInt(1, Math.max(1, Math.floor(oddCount / 2) + 1));
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function countNiceSubarrays(arr, k):
    // Transform: odd → 1, even → 0
    for i from 0 to n-1:
        arr[i] = arr[i] % 2
    // Now count subarrays with sum = k
    prefixMap = {0: 1}
    prefixSum = 0, count = 0
    for each x in arr:
        prefixSum += x
        need = prefixSum - k
        if need in prefixMap:
            count += prefixMap[need]
        prefixMap[prefixSum]++
    return count`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
using namespace std;

// Count Nice Subarrays — O(n) time, O(n) space
int countNiceSubarrays(vector<int>& arr, int k) {
    unordered_map<int, int> prefixMap;
    prefixMap[0] = 1;
    int prefixSum = 0, count = 0;

    for (int x : arr) {
        prefixSum += (x % 2);  // odd → 1, even → 0
        int need = prefixSum - k;
        if (prefixMap.count(need))
            count += prefixMap[need];
        prefixMap[prefixSum]++;
    }
    return count;
}`)}

      ${pythonPanel(this.id,
`# Count Nice Subarrays — O(n) time, O(n) space
from collections import defaultdict

def count_nice_subarrays(arr, k):
    prefix_map = defaultdict(int)
    prefix_map[0] = 1
    prefix_sum = 0
    count = 0

    for x in arr:
        prefix_sum += x % 2  # odd → 1, even → 0
        need = prefix_sum - k
        count += prefix_map[need]
        prefix_map[prefix_sum] += 1

    return count`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Count Nice Subarrays', slug: 'count-number-of-nice-subarrays', isBatch: false, company: 'Google, Amazon', statement: 'Given an array of integers arr[] and an integer k, return the number of nice subarrays. A subarray is nice if there are exactly k odd numbers in it.', hint: 'Transform odd→1, even→0. Then count subarrays with sum = k using prefix sum + hash map.' },
        { lvl: 'medium', title: 'Binary Subarrays with Sum', slug: 'binary-subarrays-with-sum', isBatch: false, company: 'Google, Facebook', statement: 'Given a binary array arr[] and an integer goal, return the number of non-empty subarrays with a sum equal to goal.', hint: 'Identical to subarray sum = k on a binary array. Prefix sum + hash map.' },
        { lvl: 'medium', title: 'Subarrays with K Different Integers', slug: 'subarrays-with-k-different-integers', isBatch: false, company: 'Google, Amazon', statement: 'Given an integer array arr[] and an integer k, return the number of good subarrays. A good subarray has exactly k different integers.', hint: 'Use atMost(k) - atMost(k-1) trick with sliding window.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
