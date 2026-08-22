/* ============================================================
   DAY 5 — TOPIC 03: TWO SUM (HASH MAP)
   For an unsorted array, use a hash map to find pair with target sum.
   ============================================================ */

const TOPIC_TWO_SUM = {
  id: 'two-sum',
  num: '03',
  title: 'Two Sum — Hash Map Approach',
  tag: 'Hashing',
  intuition: 'For each element, compute complement = target − arr[i]. If complement exists in hash map → found the pair. Otherwise, store arr[i] in the map. Single pass, O(n) time.',
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
        <input type="text" class="arr-input" id="ts2-arr" value="3, 7, 1, 4, 2, 5">
        <label>Target</label>
        <input type="number" id="ts2-target" value="9" style="width:65px;">
        <button class="primary" id="ts2-apply">Apply</button>
        <button id="ts2-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, target) {
      steps = [];
      const n = arr.length;
      if (n < 2) {
        steps.push({ arr: [...arr], phase: 'Too Short', desc: 'Need at least 2 elements.', marks: {}, vars: {}, seen: {} });
        return;
      }

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Array of ${n} elements, target = ${target}. Scan left to right with a hash map.`,
        marks: {}, vars: { n, target }, seen: {}
      });

      const seen = {}; // value -> index

      for (let i = 0; i < n; i++) {
        const complement = target - arr[i];
        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'active', tag: `i=${i}` };

        if (complement in seen) {
          const j = seen[complement];
          marks[j] = { cls: 'good active', tag: `✓ j=${j}` };
          marks[i] = { cls: 'good active', tag: `✓ i=${i}` };
          steps.push({
            arr: [...arr], phase: 'Found!',
            desc: `arr[${i}] = ${arr[i]}, complement = ${complement}. Found in map at index ${j}! arr[${j}] + arr[${i}] = ${arr[j]} + ${arr[i]} = ${target}.`,
            marks,
            vars: { i, [`arr[${i}]`]: arr[i], complement, [`map[${complement}]`]: j, result: `(${j}, ${i})` },
            seen: { ...seen }
          });
          return;
        }

        seen[arr[i]] = i;
        steps.push({
          arr: [...arr], phase: `Check i=${i}`,
          desc: `arr[${i}] = ${arr[i]}, complement = ${complement}. Not in map → store map[${arr[i]}] = ${i}.`,
          marks,
          vars: { i, [`arr[${i}]`]: arr[i], complement, action: `store ${arr[i]}→${i}` },
          seen: { ...seen }
        });
      }

      // Not found
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
      steps.push({
        arr: [...arr], phase: 'Not Found',
        desc: `Scanned all elements. No pair sums to ${target}.`,
        marks: fMarks,
        vars: { result: 'Not Found', target },
        seen: { ...seen }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_TWO_SUM.id;
      const seenRow = s.seen && Object.keys(s.seen).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Hash map:</span> ${Object.entries(s.seen).map(([k, v]) => `<div class="eq-box" style="min-width:45px;">${k}→idx${v}</div>`).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
        ${seenRow}
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#ts2-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length >= 2 ? raw : [3, 7, 1, 4, 2, 5];
      $('#ts2-arr').value = a.join(', ');
      const target = parseInt($('#ts2-target').value) || 9;
      $('#ts2-target').value = target;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_TWO_SUM.id}`).innerHTML = '';
      $(`#desc-${TOPIC_TWO_SUM.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_TWO_SUM.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ts2-apply').addEventListener('click', rebuild);
    $('#ts2-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, 1, 20);
      $('#ts2-arr').value = arr.join(', ');
      // 70% chance target is achievable
      if (Math.random() < 0.7) {
        const i = randomInt(0, len - 2);
        const j = randomInt(i + 1, len - 1);
        $('#ts2-target').value = arr[i] + arr[j];
      } else {
        $('#ts2-target').value = randomInt(5, 40);
      }
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function twoSum(arr, target):
    seen = {}  // value → index
    for i from 0 to n-1:
        complement = target - arr[i]
        if complement in seen:
            return (seen[complement], i)
        seen[arr[i]] = i
    return NOT_FOUND`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
using namespace std;

// Two Sum — Hash Map — O(n) time, O(n) space
pair<int,int> twoSum(vector<int>& arr, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)arr.size(); i++) {
        int complement = target - arr[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[arr[i]] = i;
    }
    return {-1, -1};  // not found
}`)}

      ${pythonPanel(this.id,
`# Two Sum — Hash Map — O(n) time, O(n) space
def two_sum(arr, target):
    seen = {}  # value -> index
    for i, val in enumerate(arr):
        complement = target - val
        if complement in seen:
            return (seen[complement], i)
        seen[val] = i
    return (-1, -1)`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Two Sum - Pair with Given Sum', slug: 'key-pair5616', isBatch: false, company: 'Amazon, Google, Microsoft', statement: 'Given an array arr[] of positive integers and another number target. Determine whether two elements exist in arr[] whose sum equals target.', hint: 'Hash map: for each element, check if (target - arr[i]) exists in the map.' },
        { lvl: 'medium', title: 'Count Pairs with Given Sum', slug: 'count-pairs-with-given-sum5022', isBatch: false, company: 'Amazon, Flipkart, Microsoft', statement: 'Given an array arr[] and an integer target, return the number of pairs (i, j) where i < j and arr[i] + arr[j] = target.', hint: 'Use hash map to count frequencies. For each element, add freq[target - arr[i]] to result.' },
        { lvl: 'medium', title: '4Sum - All Quadruplets', slug: 'find-all-four-sum-numbers1702', isBatch: false, company: 'Amazon, Microsoft', statement: 'Given an array arr[] of integers and a target, find all unique quadruplets [arr[a], arr[b], arr[c], arr[d]] such that their sum equals the target.', hint: 'Sort + two nested loops + two pointers on the rest. Handle duplicates.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
