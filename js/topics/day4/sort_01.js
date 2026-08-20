/* ============================================================
   DAY 4 — TOPIC 06: SORT 0s AND 1s (SEGREGATE)
   Two-pointer / Dutch National Flag variant for binary arrays.
   ============================================================ */

const TOPIC_SORT_01 = {
  id: 'sort-01',
  num: '06',
  title: 'Sort 0s and 1s — Two Pointer Partition',
  tag: 'Two Pointers',
  intuition: 'Use two pointers: left scans for 1s from the start, right scans for 0s from the end. When left finds a 1 and right finds a 0, swap them. Continue until they cross.',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Array (0s and 1s)</label>
        <input type="text" class="arr-input" id="s01-arr" value="0, 1, 0, 1, 1, 0, 0, 1, 0, 1">
        <button class="primary" id="s01-apply">Apply</button>
        <button id="s01-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(origArr) {
      steps = [];
      const arr = [...origArr];
      const n = arr.length;
      if (n <= 1) {
        steps.push({ arr: [...arr], phase: 'Done', desc: 'Array has 0 or 1 element — already sorted.', marks: {}, vars: {} });
        return;
      }

      let left = 0, right = n - 1;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Set left=0, right=${right}. Move left past 0s, right past 1s, swap when misplaced.`,
        marks: { 0: { cls: 'active', tag: 'L' }, [right]: { cls: 'active', tag: 'R' } },
        vars: { left: 0, right }
      });

      while (left < right) {
        // Advance left past 0s
        while (left < right && arr[left] === 0) left++;
        // Advance right past 1s
        while (left < right && arr[right] === 1) right--;

        if (left < right) {
          // left points to 1, right points to 0 → swap
          const marks = {};
          for (let i = 0; i < n; i++) {
            if (i < left) marks[i] = { cls: 'good' };          // sorted 0s
            else if (i > right) marks[i] = { cls: 'good' };    // sorted 1s
          }
          marks[left] = { cls: 'compare active', tag: `L (${arr[left]})` };
          marks[right] = { cls: 'compare active', tag: `R (${arr[right]})` };

          steps.push({
            arr: [...arr], phase: 'Swap',
            desc: `left=${left} has ${arr[left]}, right=${right} has ${arr[right]}. Swap them!`,
            marks,
            vars: { left, right, 'arr[L]': arr[left], 'arr[R]': arr[right], action: 'SWAP' }
          });

          // Do the swap
          [arr[left], arr[right]] = [arr[right], arr[left]];
          left++;
          right--;

          // Show after swap
          const marks2 = {};
          for (let i = 0; i < n; i++) {
            if (i < left) marks2[i] = { cls: 'good' };
            else if (i > right) marks2[i] = { cls: 'good' };
          }
          if (left <= right) {
            marks2[left] = { cls: 'active', tag: 'L' };
            marks2[right] = { cls: 'active', tag: 'R' };
          }

          steps.push({
            arr: [...arr], phase: 'After Swap',
            desc: `Swapped. Now left=${left}, right=${right}. Continue scanning.`,
            marks: marks2,
            vars: { left, right }
          });
        }
      }

      // Final
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...arr], phase: 'Sorted!',
        desc: `All 0s are on the left, all 1s on the right. Done in O(n)!`,
        marks: fMarks,
        vars: { result: arr.join(', ') }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SORT_01.id;
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
      const raw = $('#s01-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => x === 0 || x === 1);
      const a = raw.length ? raw : [0, 1, 0, 1, 1, 0, 0, 1, 0, 1];
      $('#s01-arr').value = a.join(', ');
      buildSteps(a);
      $(`#player-mount-${TOPIC_SORT_01.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SORT_01.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SORT_01.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#s01-apply').addEventListener('click', rebuild);
    $('#s01-random').addEventListener('click', () => {
      const len = randomInt(8, 14);
      const arr = Array.from({ length: len }, () => Math.random() < 0.5 ? 0 : 1);
      $('#s01-arr').value = arr.join(', ');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function sort01(arr):
    left = 0, right = n - 1
    while left < right:
        while left < right and arr[left] == 0:
            left++
        while left < right and arr[right] == 1:
            right--
        if left < right:
            swap(arr[left], arr[right])
            left++, right--

// Alternative: count 0s, fill 0s then 1s
// But two-pointer is in-place and single-pass`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// Two-Pointer Partition — O(n) time, O(1) space
void sort01(vector<int>& arr) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        while (left < right && arr[left] == 0) left++;
        while (left < right && arr[right] == 1) right--;
        if (left < right)
            swap(arr[left++], arr[right--]);
    }
}

// Dutch National Flag for 0s, 1s, 2s
void sort012(vector<int>& arr) {
    int lo = 0, mid = 0, hi = (int)arr.size() - 1;
    while (mid <= hi) {
        if (arr[mid] == 0) swap(arr[lo++], arr[mid++]);
        else if (arr[mid] == 1) mid++;
        else swap(arr[mid], arr[hi--]);
    }
}`)}

      ${pythonPanel(this.id,
`# Two-Pointer Partition — O(n) time, O(1) space
def sort_01(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        while left < right and arr[left] == 0:
            left += 1
        while left < right and arr[right] == 1:
            right -= 1
        if left < right:
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            right -= 1

# Dutch National Flag for 0s, 1s, 2s
def sort_012(arr):
    lo, mid, hi = 0, 0, len(arr) - 1
    while mid <= hi:
        if arr[mid] == 0:
            arr[lo], arr[mid] = arr[mid], arr[lo]
            lo += 1; mid += 1
        elif arr[mid] == 1:
            mid += 1
        else:
            arr[mid], arr[hi] = arr[hi], arr[mid]
            hi -= 1`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Sort an Array of 0s, 1s, and 2s (Dutch National Flag)', slug: 'sort-an-array-of-0s-1s-and-2s4231', track: 'sorting-siddhartha', isBatch: true, company: 'Amazon, Microsoft, SAP Labs', statement: 'Given an array arr[] containing only 0s, 1s, and 2s, sort the array in-place in a single traversal without using any extra space. (Dutch National Flag problem)', hint: 'Three pointers: lo, mid, hi. Move 0s to front, 2s to back, 1s stay in middle.' },
        { lvl: 'easy', title: 'Union of Two Sorted Arrays', slug: 'union-of-two-sorted-arrays-1587115621', track: 'sorting-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given two sorted arrays a[] and b[], return their union. The union of two arrays is an array having all distinct elements that are present in either array. The result should be sorted.', hint: 'Two pointers on both sorted arrays — merge-style traversal.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
