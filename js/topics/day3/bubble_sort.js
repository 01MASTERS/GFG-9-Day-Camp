/* ============================================================
   DAY 3 — TOPIC 08: BUBBLE SORT
   Visualizes adjacent-swap sorting with optimization
   ============================================================ */

const TOPIC_BUBBLE_SORT = {
  id: 'bubble-sort',
  num: '08',
  title: 'Bubble Sort — Adjacent Swaps',
  tag: 'Sorting',
  intuition: 'Repeatedly traverse the array, comparing adjacent elements and swapping if they are in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position. Optimized: if no swaps occur in a pass, the array is already sorted — stop early.',
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
        <input type="text" class="arr-input" id="bub-arr" value="64, 34, 25, 12, 22, 11, 90">
        <button class="primary" id="bub-apply">Apply</button>
        <button id="bub-random">🎲 Random</button>
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
        desc: `Array of ${n} elements. Bubble Sort will make up to ${n - 1} passes.`,
        marks: {}, vars: { n, totalPasses: n - 1 }
      });

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        const passNum = i + 1;

        for (let j = 0; j < n - 1 - i; j++) {
          const marks = {};
          // Already sorted (right side)
          for (let k = n - i; k < n; k++) marks[k] = { cls: 'good' };
          marks[j] = { cls: 'compare active', tag: 'j' };
          marks[j + 1] = { cls: 'compare active', tag: 'j+1' };

          if (cur[j] > cur[j + 1]) {
            steps.push({
              arr: [...cur], phase: `Pass ${passNum}: Swap`,
              desc: `Pass ${passNum}: arr[${j}]=${cur[j]} > arr[${j + 1}]=${cur[j + 1]}. Swap!`,
              marks, vars: { pass: passNum, j, 'arr[j]': cur[j], 'arr[j+1]': cur[j + 1], action: 'SWAP' }
            });
            const temp = cur[j];
            cur[j] = cur[j + 1];
            cur[j + 1] = temp;
            swapped = true;
          } else {
            steps.push({
              arr: [...cur], phase: `Pass ${passNum}: No Swap`,
              desc: `Pass ${passNum}: arr[${j}]=${cur[j]} ≤ arr[${j + 1}]=${cur[j + 1]}. No swap needed.`,
              marks, vars: { pass: passNum, j, 'arr[j]': cur[j], 'arr[j+1]': cur[j + 1], action: 'OK' }
            });
          }
        }

        // After pass: mark sorted element
        const afterMarks = {};
        for (let k = n - 1 - i; k < n; k++) afterMarks[k] = { cls: 'good' };
        afterMarks[n - 1 - i] = { cls: 'good active', tag: '✓' };

        steps.push({
          arr: [...cur], phase: `Pass ${passNum} Done`,
          desc: `Pass ${passNum} complete. Element ${cur[n - 1 - i]} is now in its final position at index ${n - 1 - i}.${!swapped ? ' No swaps occurred — array is sorted!' : ''}`,
          marks: afterMarks, vars: { pass: passNum, swapped, sortedSoFar: i + 1 }
        });

        if (!swapped) break;
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...cur], phase: 'Sorted!',
        desc: `Bubble Sort complete. Array is fully sorted.`,
        marks: fMarks, vars: { result: `[${cur.join(', ')}]` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_BUBBLE_SORT.id;
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
      const raw = $('#bub-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [64, 34, 25, 12, 22, 11, 90];
      buildSteps(a);
      $(`#player-mount-${TOPIC_BUBBLE_SORT.id}`).innerHTML = '';
      $(`#desc-${TOPIC_BUBBLE_SORT.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_BUBBLE_SORT.id}`),
        totalSteps: steps.length,
        onRender: draw,
        speed: 600
      });
    }

    rebuild();
    $('#bub-apply').addEventListener('click', rebuild);
    $('#bub-random').addEventListener('click', () => {
      const len = randomInt(6, 9);
      $('#bub-arr').value = randomArray(len, 5, 95).join(',');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function bubbleSort(arr, n):
    for i from 0 to n-2:
        swapped = false
        for j from 0 to n-2-i:
            if arr[j] > arr[j+1]:
                swap(arr[j], arr[j+1])
                swapped = true
        if not swapped:
            break   // early exit — array is sorted`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Bubble Sort — O(n^2) worst/avg, O(n) best (optimized)
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // O(n) best case
    }
}`)}

      ${pythonPanel(this.id,
`# Bubble Sort — O(n^2) worst/avg, O(n) best (optimized)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # O(n) best case — already sorted
    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(arr))  # [11, 12, 22, 25, 34, 64, 90]`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Bubble Sort', slug: 'bubble-sort', track: 'sorting-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro, Cognizant', hint: 'Adjacent compare and swap. After each pass, largest element bubbles to end.' },
        { lvl: 'medium', title: 'Minimum Swaps to Sort', slug: 'minimum-swaps', isBatch: false, company: 'Amazon, Microsoft', hint: 'Build a graph of cycles from current positions to sorted positions. Swaps = n - cycles.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
