/* ============================================================
   DAY 4 — TOPIC 04: FRUIT INTO BASKETS
   Variable-size sliding window: longest subarray with
   at most 2 distinct elements (basket types).
   ============================================================ */

const TOPIC_FRUIT_BASKET = {
  id: 'fruit-basket',
  num: '04',
  title: 'Fruit Into Baskets — At Most 2 Distinct Types',
  tag: 'Sliding Window',
  intuition: 'You have 2 baskets, each can hold one fruit type. Walk through the tree row: expand the window right. If a third type enters, shrink from the left until only 2 types remain. Track the longest window.',
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
        <label>Fruits</label>
        <input type="text" class="arr-input" id="fb-arr" value="1, 2, 3, 2, 2">
        <button class="primary" id="fb-apply">Apply</button>
        <button id="fb-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    const fruitEmoji = ['🍎', '🍊', '🍋', '🍇', '🍌', '🍑', '🫐', '🥝'];
    let steps = [];

    function buildSteps(arr) {
      steps = [];
      const n = arr.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'Empty', desc: 'No fruits.', marks: {}, vars: {} });
        return;
      }

      const freq = {};
      let left = 0, best = 0, bestL = 0, bestR = 0;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Array of ${n} fruits. 2 baskets available. Expand from left.`,
        marks: { 0: { cls: 'active', tag: 'L,R' } },
        vars: { left: 0, baskets: '{}', best: 0 }
      });

      for (let right = 0; right < n; right++) {
        freq[arr[right]] = (freq[arr[right]] || 0) + 1;
        const marks = {};

        // If more than 2 types, shrink
        if (Object.keys(freq).length > 2) {
          const beforeLeft = left;
          while (Object.keys(freq).length > 2) {
            freq[arr[left]]--;
            if (freq[arr[left]] === 0) delete freq[arr[left]];
            left++;
          }

          for (let j = 0; j < left; j++) marks[j] = { cls: 'bad' };
          for (let j = left; j <= right; j++) marks[j] = { cls: 'active' };
          marks[left] = { cls: 'active', tag: 'L' };
          marks[right] = { cls: 'compare active', tag: 'R' };

          steps.push({
            arr: [...arr], phase: `Shrink (3rd type: ${arr[right]})`,
            desc: `Type ${arr[right]} entered → 3 types! Shrink from left ${beforeLeft} to ${left}. Window = [${left}..${right}], len = ${right - left + 1}. Baskets: {${Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ')}}.`,
            marks,
            vars: { left, right, windowLen: right - left + 1, baskets: `{${Object.keys(freq).join(', ')}}`, best }
          });
        } else {
          const windowLen = right - left + 1;
          const improved = windowLen > best;
          if (improved) {
            best = windowLen;
            bestL = left;
            bestR = right;
          }

          for (let j = 0; j < left; j++) marks[j] = { cls: 'bad' };
          for (let j = left; j <= right; j++) marks[j] = { cls: 'active' };
          marks[left] = { cls: 'active', tag: 'L' };
          marks[right] = { cls: improved ? 'good active' : 'active', tag: 'R' };

          steps.push({
            arr: [...arr], phase: improved ? '✦ New Best!' : 'Expand',
            desc: `Type ${arr[right]} fits in baskets (≤2 types). Window [${left}..${right}], len = ${windowLen}. ${improved ? 'New best = ' + best + '!' : 'best stays ' + best + '.'}`,
            marks,
            vars: { left, right, windowLen, baskets: `{${Object.keys(freq).join(', ')}}`, best }
          });
        }
      }

      // Final
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        if (i >= bestL && i <= bestR) fMarks[i] = { cls: 'good' };
        else fMarks[i] = { cls: 'bad' };
      }
      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Maximum fruits collected = ${best} from window [${bestL}..${bestR}].`,
        marks: fMarks,
        vars: { result: best, bestWindow: `[${bestL}..${bestR}]` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_FRUIT_BASKET.id;
      // Show fruits with emoji where possible
      const displayArr = s.arr.map(v => {
        const emoji = fruitEmoji[v % fruitEmoji.length];
        return emoji ? `${emoji}${v}` : v;
      });
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(displayArr, s.marks)}</div>
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
      const raw = $('#fb-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length ? raw : [1, 2, 3, 2, 2];
      $('#fb-arr').value = a.join(', ');
      buildSteps(a);
      $(`#player-mount-${TOPIC_FRUIT_BASKET.id}`).innerHTML = '';
      $(`#desc-${TOPIC_FRUIT_BASKET.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_FRUIT_BASKET.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#fb-apply').addEventListener('click', rebuild);
    $('#fb-random').addEventListener('click', () => {
      const len = randomInt(8, 14);
      const arr = randomArray(len, 0, 4);
      $('#fb-arr').value = arr.join(', ');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function totalFruits(arr):
    freq = {}, left = 0, best = 0
    for right from 0 to n-1:
        freq[arr[right]]++
        while size(freq) > 2:
            freq[arr[left]]--
            if freq[arr[left]] == 0: remove it
            left++
        best = max(best, right - left + 1)
    return best`)}

      ${cppPanel(this.id,
`#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

// Sliding Window — O(n) time, O(1) space (map has at most 3 keys)
int totalFruits(vector<int>& arr) {
    unordered_map<int, int> freq;
    int left = 0, best = 0;
    for (int right = 0; right < (int)arr.size(); right++) {
        freq[arr[right]]++;
        while (freq.size() > 2) {
            freq[arr[left]]--;
            if (freq[arr[left]] == 0)
                freq.erase(arr[left]);
            left++;
        }
        best = max(best, right - left + 1);
    }
    return best;
}`)}

      ${pythonPanel(this.id,
`# Sliding Window — O(n) time, O(1) space
from collections import Counter

def total_fruits(arr):
    freq = Counter()
    left = 0
    best = 0
    for right in range(len(arr)):
        freq[arr[right]] += 1
        while len(freq) > 2:
            freq[arr[left]] -= 1
            if freq[arr[left]] == 0:
                del freq[arr[left]]
            left += 1
        best = max(best, right - left + 1)
    return best`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Fruit Into Baskets (Longest subarray with at most 2 distinct)', slug: 'fruit-into-baskets', isBatch: false, company: 'Amazon, Google, Microsoft', statement: 'You are visiting a farm with a row of fruit trees. You have two baskets, and each basket can only hold one type of fruit. Starting from any tree, pick one fruit from every tree while moving right. Stop when you encounter a third type. Return the maximum number of fruits you can collect.', hint: 'Sliding window with a hash map capped at 2 keys. Shrink left until ≤ 2 types.' },
        { lvl: 'medium', title: 'Longest Distinct Characters in String', slug: 'longest-distinct-characters-in-string5848', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given a string s, find the length of the longest substring that contains all distinct (non-repeating) characters.', hint: 'Same technique but no cap on distinct — instead require ALL unique.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
