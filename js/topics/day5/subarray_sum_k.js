/* ============================================================
   DAY 5 — TOPIC 05: SUBARRAY SUM EQUALS K
   Prefix sum + hash map to count subarrays with exact sum k.
   ============================================================ */

const TOPIC_SUBARRAY_SUM_K = {
  id: 'subarray-sum-k',
  num: '05',
  title: 'Subarray Sum Equals K — Prefix Sum + HashMap',
  tag: 'Prefix Sum + Hashing',
  intuition: 'If prefix[j] − prefix[i] = k, then the subarray (i+1..j) sums to k. So for each j, we need to know how many earlier prefix sums equal prefix[j] − k. Store prefix sum counts in a hash map. Initialize map with {0: 1} for subarrays starting at index 0.',
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
        <input type="text" class="arr-input" id="ssk-arr" value="1, 2, 3, -2, 5">
        <label>k</label>
        <input type="number" id="ssk-k" value="3" style="width:65px;">
        <button class="primary" id="ssk-apply">Apply</button>
        <button id="ssk-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, k) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'Empty', desc: 'Array is empty.', marks: {}, vars: {}, prefixMap: {}, count: 0 });
        return;
      }

      const prefixMap = { 0: 1 };
      let prefixSum = 0;
      let count = 0;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Array of ${n} elements, k = ${k}. Initialize prefixSum = 0, map = {0: 1}, count = 0.`,
        marks: {}, vars: { k, prefixSum: 0, count: 0 },
        prefixMap: { ...prefixMap }
      });

      for (let i = 0; i < n; i++) {
        prefixSum += arr[i];
        const need = prefixSum - k;
        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'active', tag: `i=${i}` };

        if (need in prefixMap) {
          const found = prefixMap[need];
          count += found;
          // Highlight the subarray(s) that sum to k
          marks[i] = { cls: 'good active', tag: `+${found}` };

          steps.push({
            arr: [...arr], phase: `Found ${found} subarray(s)!`,
            desc: `prefixSum = ${prefixSum}. Need = prefixSum − k = ${prefixSum} − ${k} = ${need}. map[${need}] = ${found} → count += ${found} = ${count}.`,
            marks,
            vars: { i, prefixSum, need, [`map[${need}]`]: found, count },
            prefixMap: { ...prefixMap }
          });
        } else {
          steps.push({
            arr: [...arr], phase: `Scan i=${i}`,
            desc: `prefixSum = ${prefixSum}. Need = prefixSum − k = ${prefixSum} − ${k} = ${need}. Not in map. count stays ${count}.`,
            marks,
            vars: { i, prefixSum, need, count },
            prefixMap: { ...prefixMap }
          });
        }

        // Add current prefixSum to map
        prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;

        steps.push({
          arr: [...arr], phase: `Store prefix ${prefixSum}`,
          desc: `Add prefixSum ${prefixSum} to map → map[${prefixSum}] = ${prefixMap[prefixSum]}.`,
          marks,
          vars: { i, prefixSum, count, [`map[${prefixSum}]`]: prefixMap[prefixSum] },
          prefixMap: { ...prefixMap }
        });
      }

      // Final result
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Total subarrays with sum ${k}: ${count}.`,
        marks: fMarks,
        vars: { k, result: count },
        prefixMap: { ...prefixMap }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SUBARRAY_SUM_K.id;
      const mapRow = s.prefixMap && Object.keys(s.prefixMap).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Prefix map:</span> ${Object.entries(s.prefixMap).map(([k, v]) => `<div class="eq-box" style="min-width:45px;">${k}:${v}</div>`).join(' ')}</div>`
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
      const raw = $('#ssk-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 2, 3, -2, 5];
      $('#ssk-arr').value = a.join(', ');
      const k = parseInt($('#ssk-k').value) || 3;
      $('#ssk-k').value = k;
      buildSteps(a, k);
      $(`#player-mount-${TOPIC_SUBARRAY_SUM_K.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SUBARRAY_SUM_K.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SUBARRAY_SUM_K.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ssk-apply').addEventListener('click', rebuild);
    $('#ssk-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, -5, 10);
      $('#ssk-arr').value = arr.join(', ');
      $('#ssk-k').value = randomInt(1, 10);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function subarraySum(arr, k):
    prefixMap = {0: 1}
    prefixSum = 0, count = 0
    for i from 0 to n-1:
        prefixSum += arr[i]
        need = prefixSum - k
        if need in prefixMap:
            count += prefixMap[need]
        prefixMap[prefixSum]++
    return count`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
using namespace std;

// Subarray Sum = K — Prefix Sum + HashMap — O(n) time, O(n) space
int subarraySum(vector<int>& arr, int k) {
    unordered_map<int, int> prefixMap;
    prefixMap[0] = 1;
    int prefixSum = 0, count = 0;

    for (int x : arr) {
        prefixSum += x;
        int need = prefixSum - k;
        if (prefixMap.count(need))
            count += prefixMap[need];
        prefixMap[prefixSum]++;
    }
    return count;
}`)}

      ${pythonPanel(this.id,
`# Subarray Sum = K — Prefix Sum + HashMap — O(n) time, O(n) space
from collections import defaultdict

def subarray_sum(arr, k):
    prefix_map = defaultdict(int)
    prefix_map[0] = 1
    prefix_sum = 0
    count = 0

    for x in arr:
        prefix_sum += x
        need = prefix_sum - k
        count += prefix_map[need]
        prefix_map[prefix_sum] += 1

    return count`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Subarray with Given Sum', slug: 'subarray-with-given-sum-1587115621', isBatch: false, company: 'Amazon, Microsoft, Samsung', statement: 'Given an unsorted array arr[] of non-negative integers and an integer sum, find a continuous subarray which adds to the given sum. Return the 1-based start and end indices.', hint: 'For non-negatives: sliding window. For general integers: prefix sum + hash map.' },
        { lvl: 'medium', title: 'Count Subarrays with Sum K', slug: 'subarrays-with-sum-k', isBatch: false, company: 'Google, Amazon, Facebook', statement: 'Given an unsorted array of integers arr[] and an integer k, count the total number of subarrays having sum equal to k.', hint: 'Prefix sum + hash map: for each prefix, count how many earlier prefixes equal prefix - k.' },
        { lvl: 'hard', title: 'Longest Subarray with Sum K', slug: 'longest-sub-array-with-sum-k0809', isBatch: false, company: 'Amazon, Microsoft', statement: 'Given an array arr[] and an integer k, find the length of the longest subarray with sum equal to k.', hint: 'Store first occurrence of each prefix sum. Length = i - firstOccurrence[prefix - k].' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
