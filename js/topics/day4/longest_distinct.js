/* ============================================================
   DAY 4 — TOPIC 02: LONGEST SUBSTRING WITH DISTINCT CHARACTERS
   Variable-size sliding window with a hash set to track
   characters inside the current window.
   ============================================================ */

const TOPIC_LONGEST_DISTINCT = {
  id: 'longest-distinct',
  num: '02',
  title: 'Longest Substring with All Distinct Characters',
  tag: 'Sliding Window',
  intuition: 'Expand the window right. If a duplicate enters, shrink from the left until all characters are unique again. Track the maximum window length seen.',
  time: 'O(n)',
  space: 'O(min(n, alphabet))',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>String</label>
        <input type="text" class="arr-input" id="ld-str" value="abcabcbb">
        <button class="primary" id="ld-apply">Apply</button>
        <button id="ld-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(s) {
      steps = [];
      const n = s.length;
      if (n === 0) {
        steps.push({ arr: [], phase: 'Empty', desc: 'String is empty.', marks: {}, vars: {} });
        return;
      }

      const chars = s.split('');
      const lastSeen = {};  // char -> last index
      let left = 0, best = 0, bestL = 0, bestR = 0;

      steps.push({
        arr: chars, phase: 'Initialize',
        desc: `String of length ${n}. Set left=0, best=0. Expand right pointer.`,
        marks: { 0: { cls: 'active', tag: 'L,R' } },
        vars: { left: 0, best: 0, window: '""' }
      });

      for (let right = 0; right < n; right++) {
        const c = chars[right];
        const marks = {};

        if (lastSeen[c] !== undefined && lastSeen[c] >= left) {
          const oldLeft = left;
          left = lastSeen[c] + 1;
          // Dim elements before window
          for (let j = 0; j < left; j++) marks[j] = { cls: 'bad' };
          marks[oldLeft] = { cls: 'bad', tag: 'old L' };

          for (let j = left; j <= right; j++) marks[j] = { cls: 'active' };
          marks[left] = { cls: 'active', tag: 'L' };
          marks[right] = { cls: 'compare active', tag: 'R' };

          steps.push({
            arr: chars, phase: `Shrink (dup '${c}')`,
            desc: `'${c}' already at index ${lastSeen[c]} (≥ left=${oldLeft}). Move left to ${lastSeen[c]}+1 = ${left}. Window = "${s.slice(left, right + 1)}", len = ${right - left + 1}.`,
            marks,
            vars: { left, right, duplicate: c, windowLen: right - left + 1, best, window: `"${s.slice(left, right + 1)}"` }
          });
        } else {
          for (let j = 0; j < left; j++) marks[j] = { cls: 'bad' };
          for (let j = left; j <= right; j++) marks[j] = { cls: 'active' };
          marks[left] = { cls: 'active', tag: 'L' };
          marks[right] = { cls: 'good active', tag: 'R' };

          const improved = (right - left + 1) > best;
          if (improved) {
            best = right - left + 1;
            bestL = left;
            bestR = right;
          }

          steps.push({
            arr: chars, phase: improved ? '✦ New Best!' : 'Expand',
            desc: `'${c}' is unique in window. Expand. Window = "${s.slice(left, right + 1)}", len = ${right - left + 1}. ${improved ? 'New best = ' + best + '!' : 'best stays ' + best + '.'}`,
            marks,
            vars: { left, right, windowLen: right - left + 1, best, window: `"${s.slice(left, right + 1)}"` }
          });
        }

        lastSeen[c] = right;
      }

      // Final
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        if (i >= bestL && i <= bestR) fMarks[i] = { cls: 'good' };
        else fMarks[i] = { cls: 'bad' };
      }
      steps.push({
        arr: chars, phase: 'Result',
        desc: `Longest substring with all distinct characters = ${best} → "${s.slice(bestL, bestR + 1)}".`,
        marks: fMarks,
        vars: { result: best, substring: `"${s.slice(bestL, bestR + 1)}"` }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_LONGEST_DISTINCT.id;
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
      const s = $('#ld-str').value.trim() || 'abcabcbb';
      $('#ld-str').value = s;
      buildSteps(s);
      $(`#player-mount-${TOPIC_LONGEST_DISTINCT.id}`).innerHTML = '';
      $(`#desc-${TOPIC_LONGEST_DISTINCT.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_LONGEST_DISTINCT.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#ld-apply').addEventListener('click', rebuild);
    $('#ld-random').addEventListener('click', () => {
      const pool = 'abcdefgh';
      const len = randomInt(8, 14);
      let s = '';
      for (let i = 0; i < len; i++) s += pool[randomInt(0, pool.length - 1)];
      $('#ld-str').value = s;
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function longestDistinct(s):
    lastSeen = {}      // char → last index
    left = 0, best = 0
    for right from 0 to n-1:
        if s[right] in lastSeen and lastSeen[s[right]] >= left:
            left = lastSeen[s[right]] + 1
        lastSeen[s[right]] = right
        best = max(best, right - left + 1)
    return best`)}

      ${cppPanel(this.id,
`#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

// Variable Sliding Window — O(n) time, O(alphabet) space
int longestDistinct(string& s) {
    unordered_map<char, int> lastSeen;
    int left = 0, best = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        if (lastSeen.count(s[right]) && lastSeen[s[right]] >= left)
            left = lastSeen[s[right]] + 1;
        lastSeen[s[right]] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`)}

      ${pythonPanel(this.id,
`# Variable Sliding Window — O(n) time, O(alphabet) space
def longest_distinct(s):
    last_seen = {}
    left = 0
    best = 0
    for right in range(len(s)):
        if s[right] in last_seen and last_seen[s[right]] >= left:
            left = last_seen[s[right]] + 1
        last_seen[s[right]] = right
        best = max(best, right - left + 1)
    return best`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Longest Substring with Distinct Characters', slug: 'longest-distinct-characters-in-string5848', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given a string s, find the length of the longest substring that contains all distinct (non-repeating) characters.', hint: 'Use a hash map to store last-seen index. On duplicate, jump left pointer past the previous occurrence.' },
        { lvl: 'medium', title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given a string s and an integer k, you can choose any character and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter after performing the above operations.', hint: 'Sliding window: if window_size - max_freq_char > k, shrink from left.' },
        { lvl: 'hard', title: 'Smallest Window Containing All Characters', slug: 'smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621', track: 'sliding-window-siddhartha', isBatch: true, company: 'Amazon, Microsoft', statement: 'Given two strings s and p, find the smallest window in s that contains all the characters of p (including duplicates). If no such window exists, return "-1".', hint: 'Expand until all target chars are covered, then shrink from left to minimize.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
