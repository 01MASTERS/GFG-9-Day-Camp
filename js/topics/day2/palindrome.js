/* ============================================================
   DAY 2 — TOPIC 03: PALINDROME CHECK
   Visualizes Two-Pointer Palindrome Verification for Strings & Arrays
   ============================================================ */

const TOPIC_PALINDROME = {
  id: 'palindrome',
  num: '03',
  title: 'Palindrome Check — Two-Pointer Convergence',
  tag: 'Strings',
  intuition: 'A string is a palindrome if it reads the same forward and backward. Place two pointers (left at 0, right at n-1). If s[left] != s[right] at any step, fail immediately. If pointers meet without mismatch, the string is a palindrome.',
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
        <label>String</label>
        <input type="text" class="arr-input" id="pal-str" value="racecar" style="width:200px;">
        <label>Preset</label>
        <select id="pal-preset">
          <option value="racecar" selected>racecar (Valid)</option>
          <option value="rotator">rotator (Valid)</option>
          <option value="abccba">abccba (Even Length Valid)</option>
          <option value="geeksforgeeks">geeksforgeeks (Invalid)</option>
          <option value="malayalam">malayalam (Valid)</option>
          <option value="algorithm">algorithm (Invalid)</option>
        </select>
        <button class="primary" id="pal-apply">Apply</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(rawStr) {
      const s = rawStr.trim();
      const n = s.length;
      if (n === 0) {
        steps = [{ chars: [], phase: 'empty', desc: 'String is empty (Trivially palindrome)', marks: {}, vars: {} }];
        return steps;
      }

      const chars = s.split('');
      steps = [];

      steps.push({
        chars: [...chars],
        phase: 'Initialize',
        desc: `Checking if "${s}" of length ${n} is a palindrome. Left pointer at 0 ('${chars[0]}'), Right pointer at ${n - 1} ('${chars[n - 1]}').`,
        marks: {
          0: { cls: 'active', tag: 'L (0)' },
          [n - 1]: { cls: 'active', tag: `R (${n - 1})` }
        },
        vars: { left: 0, right: n - 1, length: n, isPalindrome: 'Checking...' }
      });

      let l = 0, r = n - 1;
      let isPal = true;
      const matched = {};

      while (l < r) {
        const compareMarks = { ...matched };
        compareMarks[l] = { cls: 'compare active', tag: 'L' };
        compareMarks[r] = { cls: 'compare active', tag: 'R' };

        steps.push({
          chars: [...chars],
          phase: 'Comparing',
          desc: `Compare char at index ${l} ('${chars[l]}') with char at index ${r} ('${chars[r]}').`,
          marks: { ...compareMarks },
          vars: { left: l, right: r, 's[L]': `'${chars[l]}'`, 's[R]': `'${chars[r]}'`, condition: `'${chars[l]}' === '${chars[r]}'` }
        });

        if (chars[l] !== chars[r]) {
          isPal = false;
          const failMarks = { ...matched };
          failMarks[l] = { cls: 'bad active', tag: '✗ Mismatch' };
          failMarks[r] = { cls: 'bad active', tag: '✗ Mismatch' };

          steps.push({
            chars: [...chars],
            phase: 'Mismatch Found ❌',
            desc: `MISMATCH! s[${l}] ('${chars[l]}') != s[${r}] ('${chars[r]}'). String is NOT a palindrome. Early exit.`,
            marks: { ...failMarks },
            vars: { left: l, right: r, status: 'FAILED', isPalindrome: 'false' }
          });
          break;
        }

        matched[l] = { cls: 'good', tag: '✓' };
        matched[r] = { cls: 'good', tag: '✓' };

        steps.push({
          chars: [...chars],
          phase: 'Match Found ✓',
          desc: `Match! s[${l}] == s[${r}] ('${chars[l]}'). Advance left++, right--.`,
          marks: { ...matched },
          vars: { left: l + 1, right: r - 1, matchedChars: `'${chars[l]}'` }
        });

        l++;
        r--;
      }

      if (isPal) {
        if (l === r) {
          matched[l] = { cls: 'good active', tag: 'Center' };
        }
        steps.push({
          chars: [...chars],
          phase: 'Verified Palindrome ✅',
          desc: `Pointers met or crossed with zero mismatches! "${s}" is a VALID PALINDROME.`,
          marks: { ...matched },
          vars: { result: 'PALINDROME ✅', timeComplexity: 'O(n/2) ≈ O(n)', spaceComplexity: 'O(1)' }
        });
      }

      return steps;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_PALINDROME.id;

      stage.innerHTML = `
        <div class="boxes">${boxesHTML(s.chars, s.marks)}</div>
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
      const str = $('#pal-str').value || 'racecar';
      buildSteps(str);
      $(`#player-mount-${TOPIC_PALINDROME.id}`).innerHTML = '';
      $(`#desc-${TOPIC_PALINDROME.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_PALINDROME.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#pal-preset').addEventListener('change', e => {
      $('#pal-str').value = e.target.value;
      rebuild();
    });

    $('#pal-apply').addEventListener('click', rebuild);
    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function isPalindrome(s):
    left = 0, right = length(s) - 1
    while left < right:
        if s[left] != s[right]:
            return false // Early exit on first mismatch
        left = left + 1
        right = right - 1
    return true

// Alphanumeric case-insensitive variant:
function isPalindromeSentence(s):
    left = 0, right = length(s) - 1
    while left < right:
        while left < right and not isAlphaNum(s[left]): left++
        while left < right and not isAlphaNum(s[right]): right--
        if toLower(s[left]) != toLower(s[right]): return false
        left++, right--
    return true`)}

      ${cppPanel(this.id,
`#include <string>
#include <vector>
#include <cctype>
#include <algorithm>
using namespace std;

// 1. Standard Palindrome String Check (O(n) time, O(1) space)
bool isPalindrome(string s) {
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// 2. Minimum Characters to Add at Front to Make String Palindrome (LPS / KMP)
int minCharAddedAtFront(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    string concat = s + "$" + rev;
    int n = concat.size();
    vector<int> lps(n, 0);
    for (int i = 1; i < n; i++) {
        int len = lps[i - 1];
        while (len > 0 && concat[i] != concat[len]) {
            len = lps[len - 1];
        }
        if (concat[i] == concat[len]) len++;
        lps[i] = len;
    }
    return (int)s.size() - lps.back();
}

// 3. Check Palindrome After Removing at Most One Character
bool validPalindromeII(string s) {
    auto check = [&](int l, int r) {
        while (l < r) {
            if (s[l] != s[r]) return false;
            l++; r--;
        }
        return true;
    };
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l] != s[r]) {
            return check(l + 1, r) || check(l, r - 1);
        }
        l++; r--;
    }
    return true;
}`)}
      ${pythonPanel(this.id,
`# Palindrome String Check — O(n) time, O(1) space
def is_palindrome(s):
    return s == s[::-1]

# Two-pointer approach
def is_palindrome_two_ptr(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Valid Palindrome (alphanumeric only, case-insensitive)
def is_valid_palindrome(s):
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Palindrome String', slug: 'palindrome-string0817', track: 'strings-fundamental-siddhartha', isBatch: true, company: 'Amazon, Cisco, Paytm', hint: 'Two-pointer inward scan checking s[i] == s[n-1-i] in O(n) time and O(1) space.' },
        { lvl: 'hard', title: 'Minimum Characters to be Added at Front for Palindrome', slug: 'minimum-characters-to-be-added-at-front-to-make-string-palindrome', track: 'strings-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google', hint: 'Construct (s + "$" + rev(s)) and compute KMP LPS array. Answer is len(s) - lps.back().' },
        { lvl: 'easy', title: 'Sentence Palindrome (Valid Palindrome)', slug: 'sentence-palindrome-prime5410', isBatch: false, company: 'Facebook, Microsoft, Uber', hint: 'Skip non-alphanumeric characters with two pointers and compare case-insensitively.' },
        { lvl: 'medium', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', isBatch: false, company: 'Amazon, Microsoft, Samsung', hint: 'Expand around center for both odd and even length centers in O(n²) time.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
