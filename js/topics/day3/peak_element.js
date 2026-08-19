/* ============================================================
   DAY 3 — TOPIC 03: PEAK ELEMENT
   Visualizes finding a peak element using binary search
   ============================================================ */

const TOPIC_PEAK_ELEMENT = {
  id: 'peak-element',
  num: '03',
  title: 'Peak Element — Binary Search on Unsorted Array',
  tag: 'Searching',
  intuition: 'A peak element is greater than or equal to its neighbors. Using binary search: if arr[mid] < arr[mid+1], the peak is in the right half (ascending slope). Otherwise, the peak is in the left half (including mid). This guarantees O(log n).',
  time: 'O(log n)',
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
        <input type="text" class="arr-input" id="pe-arr" value="1, 3, 20, 4, 1, 0">
        <button class="primary" id="pe-apply">Apply</button>
        <button id="pe-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'empty', desc: 'Array is empty.', marks: {}, vars: {} });
        return;
      }
      if (n === 1) {
        steps.push({ arr: [...arr], phase: 'Single Element', desc: `Only one element: ${arr[0]} is the peak.`, marks: { 0: { cls: 'good active', tag: '✓ Peak' } }, vars: { peakIndex: 0, peakValue: arr[0] } });
        return;
      }

      let low = 0, high = n - 1;
      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Array of size ${n}. Set low=0, high=${high}. Looking for any peak element.`,
        marks: { 0: { cls: 'active', tag: 'low' }, [high]: { cls: 'active', tag: 'high' } },
        vars: { low: 0, high }
      });

      while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        marks[low] = { cls: 'active', tag: 'low' };
        marks[high] = { cls: 'active', tag: 'high' };
        marks[mid] = { cls: 'compare active', tag: 'mid' };
        if (mid + 1 <= high) marks[mid + 1] = { cls: 'compare', tag: 'mid+1' };

        if (arr[mid] < arr[mid + 1]) {
          steps.push({
            arr: [...arr], phase: 'Go Right (Ascending)',
            desc: `mid=${mid}. arr[${mid}]=${arr[mid]} < arr[${mid + 1}]=${arr[mid + 1]}. Peak is on right side. Set low = mid + 1 = ${mid + 1}.`,
            marks,
            vars: { low, high, mid, 'arr[mid]': arr[mid], 'arr[mid+1]': arr[mid + 1], action: 'low = mid+1' }
          });
          low = mid + 1;
        } else {
          steps.push({
            arr: [...arr], phase: 'Go Left (Descending)',
            desc: `mid=${mid}. arr[${mid}]=${arr[mid]} >= arr[${mid + 1}]=${arr[mid + 1]}. Peak is on left side (or at mid). Set high = mid = ${mid}.`,
            marks,
            vars: { low, high, mid, 'arr[mid]': arr[mid], 'arr[mid+1]': arr[mid + 1], action: 'high = mid' }
          });
          high = mid;
        }
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = {};
      fMarks[low] = { cls: 'good active', tag: '✓ Peak' };
      steps.push({
        arr: [...arr], phase: 'Peak Found',
        desc: `low == high == ${low}. Peak element is arr[${low}] = ${arr[low]}.`,
        marks: fMarks,
        vars: { peakIndex: low, peakValue: arr[low] }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_PEAK_ELEMENT.id;
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
      const raw = $('#pe-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 3, 20, 4, 1, 0];
      buildSteps(a);
      $(`#player-mount-${TOPIC_PEAK_ELEMENT.id}`).innerHTML = '';
      $(`#desc-${TOPIC_PEAK_ELEMENT.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_PEAK_ELEMENT.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#pe-apply').addEventListener('click', rebuild);
    $('#pe-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      $('#pe-arr').value = randomArray(len, 1, 99).join(',');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function peakElement(arr, n):
    low = 0, high = n - 1
    while low < high:
        mid = (low + high) / 2
        if arr[mid] < arr[mid + 1]:
            low = mid + 1      // peak on right
        else:
            high = mid          // peak on left or at mid
    return low  // low == high == peak index`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Peak Element — O(log n) Binary Search
int peakElement(vector<int>& arr) {
    int low = 0, high = (int)arr.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < arr[mid + 1])
            low = mid + 1;   // ascending slope → peak is right
        else
            high = mid;       // descending slope → peak is left or mid
    }
    return low;  // low == high == peak index
}

// Edge-case safe version
int peakElementSafe(vector<int>& arr) {
    int n = arr.size();
    if (n == 1) return 0;
    if (arr[0] > arr[1]) return 0;
    if (arr[n-1] > arr[n-2]) return n - 1;
    int low = 1, high = n - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] > arr[mid-1] && arr[mid] > arr[mid+1])
            return mid;
        if (arr[mid] < arr[mid+1])
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}`)}

      ${pythonPanel(this.id,
`# Peak Element — O(log n) Binary Search
def peak_element(arr):
    low, high = 0, len(arr) - 1
    while low < high:
        mid = (low + high) // 2
        if arr[mid] < arr[mid + 1]:
            low = mid + 1    # ascending → peak is right
        else:
            high = mid        # descending → peak is left or mid
    return low  # low == high == peak index

# Edge-case safe version
def peak_element_safe(arr):
    n = len(arr)
    if n == 1:
        return 0
    if arr[0] > arr[1]:
        return 0
    if arr[n - 1] > arr[n - 2]:
        return n - 1
    low, high = 1, n - 2
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] > arr[mid - 1] and arr[mid] > arr[mid + 1]:
            return mid
        if arr[mid] < arr[mid + 1]:
            low = mid + 1
        else:
            high = mid - 1
    return -1`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Peak Element', slug: 'peak-element', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google, Adobe', hint: 'Binary search: if arr[mid] < arr[mid+1], go right; else go left. O(log n).' },
        { lvl: 'hard', title: 'Find Peak Element II (2D Matrix)', slug: 'find-peak-element-ii', isBatch: false, company: 'Google, Facebook', hint: 'Apply binary search on columns, find max in mid column, then decide left/right half.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
