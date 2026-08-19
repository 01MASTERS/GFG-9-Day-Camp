/* ============================================================
   DAY 3 — TOPIC 09: SELECTION SORT
   Visualizes find-minimum-and-swap sorting
   ============================================================ */

const TOPIC_SELECTION_SORT = {
  id: 'selection-sort',
  num: '09',
  title: 'Selection Sort — Find Minimum & Swap',
  tag: 'Sorting',
  intuition: 'For each position i from 0 to n-2, find the minimum element in the unsorted portion [i..n-1] and swap it with arr[i]. After each pass, position i is finalized with the i-th smallest element.',
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
        <label>Array</label>
        <input type="text" class="arr-input" id="sel-arr" value="64, 25, 12, 22, 11">
        <button class="primary" id="sel-apply">Apply</button>
        <button id="sel-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(rawArr) {
      steps = [];
      const n = rawArr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'empty', desc: 'Array is empty.', marks: {}, vars: {} });
        return;
      }

      let cur = [...rawArr];
      steps.push({
        arr: [...cur], phase: 'Start',
        desc: `Array of ${n} elements. Selection Sort: for each position, find the minimum in the unsorted portion and swap.`,
        marks: {}, vars: { n }
      });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        const passNum = i + 1;

        // Show start of pass
        const startMarks = {};
        for (let k = 0; k < i; k++) startMarks[k] = { cls: 'good' };
        startMarks[i] = { cls: 'active', tag: `i=${i}` };

        steps.push({
          arr: [...cur], phase: `Pass ${passNum}: Find Min in [${i}..${n - 1}]`,
          desc: `Pass ${passNum}: Finding minimum in unsorted portion [${i}..${n - 1}]. Current min = arr[${i}] = ${cur[i]}.`,
          marks: startMarks, vars: { pass: passNum, i, minIdx, 'arr[minIdx]': cur[minIdx] }
        });

        for (let j = i + 1; j < n; j++) {
          const marks = {};
          for (let k = 0; k < i; k++) marks[k] = { cls: 'good' };
          marks[i] = { cls: 'active', tag: `i=${i}` };
          marks[minIdx] = { cls: 'compare', tag: 'min' };
          marks[j] = { cls: 'compare active', tag: `j=${j}` };

          if (cur[j] < cur[minIdx]) {
            steps.push({
              arr: [...cur], phase: `Pass ${passNum}: New Min`,
              desc: `arr[${j}]=${cur[j]} < arr[${minIdx}]=${cur[minIdx]}. Update minIdx = ${j}.`,
              marks: { ...marks, [j]: { cls: 'good active', tag: 'new min' } },
              vars: { pass: passNum, j, oldMin: minIdx, newMin: j, 'arr[j]': cur[j] }
            });
            minIdx = j;
          } else {
            steps.push({
              arr: [...cur], phase: `Pass ${passNum}: Compare`,
              desc: `arr[${j}]=${cur[j]} ≥ arr[${minIdx}]=${cur[minIdx]}. minIdx stays ${minIdx}.`,
              marks, vars: { pass: passNum, j, minIdx, 'arr[j]': cur[j], 'arr[minIdx]': cur[minIdx] }
            });
          }
        }

        // Swap
        if (minIdx !== i) {
          const swapMarks = {};
          for (let k = 0; k < i; k++) swapMarks[k] = { cls: 'good' };
          swapMarks[i] = { cls: 'compare active', tag: 'i' };
          swapMarks[minIdx] = { cls: 'compare active', tag: 'min' };

          steps.push({
            arr: [...cur], phase: `Pass ${passNum}: Swap`,
            desc: `Swap arr[${i}]=${cur[i]} with arr[${minIdx}]=${cur[minIdx]}.`,
            marks: swapMarks, vars: { pass: passNum, swapping: `${cur[i]} ⇄ ${cur[minIdx]}` }
          });

          const temp = cur[i];
          cur[i] = cur[minIdx];
          cur[minIdx] = temp;
        }

        const afterMarks = {};
        for (let k = 0; k <= i; k++) afterMarks[k] = { cls: 'good' };
        afterMarks[i] = { cls: 'good active', tag: '✓' };

        steps.push({
          arr: [...cur], phase: `Pass ${passNum} Done`,
          desc: `Position ${i} finalized with value ${cur[i]}.`,
          marks: afterMarks, vars: { pass: passNum, 'arr[i]': cur[i], sortedSoFar: i + 1 }
        });
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...cur], phase: 'Sorted!',
        desc: `Selection Sort complete. Array is fully sorted.`,
        marks: fMarks, vars: { result: `[${cur.join(', ')}]` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SELECTION_SORT.id;
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
      const raw = $('#sel-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [64, 25, 12, 22, 11];
      buildSteps(a);
      $(`#player-mount-${TOPIC_SELECTION_SORT.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SELECTION_SORT.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SELECTION_SORT.id}`),
        totalSteps: steps.length,
        onRender: draw,
        speed: 600
      });
    }

    rebuild();
    $('#sel-apply').addEventListener('click', rebuild);
    $('#sel-random').addEventListener('click', () => {
      const len = randomInt(5, 8);
      $('#sel-arr').value = randomArray(len, 5, 95).join(',');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function selectionSort(arr, n):
    for i from 0 to n-2:
        minIdx = i
        for j from i+1 to n-1:
            if arr[j] < arr[minIdx]:
                minIdx = j
        swap(arr[i], arr[minIdx])`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Selection Sort — O(n^2) time, O(1) space
// Not stable, but always exactly n-1 swaps
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`)}

      ${pythonPanel(this.id,
`# Selection Sort — O(n^2) time, O(1) space
# Not stable, but always exactly n-1 swaps
def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example usage
arr = [64, 25, 12, 22, 11]
print(selection_sort(arr))  # [11, 12, 22, 25, 64]`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Selection Sort', slug: 'selection-sort', track: 'sorting-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Find minimum in unsorted portion, swap with front element. Exactly n-1 swaps.' },
        { lvl: 'medium', title: 'Sort an Array of 0s, 1s and 2s', slug: 'sort-an-array-of-0s-1s-and-2s4231', isBatch: false, company: 'Amazon, Microsoft, Samsung', hint: 'Dutch National Flag / 3-way partitioning. Use three pointers: low, mid, high.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
