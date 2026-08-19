/* ============================================================
   DAY 3 — TOPIC 04: COUNT OCCURRENCES
   Uses first & last occurrence to count in O(log n)
   ============================================================ */

const TOPIC_COUNT_OCCURRENCE = {
  id: 'count-occ',
  num: '04',
  title: 'Count Occurrences — Using First & Last Occurrence',
  tag: 'Searching',
  intuition: 'In a sorted array, all occurrences of a value are contiguous. Find the first occurrence (lower bound) and last occurrence (upper bound) using binary search. Count = last - first + 1. If not found, count = 0.',
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
        <input type="text" class="arr-input" id="co-arr" value="1, 1, 2, 2, 2, 2, 3, 5, 5">
        <label>Target</label>
        <input type="number" id="co-target" value="2" style="width:65px;">
        <button class="primary" id="co-apply">Apply</button>
        <button id="co-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function findFirst(arr, target) {
      let low = 0, high = arr.length - 1, result = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) { result = mid; high = mid - 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
      return result;
    }

    function findLast(arr, target) {
      let low = 0, high = arr.length - 1, result = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) { result = mid; low = mid + 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
      return result;
    }

    function buildSteps(arr, target) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'empty', desc: 'Array is empty.', marks: {}, vars: {} });
        return;
      }

      steps.push({
        arr: [...arr], phase: 'Start',
        desc: `Sorted array of size ${n}. Finding count of ${target}. Strategy: find first & last occurrence using binary search.`,
        marks: {}, vars: { target, n }
      });

      // Step through first occurrence search
      let low = 0, high = n - 1, first = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        marks[mid] = { cls: 'compare active', tag: 'mid' };

        if (arr[mid] === target) {
          first = mid;
          steps.push({
            arr: [...arr], phase: 'First: Match → Go Left',
            desc: `Finding FIRST: mid=${mid}, arr[${mid}]=${arr[mid]} == ${target}. Record first=${mid}, search left (high=mid-1=${mid - 1}).`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: 'match' } },
            vars: { low, high, mid, first, searchingFor: 'First Occurrence' }
          });
          high = mid - 1;
        } else if (arr[mid] < target) {
          steps.push({
            arr: [...arr], phase: 'First: Go Right',
            desc: `Finding FIRST: mid=${mid}, arr[${mid}]=${arr[mid]} < ${target}. Go right (low=mid+1=${mid + 1}).`,
            marks, vars: { low, high, mid, first, searchingFor: 'First Occurrence' }
          });
          low = mid + 1;
        } else {
          steps.push({
            arr: [...arr], phase: 'First: Go Left',
            desc: `Finding FIRST: mid=${mid}, arr[${mid}]=${arr[mid]} > ${target}. Go left (high=mid-1=${mid - 1}).`,
            marks, vars: { low, high, mid, first, searchingFor: 'First Occurrence' }
          });
          high = mid - 1;
        }
      }

      if (first === -1) {
        const fMarks = {};
        for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
        steps.push({
          arr: [...arr], phase: 'Not Found',
          desc: `Target ${target} not found in array. Count = 0.`,
          marks: fMarks, vars: { first: -1, count: 0 }
        });
        return;
      }

      // Step through last occurrence search
      low = 0; high = n - 1; let last = -1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        marks[mid] = { cls: 'compare active', tag: 'mid' };

        if (arr[mid] === target) {
          last = mid;
          steps.push({
            arr: [...arr], phase: 'Last: Match → Go Right',
            desc: `Finding LAST: mid=${mid}, arr[${mid}]=${arr[mid]} == ${target}. Record last=${mid}, search right (low=mid+1=${mid + 1}).`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: 'match' } },
            vars: { low, high, mid, last, searchingFor: 'Last Occurrence' }
          });
          low = mid + 1;
        } else if (arr[mid] < target) {
          steps.push({
            arr: [...arr], phase: 'Last: Go Right',
            desc: `Finding LAST: mid=${mid}, arr[${mid}]=${arr[mid]} < ${target}. Go right.`,
            marks, vars: { low, high, mid, last, searchingFor: 'Last Occurrence' }
          });
          low = mid + 1;
        } else {
          steps.push({
            arr: [...arr], phase: 'Last: Go Left',
            desc: `Finding LAST: mid=${mid}, arr[${mid}]=${arr[mid]} > ${target}. Go left.`,
            marks, vars: { low, high, mid, last, searchingFor: 'Last Occurrence' }
          });
          high = mid - 1;
        }
      }

      const count = last - first + 1;
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        fMarks[i] = (i >= first && i <= last) ? { cls: 'good' } : {};
      }
      fMarks[first] = { cls: 'good active', tag: 'first' };
      fMarks[last] = { cls: 'good active', tag: 'last' };
      steps.push({
        arr: [...arr], phase: 'Complete',
        desc: `First occurrence at index ${first}, last at index ${last}. Count = ${last} - ${first} + 1 = ${count}.`,
        marks: fMarks, vars: { first, last, count }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_COUNT_OCCURRENCE.id;
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
      const raw = $('#co-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw.sort((a, b) => a - b) : [1, 1, 2, 2, 2, 2, 3, 5, 5];
      $('#co-arr').value = a.join(', ');
      const target = parseInt($('#co-target').value) || 2;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_COUNT_OCCURRENCE.id}`).innerHTML = '';
      $(`#desc-${TOPIC_COUNT_OCCURRENCE.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_COUNT_OCCURRENCE.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#co-apply').addEventListener('click', rebuild);
    $('#co-random').addEventListener('click', () => {
      const base = randomArray(randomInt(8, 12), 1, 6).sort((a, b) => a - b);
      $('#co-arr').value = base.join(', ');
      $('#co-target').value = base[randomInt(0, base.length - 1)];
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function countOccurrences(arr, n, target):
    first = findFirst(arr, n, target)
    if first == -1:
        return 0
    last = findLast(arr, n, target)
    return last - first + 1`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Count Occurrences — O(log n) using first + last
int firstOcc(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1, res = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) { res = mid; high = mid - 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return res;
}

int lastOcc(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1, res = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) { res = mid; low = mid + 1; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return res;
}

int countOccurrences(vector<int>& arr, int target) {
    int first = firstOcc(arr, target);
    if (first == -1) return 0;
    return lastOcc(arr, target) - first + 1;
}`)}

      ${pythonPanel(this.id,
`# Count Occurrences — O(log n)
def first_occ(arr, target):
    low, high, res = 0, len(arr) - 1, -1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            res = mid
            high = mid - 1  # keep searching left
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return res

def last_occ(arr, target):
    low, high, res = 0, len(arr) - 1, -1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            res = mid
            low = mid + 1   # keep searching right
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return res

def count_occurrences(arr, target):
    first = first_occ(arr, target)
    if first == -1:
        return 0
    return last_occ(arr, target) - first + 1

# Using bisect (Pythonic)
from bisect import bisect_left, bisect_right
def count_occurrences_bisect(arr, target):
    return bisect_right(arr, target) - bisect_left(arr, target)`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Number of Occurrence', slug: 'number-of-occurrence2259', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Samsung', hint: 'Find first and last using binary search. Count = last - first + 1.' },
        { lvl: 'easy', title: 'Count 1s in a Sorted Binary Array', slug: 'count-1s-in-a-sorted-binary-array', isBatch: false, company: 'Amazon, Samsung', hint: 'Binary search for first occurrence of 1. Count = n - firstIndex.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
