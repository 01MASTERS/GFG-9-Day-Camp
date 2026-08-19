/* ============================================================
   DAY 3 — TOPIC 07: SEARCH IN ROTATED SORTED ARRAY
   Modified binary search on a rotated sorted array
   ============================================================ */

const TOPIC_ROTATED_SEARCH = {
  id: 'rotated-search',
  num: '07',
  title: 'Search in Rotated Sorted Array',
  tag: 'Searching',
  intuition: 'A rotated sorted array has two sorted halves. At each step of binary search, at least one half (left or right of mid) is fully sorted. Check if the target lies in the sorted half; if yes, search there, else search the other half.',
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
        <label>Rotated Array</label>
        <input type="text" class="arr-input" id="rs-arr" value="4, 5, 6, 7, 0, 1, 2">
        <label>Target</label>
        <input type="number" id="rs-target" value="0" style="width:65px;">
        <button class="primary" id="rs-apply">Apply</button>
        <button id="rs-random">🎲 Random</button>
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
        desc: `Rotated sorted array of size ${n}. Target = ${target}. low=0, high=${high}.`,
        marks: { 0: { cls: 'active', tag: 'low' }, [high]: { cls: 'active', tag: 'high' } },
        vars: { low, high, target }
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i < low || i > high) marks[i] = { cls: 'bad' };
        }
        marks[low] = { cls: 'active', tag: 'low' };
        marks[high] = { cls: 'active', tag: 'high' };
        marks[mid] = { cls: 'compare active', tag: 'mid' };

        if (arr[mid] === target) {
          steps.push({
            arr: [...arr], phase: 'Found!',
            desc: `arr[${mid}] = ${arr[mid]} == ${target}. Found at index ${mid}!`,
            marks: { ...marks, [mid]: { cls: 'good active', tag: '✓ Found' } },
            vars: { low, high, mid, result: mid }
          });
          return;
        }

        // Left half is sorted
        if (arr[low] <= arr[mid]) {
          if (target >= arr[low] && target < arr[mid]) {
            steps.push({
              arr: [...arr], phase: 'Left Sorted → Go Left',
              desc: `Left half [${low}..${mid}] is sorted (${arr[low]}..${arr[mid]}). Target ${target} is in range [${arr[low]}, ${arr[mid]}). Go left.`,
              marks, vars: { low, high, mid, sortedHalf: 'LEFT', 'arr[low]': arr[low], 'arr[mid]': arr[mid] }
            });
            high = mid - 1;
          } else {
            steps.push({
              arr: [...arr], phase: 'Left Sorted → Go Right',
              desc: `Left half [${low}..${mid}] is sorted (${arr[low]}..${arr[mid]}). Target ${target} NOT in that range. Go right.`,
              marks, vars: { low, high, mid, sortedHalf: 'LEFT', 'arr[low]': arr[low], 'arr[mid]': arr[mid] }
            });
            low = mid + 1;
          }
        } else {
          // Right half is sorted
          if (target > arr[mid] && target <= arr[high]) {
            steps.push({
              arr: [...arr], phase: 'Right Sorted → Go Right',
              desc: `Right half [${mid}..${high}] is sorted (${arr[mid]}..${arr[high]}). Target ${target} is in range (${arr[mid]}, ${arr[high]}]. Go right.`,
              marks, vars: { low, high, mid, sortedHalf: 'RIGHT', 'arr[mid]': arr[mid], 'arr[high]': arr[high] }
            });
            low = mid + 1;
          } else {
            steps.push({
              arr: [...arr], phase: 'Right Sorted → Go Left',
              desc: `Right half [${mid}..${high}] is sorted (${arr[mid]}..${arr[high]}). Target ${target} NOT in that range. Go left.`,
              marks, vars: { low, high, mid, sortedHalf: 'RIGHT', 'arr[mid]': arr[mid], 'arr[high]': arr[high] }
            });
            high = mid - 1;
          }
        }
      }

      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'bad' };
      steps.push({
        arr: [...arr], phase: 'Not Found',
        desc: `Search space exhausted. Target ${target} not found. Return -1.`,
        marks: fMarks, vars: { result: -1 }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_ROTATED_SEARCH.id;
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
      const raw = $('#rs-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [4, 5, 6, 7, 0, 1, 2];
      const target = parseInt($('#rs-target').value) || 0;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_ROTATED_SEARCH.id}`).innerHTML = '';
      $(`#desc-${TOPIC_ROTATED_SEARCH.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_ROTATED_SEARCH.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#rs-apply').addEventListener('click', rebuild);
    $('#rs-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      const sorted = randomArray(len, 1, 99).sort((a, b) => a - b);
      // Remove duplicates
      const unique = [...new Set(sorted)];
      const rot = randomInt(1, unique.length - 1);
      const rotated = [...unique.slice(rot), ...unique.slice(0, rot)];
      $('#rs-arr').value = rotated.join(', ');
      $('#rs-target').value = Math.random() < 0.6 ? rotated[randomInt(0, rotated.length - 1)] : randomInt(1, 99);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function searchRotated(arr, n, target):
    low = 0, high = n - 1
    while low <= high:
        mid = (low + high) / 2
        if arr[mid] == target:
            return mid
        // Left half is sorted
        if arr[low] <= arr[mid]:
            if target >= arr[low] AND target < arr[mid]:
                high = mid - 1      // target in left sorted half
            else:
                low = mid + 1       // target in right half
        // Right half is sorted
        else:
            if target > arr[mid] AND target <= arr[high]:
                low = mid + 1       // target in right sorted half
            else:
                high = mid - 1      // target in left half
    return -1`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Search in Rotated Sorted Array — O(log n)
int searchRotated(vector<int>& arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target)
            return mid;

        // Left half is sorted
        if (arr[low] <= arr[mid]) {
            if (target >= arr[low] && target < arr[mid])
                high = mid - 1;
            else
                low = mid + 1;
        }
        // Right half is sorted
        else {
            if (target > arr[mid] && target <= arr[high])
                low = mid + 1;
            else
                high = mid - 1;
        }
    }
    return -1;
}`)}

      ${pythonPanel(this.id,
`# Search in Rotated Sorted Array — O(log n)
def search_rotated(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid

        # Left half is sorted
        if arr[low] <= arr[mid]:
            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1

# Find the rotation pivot first, then binary search
def find_pivot(arr):
    low, high = 0, len(arr) - 1
    while low < high:
        mid = (low + high) // 2
        if arr[mid] > arr[high]:
            low = mid + 1
        else:
            high = mid
    return low  # index of minimum element`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Search in a Rotated Array', slug: 'search-in-a-rotated-array4618', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google, Samsung, Adobe', hint: 'Identify which half is sorted. Check if target lies in the sorted half; if yes go there, else go to the other.' },
        { lvl: 'medium', title: 'Rotation Count', slug: 'rotation4723', track: 'searching-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Number of rotations = index of minimum element. Use binary search to find it.' },
        { lvl: 'medium', title: 'Search in Rotated Sorted Array II (with duplicates)', slug: 'search-in-rotated-array-2', isBatch: false, company: 'Amazon, LinkedIn', hint: 'Same approach but handle arr[low]==arr[mid]==arr[high] by doing low++, high--.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
