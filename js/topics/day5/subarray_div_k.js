/* ============================================================
   DAY 5 — TOPIC 06: SUBARRAY SUM DIVISIBLE BY K
   Prefix sum modulo + hash map to count subarrays whose sum
   is divisible by k using remainder grouping.
   ============================================================ */

const TOPIC_SUBARRAY_DIV_K = {
  id: 'subarray-div-k',
  num: '06',
  title: 'Subarray Sum Divisible by K — Prefix Mod + HashMap',
  tag: 'Prefix Sum + Hashing',
  intuition: 'If two prefix sums have the same remainder mod k, then the subarray between them has a sum divisible by k. Count remainders in a hash map. If a remainder r has been seen c times, it contributes c new subarrays. Initialize map with {0: 1} for subarrays starting at index 0.',
  time: 'O(n)',
  space: 'O(k)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Array</label>
        <input type="text" class="arr-input" id="sdk-arr" value="4, 5, 0, -2, -3, 1">
        <label>k</label>
        <input type="number" id="sdk-k" value="5" style="width:65px;" min="1">
        <button class="primary" id="sdk-apply">Apply</button>
        <button id="sdk-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function mod(a, b) {
      return ((a % b) + b) % b;  // Always non-negative
    }

    function buildSteps(arr, k) {
      steps = [];
      const n = arr.length;
      if (n === 0 || k <= 0) {
        steps.push({ arr: [], phase: 'Invalid', desc: 'Need non-empty array and k > 0.', marks: {}, vars: {}, remMap: {}, count: 0 });
        return;
      }

      const remMap = { 0: 1 };
      let prefixSum = 0;
      let count = 0;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Array of ${n} elements, k = ${k}. Initialize prefixSum = 0, remainder map = {0: 1}, count = 0.`,
        marks: {}, vars: { k, prefixSum: 0, count: 0 },
        remMap: { ...remMap }
      });

      for (let i = 0; i < n; i++) {
        prefixSum += arr[i];
        const rem = mod(prefixSum, k);
        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'active', tag: `i=${i}` };

        if (rem in remMap) {
          const found = remMap[rem];
          count += found;
          marks[i] = { cls: 'good active', tag: `+${found}` };

          steps.push({
            arr: [...arr], phase: `Remainder ${rem} seen ${found}x`,
            desc: `prefixSum = ${prefixSum}, rem = ${prefixSum} mod ${k} = ${rem}. map[${rem}] = ${found} → count += ${found} = ${count}.`,
            marks,
            vars: { i, prefixSum, rem, [`map[${rem}]`]: found, count },
            remMap: { ...remMap }
          });
        } else {
          steps.push({
            arr: [...arr], phase: `Scan i=${i}`,
            desc: `prefixSum = ${prefixSum}, rem = ${prefixSum} mod ${k} = ${rem}. Not in map yet. count stays ${count}.`,
            marks,
            vars: { i, prefixSum, rem, count },
            remMap: { ...remMap }
          });
        }

        remMap[rem] = (remMap[rem] || 0) + 1;

        steps.push({
          arr: [...arr], phase: `Store rem ${rem}`,
          desc: `Store remainder ${rem} → map[${rem}] = ${remMap[rem]}.`,
          marks,
          vars: { i, prefixSum, rem, count, [`map[${rem}]`]: remMap[rem] },
          remMap: { ...remMap }
        });
      }

      // Final result
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Total subarrays with sum divisible by ${k}: ${count}.`,
        marks: fMarks,
        vars: { k, result: count },
        remMap: { ...remMap }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SUBARRAY_DIV_K.id;
      const mapRow = s.remMap && Object.keys(s.remMap).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Remainder map:</span> ${Object.entries(s.remMap).map(([k, v]) => `<div class="eq-box" style="min-width:50px;">r${k}:${v}</div>`).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
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
      const raw = $('#sdk-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [4, 5, 0, -2, -3, 1];
      $('#sdk-arr').value = a.join(', ');
      const k = Math.max(1, parseInt($('#sdk-k').value) || 5);
      $('#sdk-k').value = k;
      buildSteps(a, k);
      $(`#player-mount-${TOPIC_SUBARRAY_DIV_K.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SUBARRAY_DIV_K.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SUBARRAY_DIV_K.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#sdk-apply').addEventListener('click', rebuild);
    $('#sdk-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, -8, 12);
      $('#sdk-arr').value = arr.join(', ');
      $('#sdk-k').value = randomInt(2, 7);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function subarraysDivByK(arr, k):
    remMap = {0: 1}
    prefixSum = 0, count = 0
    for each x in arr:
        prefixSum += x
        rem = ((prefixSum % k) + k) % k
        if rem in remMap:
            count += remMap[rem]
        remMap[rem]++
    return count`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
using namespace std;

// Subarrays Divisible by K — O(n) time, O(k) space
int subarraysDivByK(vector<int>& arr, int k) {
    unordered_map<int, int> remMap;
    remMap[0] = 1;
    int prefixSum = 0, count = 0;

    for (int x : arr) {
        prefixSum += x;
        int rem = ((prefixSum % k) + k) % k;
        if (remMap.count(rem))
            count += remMap[rem];
        remMap[rem]++;
    }
    return count;
}`)}

      ${pythonPanel(this.id,
`# Subarrays Divisible by K — O(n) time, O(k) space
from collections import defaultdict

def subarrays_div_by_k(arr, k):
    rem_map = defaultdict(int)
    rem_map[0] = 1
    prefix_sum = 0
    count = 0

    for x in arr:
        prefix_sum += x
        rem = prefix_sum % k  # Python mod is always non-negative
        count += rem_map[rem]
        rem_map[rem] += 1

    return count`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Subarray Sums Divisible by K', slug: 'sub-array-sum-divisible-by-k2617', isBatch: false, company: 'Google, Amazon, Microsoft', statement: 'Given an integer array arr[] and a positive integer k, return the number of non-empty subarrays that have a sum divisible by k.', hint: 'Prefix sum mod k + hash map. Same remainder means divisible difference.' },
        { lvl: 'medium', title: 'Subarray with 0 Sum', slug: 'subarray-with-0-sum-1587115621', isBatch: false, company: 'Amazon, Microsoft, Samsung', statement: 'Given an array of integers, find if there is a subarray with 0 sum.', hint: 'Special case of divisible-by-k where k equals the sum itself. Use prefix sum set: if prefix repeats, subarray between is 0.' },
        { lvl: 'medium', title: 'Longest Subarray Div by K', slug: 'longest-subarray-with-sum-divisible-by-k1259', isBatch: false, company: 'Amazon', statement: 'Given an array arr[] and an integer k, find the length of the longest subarray whose sum is divisible by k.', hint: 'Store first occurrence of each remainder. Length = i - first[rem].' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
