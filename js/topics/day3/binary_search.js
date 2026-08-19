/* ============================================================
   DAY 3 — TOPIC 02: BINARY SEARCH
   Visualizes divide-and-conquer on a sorted array
   ============================================================ */

const TOPIC_BINARY_SEARCH = {
  id: 'binary-search',
  num: '02',
  title: 'Binary Search — Divide & Conquer on Sorted Arrays',
  tag: 'Searching',
  intuition: 'On a sorted array, compare target with the middle element. If equal → found. If target < mid → search left half. If target > mid → search right half. Each step halves the search space → O(log n).',
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
        <label>Sorted Array</label>
        <input type="text" class="arr-input" id="bs-arr" value="2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91">
        <label>Target</label>
        <input type="number" id="bs-target" value="23" style="width:65px;">
        <button class="primary" id="bs-apply">Apply</button>
        <button id="bs-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, target) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'empty', desc: 'Array is empty.', marks: {}, vars: {} });
        return;
      }

      let low = 0, high = n - 1;
      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Sorted array of size ${n}. Set low=0, high=${high}. Target = ${target}.`,
        marks: { 0: { cls: 'active', tag: 'low' }, [high]: { cls: 'active', tag: 'high' } },
        vars: { low: 0, high, target }
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        // Dim out-of-range
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        marks[low] = { cls: 'active', tag: 'low' };
        marks[high] = { cls: 'active', tag: 'high' };
        marks[mid] = { cls: 'compare active', tag: 'mid' };

        if (arr[mid] === target) {
          steps.push({
            arr: [...arr], phase: 'Found!',
            desc: `mid = ⌊(${low}+${high})/2⌋ = ${mid}. arr[${mid}] = ${arr[mid]} == ${target}. Found!`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: '✓ Found' } },
            vars: { low, high, mid, 'arr[mid]': arr[mid], target, result: mid }
          });
          return;
        } else if (arr[mid] < target) {
          steps.push({
            arr: [...arr], phase: 'Go Right',
            desc: `mid = ${mid}. arr[${mid}] = ${arr[mid]} < ${target}. Target is in right half. Set low = mid + 1 = ${mid + 1}.`,
            marks,
            vars: { low, high, mid, 'arr[mid]': arr[mid], target, action: 'low = mid+1' }
          });
          low = mid + 1;
        } else {
          steps.push({
            arr: [...arr], phase: 'Go Left',
            desc: `mid = ${mid}. arr[${mid}] = ${arr[mid]} > ${target}. Target is in left half. Set high = mid - 1 = ${mid - 1}.`,
            marks,
            vars: { low, high, mid, 'arr[mid]': arr[mid], target, action: 'high = mid-1' }
          });
          high = mid - 1;
        }
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
      steps.push({
        arr: [...arr], phase: 'Not Found',
        desc: `low (${low}) > high (${high}). Search space exhausted. Target ${target} not found. Return -1.`,
        marks: fMarks,
        vars: { result: -1, low, high }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_BINARY_SEARCH.id;
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
      const raw = $('#bs-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw.sort((a, b) => a - b) : [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];
      $('#bs-arr').value = a.join(', ');
      const target = parseInt($('#bs-target').value) || 23;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_BINARY_SEARCH.id}`).innerHTML = '';
      $(`#desc-${TOPIC_BINARY_SEARCH.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_BINARY_SEARCH.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#bs-apply').addEventListener('click', rebuild);
    $('#bs-random').addEventListener('click', () => {
      const len = randomInt(8, 14);
      const arr = randomArray(len, 1, 99).sort((a, b) => a - b);
      $('#bs-arr').value = arr.join(', ');
      $('#bs-target').value = Math.random() < 0.6 ? arr[randomInt(0, len - 1)] : randomInt(1, 99);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function binarySearch(arr, n, target):
    low = 0, high = n - 1
    while low <= high:
        mid = (low + high) / 2
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Iterative Binary Search — O(log n) time, O(1) space
int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

// Recursive Binary Search
int binarySearchRec(vector<int>& arr, int low, int high, int target) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target)
        return binarySearchRec(arr, mid + 1, high, target);
    return binarySearchRec(arr, low, mid - 1, target);
}`)}

      ${pythonPanel(this.id,
`# Iterative Binary Search — O(log n) time, O(1) space
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Recursive Binary Search
def binary_search_rec(arr, low, high, target):
    if low > high:
        return -1
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_rec(arr, mid + 1, high, target)
    else:
        return binary_search_rec(arr, low, mid - 1, target)

# Using bisect module (Pythonic)
from bisect import bisect_left
def binary_search_bisect(arr, target):
    i = bisect_left(arr, target)
    return i if i < len(arr) and arr[i] == target else -1`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Binary Search in a Sorted Array', slug: 'binary-search-1587115620', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google, Samsung', hint: 'Standard binary search: compare mid, go left or right based on comparison.' },
        { lvl: 'easy', title: 'Floor in a Sorted Array', slug: 'floor-in-a-sorted-array-1587115620', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Samsung', hint: 'Binary search variant — track the last index where arr[mid] <= target.' },
        { lvl: 'medium', title: 'Square Root using Binary Search', slug: 'square-root', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Adobe', hint: 'Binary search on answer: search in [1, x] for largest mid where mid*mid <= x.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
