/* ============================================================
   DAY 5 — TOPIC 04: FIRST DUPLICATE ELEMENT
   Use a HashSet to find the first repeating element in one pass.
   ============================================================ */

const TOPIC_FIRST_DUPLICATE = {
  id: 'first-duplicate',
  num: '04',
  title: 'First Duplicate Element — HashSet',
  tag: 'Hashing',
  intuition: 'Scan left to right and add each element to a set. The moment we try to add an element that already exists in the set, that is the first duplicate. One pass, O(n).',
  time: 'O(n)',
  space: 'O(n)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Array</label>
        <input type="text" class="arr-input" id="fd-arr" value="5, 3, 4, 2, 3, 1, 5">
        <button class="primary" id="fd-apply">Apply</button>
        <button id="fd-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'Empty', desc: 'Array is empty.', marks: {}, vars: {}, setItems: [] });
        return;
      }

      steps.push({
        arr: [...arr], phase: 'Start',
        desc: `Array of ${n} elements. Scan left to right with a HashSet.`,
        marks: {}, vars: { n }, setItems: []
      });

      const seen = new Set();

      for (let i = 0; i < n; i++) {
        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'active', tag: `i=${i}` };

        if (seen.has(arr[i])) {
          // Found duplicate — also highlight first occurrence
          for (let j = 0; j < i; j++) {
            if (arr[j] === arr[i]) {
              marks[j] = { cls: 'good active', tag: '1st' };
              break;
            }
          }
          marks[i] = { cls: 'good active', tag: '✓ dup!' };
          steps.push({
            arr: [...arr], phase: 'Duplicate Found!',
            desc: `arr[${i}] = ${arr[i]} is already in the set! First duplicate = ${arr[i]}.`,
            marks,
            vars: { i, [`arr[${i}]`]: arr[i], result: arr[i] },
            setItems: [...seen]
          });
          return;
        }

        seen.add(arr[i]);
        steps.push({
          arr: [...arr], phase: `Check i=${i}`,
          desc: `arr[${i}] = ${arr[i]} not in set → add it. Set = {${[...seen].join(', ')}}.`,
          marks,
          vars: { i, [`arr[${i}]`]: arr[i], action: `add ${arr[i]}` },
          setItems: [...seen]
        });
      }

      // No duplicates
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...arr], phase: 'No Duplicates',
        desc: 'Scanned all elements. No duplicates found.',
        marks: fMarks,
        vars: { result: 'None' },
        setItems: [...seen]
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_FIRST_DUPLICATE.id;
      const setRow = s.setItems.length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">HashSet:</span> ${s.setItems.map(v => `<div class="eq-box" style="min-width:35px;">${v}</div>`).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
        ${setRow}
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#fd-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [5, 3, 4, 2, 3, 1, 5];
      $('#fd-arr').value = a.join(', ');
      buildSteps(a);
      $(`#player-mount-${TOPIC_FIRST_DUPLICATE.id}`).innerHTML = '';
      $(`#desc-${TOPIC_FIRST_DUPLICATE.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_FIRST_DUPLICATE.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#fd-apply').addEventListener('click', rebuild);
    $('#fd-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      // Generate array with at least one duplicate
      const pool = randomArray(len - 2, 1, 15);
      const dupVal = pool[randomInt(0, pool.length - 1)];
      const insertAt = randomInt(pool.length > 1 ? 2 : 1, len - 1);
      pool.splice(insertAt, 0, dupVal);
      // Possibly add more unique values
      while (pool.length < len) pool.push(randomInt(1, 20));
      $('#fd-arr').value = pool.slice(0, len).join(', ');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function firstDuplicate(arr):
    seen = empty set
    for i from 0 to n-1:
        if arr[i] in seen:
            return arr[i]    // first duplicate
        seen.add(arr[i])
    return -1    // no duplicates`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_set>
using namespace std;

// First Duplicate — O(n) time, O(n) space
int firstDuplicate(vector<int>& arr) {
    unordered_set<int> seen;
    for (int x : arr) {
        if (seen.count(x))
            return x;  // first duplicate
        seen.insert(x);
    }
    return -1;  // no duplicates
}`)}

      ${pythonPanel(this.id,
`# First Duplicate — O(n) time, O(n) space
def first_duplicate(arr):
    seen = set()
    for x in arr:
        if x in seen:
            return x  # first duplicate
        seen.add(x)
    return -1  # no duplicates`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'First Repeating Element', slug: 'first-repeating-element4018', isBatch: false, company: 'Amazon, Microsoft, Samsung', statement: 'Given an array arr[] of size n, find the first repeating element. The element should occur more than once and the index of its first occurrence should be the smallest.', hint: 'Traverse right to left with a set. If element is in set, update answer. Final answer is the leftmost repeater.' },
        { lvl: 'easy', title: 'Contains Duplicate', slug: 'contains-duplicate', isBatch: false, company: 'Amazon, Google', statement: 'Given an integer array arr[], return true if any value appears at least twice in the array, and return false if every element is distinct.', hint: 'Insert into a set. If size differs from array length, there is a duplicate.' },
        { lvl: 'medium', title: 'Find Duplicates in Array', slug: 'find-duplicates-in-an-array4839', isBatch: false, company: 'Amazon, Microsoft', statement: 'Given an array arr[] of size n where elements are in the range [0, n-1], find all elements that appear more than once.', hint: 'Use index marking: negate arr[arr[i] % n]. If already negative, it is a duplicate.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
