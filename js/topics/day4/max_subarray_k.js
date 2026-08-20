/* ============================================================
   DAY 4 — TOPIC 01: MAX SUBARRAY SUM OF SIZE K
   Fixed-size sliding window: slide a window of size k,
   track the running sum, and record the maximum.
   ============================================================ */

const TOPIC_MAX_SUBARRAY_K = {
  id: 'max-subarray-k',
  num: '01',
  title: 'Max Subarray Sum of Size K — Fixed Sliding Window',
  tag: 'Sliding Window',
  intuition: 'Instead of recomputing the sum of every k-length subarray from scratch (O(n·k)), slide a window: subtract the element leaving and add the element entering. Each slide is O(1), so the whole scan is O(n).',
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
        <label>Array</label>
        <input type="text" class="arr-input" id="msk-arr" value="2, 1, 5, 1, 3, 2">
        <label>k</label>
        <input type="number" id="msk-k" value="3" style="width:55px;" min="1">
        <button class="primary" id="msk-apply">Apply</button>
        <button id="msk-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, k) {
      steps = [];
      const n = arr.length;
      if (n === 0 || k > n || k <= 0) {
        steps.push({ arr: [], phase: 'Invalid', desc: `Array length (${n}) must be ≥ k (${k}).`, marks: {}, vars: {} });
        return;
      }

      // Step 1: compute initial window sum
      let windowSum = 0;
      const initMarks = {};
      for (let i = 0; i < k; i++) {
        windowSum += arr[i];
        initMarks[i] = { cls: 'active', tag: i === 0 ? 'win L' : (i === k - 1 ? 'win R' : '') };
      }
      let maxSum = windowSum;
      let maxStart = 0;

      steps.push({
        arr: [...arr], phase: 'Init Window',
        desc: `First window [0..${k - 1}]: sum = ${windowSum}. This is our initial maxSum.`,
        marks: initMarks,
        vars: { windowSum, maxSum, window: `[0..${k - 1}]` }
      });

      // Step 2+: slide
      for (let i = k; i < n; i++) {
        const leaving = arr[i - k];
        const entering = arr[i];
        windowSum = windowSum - leaving + entering;

        const marks = {};
        // dim elements before window
        for (let j = 0; j < i - k + 1; j++) marks[j] = { cls: 'bad' };
        // mark leaving element
        marks[i - k] = { cls: 'bad', tag: `−${leaving}` };
        // mark window
        for (let j = i - k + 1; j <= i; j++) {
          marks[j] = { cls: 'active' };
        }
        marks[i - k + 1] = { cls: 'active', tag: 'win L' };
        marks[i] = { cls: 'active', tag: `+${entering}` };

        const improved = windowSum > maxSum;
        if (improved) {
          maxSum = windowSum;
          maxStart = i - k + 1;
        }

        steps.push({
          arr: [...arr], phase: improved ? '✦ New Max!' : 'Slide',
          desc: `Slide: remove arr[${i - k}]=${leaving}, add arr[${i}]=${entering}. windowSum = ${windowSum}. ${improved ? 'New maxSum = ' + maxSum + '!' : 'maxSum stays ' + maxSum + '.'}`,
          marks,
          vars: { windowSum, maxSum, left: i - k + 1, right: i, removed: leaving, added: entering }
        });
      }

      // Final step highlighting best window
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        if (i >= maxStart && i < maxStart + k) fMarks[i] = { cls: 'good' };
        else fMarks[i] = { cls: 'bad' };
      }
      fMarks[maxStart] = { cls: 'good', tag: 'best L' };
      fMarks[maxStart + k - 1] = { cls: 'good', tag: 'best R' };

      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Maximum subarray sum of size ${k} = ${maxSum}, at window [${maxStart}..${maxStart + k - 1}].`,
        marks: fMarks,
        vars: { maxSum, bestWindow: `[${maxStart}..${maxStart + k - 1}]` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_MAX_SUBARRAY_K.id;
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
      const raw = $('#msk-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [2, 1, 5, 1, 3, 2];
      $('#msk-arr').value = a.join(', ');
      const k = Math.max(1, parseInt($('#msk-k').value) || 3);
      $('#msk-k').value = k;
      buildSteps(a, k);
      $(`#player-mount-${TOPIC_MAX_SUBARRAY_K.id}`).innerHTML = '';
      $(`#desc-${TOPIC_MAX_SUBARRAY_K.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_MAX_SUBARRAY_K.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#msk-apply').addEventListener('click', rebuild);
    $('#msk-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      const arr = randomArray(len, 1, 20);
      $('#msk-arr').value = arr.join(', ');
      $('#msk-k').value = randomInt(2, Math.min(5, len));
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function maxSubarraySum(arr, n, k):
    windowSum = sum of arr[0..k-1]
    maxSum = windowSum
    for i from k to n-1:
        windowSum = windowSum - arr[i-k] + arr[i]
        maxSum = max(maxSum, windowSum)
    return maxSum`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// Fixed Sliding Window — O(n) time, O(1) space
int maxSubarraySum(vector<int>& arr, int k) {
    int n = arr.size();
    int windowSum = 0;
    for (int i = 0; i < k; i++)
        windowSum += arr[i];

    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`)}

      ${pythonPanel(this.id,
`# Fixed Sliding Window — O(n) time, O(1) space
def max_subarray_sum(arr, k):
    n = len(arr)
    window_sum = sum(arr[:k])
    max_sum = window_sum

    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Max Sum Subarray of Size K', slug: 'max-sum-subarray-of-size-k5313', track: 'sliding-window-siddhartha', isBatch: true, company: 'TCS, Infosys', statement: 'Given an array of integers arr[] and a number k, find the maximum sum of a subarray of size k.', hint: 'Classic fixed sliding window: compute initial window sum, then slide by subtracting left and adding right.' },
        { lvl: 'easy', title: 'Chocolate Distribution Problem', slug: 'chocolate-distribution-problem3825', track: 'sliding-window-siddhartha', isBatch: true, company: 'TCS, Infosys', statement: 'Given an array arr[] of n integers where each value represents the number of chocolates in a packet, and m students. Distribute exactly one packet to each student such that the difference between the maximum and minimum chocolates given is minimized.', hint: 'Sort the array, then use a fixed window of size m to find the minimum difference between max and min in any window.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
