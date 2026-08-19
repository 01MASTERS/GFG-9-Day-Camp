/* ============================================================
   DAY 2 — TOPIC 05: PANGRAM CHECKING
   Visualizes 26-Letter Alphabet Bitmask & Boolean Array Tracker
   ============================================================ */

const TOPIC_PANAGRAM = {
  id: 'panagram',
  num: '05',
  title: 'Pangram Checking — 26-Letter Bitmask / Alphabet Map',
  tag: 'Strings',
  intuition: 'A pangram contains every letter from A to Z at least once. Maintain a 26-bit bitmask or boolean array. As we scan the string, mark each alphabetic letter. If unique seen count reaches 26 (or mask == (1<<26)-1), it is a pangram.',
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
        <label>Sentence</label>
        <input type="text" class="arr-input" id="pan-str" value="The quick brown fox jumps over the lazy dog" style="width:310px;">
        <label>Preset</label>
        <select id="pan-preset">
          <option value="The quick brown fox jumps over the lazy dog" selected>Quick brown fox (Valid 26/26)</option>
          <option value="Pack my box with five dozen liquor jugs">Five dozen liquor jugs (Valid 26/26)</option>
          <option value="Sphinx of black quartz, judge my vow">Sphinx of black quartz (Valid 26/26)</option>
          <option value="GeeksForGeeks">GeeksForGeeks (Invalid)</option>
          <option value="Antigravity coding assistant">Antigravity assistant (Invalid)</option>
        </select>
        <button class="primary" id="pan-apply">Apply</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(rawSentence) {
      const sentence = rawSentence.trim();
      const n = sentence.length;
      steps = [];

      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      let seen = new Set();
      let mask = 0;

      steps.push({
        phase: 'Initialize',
        desc: `Scanning sentence of length ${n}. Total required alphabet letters: 26 (A-Z).`,
        currChar: '',
        currIdx: -1,
        seenSet: new Set(),
        mask: 0,
        vars: { totalLength: n, uniqueFound: 0, target: 26 }
      });

      for (let i = 0; i < n; i++) {
        const ch = sentence[i].toLowerCase();
        const isAlpha = ch >= 'a' && ch <= 'z';

        if (isAlpha) {
          const bitPos = ch.charCodeAt(0) - 97;
          const wasNew = !seen.has(ch);
          seen.add(ch);
          mask |= (1 << bitPos);

          steps.push({
            phase: wasNew ? `Found New Letter: '${ch.toUpperCase()}'` : `Seen: '${ch.toUpperCase()}'`,
            desc: wasNew 
              ? `Char '${sentence[i]}' at index ${i} is a NEW letter! '${ch.toUpperCase()}' marked. Unique letters: ${seen.size} / 26.`
              : `Char '${sentence[i]}' at index ${i} ('${ch.toUpperCase()}') was already discovered earlier.`,
            currChar: sentence[i],
            currIdx: i,
            seenSet: new Set(seen),
            mask,
            vars: { index: i, char: sentence[i], uniqueLetters: `${seen.size} / 26`, bitmask: `0x${mask.toString(16).toUpperCase()}` }
          });

          if (seen.size === 26) {
            steps.push({
              phase: 'All 26 Letters Found! Early Exit ✅',
              desc: `All 26 letters (A through Z) have been discovered at index ${i}! String is guaranteed to be a PANGRAM.`,
              currChar: sentence[i],
              currIdx: i,
              seenSet: new Set(seen),
              mask,
              vars: { result: 'PANGRAM ✅', uniqueLetters: '26 / 26', status: 'Complete' }
            });
            return steps;
          }
        } else {
          steps.push({
            phase: `Skipping Non-Alpha: '${sentence[i]}'`,
            desc: `'${sentence[i]}' is punctuation / whitespace / non-alphabet. Skip to next char.`,
            currChar: sentence[i],
            currIdx: i,
            seenSet: new Set(seen),
            mask,
            vars: { index: i, skipped: sentence[i], uniqueLetters: `${seen.size} / 26` }
          });
        }
      }

      // Final evaluation if not all 26
      const missing = alphabet.filter(c => !seen.has(c));
      const isPangram = seen.size === 26;

      steps.push({
        phase: isPangram ? 'PANGRAM CONFIRMED ✅' : 'NOT A PANGRAM ❌',
        desc: isPangram
          ? `All 26 letters present. "${sentence}" is a VALID PANGRAM!`
          : `Missing ${missing.length} letter(s): [ ${missing.map(m => m.toUpperCase()).join(', ')} ]. NOT a pangram.`,
        currChar: '',
        currIdx: n,
        seenSet: new Set(seen),
        mask,
        vars: {
          result: isPangram ? 'PANGRAM ✅' : 'NOT A PANGRAM ❌',
          foundCount: `${seen.size} / 26`,
          missingCount: missing.length,
          missingLetters: missing.map(m => m.toUpperCase()).join(', ') || 'None'
        }
      });

      return steps;
    }

    function renderKeyboard(seenSet) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      const keys = alphabet.map(ch => {
        const isSeen = seenSet.has(ch);
        const cls = isSeen ? 'good' : 'dim';
        return `
          <div class="box ${cls}" style="min-width:34px;height:36px;font-size:13px;border-radius:6px;padding:0;">
            <div class="box-val">${ch.toUpperCase()}</div>
          </div>
        `;
      }).join('');

      return `<div style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center;max-width:540px;margin:12px auto 0;">${keys}</div>`;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_PANAGRAM.id;

      const chars = $('#pan-str').value.slice(0, 40).split('');
      const marks = {};
      if (s.currIdx >= 0 && s.currIdx < chars.length) {
        marks[s.currIdx] = { cls: 'active', tag: 'cur' };
      }

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;">
          <div style="font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px;">26-ALPHABET COVERAGE GAUGE: ${s.seenSet.size} / 26</div>
          <div style="width:100%;max-width:480px;height:8px;background:var(--panel-2);border-radius:4px;overflow:hidden;border:1px solid var(--border);">
            <div style="width:${(s.seenSet.size / 26) * 100}%;height:100%;background:var(--teal);transition:width .2s ease;"></div>
          </div>
          ${renderKeyboard(s.seenSet)}
        </div>
        <div class="equation" style="font-size:15px;margin-top:14px;">
          <span class="op">Status:</span>
          <div class="eq-box ${s.phase.includes('❌') ? 'bad' : s.phase.includes('✅') ? 'res' : 'hl'}">${escapeHtml(s.phase)}</div>
        </div>
      `;

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;
    function rebuild() {
      const sentence = $('#pan-str').value || 'The quick brown fox jumps over the lazy dog';
      buildSteps(sentence);
      $(`#player-mount-${TOPIC_PANAGRAM.id}`).innerHTML = '';
      $(`#desc-${TOPIC_PANAGRAM.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_PANAGRAM.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#pan-preset').addEventListener('change', e => {
      $('#pan-str').value = e.target.value;
      rebuild();
    });

    $('#pan-apply').addEventListener('click', rebuild);
    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// 1. Bitmask Method (O(1) auxiliary space - 1 single integer):
function isPangram(s):
    mask = 0
    for char c in s:
        if isAlpha(c):
            bitPos = toLower(c) - 'a'
            mask = mask | (1 << bitPos)
            if mask == (1 << 26) - 1: // All 26 bits set
                return true
    return mask == (1 << 26) - 1

// 2. Boolean Array Method:
function isPangramArray(s):
    visited = array of 26 falses
    count = 0
    for char c in s:
        if isAlpha(c):
            idx = toLower(c) - 'a'
            if not visited[idx]:
                visited[idx] = true
                count++
                if count == 26: return true
    return count == 26`)}

      ${cppPanel(this.id,
`#include <string>
#include <vector>
#include <cctype>
using namespace std;

// 1. Optimal 26-bit Bitmask Approach (O(n) time, O(1) space)
bool checkPangram(string& s) {
    int mask = 0;
    for (char c : s) {
        if (isalpha(c)) {
            mask |= (1 << (tolower(c) - 'a'));
            if (mask == (1 << 26) - 1) {
                return true; // Early exit as soon as all 26 letters are found
            }
        }
    }
    return mask == ((1 << 26) - 1);
}

// 2. Boolean Array Approach (GFG Siddhartha Batch)
bool checkPangramArray(string& s) {
    vector<bool> mark(26, false);
    int uniqueCount = 0;
    
    for (char c : s) {
        if (isalpha(c)) {
            int index = tolower(c) - 'a';
            if (!mark[index]) {
                mark[index] = true;
                uniqueCount++;
                if (uniqueCount == 26) return true;
            }
        }
    }
    return uniqueCount == 26;
}

// 3. Find Missing Characters in Pangram
string missingCharsInPangram(string str) {
    vector<bool> present(26, false);
    for (char c : str) {
        if (isalpha(c)) present[tolower(c) - 'a'] = true;
    }
    string missing = "";
    for (int i = 0; i < 26; i++) {
        if (!present[i]) missing += (char)('a' + i);
    }
    return missing.empty() ? "-1" : missing;
}`)}
      ${pythonPanel(this.id,
`# Pangram Check — O(n) time, O(1) space
def is_pangram(s):
    return len(set(c.lower() for c in s if c.isalpha())) == 26

# Bitmask approach
def is_pangram_bitmask(s):
    mask = 0
    for c in s:
        if c.isalpha():
            mask |= 1 << (ord(c.lower()) - ord('a'))
    return mask == (1 << 26) - 1

# Missing characters in pangram
def missing_chars(s):
    present = set(c.lower() for c in s if c.isalpha())
    missing = [chr(i + ord('a')) for i in range(26) if chr(i + ord('a')) not in present]
    return ''.join(missing) if missing else '-1'`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Pangram Checking', slug: 'pangram-checking-1587115620', track: 'strings-fundamental-siddhartha', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Scan the string and use a 26-bit bitmask or 26-boolean vector to verify all 26 English letters exist.' },
        { lvl: 'basic', title: 'Keypad Typing (Letter to Dial Digit Mapping)', slug: 'keypad-typing0119', track: 'strings-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Map each character to its corresponding mobile numeric keypad digit.' },
        { lvl: 'easy', title: 'The Modified String (No 3 Consecutive Identical Chars)', slug: 'the-modified-string-1587115621', track: 'strings-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Count contiguous identical characters and compute insertions needed with (count - 1) / 2.' },
        { lvl: 'easy', title: 'Check if a String is Isogram', slug: 'check-if-a-string-is-isogram-or-not-1587115620', isBatch: false, company: 'Amazon, Microsoft', hint: 'An isogram has no repeating letters; use a bitmask or frequency array to ensure each frequency <= 1.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
