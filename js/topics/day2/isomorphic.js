/* ============================================================
   DAY 2 — TOPIC 06: ISOMORPHIC STRINGS
   Visualizes 1-to-1 Bijective Character Mapping & Conflict Detection
   ============================================================ */

const TOPIC_ISOMORPHIC = {
  id: 'isomorphic',
  num: '06',
  title: 'Isomorphic Strings — 1-to-1 Bijective Mapping',
  tag: 'Strings',
  intuition: 'Two strings are isomorphic if characters in s1 can be uniquely replaced to get s2 without changing order. Every character in s1 must map to exactly one character in s2, and no two distinct characters in s1 may map to the same character in s2 (bijective 1-to-1 mapping).',
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
        <input type="text" class="arr-input" id="iso-s1" value="paper" style="width:110px;">
        <label>String 2</label>
        <input type="text" class="arr-input" id="iso-s2" value="title" style="width:110px;">
        <label>Preset</label>
        <select id="iso-preset">
          <option value="paper|title" selected>paper / title (Valid)</option>
          <option value="egg|add">egg / add (Valid)</option>
          <option value="aab|xxy">aab / xxy (Valid)</option>
          <option value="foo|bar">foo / bar (Invalid — o maps to r and a)</option>
          <option value="badc|baba">badc / baba (Invalid — b and d both map to b)</option>
          <option value="ab|aa">ab / aa (Invalid)</option>
        </select>
        <button class="primary" id="iso-apply">Apply</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(raw1, raw2) {
      const s1 = raw1.trim();
      const s2 = raw2.trim();
      steps = [];

      if (s1.length !== s2.length) {
        steps.push({
          phase: 'Length Mismatch ❌',
          desc: `Lengths differ: len(s1)=${s1.length} vs len(s2)=${s2.length}. Cannot be isomorphic!`,
          s1, s2,
          currIdx: -1,
          map1: {}, map2: {},
          marks1: {}, marks2: {},
          vars: { status: 'FAILED (Length Mismatch)' }
        });
        return steps;
      }

      const n = s1.length;
      if (n === 0) {
        steps.push({
          phase: 'Empty Strings ✅',
          desc: 'Both strings are empty, trivially isomorphic.',
          s1: '', s2: '',
          currIdx: -1,
          map1: {}, map2: {},
          marks1: {}, marks2: {},
          vars: { status: 'Valid (Empty)' }
        });
        return steps;
      }

      const map1 = {}; // s1[i] -> s2[i]
      const map2 = {}; // s2[i] -> s1[i]
      let isIso = true;

      steps.push({
        phase: 'Initialize Mappings',
        desc: `Verifying bijective mapping between "${s1}" and "${s2}" of length ${n}.`,
        s1, s2,
        currIdx: -1,
        map1: {}, map2: {},
        marks1: {}, marks2: {},
        vars: { length: n, activeRules: 0 }
      });

      for (let i = 0; i < n; i++) {
        const c1 = s1[i];
        const c2 = s2[i];

        const m1 = {}, m2 = {};
        for (let k = 0; k < i; k++) { m1[k] = { cls: 'good' }; m2[k] = { cls: 'good' }; }
        m1[i] = { cls: 'active', tag: 's1[i]' };
        m2[i] = { cls: 'compare active', tag: 's2[i]' };

        // Check if forward mapping exists
        if (map1[c1] !== undefined && map1[c1] !== c2) {
          isIso = false;
          m1[i] = { cls: 'bad active', tag: 'Conflict' };
          m2[i] = { cls: 'bad active', tag: 'Conflict' };
          steps.push({
            phase: 'Mapping Conflict in S1 ❌',
            desc: `Conflict at index ${i}: '${c1}' in s1 is ALREADY mapped to '${map1[c1]}', but current s2 char is '${c2}'. NOT Isomorphic!`,
            s1, s2,
            currIdx: i,
            map1: { ...map1 }, map2: { ...map2 },
            marks1: m1, marks2: m2,
            vars: { index: i, char1: c1, expectedChar2: map1[c1], actualChar2: c2, status: 'FAILED' }
          });
          break;
        }

        // Check if backward mapping exists
        if (map2[c2] !== undefined && map2[c2] !== c1) {
          isIso = false;
          m1[i] = { cls: 'bad active', tag: 'Conflict' };
          m2[i] = { cls: 'bad active', tag: 'Conflict' };
          steps.push({
            phase: 'Reverse Mapping Conflict in S2 ❌',
            desc: `Conflict at index ${i}: '${c2}' in s2 is ALREADY mapped from '${map2[c2]}', cannot also map from '${c1}' (two characters mapping to one). NOT Isomorphic!`,
            s1, s2,
            currIdx: i,
            map1: { ...map1 }, map2: { ...map2 },
            marks1: m1, marks2: m2,
            vars: { index: i, char2: c2, alreadyMappedFrom: map2[c2], incomingChar1: c1, status: 'FAILED' }
          });
          break;
        }

        const isNew = map1[c1] === undefined;
        map1[c1] = c2;
        map2[c2] = c1;

        steps.push({
          phase: isNew ? `Create Mapping: '${c1}' ⇄ '${c2}'` : `Confirm Consistent Mapping: '${c1}' ⇄ '${c2}'`,
          desc: isNew
            ? `Index ${i}: First time seeing '${c1}' and '${c2}'. Registering bijective rule: '${c1}' ⇄ '${c2}'.`
            : `Index ${i}: '${c1}' is already mapped to '${c2}'. Matches perfectly!`,
          s1, s2,
          currIdx: i,
          map1: { ...map1 }, map2: { ...map2 },
          marks1: m1, marks2: m2,
          vars: { index: i, rule: `'${c1}' ⇄ '${c2}'`, mappingStatus: isNew ? 'NEW RULE' : 'CONSISTENT' }
        });
      }

      if (isIso) {
        const finalM = {};
        for (let i = 0; i < n; i++) finalM[i] = { cls: 'good' };
        steps.push({
          phase: 'ISOMORPHIC STRINGS ✅',
          desc: `All characters satisfy a valid 1-to-1 bijective mapping! "${s1}" and "${s2}" are ISOMORPHIC.`,
          s1, s2,
          currIdx: n,
          map1: { ...map1 }, map2: { ...map2 },
          marks1: finalM, marks2: finalM,
          vars: { result: 'ISOMORPHIC ✅', timeComplexity: 'O(n)', spaceComplexity: 'O(1) (256 ASCII buckets)' }
        });
      }

      return steps;
    }

    function renderMappingCards(map1) {
      const entries = Object.entries(map1);
      if (entries.length === 0) return '<div style="color:var(--muted);font-size:12px;">No mapping rules established yet</div>';

      const items = entries.map(([k, v]) => `
        <div style="background:var(--panel-2);border:1px solid var(--border);border-radius:8px;padding:6px 12px;display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono';font-size:13px;">
          <span style="font-weight:800;color:var(--teal);">${k}</span>
          <span style="color:var(--yellow);font-weight:700;">⇄</span>
          <span style="font-weight:800;color:var(--blue);">${v}</span>
        </div>
      `).join('');

      return `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px;">${items}</div>`;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_ISOMORPHIC.id;

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;align-items:center;width:100%;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:12px;font-weight:700;color:var(--muted);width:55px;">S1:</span>
            <div class="boxes">${boxesHTML(s.s1.split(''), s.marks1)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:12px;font-weight:700;color:var(--muted);width:55px;">S2:</span>
            <div class="boxes">${boxesHTML(s.s2.split(''), s.marks2)}</div>
          </div>
          <div style="margin-top:6px;width:100%;text-align:center;">
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">Bijective 1-to-1 Mapping Table</div>
            ${renderMappingCards(s.map1)}
          </div>
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
      const s1 = $('#iso-s1').value || 'paper';
      const s2 = $('#iso-s2').value || 'title';

      buildSteps(s1, s2);
      $(`#player-mount-${TOPIC_ISOMORPHIC.id}`).innerHTML = '';
      $(`#desc-${TOPIC_ISOMORPHIC.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_ISOMORPHIC.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#iso-preset').addEventListener('change', e => {
      const [p1, p2] = e.target.value.split('|');
      $('#iso-s1').value = p1;
      $('#iso-s2').value = p2;
      rebuild();
    });

    $('#iso-apply').addEventListener('click', rebuild);
    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function areIsomorphic(s1, s2):
    if length(s1) != length(s2):
        return false
        
    map1 = array of 256 zeros (tracks s1[i] -> s2[i])
    map2 = array of 256 zeros (tracks s2[i] -> s1[i])
    
    for i from 0 to length(s1) - 1:
        c1 = s1[i], c2 = s2[i]
        
        // If already mapped to something else, conflict!
        if map1[c1] != 0 and map1[c1] != c2:
            return false
        if map2[c2] != 0 and map2[c2] != c1:
            return false
            
        map1[c1] = c2
        map2[c2] = c1
        
    return true`)}

      ${cppPanel(this.id,
`#include <string>
#include <vector>
#include <cstring>
using namespace std;

// 1. Two-Array Bijective Check (O(n) time, O(1) space - 256 ASCII chars)
bool areIsomorphic(string str1, string str2) {
    if (str1.length() != str2.length()) return false;
    
    int map1[256] = {0};
    int map2[256] = {0};
    
    for (int i = 0; i < (int)str1.length(); i++) {
        unsigned char c1 = str1[i];
        unsigned char c2 = str2[i];
        
        if (map1[c1] != 0 && map1[c1] != c2) return false;
        if (map2[c2] != 0 && map2[c2] != c1) return false;
        
        map1[c1] = c2;
        map2[c2] = c1;
    }
    return true;
}

// 2. Last-Seen Index Pattern (Alternative elegant single-loop approach)
bool isIsomorphicLastSeen(string s, string t) {
    if (s.length() != t.length()) return false;
    
    int lastSeenS[256] = {0};
    int lastSeenT[256] = {0};
    
    for (int i = 0; i < (int)s.length(); i++) {
        if (lastSeenS[(unsigned char)s[i]] != lastSeenT[(unsigned char)t[i]]) {
            return false;
        }
        // Store 1-based index (i + 1)
        lastSeenS[(unsigned char)s[i]] = i + 1;
        lastSeenT[(unsigned char)t[i]] = i + 1;
    }
    return true;
}`)}
      ${pythonPanel(this.id,
`# Isomorphic Strings — Two-dict bijective check O(n)
def are_isomorphic(s, t):
    if len(s) != len(t):
        return False
    map_st, map_ts = {}, {}
    for c1, c2 in zip(s, t):
        if c1 in map_st and map_st[c1] != c2:
            return False
        if c2 in map_ts and map_ts[c2] != c1:
            return False
        map_st[c1] = c2
        map_ts[c2] = c1
    return True

# Last-seen index approach
def are_isomorphic_idx(s, t):
    if len(s) != len(t):
        return False
    last_s, last_t = {}, {}
    for i, (c1, c2) in enumerate(zip(s, t)):
        if last_s.get(c1) != last_t.get(c2):
            return False
        last_s[c1] = i
        last_t[c2] = i
    return True`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Isomorphic Strings', slug: 'isomorphic-strings-1587115620', track: 'strings-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google', hint: 'Maintain two 256-size ASCII lookup arrays to enforce a strict bijective one-to-one character mapping in O(n) time and O(1) space.' },
        { lvl: 'medium', title: 'Choose and Swap (Lexicographically Smallest)', slug: 'choose-and-swap0531', track: 'strings-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: 'Find the first character that can be replaced everywhere with a smaller character appearing later.' },
        { lvl: 'easy', title: 'Word Pattern (Bijective String-Word Mapping)', slug: 'word-pattern', isBatch: false, company: 'Uber, Amazon, Microsoft', hint: 'Apply isomorphic bijective mapping between pattern characters and space-separated tokens.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
