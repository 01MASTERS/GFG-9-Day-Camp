/* ============================================================
   DAY 3 — TOPIC 01: LINEAR SEARCH
   Visualizes sequential scan through an array
   ============================================================ */

const TOPIC_LINEAR_SEARCH = {
  id: 'linear-search',
  num: '01',
  title: 'Linear Search — Sequential Scan',
  tag: 'Searching',
  intuition: 'Start from the first element and compare each element with the target one by one. If found, return the index. If the end is reached without finding, return -1. Simple but O(n).',
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
        <label>Array</label>
        <input type="text" class="arr-input" id="ls-arr" value="10, 25, 33, 47, 55, 62, 78, 90">
        <label>Target</label>
        <input type="number" id="ls-target" value="55" style="width:65px;">
        <button class="primary" id="ls-apply">Apply</button>
        <button id="ls-random">🎲 Random</button>
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

      steps.push({
        arr: [...arr], phase: 'Start',
        desc: `Searching for target = ${target} in array of size ${n}. Will scan left to right.`,
        marks: {}, vars: { target, n }
      });

      for (let i = 0; i < n; i++) {
        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'compare active', tag: `i=${i}` };

        if (arr[i] === target) {
          steps.push({
            arr: [...arr], phase: 'Found!',
            desc: `arr[${i}] = ${arr[i]} == ${target}. Target found at index ${i}!`,
            marks: { ...marks, [i]: { cls: 'good active', tag: '✓ Found' } },
            vars: { i, 'arr[i]': arr[i], target, result: i }
          });
          // final
          const fMarks = {};
          for (let j = 0; j < n; j++) fMarks[j] = j === i ? { cls: 'good active', tag: '✓' } : {};
          steps.push({
            arr: [...arr], phase: 'Complete',
            desc: `Linear Search complete. Target ${target} found at index ${i}. Checked ${i + 1} element(s).`,
            marks: fMarks,
            vars: { result: i, comparisons: i + 1 }
          });
          return;
        }

        steps.push({
          arr: [...arr], phase: 'Compare',
          desc: `arr[${i}] = ${arr[i]} ≠ ${target}. Move to next element.`,
          marks, vars: { i, 'arr[i]': arr[i], target, status: 'Not matched' }
        });
      }

      const fMarks = {};
      for (let j = 0; j < n; j++) fMarks[j] = { cls: 'bad' };
      steps.push({
        arr: [...arr], phase: 'Not Found',
        desc: `Scanned all ${n} elements. Target ${target} not present in the array. Return -1.`,
        marks: fMarks,
        vars: { result: -1, comparisons: n }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_LINEAR_SEARCH.id;
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
      const raw = $('#ls-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [10, 25, 33, 47, 55, 62, 78, 90];
      const target = parseInt($('#ls-target').value) || 55;
      buildSteps(a, target);
      $(`#player-mount-${TOPIC_LINEAR_SEARCH.id}`).innerHTML = '';
      $(`#desc-${TOPIC_LINEAR_SEARCH.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_LINEAR_SEARCH.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ls-apply').addEventListener('click', rebuild);
    $('#ls-random').addEventListener('click', () => {
      const len = randomInt(6, 10);
      const arr = randomArray(len, 1, 99);
      $('#ls-arr').value = arr.join(',');
      // 50% chance target is in array
      $('#ls-target').value = Math.random() < 0.5 ? arr[randomInt(0, len - 1)] : randomInt(1, 99);
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function linearSearch(arr, n, target):
    for i from 0 to n-1:
        if arr[i] == target:
            return i
    return -1`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// Linear Search — O(n) time, O(1) space
int linearSearch(vector<int>& arr, int target) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`)}

      ${pythonPanel(this.id,
`# Linear Search — O(n) time, O(1) space
def linear_search(arr, target):
    n = len(arr)
    for i in range(n):
        if arr[i] == target:
            return i
    return -1

# Using Python built-in (Pythonic way)
def linear_search_pythonic(arr, target):
    try:
        return arr.index(target)
    except ValueError:
        return -1`)}

      ${practicePanel(this.id, [
        { lvl: 'basic', title: 'Searching an Element in an Array', slug: 'search-an-element-in-an-array-1587115621', track: 'searching-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Simple linear scan — iterate and compare each element with target.' },
        { lvl: 'easy', title: 'Search in Linked List', slug: 'search-in-linked-list-1664434326', isBatch: false, company: 'Amazon, Samsung', hint: 'Traverse the linked list node by node, same idea as linear search on arrays.' },
        { lvl: 'easy', title: 'Who has the Majority?', slug: 'who-has-the-majority', isBatch: false, company: 'Paytm, Flipkart', hint: 'Linear scan + counting to find if any element appears more than n/2 times.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
