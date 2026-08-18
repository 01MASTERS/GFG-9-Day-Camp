/* ============================================================
   DAY 2 — TOPIC 01: ROTATE ARRAY
   Visualizes Left & Right rotation using the optimal O(1) space Reversal Algorithm
   ============================================================ */

const TOPIC_ROTATE_ARRAY = {
  id: 'rotate',
  num: '01',
  title: 'Rotate Array — Reversal Algorithm (O(1) Space)',
  tag: 'Arrays',
  intuition: 'To rotate an array by k positions in-place, reverse the partitions and then the whole array. For Left rotation: Reverse arr[0..k-1], Reverse arr[k..n-1], then Reverse arr[0..n-1]. Time O(n), Space O(1).',
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
        <input type="text" class="arr-input" id="rot-arr" value="1,2,3,4,5,6,7">
        <label>k (shift)</label>
        <input type="number" id="rot-k" value="3" min="0" max="30" style="width:70px;">
        <label>Direction</label>
        <select id="rot-dir">
          <option value="left">Left Rotate (←)</option>
          <option value="right" selected>Right Rotate (→)</option>
        </select>
        <button class="primary" id="rot-apply">Apply</button>
        <button id="rot-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];
    let initialArr = [];

    function buildSteps(rawArr, kVal, dir) {
      initialArr = [...rawArr];
      const n = rawArr.length;
      if (n === 0) {
        steps = [{ phase: 'empty', arr: [], desc: 'Empty array', vars: {} }];
        return steps;
      }

      const k = ((kVal % n) + n) % n;
      steps = [];

      let cur = [...rawArr];

      // Initial state
      steps.push({
        arr: [...cur],
        phase: 'start',
        desc: `Initial array of size n=${n}. Requested rotation: ${kVal} steps (${dir.toUpperCase()}). Normalized k = ${kVal} % ${n} = ${k}.`,
        marks: {},
        vars: { n, k, direction: dir.toUpperCase(), effectiveShift: k }
      });

      if (k === 0) {
        steps.push({
          arr: [...cur],
          phase: 'done',
          desc: `k = 0 or multiple of n (${n}). Array remains identical!`,
          marks: {},
          vars: { n, k: 0, status: 'No shift needed' }
        });
        return steps;
      }

      function recordReversal(start, end, partName) {
        let l = start, r = end;
        // Mark partition
        const partMarks = {};
        for (let i = start; i <= end; i++) partMarks[i] = { cls: 'compare' };

        steps.push({
          arr: [...cur],
          phase: `Partition: ${partName}`,
          desc: `Step: Reverse ${partName} from index ${start} to ${end}.`,
          marks: { ...partMarks },
          vars: { action: `Reversing [${start}..${end}]`, left: l, right: r }
        });

        while (l < r) {
          const swapMarks = {};
          for (let i = start; i <= end; i++) swapMarks[i] = { cls: 'compare' };
          swapMarks[l] = { cls: 'active', tag: 'L' };
          swapMarks[r] = { cls: 'active', tag: 'R' };

          steps.push({
            arr: [...cur],
            phase: `Swapping ${partName}`,
            desc: `Swap arr[${l}] (${cur[l]}) and arr[${r}] (${cur[r]}).`,
            marks: { ...swapMarks },
            vars: { left: l, right: r, 'arr[L]': cur[l], 'arr[R]': cur[r] }
          });

          // Swap in state
          const temp = cur[l];
          cur[l] = cur[r];
          cur[r] = temp;

          const afterMarks = {};
          for (let i = start; i <= end; i++) afterMarks[i] = { cls: 'compare' };
          afterMarks[l] = { cls: 'good', tag: '✓' };
          afterMarks[r] = { cls: 'good', tag: '✓' };

          steps.push({
            arr: [...cur],
            phase: `Swapped ${partName}`,
            desc: `Swapped! arr[${l}] is now ${cur[l]} and arr[${r}] is ${cur[r]}. Move pointers inward.`,
            marks: { ...afterMarks },
            vars: { left: l + 1, right: r - 1, status: 'Swapped' }
          });

          l++;
          r--;
        }
      }

      if (dir === 'left') {
        // Left Rotate by k:
        // 1. Reverse arr[0..k-1]
        // 2. Reverse arr[k..n-1]
        // 3. Reverse arr[0..n-1]
        recordReversal(0, k - 1, `Prefix [0..${k - 1}]`);
        recordReversal(k, n - 1, `Suffix [${k}..${n - 1}]`);
        recordReversal(0, n - 1, `Entire Array [0..${n - 1}]`);
      } else {
        // Right Rotate by k:
        // 1. Reverse arr[0..n-1]
        // 2. Reverse arr[0..k-1]
        // 3. Reverse arr[k..n-1]
        recordReversal(0, n - 1, `Entire Array [0..${n - 1}]`);
        recordReversal(0, k - 1, `First ${k} Elements [0..${k - 1}]`);
        recordReversal(k, n - 1, `Remaining Elements [${k}..${n - 1}]`);
      }

      // Final complete state
      const finalMarks = {};
      for (let i = 0; i < n; i++) finalMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...cur],
        phase: 'Complete',
        desc: `Rotation Complete! Array successfully rotated ${dir.toUpperCase()} by ${k} positions in O(1) auxiliary space.`,
        marks: finalMarks,
        vars: { result: `[${cur.join(', ')}]`, spaceComplexity: 'O(1) in-place' }
      });

      return steps;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_ROTATE_ARRAY.id;

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
      const raw = $('#rot-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 2, 3, 4, 5, 6, 7];
      const k = parseInt($('#rot-k').value) || 0;
      const dir = $('#rot-dir').value;

      buildSteps(a, k, dir);
      $(`#player-mount-${TOPIC_ROTATE_ARRAY.id}`).innerHTML = '';
      $(`#desc-${TOPIC_ROTATE_ARRAY.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_ROTATE_ARRAY.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();

    $('#rot-apply').addEventListener('click', rebuild);
    $('#rot-dir').addEventListener('change', rebuild);
    $('#rot-random').addEventListener('click', () => {
      const len = randomInt(5, 9);
      $('#rot-arr').value = randomArray(len, 1, 99).join(',');
      $('#rot-k').value = randomInt(1, len);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// Reversal Algorithm for Right Rotation by k:
function rotateRight(arr, n, k):
    k = k % n
    reverse(arr, 0, n - 1)     // Step 1: Reverse entire array
    reverse(arr, 0, k - 1)     // Step 2: Reverse first k elements
    reverse(arr, k, n - 1)     // Step 3: Reverse remaining n-k elements

// Reversal Algorithm for Left Rotation by d:
function rotateLeft(arr, n, d):
    d = d % n
    reverse(arr, 0, d - 1)     // Step 1: Reverse first d elements
    reverse(arr, d, n - 1)     // Step 2: Reverse remaining n-d elements
    reverse(arr, 0, n - 1)     // Step 3: Reverse entire array`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// In-Place Reversal Helper
void reverseRange(vector<int>& arr, int start, int end) {
    while (start < end) {
        swap(arr[start], arr[end]);
        start++;
        end--;
    }
}

// 1. Left Rotate by d elements (O(n) time, O(1) space)
void rotateLeft(vector<int>& arr, int d) {
    int n = arr.size();
    if (n == 0) return;
    d = d % n;
    reverseRange(arr, 0, d - 1);
    reverseRange(arr, d, n - 1);
    reverseRange(arr, 0, n - 1);
}

// 2. Right Rotate by k elements (LeetCode 189)
void rotateRight(vector<int>& arr, int k) {
    int n = arr.size();
    if (n == 0) return;
    k = k % n;
    reverseRange(arr, 0, n - 1);
    reverseRange(arr, 0, k - 1);
    reverseRange(arr, k, n - 1);
}

// 3. Juggling Algorithm (GCD Cycles) — Alternative O(1) space
void rotateLeftJuggling(vector<int>& arr, int d) {
    int n = arr.size();
    d = d % n;
    int g = std::__gcd(d, n);
    for (int i = 0; i < g; i++) {
        int temp = arr[i];
        int j = i;
        while (true) {
            int k = (j + d) % n;
            if (k == i) break;
            arr[j] = arr[k];
            j = k;
        }
        arr[j] = temp;
    }
}`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Rotate Array by N Elements', slug: 'rotate-array-by-n-elements-1587115621', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Adobe, Cisco', hint: 'Apply the 3-reversals method to rotate the array counter-clockwise by d in O(1) auxiliary space.' },
        { lvl: 'medium', title: 'Check if Strings are Rotations of Each Other', slug: 'check-if-strings-are-rotations-of-each-other-or-not-1587115620', track: 'strings-practice-siddhartha', isBatch: true, company: 'Oracle, Amazon, Microsoft', hint: 'Check if string s2 is a substring of (s1 + s1).' },
        { lvl: 'medium', title: 'Rearrange Array with O(1) Extra Space', slug: 'rearrange-an-array-with-o1-extra-space3142', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Samsung, Paytm', hint: 'Store two values at one index using mathematical quotient and remainder encoding (arr[i] += (arr[arr[i]] % n) * n).' },
        { lvl: 'medium', title: 'Rotate Matrix by 180 Degree', slug: 'c-matrix-rotation-by-180-degree0745', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: '180° rotation equals reversing each row and then reversing each column.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
