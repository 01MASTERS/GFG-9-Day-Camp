/* ============================================================
   DAY 2 — TOPIC 07: GENERATE ALL SUBARRAYS
   Visualizes Contiguous Subarray Generation & Subarray Sums
   ============================================================ */

const TOPIC_SUBARRAYS = {
  id: 'subarrays',
  num: '07',
  title: 'Generate All Subarrays — Nested Loops & O(n²) Slices',
  tag: 'Arrays',
  intuition: 'A subarray is a contiguous slice of an array. An array of size n has exactly n*(n+1)/2 non-empty subarrays. Fixing start index i from 0..n-1 and expanding end index j from i..n-1 generates every contiguous subarray in O(n²) time.',
  time: 'O(n²)',
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
        <select id="sub-mode">
          <option value="all" selected>All Contiguous Subarrays</option>
          <option value="sums">Subarray Sums Tracker</option>
          <option value="increasing">Strictly Increasing Subarrays</option>
        </select>
        <label>Array</label>
        <input type="text" class="arr-input" id="sub-arr" value="1, 2, 3, 4" style="width:160px;">
        <button class="primary" id="sub-apply">Apply</button>
        <button id="sub-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(rawArr, mode) {
      const n = rawArr.length;
      if (n === 0) {
        steps = [{ arr: [], phase: 'empty', desc: 'Array is empty', marks: {}, vars: {}, gallery: [] }];
        return steps;
      }

      steps = [];
      const totalPossible = (n * (n + 1)) / 2;
      const gallery = [];

      steps.push({
        arr: [...rawArr],
        phase: 'Initialize',
        desc: `Array of size n=${n}. Total contiguous subarrays to generate: n*(n+1)/2 = ${n}*${n + 1}/2 = ${totalPossible}.`,
        marks: {},
        currSlice: [],
        gallery: [],
        vars: { n, totalSubarrays: totalPossible, mode: mode.toUpperCase() }
      });

      let countIncreasing = 0;

      for (let i = 0; i < n; i++) {
        let runningSum = 0;
        let isStrictlyIncreasing = true;

        for (let j = i; j < n; j++) {
          runningSum += rawArr[j];
          if (j > i && rawArr[j] <= rawArr[j - 1]) {
            isStrictlyIncreasing = false;
          }

          const slice = rawArr.slice(i, j + 1);
          const isInc = isStrictlyIncreasing;
          if (isInc) countIncreasing++;

          gallery.push({
            slice: [...slice],
            sum: runningSum,
            isInc,
            indices: `[${i}..${j}]`
          });

          const marks = {};
          for (let k = 0; k < n; k++) {
            if (k >= i && k <= j) {
              marks[k] = { cls: 'max active' };
            } else {
              marks[k] = { cls: 'dim' };
            }
          }
          marks[i] = { ...marks[i], tag: 'i (start)' };
          marks[j] = { ...marks[j], tag: (i === j ? 'i, j' : 'j (end)') };

          let descText = `Subarray [${i}..${j}]: [ ${slice.join(', ')} ] (length ${j - i + 1}). Generated ${gallery.length} of ${totalPossible}.`;
          if (mode === 'sums') {
            descText += ` Running Sum = ${runningSum}.`;
          } else if (mode === 'increasing') {
            descText += isInc ? ' Strictly Increasing: YES ✅' : ' Strictly Increasing: NO ❌';
          }

          steps.push({
            arr: [...rawArr],
            phase: `Subarray [${i}..${j}]`,
            desc: descText,
            marks,
            currSlice: slice,
            gallery: [...gallery],
            vars: {
              start: i,
              end: j,
              length: j - i + 1,
              subarray: `[${slice.join(', ')}]`,
              sum: runningSum,
              progress: `${gallery.length} / ${totalPossible}`,
              increasingCount: countIncreasing
            }
          });
        }
      }

      const finalMarks = {};
      for (let k = 0; k < n; k++) finalMarks[k] = { cls: 'good' };

      steps.push({
        arr: [...rawArr],
        phase: 'Complete',
        desc: `Completed! All ${totalPossible} contiguous subarrays generated in O(n²) time.` +
          (mode === 'increasing' ? ` Found ${countIncreasing} strictly increasing subarrays.` : ''),
        marks: finalMarks,
        currSlice: [],
        gallery: [...gallery],
        vars: {
          totalGenerated: totalPossible,
          increasingSubarrays: countIncreasing,
          timeComplexity: 'O(n²)',
          spaceComplexity: 'O(1)'
        }
      });

      return steps;
    }

    function renderGallery(gallery) {
      if (!gallery || gallery.length === 0) return '';
      const chips = gallery.map(item => `
        <div style="background:var(--panel-2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-family:'JetBrains Mono';font-size:11px;display:flex;align-items:center;gap:6px;">
          <span style="color:var(--yellow);font-weight:700;">${item.indices}</span>
          <span style="color:var(--chalk);font-weight:600;">[${item.slice.join(',')}]</span>
          <span style="color:var(--teal);font-size:10px;">Σ=${item.sum}</span>
        </div>
      `).join('');

      return `
        <div style="margin-top:10px;width:100%;max-width:680px;">
          <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:6px;text-align:center;">
            Generated Subarrays Gallery (${gallery.length})
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;max-height:110px;overflow-y:auto;padding:4px;border:1px dashed var(--border);border-radius:8px;">
            ${chips}
          </div>
        </div>
      `;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SUBARRAYS.id;

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
          <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
          ${renderGallery(s.gallery)}
        </div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Active Subarray:</span>
          <div class="eq-box hl">${s.currSlice.length ? `[ ${s.currSlice.join(', ')} ]` : 'None'}</div>
        </div>
      `;

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#sub-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 2, 3, 4];
      const mode = $('#sub-mode').value;

      buildSteps(a, mode);
      $(`#player-mount-${TOPIC_SUBARRAYS.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SUBARRAYS.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SUBARRAYS.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#sub-apply').addEventListener('click', rebuild);
    $('#sub-mode').addEventListener('change', rebuild);
    $('#sub-random').addEventListener('click', () => {
      const len = randomInt(3, 5);
      $('#sub-arr').value = randomArray(len, 1, 20).join(',');
      rebuild();
    });

    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// 1. Generate and Process All Subarrays (O(n²) time, O(1) space):
function generateAllSubarrays(arr, n):
    for i from 0 to n - 1:
        runningSum = 0
        for j from i to n - 1:
            runningSum += arr[j] // O(1) sum accumulation
            processSubarray(arr[i..j], runningSum)

// 2. Count Strictly Increasing Subarrays (O(n) Optimal Sliding Window):
function countIncreasing(arr, n):
    total = 0
    len = 1
    for i from 1 to n - 1:
        if arr[i] > arr[i - 1]:
            len++
        else:
            total += (len * (len - 1)) / 2
            len = 1
    total += (len * (len - 1)) / 2
    return total`)}

      ${cppPanel(this.id,
`#include <vector>
#include <iostream>
using namespace std;

// 1. Print / Process All Subarrays (O(n²) time, O(1) auxiliary space)
void printAllSubarrays(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += arr[j];
            // Subarray spans arr[i...j] with sum = currentSum
        }
    }
}

