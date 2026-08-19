/* ============================================================
   DAY 2 — TOPIC 02: REVERSE AN ARRAY
   Visualizes In-Place Array Reversal & Reverse in Groups of K
   ============================================================ */

const TOPIC_REVERSE_ARRAY = {
  id: 'reverse-arr',
  num: '02',
  title: 'Reverse an Array — Two Pointers & Group Reversal',
  tag: 'Arrays',
  intuition: 'Initialize two pointers at opposite ends (left = 0, right = n - 1). Swap their values, then move inward (left++, right--) until they cross. To reverse in groups of k, repeat the two-pointer reversal for each subsegment of length k.',
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
        <label>Mode</label>
        <select id="rev-mode">
          <option value="standard" selected>Full Array Reverse (Two Pointers)</option>
          <option value="groups">Reverse in Groups of K</option>
        </select>
        <label>Array</label>
        <input type="text" class="arr-input" id="rev-arr" value="10, 20, 30, 40, 50, 60, 70, 80">
        <span id="rev-k-container" style="display:none;align-items:center;gap:6px;">
          <label>k (group size)</label>
          <input type="number" id="rev-k" value="3" min="1" max="20" style="width:65px;">
        </span>
        <button class="primary" id="rev-apply">Apply</button>
        <button id="rev-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(rawArr, mode, kVal) {
      const n = rawArr.length;
      if (n === 0) {
        steps = [{ arr: [], phase: 'empty', desc: 'Array is empty', marks: {}, vars: {} }];
        return steps;
      }

      steps = [];
      let cur = [...rawArr];

      if (mode === 'standard') {
        steps.push({
          arr: [...cur],
          phase: 'Initialize',
          desc: `Starting standard two-pointer reversal on array of size ${n}. Left pointer at 0, Right pointer at ${n - 1}.`,
          marks: {
            0: { cls: 'active', tag: 'L (0)' },
            [n - 1]: { cls: 'active', tag: `R (${n - 1})` }
          },
          vars: { left: 0, right: n - 1, status: 'Ready to swap' }
        });

        let l = 0, r = n - 1;
        while (l < r) {
          // Compare step
          const prepMarks = {};
          for (let i = 0; i < l; i++) prepMarks[i] = { cls: 'good' };
          for (let i = r + 1; i < n; i++) prepMarks[i] = { cls: 'good' };
          prepMarks[l] = { cls: 'compare active', tag: 'L' };
          prepMarks[r] = { cls: 'compare active', tag: 'R' };

          steps.push({
            arr: [...cur],
            phase: 'Compare & Prep Swap',
            desc: `left=${l} < right=${r}. Values to swap: arr[${l}] = ${cur[l]} and arr[${r}] = ${cur[r]}.`,
            marks: { ...prepMarks },
            vars: { left: l, right: r, 'arr[left]': cur[l], 'arr[right]': cur[r] }
          });

          // Perform swap
          const temp = cur[l];
          cur[l] = cur[r];
          cur[r] = temp;

          const swappedMarks = {};
          for (let i = 0; i <= l; i++) swappedMarks[i] = { cls: 'good' };
          for (let i = r; i < n; i++) swappedMarks[i] = { cls: 'good' };
          swappedMarks[l] = { cls: 'good active', tag: '✓' };
          swappedMarks[r] = { cls: 'good active', tag: '✓' };

          steps.push({
            arr: [...cur],
            phase: 'Swapped',
            desc: `Swapped! arr[${l}] is now ${cur[l]} and arr[${r}] is ${cur[r]}. Advance left++, right--.`,
            marks: { ...swappedMarks },
            vars: { left: l + 1, right: r - 1, lastSwapped: `${cur[l]} ⇄ ${cur[r]}` }
          });

          l++;
          r--;
        }

        const finalMarks = {};
        for (let i = 0; i < n; i++) finalMarks[i] = { cls: 'good' };
        steps.push({
          arr: [...cur],
          phase: 'Complete',
          desc: `Pointers met/crossed (left >= right). Full array reversed in O(n/2) ≈ O(n) time and O(1) space.`,
          marks: finalMarks,
          vars: { result: `[${cur.join(', ')}]`, totalSwaps: Math.floor(n / 2) }
        });
      } else {
        // Groups of K mode
        const k = Math.max(1, kVal);
        steps.push({
          arr: [...cur],
          phase: 'Initialize Group Reverse',
          desc: `Reversing in groups of k=${k}. For each chunk of size ${k}, apply two-pointer reverse in-place.`,
          marks: {},
          vars: { groupSize: k, totalElements: n }
        });

        for (let i = 0; i < n; i += k) {
          let l = i;
          let r = Math.min(i + k - 1, n - 1);
          const groupIdx = Math.floor(i / k) + 1;

          const groupMarks = {};
          for (let idx = 0; idx < i; idx++) groupMarks[idx] = { cls: 'good' };
          for (let idx = i; idx <= r; idx++) groupMarks[idx] = { cls: 'compare' };

          steps.push({
            arr: [...cur],
            phase: `Group ${groupIdx} [${l}..${r}]`,
            desc: `Processing Group ${groupIdx}: subsegment indices [${l}..${r}].`,
            marks: { ...groupMarks },
            vars: { group: groupIdx, windowStart: l, windowEnd: r }
          });

          while (l < r) {
            const stepMarks = {};
            for (let idx = 0; idx < i; idx++) stepMarks[idx] = { cls: 'good' };
            for (let idx = i; idx <= Math.min(i + k - 1, n - 1); idx++) stepMarks[idx] = { cls: 'compare' };
            stepMarks[l] = { cls: 'active', tag: 'L' };
            stepMarks[r] = { cls: 'active', tag: 'R' };

            steps.push({
              arr: [...cur],
              phase: `Group ${groupIdx} Swap`,
              desc: `In Group ${groupIdx}: swap arr[${l}] (${cur[l]}) with arr[${r}] (${cur[r]}).`,
              marks: { ...stepMarks },
              vars: { group: groupIdx, left: l, right: r, 'arr[L]': cur[l], 'arr[R]': cur[r] }
            });

            const t = cur[l];
            cur[l] = cur[r];
            cur[r] = t;

            l++;
            r--;
          }

          const afterGroupMarks = {};
          for (let idx = 0; idx <= Math.min(i + k - 1, n - 1); idx++) afterGroupMarks[idx] = { cls: 'good' };
          steps.push({
            arr: [...cur],
            phase: `Group ${groupIdx} Finished`,
            desc: `Finished reversing Group ${groupIdx} [${i}..${Math.min(i + k - 1, n - 1)}].`,
            marks: { ...afterGroupMarks },
            vars: { completedGroup: groupIdx, status: 'Chunk reversed' }
          });
        }

        const finalMarks = {};
        for (let i = 0; i < n; i++) finalMarks[i] = { cls: 'good' };
        steps.push({
          arr: [...cur],
          phase: 'Complete',
          desc: `All groups of size k=${k} successfully reversed in-place!`,
          marks: finalMarks,
          vars: { result: `[${cur.join(', ')}]`, k }
        });
      }

      return steps;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_REVERSE_ARRAY.id;

      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">State:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
      `;

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#rev-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [10, 20, 30, 40, 50, 60, 70, 80];
      const mode = $('#rev-mode').value;
      const k = parseInt($('#rev-k').value) || 3;

      buildSteps(a, mode, k);
      $(`#player-mount-${TOPIC_REVERSE_ARRAY.id}`).innerHTML = '';
      $(`#desc-${TOPIC_REVERSE_ARRAY.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_REVERSE_ARRAY.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    const modeSelect = $('#rev-mode');
    modeSelect.addEventListener('change', () => {
      const isGroups = modeSelect.value === 'groups';
      $('#rev-k-container').style.display = isGroups ? 'inline-flex' : 'none';
      rebuild();
    });

    rebuild();

    $('#rev-apply').addEventListener('click', rebuild);
    $('#rev-random').addEventListener('click', () => {
      const len = randomInt(5, 9);
      $('#rev-arr').value = randomArray(len, 5, 95).join(',');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// 1. Standard In-Place Array Reverse:
function reverseArray(arr, n):
    left = 0, right = n - 1
    while left < right:
        swap(arr[left], arr[right])
        left = left + 1
        right = right - 1

// 2. Reverse in Groups of K:
function reverseInGroups(arr, n, k):
    for i from 0 to n-1 step k:
        left = i
        right = min(i + k - 1, n - 1)
        while left < right:
            swap(arr[left], arr[right])
            left++
            right--`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// 1. Full In-Place Array Reverse (Two Pointers)
void reverseArray(vector<int>& arr) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}

// 2. Reverse Array in Groups of K (GFG Siddhartha Batch)
void reverseInGroups(vector<long long>& arr, int n, int k) {
    for (int i = 0; i < n; i += k) {
        int left = i;
        int right = min(i + k - 1, n - 1);
        while (left < right) {
            swap(arr[left], arr[right]);
            left++;
            right--;
        }
    }
}

// 3. Recursive In-Place Array Reversal
void reverseRecursive(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    swap(arr[l], arr[r]);
    reverseRecursive(arr, l + 1, r - 1);
}`)}
      ${pythonPanel(this.id,
`# Full In-Place Array Reverse (Two Pointers)
def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

# Reverse in Groups of K
def reverse_in_groups(arr, k):
    n = len(arr)
    for i in range(0, n, k):
        left = i
        right = min(i + k - 1, n - 1)
        while left < right:
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            right -= 1

# Pythonic one-liner
arr = [1, 2, 3, 4, 5]
arr.reverse()  # or arr[::-1] for new list`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Reverse Array in Groups of K', slug: 'reverse-array-in-groups0255', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Paytm', hint: 'Iterate with step k. Reverse each subsegment from i to min(i+k-1, n-1) with two pointers.' },
        { lvl: 'hard', title: 'Rearrange the Array Alternately (Max/Min)', slug: 'rearrange-the-array-1639032648', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, FactSet', hint: 'Use two pointers from front and back, encoding both values using modulo arithmetic (arr[i] += (arr[max_idx] % max_elem) * max_elem).' },
        { lvl: 'easy', title: 'Reverse Words in a Given String', slug: 'reverse-words-in-a-given-string5459', track: 'strings-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Samsung, Cisco', hint: 'Reverse each individual word, then reverse the entire string (or use word tokenization).' },
        { lvl: 'basic', title: 'Reverse an Array (Standard)', slug: 'reverse-an-array', isBatch: false, company: 'Infosys, Cognizant, TCS', hint: 'Standard two-pointer swap from l=0 to r=n-1 in O(n) time and O(1) space.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
