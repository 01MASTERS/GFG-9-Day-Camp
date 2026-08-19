/* ============================================================
   DAY 3 — TOPIC 06: LAST OCCURRENCE
   Upper-bound binary search
   ============================================================ */

const TOPIC_LAST_OCCURRENCE = {
  id: 'last-occ',
  num: '06',
  title: 'Last Occurrence — Upper Bound Binary Search',
  tag: 'Searching',
  intuition: 'When arr[mid] == target, record the answer but continue searching RIGHT (low = mid + 1) to find a later occurrence. This mirrors first occurrence but searches in the opposite direction after a match.',
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
        <input type="text" class="arr-input" id="lo-arr" value="2, 4, 10, 10, 10, 18, 20">
        <label>Target</label>
        <input type="number" id="lo-target" value="10" style="width:65px;">
        <button class="primary" id="lo-apply">Apply</button>
        <button id="lo-random">🎲 Random</button>
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
        desc: `Sorted array of size ${n}. Finding LAST occurrence of ${target}. Set low=0, high=${high}, result=-1.`,
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
            arr: [...arr], phase: 'Match → Search Right',
            desc: `mid=${mid}, arr[${mid}]=${arr[mid]} == ${target}. Record result=${mid}. Continue right (low=${mid + 1}) to find later occurrence.`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: 'match' } },
            vars: { low: mid + 1, high, mid, result, action: 'low = mid+1' }
          });
          low = mid + 1;
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
        fMarks[result] = { cls: 'good active', tag: '✓ Last' };
        steps.push({
          arr: [...arr], phase: 'Complete',
          desc: `Last occurrence of ${target} is at index ${result}.`,
          marks: fMarks, vars: { lastOccurrence: result }
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
      const id = TOPIC_LAST_OCCURRENCE.id;
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
      const raw = $('#lo-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw.sort((a, b) => a - b) : [2, 4, 10, 10, 10, 18, 20];
      $('#lo-arr').value = a.join(', ');
      const target = parseInt($('#lo-target').value) || 10;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_LAST_OCCURRENCE.id}`).innerHTML = '';
      $(`#desc-${TOPIC_LAST_OCCURRENCE.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_LAST_OCCURRENCE.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#lo-apply').addEventListener('click', rebuild);
    $('#lo-random').addEventListener('click', () => {
      const base = randomArray(randomInt(8, 12), 1, 8).sort((a, b) => a - b);
      $('#lo-arr').value = base.join(', ');
      $('#lo-target').value = base[randomInt(0, base.length - 1)];
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function lastOccurrence(arr, n, target):
    low = 0, high = n - 1, result = -1
    while low <= high:
        mid = (low + high) / 2
        if arr[mid] == target:
            result = mid         // record answer
            low = mid + 1        // keep looking right
        else if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return result`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Last Occurrence (Upper Bound) — O(log n)
int lastOccurrence(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1, result = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            result = mid;       // record answer
            low = mid + 1;      // keep searching right
        }
        else if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return result;
}

// Using STL upper_bound
#include <algorithm>
int lastOccSTL(vector<int>& arr, int target) {
    auto it = upper_bound(arr.begin(), arr.end(), target);
    if (it != arr.begin() && *(--it) == target)
        return it - arr.begin();
    return -1;
}`)}

      ${pythonPanel(this.id,
`# Last Occurrence (Upper Bound) — O(log n)
def last_occurrence(arr, target):
    low, high, result = 0, len(arr) - 1, -1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            result = mid       # record answer
            low = mid + 1      # keep searching right
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return result

# Using bisect_right (Pythonic)
from bisect import bisect_right
def last_occurrence_bisect(arr, target):
    i = bisect_right(arr, target) - 1
    return i if i >= 0 and arr[i] == target else -1`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'First and Last Occurrences of X', slug: 'first-and-last-occurrences-of-x3116', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, OLA', hint: 'Two binary searches: first goes left on match, last goes right on match.' },
        { lvl: 'easy', title: 'Ceil the Floor', slug: 'ceil-the-floor2802', isBatch: false, company: 'Amazon, Adobe', hint: 'Floor = largest element ≤ target. Ceil = smallest element ≥ target. Both via binary search.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
