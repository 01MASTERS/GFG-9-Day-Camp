/* ============================================================
   DAY 2 — TOPIC 09: SET MATRIX TO ZERO
   Visualizes O(1) Space In-Place Marker Algorithm (Row 0 & Col 0 Bins)
   ============================================================ */

const TOPIC_SET_MATRIX_ZERO = {
  id: 'set-matrix-zero',
  num: '09',
  title: 'Set Matrix to Zero — Optimal O(1) Space Markers',
  tag: 'Matrix',
  intuition: 'If an element is 0, its entire row and column must be set to 0. Instead of using O(m+n) extra memory, use the matrix’s own 1st row and 1st column as marker bins, tracking whether row 0 and col 0 originally had zeroes using two boolean flags.',
  time: 'O(m × n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Preset</label>
        <select id="smz-preset">
          <option value="p1" selected>3 × 3 (Zero at [1,1])</option>
          <option value="p2">3 × 4 (Zeroes at [0,1] & [1,3])</option>
          <option value="p3">4 × 4 (Zeroes at [1,1] & [2,3])</option>
        </select>
        <button class="primary" id="smz-apply">Apply</button>
        <button id="smz-random">🎲 Random Zeroes</button>
        <span style="font-size:11px;color:var(--muted);margin-left:6px;">💡 Tip: Click any cell on the stage to toggle 0 / non-zero!</span>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    const presets = {
      p1: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
      p2: [[1, 0, 1, 1], [1, 1, 1, 0], [1, 1, 1, 1]],
      p3: [[1, 2, 3, 4], [5, 0, 7, 8], [9, 10, 11, 0], [13, 14, 15, 16]]
    };

    let currentMatrix = presets.p1.map(r => [...r]);

    function buildSteps(initialMat) {
      const m = initialMat.length;
      const n = initialMat[0].length;
      steps = [];

      let cur = initialMat.map(r => [...r]);

      // Phase 0: Start
      steps.push({
        mat: cur.map(r => [...r]),
        phase: 'Initial State',
        desc: `Input matrix of dimensions ${m} × ${n}. Goal: Any row or column containing a 0 must be filled with 0s in O(1) auxiliary space.`,
        highlights: {},
        vars: { rows: m, cols: n, space: 'O(1) in-place' }
      });

      // Phase 1: Check if first row & first col have zeroes
      let firstRowZero = false;
      let firstColZero = false;

      for (let j = 0; j < n; j++) {
        if (cur[0][j] === 0) firstRowZero = true;
      }
      for (let i = 0; i < m; i++) {
        if (cur[i][0] === 0) firstColZero = true;
      }

      const p1Hl = {};
      for (let j = 0; j < n; j++) p1Hl[`0,${j}`] = 'marker-bin';
      for (let i = 0; i < m; i++) p1Hl[`${i},0`] = 'marker-bin';

      steps.push({
        mat: cur.map(r => [...r]),
        phase: 'Phase 1: Check Row 0 & Col 0 Flags',
        desc: `Scan 1st row and 1st col: firstRowZero = ${firstRowZero ? 'TRUE ⚠️' : 'false'}, firstColZero = ${firstColZero ? 'TRUE ⚠️' : 'false'}. These determine if boundary lines get zeroed at the end.`,
        highlights: p1Hl,
        vars: { firstRowZero: String(firstRowZero), firstColZero: String(firstColZero) }
      });

      // Phase 2: Use row 0 and col 0 as marker bins
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          if (cur[i][j] === 0) {
            cur[i][0] = 0;
            cur[0][j] = 0;

            const markHl = { ...p1Hl };
            markHl[`${i},${j}`] = 'active';
            markHl[`${i},0`] = 'zero-marker';
            markHl[`0,${j}`] = 'zero-marker';

            steps.push({
              mat: cur.map(r => [...r]),
              phase: `Phase 2: Marking Zero at (${i}, ${j})`,
              desc: `Found 0 at M[${i}][${j}]. Marked its row header M[${i}][0] = 0 and column header M[0][${j}] = 0.`,
              highlights: markHl,
              vars: { foundZeroAt: `(${i}, ${j})`, 'M[i][0]': 0, 'M[0][j]': 0 }
            });
          }
        }
      }

      // Phase 3: Set inner cells to 0 based on markers
      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          if (cur[i][0] === 0 || cur[0][j] === 0) {
            cur[i][j] = 0;

            const zeroHl = {};
            zeroHl[`${i},0`] = 'zero-marker';
            zeroHl[`0,${j}`] = 'zero-marker';
            zeroHl[`${i},${j}`] = 'good';

            steps.push({
              mat: cur.map(r => [...r]),
              phase: `Phase 3: Zeroing Inner Cell (${i}, ${j})`,
              desc: `Cell (${i}, ${j}) has marker M[${i}][0]==0 or M[0][${j}]==0 → Set M[${i}][${j}] = 0.`,
              highlights: zeroHl,
              vars: { zeroingCell: `(${i}, ${j})`, rowMarker: cur[i][0], colMarker: cur[0][j] }
            });
          }
        }
      }

      // Phase 4: Zero first row if flagged
      if (firstRowZero) {
        for (let j = 0; j < n; j++) cur[0][j] = 0;
        const rowHl = {};
        for (let j = 0; j < n; j++) rowHl[`0,${j}`] = 'good';

        steps.push({
          mat: cur.map(r => [...r]),
          phase: 'Phase 4: Zeroing Entire 1st Row',
          desc: `firstRowZero was TRUE → Set every element in Row 0 to 0.`,
          highlights: rowHl,
          vars: { row0Zeroed: 'YES', firstRowZero: 'true' }
        });
      }

      // Phase 5: Zero first col if flagged
      if (firstColZero) {
        for (let i = 0; i < m; i++) cur[i][0] = 0;
        const colHl = {};
        for (let i = 0; i < m; i++) colHl[`${i},0`] = 'good';

        steps.push({
          mat: cur.map(r => [...r]),
          phase: 'Phase 5: Zeroing Entire 1st Column',
          desc: `firstColZero was TRUE → Set every element in Col 0 to 0.`,
          highlights: colHl,
          vars: { col0Zeroed: 'YES', firstColZero: 'true' }
        });
      }

      // Final complete state
      const finalHl = {};
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (cur[i][j] === 0) finalHl[`${i},${j}`] = 'good';
        }
      }

      steps.push({
        mat: cur.map(r => [...r]),
        phase: 'Complete ✅',
        desc: `Set Matrix Zeroes completed successfully in O(m × n) time and O(1) auxiliary space!`,
        highlights: finalHl,
        vars: {
          resultStatus: 'ALL ZEROES PROPAGATED ✅',
          timeComplexity: 'O(m × n)',
          spaceComplexity: 'O(1) optimal'
        }
      });

      return steps;
    }

    function renderMatrixHTML(mat, highlights = {}) {
      if (!mat || mat.length === 0) return '';
      const cCount = mat[0].length;

      const rowsHTML = mat.map((row, r) => {
        const cells = row.map((val, c) => {
          const key = `${r},${c}`;
          const hl = highlights[key] || '';
          let cls = 'matrix-cell';
          if (val === 0) cls += ' matrix-zero';
          if (hl === 'marker-bin') cls += ' matrix-marker-bin';
          else if (hl === 'zero-marker') cls += ' matrix-zero-marker';
          else if (hl === 'active') cls += ' matrix-active';
          else if (hl === 'good') cls += ' matrix-good';

          return `<div class="${cls}" data-r="${r}" data-c="${c}"><span class="matrix-pos">${r},${c}</span>${val}</div>`;
        }).join('');
        return `<div class="matrix-row">${cells}</div>`;
      }).join('');

      return `<div class="matrix-grid interactive" style="grid-template-columns: repeat(${cCount}, 54px);">${rowsHTML}</div>`;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_SET_MATRIX_ZERO.id;

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:12px;">
          ${renderMatrixHTML(s.mat, s.highlights)}
        </div>
        <div class="equation" style="font-size:15px;margin-top:14px;">
          <span class="op">Phase:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
      `;

      // Wire interactive cell click toggling
      $$('.matrix-cell', stage).forEach(cell => {
        cell.addEventListener('click', () => {
          const r = parseInt(cell.dataset.r);
          const c = parseInt(cell.dataset.c);
          currentMatrix[r][c] = currentMatrix[r][c] === 0 ? 5 : 0;
          rebuildWithCurrent();
        });
      });

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let player;

    function rebuildWithCurrent() {
      buildSteps(currentMatrix);
      $(`#player-mount-${TOPIC_SET_MATRIX_ZERO.id}`).innerHTML = '';
      $(`#desc-${TOPIC_SET_MATRIX_ZERO.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_SET_MATRIX_ZERO.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    function rebuild() {
      const pKey = $('#smz-preset').value;
      const base = presets[pKey] || presets.p1;
      currentMatrix = base.map(r => [...r]);
      rebuildWithCurrent();
    }

    $('#smz-preset').addEventListener('change', rebuild);
    $('#smz-apply').addEventListener('click', rebuild);
    $('#smz-random').addEventListener('click', () => {
      const pKey = $('#smz-preset').value;
      const base = presets[pKey] || presets.p1;
      const r = base.length;
      const c = base[0].length;
      currentMatrix = Array.from({ length: r }, () => Array.from({ length: c }, () => randomInt(1, 9)));
      // Inject 1-3 zeroes
      const zeroCount = randomInt(1, 3);
      for (let k = 0; k < zeroCount; k++) {
        currentMatrix[randomInt(0, r - 1)][randomInt(0, c - 1)] = 0;
      }
      rebuildWithCurrent();
    });

    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// Optimal In-Place Marker Algorithm (O(m*n) time, O(1) space):
function setMatrixZeroes(matrix):
    m = rows(matrix), n = cols(matrix)
    firstRowZero = false, firstColZero = false
    
    // Step 1: Check if boundary row/col have zeroes
    for j from 0 to n-1: if matrix[0][j] == 0: firstRowZero = true
    for i from 0 to m-1: if matrix[i][0] == 0: firstColZero = true
    
    // Step 2: Use row 0 and col 0 as marker bins
    for i from 1 to m-1:
        for j from 1 to n-1:
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
                
    // Step 3: Zero inner cells using headers
    for i from 1 to m-1:
        for j from 1 to n-1:
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
                
    // Step 4: Zero boundary lines if flagged
    if firstRowZero: for j from 0 to n-1: matrix[0][j] = 0
    if firstColZero: for i from 0 to m-1: matrix[i][0] = 0`)}

      ${cppPanel(this.id,
`#include <vector>
using namespace std;

// 1. Optimal O(1) Auxiliary Space Solution (GFG / LeetCode 73)
void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size();
    int n = matrix[0].size();
    
    bool firstRowZero = false;
    bool firstColZero = false;
    
    // 1. Check first row & column
    for (int j = 0; j < n; j++) {
        if (matrix[0][j] == 0) firstRowZero = true;
    }
    for (int i = 0; i < m; i++) {
        if (matrix[i][0] == 0) firstColZero = true;
    }
    
    // 2. Mark zeroes in row 0 and col 0
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    // 3. Fill inner matrix using markers
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    // 4. Update first row and first column
    if (firstRowZero) {
        for (int j = 0; j < n; j++) matrix[0][j] = 0;
    }
    if (firstColZero) {
        for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}

// 2. O(M + N) Space Solution (Simple Boolean Vectors)
void setZeroesAux(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<bool> row(m, false), col(n, false);
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == 0) {
                row[i] = true;
                col[j] = true;
            }
        }
    }
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (row[i] || col[j]) matrix[i][j] = 0;
        }
    }
}`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google, Facebook', hint: 'Use 1st row and 1st column as in-place marker bins with two boolean boundary flags to achieve optimal O(1) space.' },
        { lvl: 'medium', title: 'Spirally Traversing a Matrix', slug: 'spirally-traversing-a-matrix-1587115621', track: 'matrix-siddhartha', isBatch: true, company: 'Paytm, Flipkart, Amazon, Microsoft', hint: 'Maintain 4 boundary pointers (top, bottom, left, right) and traverse in cyclical right-down-left-up loops.' },
        { lvl: 'medium', title: 'Make Matrix Beautiful (Equal Row/Col Sums)', slug: 'make-matrix-beautiful-1587115620', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Samsung', hint: 'Find max target row/column sum and calculate sum of deviations.' },
        { lvl: 'easy', title: 'Search in a Row-Column Sorted Matrix', slug: 'search-in-a-matrix17201720', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Directi', hint: 'Start at top-right corner (0, n-1). Move left if target < val, move down if target > val in O(m+n) time.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
