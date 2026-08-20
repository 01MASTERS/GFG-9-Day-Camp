/* ============================================================
   DAY 4 — TOPIC 07: TWO SUM IN SORTED ARRAY
   Two pointers from both ends on a sorted array.
   ============================================================ */

const TOPIC_TWO_SUM_SORTED = {
  id: 'two-sum-sorted',
  num: '07',
  title: 'Two Sum in Sorted Array — Two Pointers',
  tag: 'Two Pointers',
  intuition: 'In a sorted array, place left at start and right at end. If sum < target → move left right (increase sum). If sum > target → move right left (decrease sum). Meets in O(n).',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Sorted Array</label>
        <input type="text" class="arr-input" id="ts-arr" value="1, 2, 3, 4, 6, 8, 11, 15">
        <label>Target</label>
        <input type="number" id="ts-target" value="9" style="width:65px;">
        <button class="primary" id="ts-apply">Apply</button>
        <button id="ts-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, target) {
      steps = [];
      const n = arr.length;
      if (n < 2) {
        steps.push({ arr: [...arr], phase: 'Too Short', desc: 'Need at least 2 elements.', marks: {}, vars: {} });
        return;
      }

      let left = 0, right = n - 1;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Sorted array, target = ${target}. Place left=0, right=${right}.`,
        marks: { 0: { cls: 'active', tag: 'L' }, [right]: { cls: 'active', tag: 'R' } },
        vars: { left: 0, right, target }
      });

      while (left < right) {
        const sum = arr[left] + arr[right];
        const marks = {};

        // Dim already-eliminated positions
        for (let i = 0; i < left; i++) marks[i] = { cls: 'bad' };
        for (let i = right + 1; i < n; i++) marks[i] = { cls: 'bad' };
        marks[left] = { cls: 'active', tag: 'L' };
        marks[right] = { cls: 'active', tag: 'R' };

        if (sum === target) {
          marks[left] = { cls: 'good active', tag: '✓ L' };
          marks[right] = { cls: 'good active', tag: '✓ R' };
          steps.push({
            arr: [...arr], phase: 'Found!',
            desc: `arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} == ${target}. Found the pair!`,
            marks,
            vars: { left, right, 'arr[L]': arr[left], 'arr[R]': arr[right], sum, target, result: `(${arr[left]}, ${arr[right]})` }
          });
          return;
        } else if (sum < target) {
          steps.push({
            arr: [...arr], phase: 'Sum Too Small → L++',
            desc: `arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} < ${target}. Need larger sum → move left right to ${left + 1}.`,
            marks,
            vars: { left, right, 'arr[L]': arr[left], 'arr[R]': arr[right], sum, target, action: 'left++' }
          });
          left++;
        } else {
          steps.push({
            arr: [...arr], phase: 'Sum Too Large → R--',
            desc: `arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum} > ${target}. Need smaller sum → move right left to ${right - 1}.`,
            marks,
            vars: { left, right, 'arr[L]': arr[left], 'arr[R]': arr[right], sum, target, action: 'right--' }
          });
          right--;
        }
      }

      // Not found
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
      steps.push({
        arr: [...arr], phase: 'Not Found',
        desc: `Pointers crossed. No pair sums to ${target}. Return false / [-1, -1].`,
        marks: fMarks,
        vars: { result: 'Not Found', target }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_TWO_SUM_SORTED.id;
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
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
      const raw = $('#ts-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length >= 2 ? raw.sort((a, b) => a - b) : [1, 2, 3, 4, 6, 8, 11, 15];
      $('#ts-arr').value = a.join(', ');
      const target = parseInt($('#ts-target').value) || 9;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_TWO_SUM_SORTED.id}`).innerHTML = '';
      $(`#desc-${TOPIC_TWO_SUM_SORTED.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_TWO_SUM_SORTED.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ts-apply').addEventListener('click', rebuild);
    $('#ts-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      const arr = randomArray(len, 1, 30).sort((a, b) => a - b);
      $('#ts-arr').value = arr.join(', ');
      // 60% chance target is achievable
      if (Math.random() < 0.6) {
        const i = randomInt(0, len - 2);
        const j = randomInt(i + 1, len - 1);
        $('#ts-target').value = arr[i] + arr[j];
      } else {
        $('#ts-target').value = randomInt(5, 50);
      }
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function twoSum(arr, target):
    left = 0, right = n - 1
    while left < right:
        sum = arr[left] + arr[right]
        if sum == target:
            return (left, right)
        else if sum < target:
            left++
        else:
            right--
    return NOT_FOUND`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Two Pointers on Sorted Array — O(n) time, O(1) space
pair<int,int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)
            return {left, right};
        else if (sum < target)
            left++;
        else
            right--;
    }
    return {-1, -1};  // not found
}

// If array is NOT sorted, use hash map approach:
// unordered_map<int,int> seen;
// for each i: if seen.count(target - arr[i]) → found
// else seen[arr[i]] = i;`)}

      ${pythonPanel(this.id,
`# Two Pointers on Sorted Array — O(n) time, O(1) space
def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        elif s < target:
            left += 1
        else:
            right -= 1
    return (-1, -1)

# Hash map approach for unsorted array — O(n) time, O(n) space
def two_sum_unsorted(arr, target):
    seen = {}
    for i, val in enumerate(arr):
        complement = target - val
        if complement in seen:
            return (seen[complement], i)
        seen[val] = i
    return (-1, -1)`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Pair with Given Sum in Sorted Array', slug: 'pair-with-given-sum-in-a-sorted-array4940', isBatch: false, company: 'Amazon, Microsoft, TCS', statement: 'Given a sorted array arr[] and a target sum, find if there exists a pair of elements in the array whose sum equals the given target. Return true if such a pair exists, otherwise false.', hint: 'Classic two-pointer: left + right on sorted array. Adjust based on comparison with target.' },
        { lvl: 'easy', title: 'Pairs with Specific Difference', slug: 'pairs-with-specific-difference1533', track: 'sorting-siddhartha', isBatch: true, company: 'TCS, Infosys', statement: 'Given an array arr[] of integers and a number k, count all distinct pairs of elements in the array that have an absolute difference equal to k.', hint: 'Sort + two-pointer, or hash set for O(n) lookup.' },
        { lvl: 'medium', title: 'Count Possible Triangles', slug: 'count-possible-triangles-1587115620', track: 'sorting-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given an unsorted array arr[] of n positive integers, find the number of triangles that can be formed with three different array elements as the lengths of three sides of the triangle.', hint: 'Sort array. Fix largest side, use two-pointer on remaining to count valid pairs.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
