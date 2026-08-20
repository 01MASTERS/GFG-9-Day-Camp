/* ============================================================
   DAY 4 — TOPIC 03: COUNT DISTINCT ELEMENTS IN EVERY WINDOW
   Fixed-size sliding window with a frequency map.
   ============================================================ */

const TOPIC_COUNT_DISTINCT_WINDOW = {
  id: 'count-distinct-window',
  num: '03',
  title: 'Count Distinct Elements in Every Window of Size K',
  tag: 'Sliding Window',
  intuition: 'Maintain a frequency map for the current window. When sliding, decrement the leaving element\'s count (remove if 0) and increment the entering element. The map size gives distinct count in O(1).',
  time: 'O(n)',
  space: 'O(k)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Array</label>
        <input type="text" class="arr-input" id="cdw-arr" value="1, 2, 1, 3, 4, 2, 3">
        <label>k</label>
        <input type="number" id="cdw-k" value="4" style="width:55px;" min="1">
        <button class="primary" id="cdw-apply">Apply</button>
        <button id="cdw-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr, k) {
      steps = [];
      const n = arr.length;
      if (n === 0 || k > n || k <= 0) {
        steps.push({ arr: [], phase: 'Invalid', desc: `Need n ≥ k > 0.`, marks: {}, vars: {}, result: [] });
        return;
      }

      const freq = {};
      const result = [];

      // Build first window
      for (let i = 0; i < k; i++) {
        freq[arr[i]] = (freq[arr[i]] || 0) + 1;
      }
      const firstDistinct = Object.keys(freq).length;
      result.push(firstDistinct);

      const initMarks = {};
      for (let i = 0; i < k; i++) initMarks[i] = { cls: 'active' };
      initMarks[0] = { cls: 'active', tag: 'L' };
      initMarks[k - 1] = { cls: 'active', tag: 'R' };

      steps.push({
        arr: [...arr], phase: 'Init Window',
        desc: `First window [0..${k - 1}]: freq = {${Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ')}}. Distinct = ${firstDistinct}.`,
        marks: initMarks,
        vars: { window: `[0..${k - 1}]`, distinct: firstDistinct },
        result: [...result],
        freqSnapshot: { ...freq }
      });

      // Slide
      for (let i = k; i < n; i++) {
        const leaving = arr[i - k];
        const entering = arr[i];

        // Remove leaving
        freq[leaving]--;
        if (freq[leaving] === 0) delete freq[leaving];
        // Add entering
        freq[entering] = (freq[entering] || 0) + 1;

        const distinct = Object.keys(freq).length;
        result.push(distinct);

        const marks = {};
        for (let j = 0; j < i - k + 1; j++) marks[j] = { cls: 'bad' };
        marks[i - k] = { cls: 'bad', tag: `−${leaving}` };
        for (let j = i - k + 1; j <= i; j++) marks[j] = { cls: 'active' };
        marks[i - k + 1] = { cls: 'active', tag: 'L' };
        marks[i] = { cls: 'active', tag: `+${entering}` };

        steps.push({
          arr: [...arr], phase: `Window [${i - k + 1}..${i}]`,
          desc: `Remove ${leaving}, add ${entering}. freq = {${Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ')}}. Distinct = ${distinct}.`,
          marks,
          vars: { left: i - k + 1, right: i, removed: leaving, added: entering, distinct },
          result: [...result],
          freqSnapshot: { ...freq }
        });
      }

      // Final result
      const fMarks = {};
      for (let i = 0; i < n; i++) fMarks[i] = { cls: 'good' };
      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Distinct counts for each window: [${result.join(', ')}].`,
        marks: fMarks,
        vars: { output: `[${result.join(', ')}]` },
        result: [...result],
        freqSnapshot: {}
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_COUNT_DISTINCT_WINDOW.id;
      const resultRow = s.result && s.result.length
        ? `<div class="equation" style="font-size:14px;margin-top:8px;"><span class="op">Output so far:</span> ${s.result.map(v => `<div class="eq-box">${v}</div>`).join(' ')}</div>`
        : '';
      const freqRow = s.freqSnapshot && Object.keys(s.freqSnapshot).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Freq map:</span> ${Object.entries(s.freqSnapshot).map(([k, v]) => `<div class="eq-box" style="min-width:40px;">${k}:${v}</div>`).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.arr, s.marks)}</div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
        ${freqRow}
        ${resultRow}
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const raw = $('#cdw-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 2, 1, 3, 4, 2, 3];
      $('#cdw-arr').value = a.join(', ');
      const k = Math.max(1, parseInt($('#cdw-k').value) || 4);
      $('#cdw-k').value = k;
      buildSteps(a, k);
      $(`#player-mount-${TOPIC_COUNT_DISTINCT_WINDOW.id}`).innerHTML = '';
      $(`#desc-${TOPIC_COUNT_DISTINCT_WINDOW.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_COUNT_DISTINCT_WINDOW.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#cdw-apply').addEventListener('click', rebuild);
    $('#cdw-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      const arr = randomArray(len, 1, 6);
      $('#cdw-arr').value = arr.join(', ');
      $('#cdw-k').value = randomInt(2, Math.min(5, len));
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function countDistinct(arr, n, k):
    freq = {}
    for i from 0 to k-1:
        freq[arr[i]]++
    result = [size(freq)]
    for i from k to n-1:
        freq[arr[i-k]]--
        if freq[arr[i-k]] == 0: remove it
        freq[arr[i]]++
        result.append(size(freq))
    return result`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
using namespace std;

// Sliding Window + Hash Map — O(n) time, O(k) space
vector<int> countDistinct(vector<int>& arr, int k) {
    int n = arr.size();
    unordered_map<int, int> freq;
    vector<int> result;

    // First window
    for (int i = 0; i < k; i++)
        freq[arr[i]]++;
    result.push_back(freq.size());

    // Slide
    for (int i = k; i < n; i++) {
        freq[arr[i - k]]--;
        if (freq[arr[i - k]] == 0)
            freq.erase(arr[i - k]);
        freq[arr[i]]++;
        result.push_back(freq.size());
    }
    return result;
}`)}

      ${pythonPanel(this.id,
`# Sliding Window + Counter — O(n) time, O(k) space
from collections import Counter

def count_distinct(arr, k):
    freq = Counter(arr[:k])
    result = [len(freq)]

    for i in range(k, len(arr)):
        freq[arr[i - k]] -= 1
        if freq[arr[i - k]] == 0:
            del freq[arr[i - k]]
        freq[arr[i]] += 1
        result.append(len(freq))

    return result`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Count Distinct Elements in Every Window', slug: 'count-distinct-elements-in-every-window', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given an array of integers arr[] and a number k, find the count of distinct elements in every window of size k in the array.', hint: 'Maintain a hash map of frequencies; map size = distinct count. Slide and update.' },
        { lvl: 'medium', title: 'Count Substrings with Exactly K Distinct', slug: 'count-substring', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given a string s and an integer k, return the count of substrings that contain exactly k distinct characters.', hint: 'Use atMost(k) - atMost(k-1) trick with two sliding window passes.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
