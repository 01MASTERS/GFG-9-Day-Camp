/* ============================================================
   DAY 2 — TOPIC 04: ANAGRAM CHECK
   Visualizes 26-Character Frequency Hashing vs Sorting for Anagrams
   ============================================================ */

const TOPIC_ANAGRAM = {
  id: 'anagram',
  num: '04',
  title: 'Anagram Check — Frequency Hashing (O(n)) vs Sorting',
  tag: 'Strings',
  intuition: 'Two strings are anagrams if they have the exact same character frequencies. Using a 26-element array, increment counts for s1 and decrement for s2 in a single pass. If all frequencies end at 0, they are anagrams.',
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
        <label>String 1</label>
        <input type="text" class="arr-input" id="ana-s1" value="listen" style="width:130px;">
        <label>String 2</label>
        <input type="text" class="arr-input" id="ana-s2" value="silent" style="width:130px;">
        <label>Preset</label>
        <select id="ana-preset">
          <option value="listen|silent" selected>listen / silent (Valid)</option>
          <option value="triangle|integral">triangle / integral (Valid)</option>
          <option value="anagram|nagaram">anagram / nagaram (Valid)</option>
          <option value="rat|car">rat / car (Invalid)</option>
          <option value="geeks|geeke">geeks / geeke (Invalid)</option>
        </select>
        <label>Method</label>
        <select id="ana-method">
          <option value="freq" selected>Frequency Array (O(n))</option>
          <option value="sort">Sort & Compare (O(n log n))</option>
        </select>
        <button class="primary" id="ana-apply">Apply</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(raw1, raw2, method) {
      const s1 = raw1.toLowerCase().replace(/[^a-z]/g, '');
      const s2 = raw2.toLowerCase().replace(/[^a-z]/g, '');
      steps = [];

      if (s1.length !== s2.length) {
        steps.push({
          phase: 'Length Mismatch ❌',
          desc: `Lengths differ: len("${s1}") = ${s1.length} vs len("${s2}") = ${s2.length}. Cannot be anagrams!`,
          s1, s2,
          marks1: {}, marks2: {},
          freq: {},
          vars: { len1: s1.length, len2: s2.length, status: 'FAILED (Length Mismatch)' }
        });
        return steps;
      }

      const n = s1.length;
      if (n === 0) {
        steps.push({
          phase: 'Empty Strings ✅',
          desc: 'Both strings are empty, trivially valid anagrams.',
          s1: '', s2: '',
          marks1: {}, marks2: {},
          freq: {},
          vars: { status: 'Valid (Empty)' }
        });
        return steps;
      }

      if (method === 'sort') {
        steps.push({
          phase: 'Initial Strings',
          desc: `Comparing "${s1}" and "${s2}" using Sorting approach.`,
          s1, s2,
          marks1: {}, marks2: {},
          freq: {},
          vars: { string1: s1, string2: s2, method: 'Sort O(n log n)' }
        });

        const sorted1 = s1.split('').sort().join('');
        const sorted2 = s2.split('').sort().join('');

        steps.push({
          phase: 'Sorted Strings',
          desc: `Sorted String 1: "${sorted1}", Sorted String 2: "${sorted2}". Now compare index by index.`,
          s1: sorted1, s2: sorted2,
          marks1: {}, marks2: {},
          freq: {},
          vars: { sorted1, sorted2 }
        });

        let match = true;
        for (let i = 0; i < n; i++) {
          const m1 = {}, m2 = {};
          for (let k = 0; k < i; k++) { m1[k] = { cls: 'good' }; m2[k] = { cls: 'good' }; }

          if (sorted1[i] === sorted2[i]) {
            m1[i] = { cls: 'good active', tag: '✓' };
            m2[i] = { cls: 'good active', tag: '✓' };
            steps.push({
              phase: `Comparing Index ${i}`,
              desc: `Index ${i}: sorted1[${i}] ('${sorted1[i]}') == sorted2[${i}] ('${sorted2[i]}'). Match!`,
              s1: sorted1, s2: sorted2,
              marks1: m1, marks2: m2,
              freq: {},
              vars: { index: i, 'sorted1[i]': sorted1[i], 'sorted2[i]': sorted2[i] }
            });
          } else {
            match = false;
            m1[i] = { cls: 'bad active', tag: '✗' };
            m2[i] = { cls: 'bad active', tag: '✗' };
            steps.push({
              phase: 'Mismatch Found ❌',
              desc: `Index ${i}: sorted1[${i}] ('${sorted1[i]}') != sorted2[${i}] ('${sorted2[i]}'). NOT Anagrams!`,
              s1: sorted1, s2: sorted2,
              marks1: m1, marks2: m2,
              freq: {},
              vars: { index: i, mismatch: `${sorted1[i]} vs ${sorted2[i]}`, status: 'FAILED' }
            });
            break;
          }
        }

        if (match) {
          const finalM = {};
          for (let i = 0; i < n; i++) finalM[i] = { cls: 'good' };
          steps.push({
            phase: 'VALID ANAGRAMS ✅',
            desc: `Both sorted strings are identical! "${s1}" and "${s2}" are VALID ANAGRAMS.`,
            s1: sorted1, s2: sorted2,
            marks1: finalM, marks2: finalM,
            freq: {},
            vars: { result: 'ANAGRAMS ✅', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1) / O(n)' }
          });
        }
      } else {
        // Frequency Array method (O(n))
        const freq = {};
        steps.push({
          phase: 'Initialize Frequency Hash (26 Buckets)',
          desc: `Initializing 26-alphabet frequency array to all 0s. For each index i, we do freq[s1[i]]++ and freq[s2[i]]--.`,
          s1, s2,
          marks1: {}, marks2: {},
          freq: { ...freq },
          vars: { size: n, activeBuckets: 0 }
        });

        for (let i = 0; i < n; i++) {
          const c1 = s1[i];
          const c2 = s2[i];

          freq[c1] = (freq[c1] || 0) + 1;
          freq[c2] = (freq[c2] || 0) - 1;

          const m1 = {}, m2 = {};
          for (let k = 0; k < i; k++) { m1[k] = { cls: 'good' }; m2[k] = { cls: 'good' }; }
          m1[i] = { cls: 'active', tag: '+1' };
          m2[i] = { cls: 'compare active', tag: '-1' };

          steps.push({
            phase: `Process Index ${i} ('${c1}' & '${c2}')`,
            desc: `Index ${i}: s1[${i}]='${c1}' (+1 to freq['${c1}']), s2[${i}]='${c2}' (-1 to freq['${c2}']).`,
            s1, s2,
            marks1: m1, marks2: m2,
            freq: { ...freq },
            vars: { i, 's1[i]': c1, 's2[i]': c2, [`freq[${c1}]`]: freq[c1], [`freq[${c2}]`]: freq[c2] }
          });
        }

        // Final check
        let isAna = true;
        let nonZeroChar = null;
        for (const [ch, count] of Object.entries(freq)) {
          if (count !== 0) {
            isAna = false;
            nonZeroChar = ch;
            break;
          }
        }

        if (isAna) {
          const finalM = {};
          for (let i = 0; i < n; i++) finalM[i] = { cls: 'good' };
          steps.push({
            phase: 'VALID ANAGRAMS ✅',
            desc: `All 26 frequency buckets balanced out to exactly 0! "${s1}" and "${s2}" are VALID ANAGRAMS.`,
            s1, s2,
            marks1: finalM, marks2: finalM,
            freq: { ...freq },
            vars: { result: 'ANAGRAMS ✅', timeComplexity: 'O(n)', spaceComplexity: 'O(1) — 26 ints' }
          });
        } else {
          steps.push({
            phase: 'NOT ANAGRAMS ❌',
            desc: `Frequency table contains non-zero balance for character '${nonZeroChar}' (count = ${freq[nonZeroChar]}). NOT anagrams!`,
            s1, s2,
            marks1: {}, marks2: {},
            freq: { ...freq },
            vars: { failedChar: nonZeroChar, netBalance: freq[nonZeroChar], result: 'NOT ANAGRAMS ❌' }
          });
        }
      }

      return steps;
    }

    function renderFreqTable(freq) {
      const activeKeys = Object.keys(freq).filter(k => freq[k] !== undefined);
      if (activeKeys.length === 0) return '';

      const items = activeKeys.map(k => {
        const val = freq[k];
        const color = val === 0 ? 'var(--teal)' : val > 0 ? 'var(--yellow)' : 'var(--coral)';
        return `
          <div style="background:var(--panel-2);border:1px solid var(--border);border-radius:6px;padding:4px 8px;font-family:'JetBrains Mono';font-size:12px;display:flex;align-items:center;gap:6px;">
            <span style="font-weight:700;color:var(--chalk);">${k.toUpperCase()}:</span>
            <span style="font-weight:800;color:${color};">${val > 0 ? '+' + val : val}</span>
          </div>
        `;
      }).join('');

      return `<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:10px;">${items}</div>`;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_ANAGRAM.id;

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;align-items:center;width:100%;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:12px;font-weight:700;color:var(--muted);width:55px;">STR 1:</span>
            <div class="boxes">${boxesHTML(s.s1.split(''), s.marks1)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:12px;font-weight:700;color:var(--muted);width:55px;">STR 2:</span>
            <div class="boxes">${boxesHTML(s.s2.split(''), s.marks2)}</div>
          </div>
          ${renderFreqTable(s.freq)}
        </div>
        <div class="equation" style="font-size:15px;margin-top:12px;">
          <span class="op">Status:</span>
          <div class="eq-box ${s.phase.includes('❌') ? 'bad' : s.phase.includes('✅') ? 'res' : 'hl'}">${escapeHtml(s.phase)}</div>
        </div>
      `;

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const s1 = $('#ana-s1').value || 'listen';
      const s2 = $('#ana-s2').value || 'silent';
      const method = $('#ana-method').value;

      buildSteps(s1, s2, method);
      $(`#player-mount-${TOPIC_ANAGRAM.id}`).innerHTML = '';
      $(`#desc-${TOPIC_ANAGRAM.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_ANAGRAM.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#ana-preset').addEventListener('change', e => {
      const [p1, p2] = e.target.value.split('|');
      $('#ana-s1').value = p1;
      $('#ana-s2').value = p2;
      rebuild();
    });

    $('#ana-apply').addEventListener('click', rebuild);
    $('#ana-method').addEventListener('change', rebuild);
    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// Optimal Frequency Hashing Approach:
function isAnagram(s1, s2):
    if length(s1) != length(s2):
        return false
    
    freq = array of 26 zeros
    for i from 0 to length(s1) - 1:
        freq[s1[i] - 'a']++
        freq[s2[i] - 'a']--
    
    for count in freq:
        if count != 0:
            return false
            
    return true`)}

      ${cppPanel(this.id,
`#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// 1. Optimal Frequency Counting (O(n) time, O(1) space)
bool isAnagram(string s1, string s2) {
    if (s1.size() != s2.size()) return false;
    
    int freq[26] = {0};
    for (int i = 0; i < (int)s1.size(); i++) {
        freq[s1[i] - 'a']++;
        freq[s2[i] - 'a']--;
    }
    
    for (int i = 0; i < 26; i++) {
        if (freq[i] != 0) return false;
    }
    return true;
}

// 2. Check If Two Strings Are K-Anagrams (Siddhartha Batch Track)
// Return true if strings can become anagrams with <= k character modifications
bool areKAnagrams(string str1, string str2, int k) {
    if (str1.length() != str2.length()) return false;
    
    int count1[26] = {0};
    for (char c : str1) count1[c - 'a']++;
    
    int diffCount = 0;
    for (char c : str2) {
        if (count1[c - 'a'] > 0) {
            count1[c - 'a']--;
        } else {
            diffCount++;
        }
    }
    return diffCount <= k;
}

// 3. Sorting Approach (O(n log n) time, O(1) space)
bool isAnagramSort(string s1, string s2) {
    if (s1.size() != s2.size()) return false;
    sort(s1.begin(), s1.end());
    sort(s2.begin(), s2.end());
    return s1 == s2;
}`)}
      ${pythonPanel(this.id,
`# Anagram Check — Frequency Counting O(n)
def is_anagram(s1, s2):
    if len(s1) != len(s2):
        return False
    freq = [0] * 26
    for i in range(len(s1)):
        freq[ord(s1[i]) - ord('a')] += 1
        freq[ord(s2[i]) - ord('a')] -= 1
    return all(f == 0 for f in freq)

# Pythonic (Counter)
from collections import Counter
def is_anagram_pythonic(s1, s2):
    return Counter(s1) == Counter(s2)

# Sorting approach
def is_anagram_sort(s1, s2):
    return sorted(s1) == sorted(s2)`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Check If Two Strings are K-Anagrams', slug: 'check-if-two-strings-are-k-anagrams-or-not', track: 'strings-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Count frequency deltas across 26 chars. If characters needing changes is <= k, return true.' },
        { lvl: 'easy', title: 'Anagram (Valid Anagram)', slug: 'anagram-1587115620', isBatch: false, company: 'Amazon, Microsoft, Goldman Sachs, Flipkart', hint: 'Count frequencies using a fixed size 26 integer table in O(n) time and O(1) auxiliary space.' },
        { lvl: 'medium', title: 'Print Anagrams Together (Group Anagrams)', slug: 'print-anagrams-together', isBatch: false, company: 'Amazon, Microsoft, Google', hint: 'Use sorted strings or 26-tuple frequency hash as hash map keys to group anagram words.' },
        { lvl: 'medium', title: 'Choose and Swap (Lexicographically Smallest String)', slug: 'choose-and-swap0531', track: 'strings-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Find the first character that can be swapped with a strictly smaller character appearing later.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
