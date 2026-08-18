/* ---------- 2. TYPES OF ERRORS IN C++ & CP ---------- */
const TOPIC_ERRORS = {
  id: 'errors',
  num: '02',
  title: 'Types of Errors in C++ & Online Judges (CP)',
  tag: 'Debugging & Foundations',
  intuition: 'In C++ and competitive programming / online judges (GFG, LeetCode, Codeforces), errors fall into 5 distinct categories: Compilation Errors (CE), Runtime Errors (SIGSEGV/SIGFPE/RE), Time Limit Exceeded (TLE), Memory Limit Exceeded (MLE), and Wrong Answer (WA). Select an error below to simulate the bug, inspect the judge terminal output, and see the standard fix.',
  time: 'Diagnosis: Instant',
  space: 'Fix: Best Practice',
  mount(root) {
    const errorList = [
      {
        id: 'sigsegv',
        category: 're',
        tagText: 'SIGSEGV (Signal 11)',
        badgeClass: 'err-tag-re',
        title: 'Segmentation Fault (Out of Bounds)',
        shortDesc: 'Accessing array/vector indices outside valid bounds or dereferencing null pointers.',
        signal: 'SIGSEGV — Invalid Memory Access / Core Dumped',
        cause: 'Accessing index >= size in a 0-indexed container (e.g., arr[n] when size is n), or dereferencing a dangling / nullptr.',
        rule: 'In 0-indexed arrays of size N, the only valid indices are 0 to N-1. Use i < n, never i <= n.',
        buggyCode: `// BUG: Array has 5 elements (valid indices 0..4)
// Loop condition i <= arr.size() attempts to access arr[5]!
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};
    for (int i = 0; i <= arr.size(); i++) { // <= is OUT OF BOUNDS!
        cout << arr[i] << " ";               // Crashes with SIGSEGV at i = 5
    }
    return 0;
}`,
        fixedCode: `// FIX: Use strict inequality (i < arr.size()) or range-based for loop
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};
    for (int i = 0; i < arr.size(); i++) { // Correct: bounds 0..4
        cout << arr[i] << " ";
    }
    // Modern C++ alternative: for (int x : arr) cout << x << " ";
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Runtime Error (SIGSEGV)
Signal: 11 (Segmentation fault)
Address: 0x7fff5fbff840 out of bounds [0..4]
Culprit: Line 9 — arr[5] attempted access on vector of size 5`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: 10 20 30 40 50 
CPU Time: 0.002s  |  Memory: 14.1 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'overflow',
        category: 'wa',
        tagText: 'Integer Overflow (WA)',
        badgeClass: 'err-tag-wa',
        title: '32-Bit Integer Overflow (Silent WA)',
        shortDesc: 'Multiplying two 32-bit ints exceeds 2.14×10⁹, silently producing negative garbage numbers.',
        signal: 'Silent 32-bit wrap-around (No Crash, just Wrong Answer)',
        cause: 'In C++, arithmetic expression type is determined by operands (int * int = int). If the result exceeds 2³¹ - 1 (2,147,483,647), it overflows BEFORE being saved into a long long!',
        rule: 'Always cast to 64-bit using 1LL * a * b or declare variables as long long from the start.',
        buggyCode: `// BUG: a * b is evaluated as 32-bit int BEFORE assigning to prod!
#include <iostream>
using namespace std;

int main() {
    int a = 100000;
    int b = 100000;
    long long prod = a * b; // 10^10 overflows 32-bit int -> -1486618624!
    cout << "Product: " << prod << endl;
    return 0;
}`,
        fixedCode: `// FIX: Multiply by 1LL (long long 1) to promote evaluation to 64-bit
#include <iostream>
using namespace std;

int main() {
    int a = 100000;
    int b = 100000;
    long long prod = 1LL * a * b; // Evaluated directly in 64-bit: 10^10
    cout << "Product: " << prod << endl;
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Verdict: WRONG ANSWER ❌ (Test case 4/50 failed)
Input: a = 100000, b = 100000
Your Output: Product: -1486618624
Expected Output: Product: 10000000000
Hint: 32-bit signed int limit is ~2.14×10^9`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: Product: 10000000000
CPU Time: 0.001s  |  Memory: 13.8 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'sigfpe',
        category: 're',
        tagText: 'SIGFPE (Div by Zero)',
        badgeClass: 'err-tag-re',
        title: 'Floating Point Exception (Division / Modulo by 0)',
        shortDesc: 'Dividing or taking remainder by zero (a / 0 or a % 0), often on empty arrays.',
        signal: 'SIGFPE (Signal 8) - Erroneous Arithmetic Operation',
        cause: 'Dividing by zero or modulo by zero (often when arr.size() is 0 or variable is uninitialized).',
        rule: 'Always guard division and modulo operations: if (divisor == 0) return 0;',
        buggyCode: `// BUG: If arr is empty (size = 0), division by zero triggers SIGFPE!
#include <iostream>
#include <vector>
using namespace std;

int average(const vector<int>& arr) {
    int sum = 0;
    for (int x : arr) sum += x;
    return sum / arr.size(); // SIGFPE if arr is empty (arr.size() == 0)!
}

int main() {
    vector<int> emptyArr;
    cout << average(emptyArr);
    return 0;
}`,
        fixedCode: `// FIX: Add early return guard for empty collection
#include <iostream>
#include <vector>
using namespace std;

int average(const vector<int>& arr) {
    if (arr.empty()) return 0; // Guard clause prevents division by zero
    int sum = 0;
    for (int x : arr) sum += x;
    return sum / arr.size();
}

int main() {
    vector<int> emptyArr;
    cout << average(emptyArr);
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Runtime Error (SIGFPE)
Signal: 8 (Floating point exception)
Culprit: Integer division by zero at Line 9
Stack Trace: average(std::vector<int> const&) at line 9`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: 0
CPU Time: 0.001s  |  Memory: 14.0 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'tle',
        category: 'tle',
        tagText: 'TLE (> 1.0s)',
        badgeClass: 'err-tag-tle',
        title: 'Time Limit Exceeded (Infinite Loop / Slow I/O)',
        shortDesc: 'Loop counter never incremented, or slow C++ I/O with endl on 10⁵ lines.',
        signal: 'Process terminated after exceeding 1.00s CPU limit',
        cause: 'Missing loop increment (infinite loop), using endl instead of \'\\n\', or using O(N²) on N = 10⁵.',
        rule: 'In C++, add ios::sync_with_stdio(0); cin.tie(0); and use \'\\n\'. Always check while loop increments.',
        buggyCode: `// BUG 1: Forgetting i++ in while loop -> Infinite Loop!
// BUG 2: Using std::endl flushes buffer on every iteration (100x slower)
#include <iostream>
using namespace std;

int main() {
    int n = 100000;
    int i = 0;
    while (i < n) {
        cout << i << endl; // Freezes judge or takes 15 seconds!
        // Missing: i++;
    }
    return 0;
}`,
        fixedCode: `// FIX: Guaranteed loop increment + Fast C++ I/O setup
#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false); // Disable sync with C stdio
    cin.tie(nullptr);            // Untie cin from cout

    int n = 100000;
    for (int i = 0; i < n; i++) {
        cout << i << '\n';       // Use '\n' instead of endl
    }
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Time Limit Exceeded (TLE)
CPU Time: > 1.005s (Time limit: 1.000s)
Verdict: Execution timed out. Program did not terminate.
Hint: Check for infinite while loops or slow I/O.`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: [100,000 lines generated]
CPU Time: 0.038s  |  Memory: 14.5 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'mle',
        category: 'mle',
        tagText: 'MLE / Stack Overflow',
        badgeClass: 'err-tag-mle',
        title: 'Memory Limit / Infinite Recursion',
        shortDesc: 'Unbounded recursion blowing the 8MB call stack or allocating vector of 10⁹ elements.',
        signal: 'Stack Overflow (SIGSEGV) / std::bad_alloc',
        cause: 'Missing base case in recursion causes call stack to exceed the 8MB OS stack limit, or dynamic array allocation exceeds 256MB judge limit.',
        rule: 'Every recursive function MUST have a terminating base condition before making recursive calls.',
        buggyCode: `// BUG: Missing base condition (if n <= 1 return 1)
// Causes infinite recursion until stack memory is exhausted!
#include <iostream>
using namespace std;

long long fact(int n) {
    // Missing: if (n <= 1) return 1;
    return n * fact(n - 1); // Infinite recursive calls!
}

int main() {
    cout << fact(5);
    return 0;
}`,
        fixedCode: `// FIX: Always define base condition as the first statement
#include <iostream>
using namespace std;

long long fact(int n) {
    if (n <= 1) return 1;   // Base case prevents infinite recursion
    return n * fact(n - 1);
}

int main() {
    cout << fact(5); // Correct: 120
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Runtime Error (SIGSEGV - Stack Overflow)
Signal: 11 (Segmentation fault)
Call Stack Depth: > 260,000 frames (8 MB Stack Exhausted)
Culprit: fact(int) called recursively without termination`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: 120
CPU Time: 0.001s  |  Memory: 13.9 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'uninit',
        category: 'wa',
        tagText: 'Uninitialized Var',
        badgeClass: 'err-tag-wa',
        title: 'Uninitialized Variables (Garbage Memory)',
        shortDesc: 'Local variables in C++ are not zeroed by default; they contain random memory garbage.',
        signal: 'Undefined Behavior (Silent Flaky Wrong Answer)',
        cause: 'In C++, local stack variables like `int total;` hold whatever dirty bits happened to exist at that memory address.',
        rule: 'Always explicitly initialize accumulators and pointers: int sum = 0, count = 0, minVal = INT_MAX.',
        buggyCode: `// BUG: 'total' is not initialized! Holds garbage value (e.g. 32767)
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    int total; // GARBAGE VALUE!
    for (int x : arr) {
        total += x;
    }
    cout << "Sum: " << total << endl; // Output: Sum: 32782 (Wrong!)
    return 0;
}`,
        fixedCode: `// FIX: Explicitly initialize total to 0
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    int total = 0; // Explicitly initialized to 0
    for (int x : arr) {
        total += x;
    }
    cout << "Sum: " << total << endl; // Output: Sum: 15 (Correct!)
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
Verdict: WRONG ANSWER ❌
Input: [1, 2, 3, 4, 5]
Your Output: Sum: 32782
Expected Output: Sum: 15
Culprit: 'total' used uninitialized on Line 8`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: Sum: 15
CPU Time: 0.001s  |  Memory: 14.0 MB
Status: 100% Test Cases Passed`
      },
      {
        id: 'ce',
        category: 'ce',
        tagText: 'Compilation Error',
        badgeClass: 'err-tag-ce',
        title: 'Compilation Error (Missing Headers & Syntax)',
        shortDesc: 'Missing #include <algorithm>, missing semicolons, or type mismatches.',
        signal: 'G++ / Clang build error',
        cause: 'Using library functions without including their header file (e.g. `sort` requires `<algorithm>`, `INT_MAX` requires `<climits>`).',
        rule: 'In CP, use #include <bits/stdc++.h> or explicitly include <algorithm>, <vector>, <cmath>, <climits>, <string>.',
        buggyCode: `// BUG: 'sort' used without #include <algorithm>, missing semicolon
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> arr = {5, 2, 8, 1};
    sort(arr.begin(), arr.end()) // Missing header & semicolon!
    for (int x : arr) cout << x << " ";
    return 0;
}`,
        fixedCode: `// FIX: Add #include <algorithm> and semicolon
#include <iostream>
#include <vector>
#include <algorithm> // Required for std::sort
using namespace std;

int main() {
    vector<int> arr = {5, 2, 8, 1};
    sort(arr.begin(), arr.end()); // Semicolon added
    for (int x : arr) cout << x << " ";
    return 0;
}`,
        buggyOutput: `[Judge Execution Terminal]
COMPILATION ERROR (CE)
main.cpp:8:5: error: 'sort' was not declared in this scope; did you mean 'std::sort'?
    sort(arr.begin(), arr.end())
    ^~~~
main.cpp:9:5: error: expected ';' before 'for'
    for (int x : arr)`,
        fixedOutput: `[Judge Execution Terminal]
Verdict: ACCEPTED 🟢
Output: 1 2 5 8 
CPU Time: 0.002s  |  Memory: 14.1 MB
Status: 100% Test Cases Passed`
      }
    ];

    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <div class="err-filter-bar" id="err-filter-bar">
          <button class="err-filter-btn active" data-cat="all">All Errors (7)</button>
          <button class="err-filter-btn" data-cat="re">💥 Runtime (SIGSEGV / SIGFPE)</button>
          <button class="err-filter-btn" data-cat="wa">❌ Wrong Answer (Overflow / Garbage)</button>
          <button class="err-filter-btn" data-cat="tle">⏱️ Time Limit (TLE)</button>
          <button class="err-filter-btn" data-cat="mle">🧠 Memory Limit (MLE)</button>
          <button class="err-filter-btn" data-cat="ce">⚠️ Compilation (CE)</button>
        </div>
      `
    });

    const stage = $(`#stage-${this.id}`);
    $(`#vars-${this.id}`).remove();

    let currentCat = 'all';
    let selectedErr = errorList[0];
    let terminalState = 'buggy'; // 'buggy' | 'fixed'

    function renderErrorLab() {
      const filtered = currentCat === 'all' ? errorList : errorList.filter(e => e.category === currentCat);

      const cardsHTML = `
        <div class="err-selector-grid" id="err-selector-grid">
          ${filtered.map(err => {
            const isSelected = err.id === selectedErr.id;
            return `
              <div class="err-card ${isSelected ? 'active' : ''}" data-id="${err.id}">
                <div class="err-card-header">
                  <span class="err-tag-badge ${err.badgeClass}">${err.tagText}</span>
                </div>
                <div class="err-card-title">${err.title}</div>
                <div class="err-card-desc">${err.shortDesc}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      const detailHTML = `
        <div class="err-detail-box">
          <div class="err-head">
            <div class="err-title">
              <span class="err-tag-badge ${selectedErr.badgeClass}">${selectedErr.tagText}</span>
              <span>${selectedErr.title}</span>
            </div>
            <span style="font-family:'JetBrains Mono';font-size:12px;color:var(--muted);">${selectedErr.signal}</span>
          </div>

          <div style="background:var(--stage);border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:13px;line-height:1.5;">
            <b>Why this occurs:</b> ${selectedErr.cause}<br>
            <b style="color:var(--yellow);margin-top:4px;display:inline-block;">Golden Fix Rule:</b> ${selectedErr.rule}
          </div>

          <div class="err-actions">
            <button class="err-btn-sim" id="btn-run-buggy">▶ Simulate Buggy Submission</button>
            <button class="err-btn-fix" id="btn-run-fixed">✅ Test Corrected Fix</button>
          </div>

          <div class="err-terminal">
            <div class="err-terminal-header">
              <div class="err-terminal-dots">
                <span class="err-dot red"></span>
                <span class="err-dot yellow"></span>
                <span class="err-dot green"></span>
              </div>
              <span style="color:var(--muted);font-size:11px;">Judge Output Console · ${terminalState === 'buggy' ? 'BUGGY RUN' : 'VERIFIED FIX'}</span>
            </div>
            <div class="err-terminal-body">${terminalState === 'buggy' ? selectedErr.buggyOutput : selectedErr.fixedOutput}</div>
          </div>

          <div class="err-code-split">
            <div class="code-wrap">
              <div class="code-header" style="background:#2a1418;border-color:#5c1d24;">
                <span class="code-lang-tag" style="color:#ff7b72;">❌ Buggy Code (Triggering Error)</span>
              </div>
              <pre class="vscode-theme"><code>${highlightCpp(selectedErr.buggyCode)}</code></pre>
            </div>
            <div class="code-wrap">
              <div class="code-header" style="background:#13261f;border-color:#1b4737;">
                <span class="code-lang-tag" style="color:#7ee787;">✅ Corrected Solution (Accepted)</span>
              </div>
              <pre class="vscode-theme"><code>${highlightCpp(selectedErr.fixedCode)}</code></pre>
            </div>
          </div>
        </div>
      `;

      stage.innerHTML = cardsHTML + detailHTML;

      // Wire card selection
      $$('.err-card', stage).forEach(card => {
        card.addEventListener('click', () => {
          const found = errorList.find(e => e.id === card.dataset.id);
          if (found) {
            selectedErr = found;
            terminalState = 'buggy';
            renderErrorLab();
          }
        });
      });

      // Wire terminal simulate buttons
      const btnBuggy = $('#btn-run-buggy');
      const btnFixed = $('#btn-run-fixed');
      if (btnBuggy) {
        btnBuggy.addEventListener('click', () => {
          terminalState = 'buggy';
          renderErrorLab();
        });
      }
      if (btnFixed) {
        btnFixed.addEventListener('click', () => {
          terminalState = 'fixed';
          renderErrorLab();
        });
      }
    }

    renderErrorLab();

    // Wire Filter Buttons
    $$('.err-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.err-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.cat;
        // If current selection is not in filtered list, select first available
        const filtered = currentCat === 'all' ? errorList : errorList.filter(e => e.category === currentCat);
        if (!filtered.some(e => e.id === selectedErr.id)) {
          selectedErr = filtered[0] || errorList[0];
        }
        renderErrorLab();
      });
    });

    $(`#desc-${this.id}`).style.display = 'block';
    $(`#desc-${this.id}`).innerHTML = '<b>Judge Tip:</b> In competitive programming, over 80% of penalty points come from 32-bit Integer Overflow, Out-of-Bounds SIGSEGV, and slow I/O TLE. Master the golden fix rules above!';

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      <div class="tab-panel active" id="panel-${this.id}-verdicts">
        <div style="font-size:13.5px;color:var(--muted);margin-bottom:14px;line-height:1.5;">
          Online judges (GFG, LeetCode, Codeforces) report specific verdict codes. Here is the official translation matrix:
        </div>
        <table class="tc-cheat-table">
          <thead>
            <tr>
              <th>Verdict Code</th>
              <th>Full Meaning</th>
              <th>Common Culprit</th>
              <th>Instant Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span style="color:#7ee787;font-weight:700;">AC</span></td>
              <td>Accepted</td>
              <td>Code passed all private test cases within time & memory limits</td>
              <td>Success! Move to next problem.</td>
            </tr>
            <tr>
              <td><span style="color:#ff7b72;font-weight:700;">WA</span></td>
              <td>Wrong Answer</td>
              <td>Integer overflow, missing edge case (n=0,1), wrong logic</td>
              <td>Use <code>long long</code>, test negative/boundary inputs.</td>
            </tr>
            <tr>
              <td><span style="color:#c792ea;font-weight:700;">TLE</span></td>
              <td>Time Limit Exceeded</td>
              <td>Infinite loop, O(N²) on N=10⁵, slow <code>std::endl</code></td>
              <td>Optimize Big-O, add fast I/O, replace <code>endl</code> with <code>'\\n'</code>.</td>
            </tr>
            <tr>
              <td><span style="color:#ff7b72;font-weight:700;">SIGSEGV</span></td>
              <td>Segmentation Fault</td>
              <td><code>arr[n]</code> out of bounds, null pointer, stack overflow</td>
              <td>Verify <code>i < n</code>, check recursive base cases.</td>
            </tr>
            <tr>
              <td><span style="color:#ff7b72;font-weight:700;">SIGFPE</span></td>
              <td>Floating Point Exception</td>
              <td>Division by zero (<code>a / 0</code>) or modulo zero (<code>a % 0</code>)</td>
              <td>Add <code>if (divisor == 0) return 0;</code> guard.</td>
            </tr>
            <tr>
              <td><span style="color:#6ea8fe;font-weight:700;">MLE</span></td>
              <td>Memory Limit Exceeded</td>
              <td>Allocating dynamic structures beyond 256MB (e.g. <code>vector(1e8)</code>)</td>
              <td>Reuse memory, avoid deep recursive call frames.</td>
            </tr>
            <tr>
              <td><span style="color:#ffd166;font-weight:700;">CE</span></td>
              <td>Compilation Error</td>
              <td>Missing header, typo, missing semicolon</td>
              <td>Include <code>&lt;algorithm&gt;</code>, <code>&lt;climits&gt;</code>, <code>&lt;vector&gt;</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tab-panel" id="panel-${this.id}-checklist">
        <div style="font-size:13.5px;color:var(--chalk);line-height:1.8;">
          <h3 style="margin-top:0;">10 Golden Rules for Bug-Free C++ in CP & Interviews</h3>
          <ol style="padding-left:20px;color:var(--muted);">
            <li><b style="color:var(--chalk);">Fast I/O:</b> Always include <code>ios::sync_with_stdio(0); cin.tie(0);</code> at top of <code>main()</code>.</li>
            <li><b style="color:var(--chalk);">No endl:</b> Use <code>'\\n'</code> instead of <code>std::endl</code> to prevent unneeded buffer flushes.</li>
            <li><b style="color:var(--chalk);">Prevent Overflow:</b> When multiplying numbers that can exceed $2 \times 10^9$, use <code>1LL * a * b</code> or <code>long long</code>.</li>
            <li><b style="color:var(--chalk);">0-Indexed Bounds:</b> For size $N$, valid loop is <code>for (int i = 0; i < n; i++)</code>. Never <code><= n</code>.</li>
            <li><b style="color:var(--chalk);">Initialize Accumulators:</b> Local variables hold random garbage memory. Always set <code>int sum = 0, count = 0;</code>.</li>
            <li><b style="color:var(--chalk);">Guard Divisors:</b> Before executing <code>/ d</code> or <code>% d</code>, ensure <code>d != 0</code>.</li>
            <li><b style="color:var(--chalk);">Base Cases First:</b> In recursion, always write the base condition on line 1 of the function.</li>
            <li><b style="color:var(--chalk);">Floating Point Equality:</b> Never use <code>if (a == b)</code> for floats; use <code>if (abs(a - b) < 1e-9)</code>.</li>
            <li><b style="color:var(--chalk);">Check Constraint Scale:</b> Read $N$ in the problem description to pick the right Big-O before coding.</li>
            <li><b style="color:var(--chalk);">Test Extreme Cases:</b> Test $N = 0$, $N = 1$, all negative, all identical, already sorted.</li>
          </ol>
        </div>
      </div>

      ${practicePanel(this.id, [
        { lvl: 'basic', title: 'Find Syntax, Logical & Compiler Errors in C++', slug: 'common-errors-in-c', isBatch: true, company: 'TCS, Infosys, Wipro', hint: 'Identify compilation vs runtime vs silent logic errors.' },
        { lvl: 'easy', title: 'Debugging 32-Bit Integer Overflow & SIGSEGV in Judges', slug: 'runtime-error-in-c', isBatch: true, company: 'Amazon, Adobe, Samsung', hint: 'Prevent out-of-bounds pointer crashes and negative arithmetic wrap-around.' },
        { lvl: 'medium', title: 'Competitive Programming Debugging & Fast I/O Template', slug: 'fast-io-in-c', isBatch: false, company: 'Google, Microsoft, Uber', hint: 'Master ios::sync_with_stdio(0); cin.tie(0); and memory sanitizers.' }
      ])}
    `);

    // Setup tab buttons
    const tabsRoot = $(`#tabs-${this.id}`);
    if (tabsRoot) {
      tabsRoot.innerHTML = `
        <button class="tab-btn active" data-tab="verdicts">Judge Verdicts Matrix</button>
        <button class="tab-btn" data-tab="checklist">10 Golden Debugging Rules</button>
        <button class="tab-btn" data-tab="practice">Practice & Quizzes</button>
      `;
    }

    wireTabs(this.id);
  }
};
