/* ============================================================
   DAY 3 — TOPIC 05: FIRST OCCURRENCE
   Lower-bound binary search
   ============================================================ */

const TOPIC_FIRST_OCCURRENCE = {
  id: 'first-occ',
  num: '05',
  title: 'First Occurrence — Lower Bound Binary Search',
  tag: 'Searching',
  intuition: 'Standard binary search stops at any match. To find the FIRST occurrence, when arr[mid] == target, record the answer but continue searching LEFT (high = mid - 1) to find an even earlier match.',
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
        <input type="text" class="arr-input" id="fo-arr" value="2, 4, 10, 10, 10, 18, 20">
        <label>Target</label>
        <input type="number" id="fo-target" value="10" style="width:65px;">
        <button class="primary" id="fo-apply">Apply</button>
        <button id="fo-random">🎲 Random</button>
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

      let low = 0, high = n - 1, result = -1;
      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Sorted array of size ${n}. Finding FIRST occurrence of ${target}. Set low=0, high=${high}, result=-1.`,
        marks: { 0: { cls: 'active', tag: 'low' }, [high]: { cls: 'active', tag: 'high' } },
        vars: { low: 0, high, target, result: -1 }
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        if (result >= 0) marks[result] = { cls: 'good', tag: 'best' };
        marks[mid] = { cls: 'compare active', tag: 'mid' };

        if (arr[mid] === target) {
          result = mid;
          steps.push({
            arr: [...arr], phase: 'Match → Search Left',
            desc: `mid=${mid}, arr[${mid}]=${arr[mid]} == ${target}. Record result=${mid}. Continue left (high=${mid - 1}) to find earlier occurrence.`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: 'match' } },
            vars: { low, high: mid - 1, mid, result, action: 'high = mid-1' }
          });
          high = mid - 1;
        } else if (arr[mid] < target) {
          steps.push({
            arr: [...arr], phase: 'Go Right',
            desc: `mid=${mid}, arr[${mid}]=${arr[mid]} < ${target}. Go right (low=${mid + 1}).`,
            marks, vars: { low: mid + 1, high, mid, result, action: 'low = mid+1' }
          });
          low = mid + 1;
        } else {
          steps.push({
            arr: [...arr], phase: 'Go Left',
            desc: `mid=${mid}, arr[${mid}]=${arr[mid]} > ${target}. Go left (high=${mid - 1}).`,
            marks, vars: { low, high: mid - 1, mid, result, action: 'high = mid-1' }
          });
          high = mid - 1;
        }
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = {};
      if (result >= 0) {
        fMarks[result] = { cls: 'good active', tag: '✓ First' };
        steps.push({
          arr: [...arr], phase: 'Complete',
          desc: `First occurrence of ${target} is at index ${result}.`,
          marks: fMarks, vars: { firstOccurrence: result }
        });
      } else {
        for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
        steps.push({
          arr: [...arr], phase: 'Not Found',
          desc: `Target ${target} not found. Return -1.`,
          marks: fMarks, vars: { result: -1 }
        });
      }
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_FIRST_OCCURRENCE.id;
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
      const raw = $('#fo-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw.sort((a, b) => a - b) : [2, 4, 10, 10, 10, 18, 20];
      $('#fo-arr').value = a.join(', ');
      const target = parseInt($('#fo-target').value) || 10;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_FIRST_OCCURRENCE.id}`).innerHTML = '';
      $(`#desc-${TOPIC_FIRST_OCCURRENCE.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_FIRST_OCCURRENCE.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#fo-apply').addEventListener('click', rebuild);
    $('#fo-random').addEventListener('click', () => {
      const base = randomArray(randomInt(8, 12), 1, 8).sort((a, b) => a - b);
      $('#fo-arr').value = base.join(', ');
      $('#fo-target').value = base[randomInt(0, base.length - 1)];
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function firstOccurrence(arr, n, target):
    low = 0, high = n - 1, result = -1
    while low <= high:
        mid = (low + high) / 2
        if arr[mid] == target:
            result = mid         // record answer
            high = mid - 1       // keep looking left
        else if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return result`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// First Occurrence (Lower Bound) — O(log n)
int firstOccurrence(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1, result = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            result = mid;       // record answer
            high = mid - 1;     // keep searching left
        }
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return result;
}

// Using STL lower_bound
#include <algorithm>
int firstOccSTL(vector<int>& arr, int target) {
    auto it = lower_bound(arr.begin(), arr.end(), target);
    if (it != arr.end() && *it == target)
        return it - arr.begin();
    return -1;
}`)}

      ${pythonPanel(this.id,
`# First Occurrence (Lower Bound) — O(log n)
def first_occurrence(arr, target):
    low, high, result = 0, len(arr) - 1, -1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            result = mid       # record answer
            high = mid - 1     # keep searching left
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return result

# Using bisect_left (Pythonic)
from bisect import bisect_left
def first_occurrence_bisect(arr, target):
    i = bisect_left(arr, target)
    return i if i < len(arr) and arr[i] == target else -1`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'First and Last Occurrences of X', slug: 'first-and-last-occurrences-of-x3116', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, OLA', hint: 'Two binary searches: one that continues left on match (first), one that continues right (last).' },
        { lvl: 'easy', title: 'Floor in a Sorted Array', slug: 'floor-in-a-sorted-array-1587115620', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Samsung', hint: 'Modified binary search — track last index where arr[mid] <= target.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
