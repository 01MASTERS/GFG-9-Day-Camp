/* ============================================================
   DAY 3 — TOPIC 10: INSERTION SORT
   Visualizes shift-and-insert sorting
   ============================================================ */

const TOPIC_INSERTION_SORT = {
  id: 'insertion-sort',
  num: '10',
  title: 'Insertion Sort — Shift & Insert',
  tag: 'Sorting',
  intuition: 'Build the sorted array one element at a time. For each element at position i, "pick it up" (key = arr[i]) and shift all larger elements in the sorted portion [0..i-1] one step right, then insert the key into its correct position. Best case O(n) on nearly sorted arrays.',
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
        <input type="text" class="arr-input" id="ins-arr" value="12, 11, 13, 5, 6">
        <button class="primary" id="ins-apply">Apply</button>
        <button id="ins-random">🎲 Random</button>
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
        desc: `Array of ${n} elements. Insertion Sort: build sorted portion from left, inserting each new element at its correct position.`,
        marks: { 0: { cls: 'good', tag: 'sorted' } }, vars: { n }
      });

      for (let i = 1; i < n; i++) {
        const key = cur[i];
        const passNum = i;

        // Pick up key
        const pickMarks = {};
        for (let k = 0; k < i; k++) pickMarks[k] = { cls: 'good' };
        pickMarks[i] = { cls: 'compare active', tag: `key=${key}` };

        steps.push({
          arr: [...cur], phase: `Pass ${passNum}: Pick Key`,
          desc: `Pass ${passNum}: Pick up key = arr[${i}] = ${key}. Will insert it into sorted portion [0..${i - 1}].`,
          marks: pickMarks, vars: { pass: passNum, key, i }
        });

        let j = i - 1;
        while (j >= 0 && cur[j] > key) {
          // Show comparison and shift
          const shiftMarks = {};
          for (let k = 0; k < i; k++) shiftMarks[k] = k <= j ? { cls: 'good' } : {};
          shiftMarks[j] = { cls: 'compare active', tag: `j=${j}` };

          steps.push({
            arr: [...cur], phase: `Pass ${passNum}: Shift Right`,
            desc: `arr[${j}]=${cur[j]} > key=${key}. Shift arr[${j}] right to arr[${j + 1}].`,
            marks: shiftMarks, vars: { pass: passNum, key, j, 'arr[j]': cur[j], action: 'shift right' }
          });

          cur[j + 1] = cur[j];
          j--;
        }

        cur[j + 1] = key;

        // Show insertion
        const insertMarks = {};
        for (let k = 0; k <= i; k++) insertMarks[k] = { cls: 'good' };
        insertMarks[j + 1] = { cls: 'good active', tag: '✓ inserted' };

        steps.push({
          arr: [...cur], phase: `Pass ${passNum}: Insert`,
          desc: `Insert key=${key} at position ${j + 1}. Sorted portion is now [0..${i}].`,
          marks: insertMarks, vars: { pass: passNum, key, insertedAt: j + 1, sortedSize: i + 1 }
        });
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...cur], phase: 'Sorted!',
        desc: `Insertion Sort complete. Array is fully sorted.`,
        marks: fMarks, vars: { result: `[${cur.join(', ')}]` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_INSERTION_SORT.id;
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
      const raw = $('#ins-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [12, 11, 13, 5, 6];
      buildSteps(a);
      $(`#player-mount-${TOPIC_INSERTION_SORT.id}`).innerHTML = '';
      $(`#desc-${TOPIC_INSERTION_SORT.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_INSERTION_SORT.id}`),
        totalSteps: steps.length,
        onRender: draw,
        speed: 600
      });
    }

    rebuild();
    $('#ins-apply').addEventListener('click', rebuild);
    $('#ins-random').addEventListener('click', () => {
      const len = randomInt(5, 8);
      $('#ins-arr').value = randomArray(len, 5, 95).join(',');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function insertionSort(arr, n):
    for i from 1 to n-1:
        key = arr[i]
        j = i - 1
        while j >= 0 AND arr[j] > key:
            arr[j + 1] = arr[j]     // shift right
            j = j - 1
        arr[j + 1] = key             // insert key`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Insertion Sort — O(n^2) worst, O(n) best (nearly sorted)
// Stable sort, in-place, adaptive
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];  // shift right
            j--;
        }
        arr[j + 1] = key;  // insert at correct position
    }
}`)}

      ${pythonPanel(this.id,
`# Insertion Sort — O(n^2) worst, O(n) best (nearly sorted)
# Stable sort, in-place, adaptive
def insertion_sort(arr):
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]  # shift right
            j -= 1
        arr[j + 1] = key  # insert at correct position
    return arr

# Example usage
arr = [12, 11, 13, 5, 6]
print(insertion_sort(arr))  # [5, 6, 11, 12, 13]`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Insertion Sort', slug: 'insertion-sort', track: 'sorting-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro, Cognizant', hint: 'Pick element, shift larger elements right, insert at correct position.' },
        { lvl: 'medium', title: 'Insertion Sort for Linked List', slug: 'insertion-sort-for-singly-linked-list', isBatch: false, company: 'Amazon, Microsoft', hint: 'Same idea but with node relinking instead of array shifting.' },
        { lvl: 'medium', title: 'Count Inversions', slug: 'count-inversions', isBatch: false, company: 'Amazon, Microsoft, Google', hint: 'Each shift in insertion sort = one inversion. For O(n log n), use merge sort and count during merge.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
