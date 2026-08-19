/* ---------- 1. TIME COMPLEXITY ---------- */
const TOPIC_COMPLEXITY = {
  id: 'complexity',
  num: '01',
  title: 'Time Complexity — Growth Rates & Big-O Standards',
  tag: 'Foundations',
  intuition: 'Time complexity measures how operation counts grow as input size N scales toward infinity. In DSA and coding interviews, standard judges execute ~10⁸ basic C++ operations per second. Toggle between "Same n" (to witness exponential explosion) and "Practical n" (to see realistic problem bounds).',
  time: 'Standard TC: O(1) → O(N!)',
  space: 'CPU Budget: ~10⁸ ops/sec',
  mount(root) {
    let currentMode = 'same'; // 'same' | 'practical'
    let currentSameN = 1000000;
    let selectedKey = 'O(n)';

    const presetsSame = [
      { label: 'n = 10', val: 10, desc: 'Tiny (Factorial & 2ⁿ still run fast)' },
      { label: 'n = 20', val: 20, desc: '2²⁰ ≈ 1M ops, but 20! explodes to 10¹⁸' },
      { label: 'n = 50', val: 50, desc: '2⁵⁰ takes 130 days; 50! takes 10⁵⁶ yrs' },
      { label: 'n = 100', val: 100, desc: 'Polynomial is fast; 2¹⁰⁰ > all atoms in universe' },
      { label: 'n = 1,000', val: 1000, desc: '1K (Quadratic limit ~10⁶ ops)' },
      { label: 'n = 10⁵', val: 100000, desc: '100K (Standard array bound)' },
      { label: 'n = 10⁶', val: 1000000, desc: '1M (N log N bound)' },
      { label: 'n = 10⁸', val: 100000000, desc: '100M (1-Second CPU Barrier)' }
    ];

    const practicalNMap = {
      'O(1)': 1000000,
      'O(log n)': 1000000,
      'O(n)': 1000000,
      'O(n log n)': 1000000,
      'O(n²)': 1000000,
      'O(2ⁿ)': 36,
      'O(n!)': 14
    };

    const complexities = [
      {
        key: 'O(1)',
        name: 'Constant Time',
        color: 'var(--teal)',
        tag: '⚡ Instant (Optimal)',
        safeLimit: 'Unlimited (N → ∞)',
        metaphor: 'Looking up a word in a dictionary when you already have the exact page bookmark (or checking your own name on an ID card).',
        meaning: 'Execution time remains completely constant regardless of input size N. Running on 10 items or 10 billion items takes the exact same number of machine steps.',
        rule: 'N doubles (2×) → Execution time remains 1× (Unchanged).',
        code: `// Array direct index access & primitive math formulas
int getFirst(const vector<int>& arr) {
    return arr.empty() ? -1 : arr[0]; // O(1)
}

int mathSum(int n) {
    return (n * (n + 1)) / 2;         // O(1)
}`,
        algos: 'Array indexing (arr[i]), Hash Map lookup/insert (average), Stack push/pop, Math formulas.'
      },
      {
        key: 'O(log n)',
        name: 'Logarithmic Time',
        color: 'var(--blue)',
        tag: '⚡ Ultra Fast',
        safeLimit: 'N ≤ 10¹⁸ (64-bit integer limit)',
        metaphor: 'Opening a 1,000,000-page dictionary right in the middle, discarding the half that doesn\'t contain your word, and repeating.',
        meaning: 'Problem size is divided (usually halved) at every step. Even for N = 1,000,000,000 (1 billion items), log₂(10⁹) takes only ~30 comparison steps!',
        rule: 'N doubles (2×) → Operations only increase by +1 step.',
        code: `// Binary search: halving search space every step
int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        algos: 'Binary Search, Euclidean GCD Algorithm, Balanced BST Search (AVL / Red-Black), Fast Exponentiation.'
      },
      {
        key: 'O(n)',
        name: 'Linear Time',
        color: 'var(--yellow)',
        tag: '🟢 Standard / Blazing',
        safeLimit: 'N ≤ 10⁸ (100 Million for 1.0s)',
        metaphor: 'Reading an N-page book page-by-page from front to back, or scanning an unsorted grocery list for milk.',
        meaning: 'The number of operations scales in exact 1:1 direct proportion with input size N. Every element in the input is visited or processed a constant number of times.',
        rule: 'N doubles (2×) → Execution time doubles (2×). N increases 10× → Time increases 10×.',
        code: `// Single loop scanning every element once
int findMax(const vector<int>& arr) {
    int maxVal = arr[0];
    for (int i = 1; i < arr.size(); i++) { // Runs N times
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
        algos: 'Linear Search, Kadane\'s Algorithm (Max Subarray), Prefix Sum array build, Two Pointers scan, Counting frequencies.'
      },
      {
        key: 'O(n log n)',
        name: 'Linearithmic Time',
        color: 'var(--purple)',
        tag: '🟢 Fast (Sorting Limit)',
        safeLimit: 'N ≤ 10⁶ (1 Million for 1.0s)',
        metaphor: 'Sorting a pile of exam papers by repeatedly splitting them into halves, sorting each half, and merging them back together.',
        meaning: 'The theoretical fastest time complexity for comparison-based sorting. Combining a divide-and-conquer tree (log N depth) with linear scanning (N work per level).',
        rule: 'N doubles (2×) → Execution time increases slightly more than 2× (approx 2.1×).',
        code: `// Efficient sorting (MergeSort / QuickSort / std::sort)
void sortArray(vector<int>& arr) {
    std::sort(arr.begin(), arr.end()); // O(N log N)
}`,
        algos: 'Merge Sort, Quick Sort, Heap Sort, std::sort (IntroSort), Segment Tree queries/updates, Convex Hull.'
      },
      {
        key: 'O(n²)',
        name: 'Quadratic Time',
        color: 'var(--coral)',
        tag: '🟡 Slow / Nested Loops',
        safeLimit: 'N ≤ 5,000 (Above this risks TLE)',
        metaphor: 'Comparing every student in a classroom with every other student to see if any two share the exact same birthday.',
        meaning: 'Operations scale with the square of the input size. For N = 5,000, operations are 2.5×10⁷ (~0.25s). But for N = 1,000,000, operations reach 10¹² (1 Trillion ops → 2.78 hours → Severe TLE!).',
        rule: 'N doubles (2×) → Execution time quadruples (4×). N increases 10× → Time increases 100× (10²×).',
        code: `// Nested loops comparing all pairs (i, j)
bool hasDuplicatePairs(const vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) { // Nested loop
            if (arr[i] == arr[j]) return true;
        }
    }
    return false;
}`,
        algos: 'Bubble Sort, Selection Sort, Insertion Sort, Checking all pairs in an array, 2D Grid Dynamic Programming.'
      },
      {
        key: 'O(2ⁿ)',
        name: 'Exponential Time',
        color: '#ff4d94',
        tag: '🔴 Impractical / Brute Force',
        safeLimit: 'N ≤ 20 – 25 (Exceeds seconds past 30)',
        metaphor: 'Trying every combination on an N-digit PIN code, where each added digit doubles the total possible combinations.',
        meaning: 'Operations double with each single addition to input size N. For N = 36, 2³⁶ ≈ 6.87×10¹⁰ ops (~11.5 mins). For N = 1,000,000, 2¹⁰⁰⁰⁰⁰⁰ has over 300,000 digits — astronomically larger than the total atoms in the observable universe (10⁸⁰)!',
        rule: 'N increases by +1 → Execution time doubles (2×). N increases by +10 → Time increases 1024×.',
        code: `// Naive recursive Fibonacci / Generating all subsets
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2); // 2 recursive calls per step
}`,
        algos: 'Generating all 2ⁿ subsets, Naive recursive Fibonacci, 0/1 Knapsack brute force, Traveling Salesperson recursion.'
      },
      {
        key: 'O(n!)',
        name: 'Factorial Time',
        color: '#ff2a55',
        tag: '⛔ Extreme / Permutations',
        safeLimit: 'N ≤ 10 – 11 (Exceeds seconds past 12)',
        metaphor: 'Finding the shortest route connecting N cities by calculating the total distance of every single possible visit order.',
        meaning: 'Operations scale by multiplying every integer up to N. 10! = 3.6M ops (0.04s). 14! = 8.7×10¹⁰ ops (~14.5 mins). For N = 1,000,000, 1,000,000! has over 5.5 million digits — taking vastly longer than the age of the entire universe.',
        rule: 'N increases by +1 → Execution time multiplies by N.',
        code: `// Generating all N! permutations
void permute(vector<int>& arr, int l, int r) {
    if (l == r) return;
    for (int i = l; i <= r; i++) {
        swap(arr[l], arr[i]);
        permute(arr, l + 1, r);
        swap(arr[l], arr[i]);
    }
}`,
        algos: 'Generating all Permutations (std::next_permutation brute force), Traveling Salesperson Problem (Brute Force).'
      }
    ];

    // Mathematical Operations Calculator for arbitrary N without overflow
    function computeMetrics(key, n) {
      n = Math.max(1, Math.round(n));

      if (key === 'O(1)') {
        return {
          n,
          log10Ops: 0,
          opsFormatted: '1 op',
          timeFormatted: '< 0.001 ms',
          verdictClass: 'verdict-instant',
          verdictLabel: '⚡ Instant',
          barPct: 2
        };
      }

      if (key === 'O(log n)') {
        const val = Math.log2(Math.max(n, 1));
        const log10Ops = Math.log10(Math.max(val, 0.001));
        return {
          n,
          log10Ops,
          opsFormatted: `${val.toFixed(1)} ops`,
          timeFormatted: '< 0.001 ms',
          verdictClass: 'verdict-instant',
          verdictLabel: '⚡ Instant',
          barPct: Math.min(100, Math.max(4, (log10Ops / 8) * 45))
        };
      }

      if (key === 'O(n)') {
        const log10Ops = Math.log10(n);
        const { timeStr, verdict, label } = formatCpuTimeFromLog(log10Ops);
        return {
          n,
          log10Ops,
          opsFormatted: formatStandardOps(n),
          timeFormatted: timeStr,
          verdictClass: verdict,
          verdictLabel: label,
          barPct: Math.min(100, Math.max(8, (log10Ops / 8) * 70))
        };
      }

      if (key === 'O(n log n)') {
        const val = n * Math.log2(Math.max(n, 1));
        const log10Ops = Math.log10(val);
        const { timeStr, verdict, label } = formatCpuTimeFromLog(log10Ops);
        return {
          n,
          log10Ops,
          opsFormatted: formatStandardOps(val),
          timeFormatted: timeStr,
          verdictClass: verdict,
          verdictLabel: label,
          barPct: Math.min(100, Math.max(10, (log10Ops / 8) * 80))
        };
      }

      if (key === 'O(n²)') {
        const log10Ops = 2 * Math.log10(n);
        const { timeStr, verdict, label } = formatCpuTimeFromLog(log10Ops);
        let opsStr = n <= 1e7 ? formatStandardOps(n * n) : formatExpOps(log10Ops);
        return {
          n,
          log10Ops,
          opsFormatted: opsStr,
          timeFormatted: timeStr,
          verdictClass: verdict,
          verdictLabel: label,
          barPct: log10Ops <= 8 ? Math.max(12, (log10Ops / 8) * 90) : 100
        };
      }

      if (key === 'O(2ⁿ)') {
        const log10Ops = n * Math.LOG10E * Math.LN2; // n * 0.30102999566
        const { timeStr, verdict, label } = formatCpuTimeFromLog(log10Ops);
        let opsStr = '';
        if (n <= 45) {
          opsStr = formatStandardOps(Math.pow(2, n));
        } else {
          opsStr = formatExpOps(log10Ops);
        }
        return {
          n,
          log10Ops,
          opsFormatted: opsStr,
          timeFormatted: timeStr,
          verdictClass: verdict,
          verdictLabel: label,
          barPct: log10Ops <= 8 ? Math.max(10, (log10Ops / 8) * 95) : 100
        };
      }

      if (key === 'O(n!)') {
        let log10Ops = 0;
        let opsStr = '';
        if (n <= 14) {
          let res = 1;
          for (let i = 2; i <= n; i++) res *= i;
          log10Ops = Math.log10(res);
          opsStr = formatStandardOps(res);
        } else {
          // Stirling's approximation: ln(n!) ≈ n*ln(n) - n + 0.5*ln(2*pi*n)
          const lnFact = n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
          log10Ops = lnFact * Math.LOG10E;
          opsStr = formatExpOps(log10Ops);
        }
        const { timeStr, verdict, label } = formatCpuTimeFromLog(log10Ops);
        return {
          n,
          log10Ops,
          opsFormatted: opsStr,
          timeFormatted: timeStr,
          verdictClass: verdict,
          verdictLabel: label,
          barPct: log10Ops <= 8 ? Math.max(10, (log10Ops / 8) * 95) : 100
        };
      }

      return { n, log10Ops: 0, opsFormatted: '1 op', timeFormatted: '< 0.001 ms', verdictClass: 'verdict-instant', verdictLabel: '⚡ Instant', barPct: 2 };
    }

    function formatStandardOps(ops) {
      if (ops === 1) return '1 op';
      if (ops < 1000) return `${ops.toFixed(ops < 10 ? 1 : 0)} ops`;
      if (ops < 1e6) return `${(ops / 1e3).toFixed(1)}K ops`;
      if (ops < 1e9) return `${(ops / 1e6).toFixed(1)}M ops`;
      if (ops < 1e12) return `${(ops / 1e9).toFixed(2)}B ops`;
      const exp = Math.floor(Math.log10(ops));
      const coeff = (ops / Math.pow(10, exp)).toFixed(2);
      return `${coeff}×10<sup>${exp}</sup> ops`;
    }

    function formatExpOps(log10Ops) {
      if (log10Ops > 100000) {
        const exp = Math.round(log10Ops);
        return `~10<sup>${exp.toLocaleString()}</sup> ops (Astronomical)`;
      }
      const exp = Math.floor(log10Ops);
      const mantissa = Math.pow(10, log10Ops - exp);
      return `${mantissa.toFixed(2)}×10<sup>${exp.toLocaleString()}</sup> ops`;
    }

    function formatCpuTimeFromLog(log10Ops) {
      // 10^8 ops = 1.0 second CPU time
      const log10Sec = log10Ops - 8;

      if (log10Sec < -5) {
        return { timeStr: '< 0.001 ms', verdict: 'verdict-instant', label: '⚡ Instant' };
      }
      if (log10Sec < -3) {
        const ms = Math.pow(10, log10Sec + 3);
        return { timeStr: `${ms.toFixed(2)} ms`, verdict: 'verdict-instant', label: '⚡ Instant' };
      }
      if (log10Sec < -1) {
        const ms = Math.pow(10, log10Sec + 3);
        return { timeStr: `${ms.toFixed(1)} ms`, verdict: 'verdict-pass', label: '🟢 Accepted' };
      }
      if (log10Sec <= 0) {
        const s = Math.pow(10, log10Sec);
        return { timeStr: `${s.toFixed(2)} s`, verdict: 'verdict-risky', label: '🟡 Close (<1s)' };
      }
      if (log10Sec < 1.778) { // < 60 s
        const s = Math.pow(10, log10Sec);
        return { timeStr: `${s.toFixed(1)} s`, verdict: 'verdict-tle', label: '🔴 TLE (>1s)' };
      }
      if (log10Sec < 3.556) { // < 1 hr
        const mins = Math.pow(10, log10Sec) / 60;
        return { timeStr: `${mins.toFixed(1)} mins`, verdict: 'verdict-tle', label: '🔴 TLE' };
      }
      if (log10Sec < 4.936) { // < 1 day
        const hrs = Math.pow(10, log10Sec) / 3600;
        return { timeStr: `${hrs.toFixed(1)} hrs`, verdict: 'verdict-tle', label: '⛔ Severe TLE' };
      }
      if (log10Sec < 7.499) { // < 1 yr (3.1536e7 s)
        const days = Math.pow(10, log10Sec) / 86400;
        return { timeStr: `${days.toFixed(1)} days`, verdict: 'verdict-tle', label: '⛔ Fatal TLE' };
      }

      // Years
      const log10Years = log10Sec - 7.4988;
      if (log10Years < 6) {
        const yrs = Math.pow(10, log10Years);
        return { timeStr: `${yrs.toFixed(1)} yrs`, verdict: 'verdict-tle', label: '⛔ Fatal TLE' };
      }
      if (log10Years > 10000) {
        return { timeStr: `> 10<sup>${Math.round(log10Years).toLocaleString()}</sup> yrs`, verdict: 'verdict-tle', label: '⛔ Astronomical' };
      }
      const expYrs = Math.floor(log10Years);
      const mantissa = Math.pow(10, log10Years - expYrs);
      return { timeStr: `${mantissa.toFixed(1)}×10<sup>${expYrs.toLocaleString()}</sup> yrs`, verdict: 'verdict-tle', label: '⛔ Universe Age' };
    }

    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <div class="cx-controls-group">
          <div class="cx-toolbar">
            <div class="cx-mode-toggle">
              <button class="cx-mode-btn ${currentMode === 'same' ? 'active' : ''}" id="mode-same" title="Compare all complexities at identical input n">Fixed Input (Same n)</button>
              <button class="cx-mode-btn ${currentMode === 'practical' ? 'active' : ''}" id="mode-practical" title="Compare complexities at realistic input sizes">Real-World Limits (Practical n)</button>
            </div>
            <div id="cx-same-controls" style="display:${currentMode === 'same' ? 'flex' : 'none'};align-items:center;gap:10px;flex-wrap:wrap;">
              <label>Custom n =</label>
              <input type="range" id="cx-slider" min="1" max="10000" value="1000" style="width:200px;">
              <input type="number" id="cx-direct" value="${currentSameN}" min="1" max="100000000" style="width:120px;">
              <span class="var-tag"><span class="var-k">n</span><span class="var-v" id="cx-nval">${currentSameN.toLocaleString()}</span></span>
            </div>
          </div>

          <div id="cx-presets-row" class="cx-presets" style="display:${currentMode === 'same' ? 'flex' : 'none'};">
            <label>Quick Presets:</label>
            ${presetsSame.map((p, idx) => `<button class="preset-btn ${p.val === currentSameN ? 'active' : ''}" data-val="${p.val}" title="${p.desc}">${p.label}</button>`).join('')}
          </div>

          <div class="cx-mode-desc" id="cx-mode-desc">
            ${currentMode === 'same'
              ? `<b>Same n Mode:</b> Evaluates all 7 Big-O curves on the <b>exact same input size (n = ${currentSameN.toLocaleString()})</b>. Notice how polynomial/logarithmic algorithms breeze through, while exponential/factorial explode into astronomical runtimes.`
              : `<b>Practical n Mode:</b> Shows the <b>realistic input size</b> each complexity can process in practice. Notice that O(1) & O(log n) easily process <b>n = 1,000,000</b> in <0.001ms, while O(2ⁿ) with just <b>n = 36</b> or O(n!) with just <b>n = 14</b> already takes ~11–15 minutes!`}
          </div>
        </div>
      `
    });

    const stage = $(`#stage-${this.id}`);
    $(`#vars-${this.id}`).remove();

    function renderInspector(c, metric) {
      return `
        <div class="tc-inspector" id="tc-inspector-card">
          <div class="tc-inspector-head">
            <div class="tc-inspector-title">
              <span style="color:${c.color};font-family:'JetBrains Mono';">${c.key}</span>
              <span>— ${c.name}</span>
            </div>
            <span class="tc-inspector-tag" style="color:${c.color};">${c.tag}</span>
          </div>

          <div class="tc-benchmarks">
            <div class="tc-bench-item">
              <span class="tc-bench-lbl">Tested Input (${currentMode === 'same' ? 'Same n' : 'Practical n'})</span>
              <span class="tc-bench-val">n = ${metric.n.toLocaleString()}</span>
            </div>
            <div class="tc-bench-item">
              <span class="tc-bench-lbl">Total Operations</span>
              <span class="tc-bench-val" style="color:${c.color};">${metric.opsFormatted}</span>
            </div>
            <div class="tc-bench-item">
              <span class="tc-bench-lbl">Estimated CPU Time (@10⁸ ops/s)</span>
              <span class="tc-bench-val">${metric.timeFormatted}</span>
            </div>
            <div class="tc-bench-item">
              <span class="tc-bench-lbl">Judge Status</span>
              <span class="cx-verdict ${metric.verdictClass}" style="align-self:flex-start;margin-top:2px;">${metric.verdictLabel}</span>
            </div>
          </div>

          <div class="tc-grid">
            <div class="tc-card">
              <div class="tc-card-label">What does ${c.key} actually mean?</div>
              <div class="tc-card-value">${c.meaning}</div>
            </div>
            <div class="tc-card">
              <div class="tc-card-label">The Scaling / Doubling Rule</div>
              <div class="tc-card-value"><b>${c.rule}</b></div>
            </div>
            <div class="tc-card">
              <div class="tc-card-label">Real-World Metaphor</div>
              <div class="tc-card-value">${c.metaphor}</div>
            </div>
            <div class="tc-card">
              <div class="tc-card-label">Safe Constraint Boundary</div>
              <div class="tc-card-value"><b>${c.safeLimit}</b> for 1.0s online judge execution.</div>
            </div>
          </div>

          <div class="tc-card" style="margin-bottom:12px;">
            <div class="tc-card-label">Classic DSA Algorithms</div>
            <div class="tc-card-value" style="color:var(--chalk);">${c.algos}</div>
          </div>

          <div class="code-wrap">
            <div class="code-header">
              <span class="code-lang-tag">Canonical C++ Pattern for ${c.key}</span>
            </div>
            <pre class="vscode-theme"><code>${highlightCpp(c.code)}</code></pre>
          </div>
        </div>
      `;
    }

    function renderStage() {
      const items = complexities.map(c => {
        const n = currentMode === 'same' ? currentSameN : practicalNMap[c.key];
        const metric = computeMetrics(c.key, n);
        const isSelected = c.key === selectedKey;
        return { c, metric, isSelected };
      });

      const chartHTML = `
        <div class="cx-chart" id="cx-chart">
          ${items.map(({ c, metric, isSelected }) => `
            <div class="cx-row ${isSelected ? 'selected' : ''}" data-key="${c.key}" title="Click to inspect what ${c.key} means">
              <div class="cx-badge" style="color:${c.color};">${c.key}</div>
              <div class="cx-n-tag">n = ${metric.n.toLocaleString()}</div>
              <div class="cx-bar-track">
                <div class="cx-bar-fill" style="width:${metric.barPct}%;background:${c.color};"></div>
              </div>
              <div class="cx-ops">${metric.opsFormatted}</div>
              <div class="cx-time">${metric.timeFormatted}</div>
              <div><span class="cx-verdict ${metric.verdictClass}">${metric.verdictLabel}</span></div>
            </div>
          `).join('')}
        </div>
      `;

      const activeItem = items.find(it => it.c.key === selectedKey) || items[2];
      stage.innerHTML = chartHTML + renderInspector(activeItem.c, activeItem.metric);

      // Wire row clicks to switch inspected complexity
      $$('.cx-row', stage).forEach(row => {
        row.addEventListener('click', () => {
          selectedKey = row.dataset.key;
          renderStage();
        });
      });
    }

    renderStage();

    // Mode Toggle Handlers
    const modeSameBtn = $('#mode-same');
    const modePractBtn = $('#mode-practical');
    const sameControls = $('#cx-same-controls');
    const presetsRow = $('#cx-presets-row');
    const modeDesc = $('#cx-mode-desc');

    function setMode(newMode) {
      currentMode = newMode;
      if (modeSameBtn) modeSameBtn.classList.toggle('active', newMode === 'same');
      if (modePractBtn) modePractBtn.classList.toggle('active', newMode === 'practical');
      if (sameControls) sameControls.style.display = newMode === 'same' ? 'flex' : 'none';
      if (presetsRow) presetsRow.style.display = newMode === 'same' ? 'flex' : 'none';

      if (modeDesc) {
        modeDesc.innerHTML = newMode === 'same'
          ? `<b>Same n Mode:</b> Evaluates all 7 Big-O curves on the <b>exact same input size (n = ${currentSameN.toLocaleString()})</b>. Notice how polynomial/logarithmic algorithms breeze through, while exponential/factorial explode into astronomical runtimes.`
          : `<b>Practical n Mode:</b> Shows the <b>realistic input size</b> each complexity can process in practice. Notice that O(1) & O(log n) easily process <b>n = 1,000,000</b> in <0.001ms, while O(2ⁿ) with just <b>n = 36</b> or O(n!) with just <b>n = 14</b> already takes ~11–15 minutes!`;
      }
      renderStage();
    }

    if (modeSameBtn) modeSameBtn.addEventListener('click', () => setMode('same'));
    if (modePractBtn) modePractBtn.addEventListener('click', () => setMode('practical'));

    // Controls wiring for Same n mode
    const slider = $('#cx-slider');
    const directInput = $('#cx-direct');
    const nval = $('#cx-nval');

    function updateSameN(val) {
      val = Math.max(1, Math.min(100000000, Number(val) || 1));
      currentSameN = val;
      if (slider) slider.value = Math.min(10000, val);
      if (directInput) directInput.value = val;
      if (nval) nval.textContent = val.toLocaleString();

      // Highlight matching preset button
      $$('.preset-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.val) === val);
      });

      if (currentMode === 'same' && modeDesc) {
        modeDesc.innerHTML = `<b>Same n Mode:</b> Evaluates all 7 Big-O curves on the <b>exact same input size (n = ${currentSameN.toLocaleString()})</b>. Notice how polynomial/logarithmic algorithms breeze through, while exponential/factorial explode into astronomical runtimes.`;
      }

      renderStage();
    }

    if (slider) slider.addEventListener('input', e => updateSameN(e.target.value));
    if (directInput) directInput.addEventListener('change', e => updateSameN(e.target.value));

    $$('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        updateSameN(Number(btn.dataset.val));
      });
    });

    $(`#desc-${this.id}`).style.display = 'block';
    $(`#desc-${this.id}`).innerHTML = '<b>Pedagogical Insight:</b> Toggle between "Same n" and "Practical n" above to understand why algorithms with exponential or factorial growth can only ever be run on tiny inputs in real software.';

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      <div class="tab-panel active" id="panel-${this.id}-cheatsheet">
        <div style="font-size:13.5px;color:var(--muted);margin-bottom:14px;line-height:1.5;">
          In competitive programming & technical interviews, the problem's given <b>input constraint (N)</b> immediately reveals the intended Time Complexity. Online judges allocate a <b>1.0-second CPU limit (~10⁸ basic C++ ops)</b>.
        </div>
        <table class="tc-cheat-table">
          <thead>
            <tr>
              <th>Input Constraint (N)</th>
              <th>Expected Time Complexity</th>
              <th>Operations @ Limit</th>
              <th>Classic Algorithm / Approach</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>N ≤ 10 – 11</code></td>
              <td><span style="color:#ff2a55;font-weight:700;">O(N!)</span> or <span style="color:#ff4d94;font-weight:700;">O(N² · 2ᴺ)</span></td>
              <td>~3.6 × 10⁶ ops</td>
              <td>Permutations, TSP brute force, Bitmask DP</td>
            </tr>
            <tr>
              <td><code>N ≤ 20 – 25</code></td>
              <td><span style="color:#ff4d94;font-weight:700;">O(2ᴺ)</span> or <span style="color:var(--purple);font-weight:700;">O(N · 2ᴺ)</span></td>
              <td>~3.3 × 10⁷ ops</td>
              <td>Subsets, Recursion with Backtracking, Meet-in-the-middle</td>
            </tr>
            <tr>
              <td><code>N ≤ 400 – 500</code></td>
              <td><span style="color:var(--coral);font-weight:700;">O(N³)</span></td>
              <td>~6.4 × 10⁷ ops</td>
              <td>Floyd-Warshall, 3 nested loops, Matrix multiplication</td>
            </tr>
            <tr>
              <td><code>N ≤ 2,000 – 5,000</code></td>
              <td><span style="color:var(--coral);font-weight:700;">O(N²)</span></td>
              <td>~2.5 × 10⁷ ops</td>
              <td>Nested loops, 2D Grid DP, Checking all pairs</td>
            </tr>
            <tr>
              <td><code>N ≤ 10⁵ – 10⁶</code></td>
              <td><span style="color:var(--purple);font-weight:700;">O(N log N)</span> or <span style="color:var(--yellow);font-weight:700;">O(N)</span></td>
              <td>~2.0 × 10⁷ ops</td>
              <td>Sorting (Merge/Quick/std::sort), Heaps, BST, Segment Trees</td>
            </tr>
            <tr>
              <td><code>N ≤ 10⁷ – 10⁸</code></td>
              <td><span style="color:var(--yellow);font-weight:700;">O(N)</span></td>
              <td>~1.0 × 10⁸ ops</td>
              <td>Single pass scan, Two Pointers, Sliding Window, Prefix Sum</td>
            </tr>
            <tr>
              <td><code>N > 10⁸ (e.g. 10¹⁸)</code></td>
              <td><span style="color:var(--blue);font-weight:700;">O(log N)</span> or <span style="color:var(--teal);font-weight:700;">O(1)</span></td>
              <td>~30 – 60 ops</td>
              <td>Binary Search, Euclidean GCD, Matrix Exponentiation, Math</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${pseudoPanel(this.id,
`for a loop of 1 statement           → O(1)
for i in 1..n, halving each time    → O(log n)
for i in 1..n                       → O(n)
for i in 1..n: for j in 1..log n    → O(n log n)
for i in 1..n: for j in 1..n        → O(n²)`)}

      ${cppPanel(this.id,
`// Recognising complexity from code shape
void constant(int n) { cout << n; }                                  // O(1)

int logarithmic(int n) { int c = 0; while(n > 1) { n /= 2; c++; } return c; } // O(log n)

void linear(int n) { for(int i = 0; i < n; i++) cout << i; }         // O(n)

void nlogn(int n) {                                                 // O(n log n)
    for(int i = 0; i < n; i++)
        for(int j = 1; j < n; j *= 2) cout << j;
}

void quadratic(int n) {                                              // O(n^2)
    for(int i = 0; i < n; i++)
        for(int j = 0; j < n; j++) cout << i + j;
}`)}
      ${pythonPanel(this.id,
`# Recognising complexity from code shape
def constant(n):
    print(n)                                         # O(1)

def logarithmic(n):
    c = 0
    while n > 1:
        n //= 2
        c += 1
    return c                                         # O(log n)

def linear(n):
    for i in range(n):
        print(i)                                     # O(n)

def nlogn(n):
    for i in range(n):
        j = 1
        while j < n:
            print(j)
            j *= 2                                   # O(n log n)

def quadratic(n):
    for i in range(n):
        for j in range(n):
            print(i + j)                             # O(n^2)`)}

      ${practicePanel(this.id, [
        { lvl: 'basic', title: 'Analysis of Algorithms — Loops & Asymptotic Notation', slug: 'time-complexity-analysis', isBatch: true, company: 'Amazon, Microsoft, TCS', hint: 'Find closed-form Big-O for dependent and geometric loops.' },
        { lvl: 'easy', title: 'Space Complexity & Recursion Stack Memory', slug: 'space-complexity-in-data-structures', isBatch: true, company: 'Adobe, Google', hint: 'Analyze auxiliary vs total memory across iterative and recursive calls.' },
        { lvl: 'medium', title: 'Order of Growth & Recurrence Relations (Master Theorem)', slug: 'master-theorem-for-divide-and-conquer-recurrences', isBatch: false, company: 'Directi, Flipkart, Goldman Sachs', hint: 'T(n) = aT(n/b) + f(n) analysis for divide and conquer algorithms.' }
      ])}
    `);

    // Add cheatsheet tab button dynamically to tabs container
    const tabsRoot = $(`#tabs-${this.id}`);
    if (tabsRoot) {
      tabsRoot.innerHTML = `
        <button class="tab-btn active" data-tab="cheatsheet">Constraints Guide</button>
        <button class="tab-btn" data-tab="pseudo">Pseudocode</button>
        <button class="tab-btn" data-tab="cpp">C++ Solution</button>
        <button class="tab-btn" data-tab="python">Python Solution</button>
        <button class="tab-btn" data-tab="practice">Practice</button>
      `;
    }

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