// 2. Count Strictly Increasing Subarrays of length >= 2 (GFG Siddhartha Batch)
long long countIncreasingSubarrays(vector<int>& arr, int n) {
    long long count = 0;
    long long len = 1;
    
    for (int i = 1; i < n; i++) {
        if (arr[i] > arr[i - 1]) {
            len++;
        } else {
            count += (len * (len - 1)) / 2;
            len = 1;
        }
    }
    count += (len * (len - 1)) / 2;
    return count;
}

// 3. Split an Array into Two Equal Sum Subarrays (O(n) Prefix Sum)
int splitEqualSumSubarrays(vector<int>& arr) {
    int total = 0;
    for (int x : arr) total += x;
    
    int prefix = 0;
    for (int i = 0; i < (int)arr.size(); i++) {
        prefix += arr[i];
        if (prefix == total - prefix) {
            return i; // Valid split point after index i
        }
    }
    return -1;
}`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Count Strictly Increasing Subarrays', slug: 'count-increasing-subarrays5301', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Find length len of each contiguous increasing segment. Number of valid subarrays in segment is len * (len - 1) / 2.' },
        { lvl: 'easy', title: 'Split an Array into Two Equal Sum Subarrays', slug: 'split-an-array-into-two-equal-sum-subarrays', track: 'array-fundamental-siddhartha', isBatch: true, company: 'TCS, Infosys', hint: 'Compute total sum and check if any prefix sum equals exactly total / 2.' },
        { lvl: 'medium', title: 'Longest Subarray of Evens and Odds', slug: 'longest-subarray-of-evens-and-odds', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, PayU', hint: 'Kadane-style transition tracking alternating parity of adjacent elements in O(n) time.' },
        { lvl: 'medium', title: 'Subarray with Given Sum', slug: 'subarray-with-given-sum-1587115621', isBatch: false, company: 'Amazon, Visa, Google', hint: 'Use a two-pointer sliding window for non-negative integers or prefix sum hash map for negatives.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
