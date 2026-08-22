/* ============================================================
   DAY 5 — TOPIC 02: COUNT MAX FREQUENCY CHARACTER
   Hash/count array to find the character with highest frequency.
   ============================================================ */

const TOPIC_MAX_FREQ_CHAR = {
  id: 'max-freq-char',
  num: '02',
  title: 'Max Frequency Character — Hashing',
  tag: 'Hashing',
  intuition: 'Scan the string once and maintain a frequency count (hash map or array of size 26). Track the character with the highest count. One pass, O(n) time.',
  time: 'O(n)',
  space: 'O(1) — fixed 26 slots',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>String</label>
        <input type="text" class="arr-input" id="mfc-str" value="abracadabra">
        <button class="primary" id="mfc-apply">Apply</button>
        <button id="mfc-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(str) {
      steps = [];
      const chars = str.split('');
      const n = chars.length;
      if (n === 0) {
        steps.push({ chars: [], phase: 'Empty', desc: 'String is empty.', marks: {}, vars: {}, freq: {} });
        return;
      }

      steps.push({
        chars: [...chars], phase: 'Start',
        desc: `String "${str}" has ${n} characters. Scan left to right, counting frequencies.`,
        marks: {}, vars: { n }, freq: {}
      });

      const freq = {};
      let maxChar = '', maxCount = 0;

      for (let i = 0; i < n; i++) {
        const c = chars[i];
        freq[c] = (freq[c] || 0) + 1;
        if (freq[c] > maxCount) {
          maxCount = freq[c];
          maxChar = c;
        }

        const marks = {};
        for (let j = 0; j < i; j++) marks[j] = { cls: 'bad' };
        marks[i] = { cls: 'good', tag: `'${c}'` };

        steps.push({
          chars: [...chars], phase: `Scan i=${i}`,
          desc: `Character '${c}': freq['${c}'] = ${freq[c]}. Current max = '${maxChar}' with count ${maxCount}.`,
          marks,
          vars: { i, [`char`]: `'${c}'`, [`freq['${c}']`]: freq[c], maxChar: `'${maxChar}'`, maxCount },
          freq: { ...freq }
        });
      }

      // Final result
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        fMarks[i] = chars[i] === maxChar ? { cls: 'good' } : { cls: 'bad' };
      }
      steps.push({
        chars: [...chars], phase: 'Result',
        desc: `Max frequency character is '${maxChar}' appearing ${maxCount} times.`,
        marks: fMarks,
        vars: { result: `'${maxChar}'`, frequency: maxCount },
        freq: { ...freq }
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_MAX_FREQ_CHAR.id;
      const freqRow = s.freq && Object.keys(s.freq).length
        ? `<div class="equation" style="font-size:13px;margin-top:6px;"><span class="op">Freq map:</span> ${Object.entries(s.freq).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="eq-box" style="min-width:40px;">${k}:${v}</div>`).join(' ')}</div>`
        : '';
      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.chars, s.marks)}</div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
        ${freqRow}
      `;
      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const str = ($('#mfc-str').value || 'abracadabra').toLowerCase().replace(/[^a-z]/g, '');
      $('#mfc-str').value = str;
      buildSteps(str);
      $(`#player-mount-${TOPIC_MAX_FREQ_CHAR.id}`).innerHTML = '';
      $(`#desc-${TOPIC_MAX_FREQ_CHAR.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_MAX_FREQ_CHAR.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    const sampleStrings = ['banana', 'mississippi', 'abracadabra', 'programming', 'geeksforgeeks', 'helloworld', 'algorithm'];
    rebuild();
    $('#mfc-apply').addEventListener('click', rebuild);
    $('#mfc-random').addEventListener('click', () => {
      $('#mfc-str').value = sampleStrings[randomInt(0, sampleStrings.length - 1)];
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function maxFreqChar(str):
    freq = {} or int[26]
    maxChar = '', maxCount = 0
    for each char c in str:
        freq[c]++
        if freq[c] > maxCount:
            maxCount = freq[c]
            maxChar = c
    return maxChar`)}

      ${cppPanel(this.id,
`#include <string>
#include <vector>
using namespace std;

// Max Frequency Character — O(n) time, O(1) space
char maxFreqChar(string& s) {
    int freq[26] = {};
    for (char c : s)
        freq[c - 'a']++;

    int maxCount = 0;
    char maxChar = 'a';
    for (int i = 0; i < 26; i++) {
        if (freq[i] > maxCount) {
            maxCount = freq[i];
            maxChar = 'a' + i;
        }
    }
    return maxChar;
}`)}

      ${pythonPanel(this.id,
`# Max Frequency Character — O(n) time, O(1) space
from collections import Counter

def max_freq_char(s):
    freq = Counter(s)
    return max(freq, key=freq.get)

# Manual approach (without Counter)
def max_freq_char_manual(s):
    freq = {}
    max_char, max_count = '', 0
    for c in s:
        freq[c] = freq.get(c, 0) + 1
        if freq[c] > max_count:
            max_count = freq[c]
            max_char = c
    return max_char`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Non Repeating Character', slug: 'non-repeating-character-1587115620', isBatch: false, company: 'Amazon, Goldman Sachs, Flipkart', statement: 'Given a string s of lowercase English letters, find the first character that does not repeat. If no such character exists, return "$".', hint: 'Two-pass: first build freq map, then scan string for freq == 1.' },
        { lvl: 'easy', title: 'Most Frequent Character', slug: 'most-frequent-character-in-a-string5233', isBatch: false, company: 'TCS, Infosys', statement: 'Given a string s, find the most frequent character in the string. If multiple characters have the same frequency, return the lexicographically smallest.', hint: 'Count with freq[26], then iterate 0..25 for max.' },
        { lvl: 'medium', title: 'Sort Characters By Frequency', slug: 'sorting-elements-of-an-array-by-frequency-1587115621', isBatch: false, company: 'Amazon, Microsoft', statement: 'Given a string s, sort the characters by their frequency in decreasing order. If two characters have the same frequency, the one appearing first in the input comes first.', hint: 'Count frequencies, then sort by count descending.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
