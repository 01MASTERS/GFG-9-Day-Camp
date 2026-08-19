/* ============================================================
   DAY 2 — TOPIC 08: TRANSPOSE OF A MATRIX
   Visualizes In-Place Diagonal Swaps & 90-Degree Matrix Rotation
   ============================================================ */

const TOPIC_TRANSPOSE_MATRIX = {
  id: 'transpose',
  num: '08',
  title: 'Transpose of a Matrix — Diagonal Reflection & 90° Rotation',
  tag: 'Matrix',
  intuition: 'The transpose of matrix M swaps rows with columns: M[i][j] ⇄ M[j][i]. For an N×N square matrix, this is done in-place in O(1) extra space by swapping across the main diagonal (j > i). Rotating 90° clockwise equals Transpose + Reverse each row.',
  time: 'O(N²)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `
        <label>Size</label>
        <select id="trn-size">
          <option value="3x3" selected>3 × 3 Square Matrix</option>
          <option value="4x4">4 × 4 Square Matrix</option>
          <option value="2x3">2 × 3 Rectangular Matrix</option>
        </select>
        <label>Operation</label>
        <select id="trn-mode">
          <option value="transpose" selected>In-Place Transpose (M[i][j] ⇄ M[j][i])</option>
          <option value="rotate90">Rotate 90° Clockwise (Transpose + Row Reverse)</option>
        </select>
        <button class="primary" id="trn-apply">Apply</button>
        <button id="trn-random">🎲 Random Matrix</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(matrix, mode) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const isSquare = rows === cols;
      steps = [];

      let cur = matrix.map(r => [...r]);

      steps.push({
        mat: cur.map(r => [...r]),
        phase: 'Initialize Matrix',
        desc: `Initial ${rows} × ${cols} matrix. Main diagonal elements (where i == j) never move during transposition.`,
        highlights: {},
        vars: { rows, cols, isSquare: isSquare ? 'YES (In-Place O(1))' : 'NO (Auxiliary Matrix)' }
      });

      if (isSquare) {
        const n = rows;
        // Step 1: Transpose in-place
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const prepHl = {};
            // Mark diagonal
            for (let d = 0; d < n; d++) prepHl[`${d},${d}`] = 'diag';
            prepHl[`${i},${j}`] = 'active';
            prepHl[`${j},${i}`] = 'compare';

            steps.push({
              mat: cur.map(r => [...r]),
              phase: `Compare M[${i}][${j}] & M[${j}][${i}]`,
              desc: `Row ${i}, Col ${j}: Swap M[${i}][${j}] (${cur[i][j]}) with symmetric element M[${j}][${i}] (${cur[j][i]}).`,
              highlights: { ...prepHl },
              vars: { i, j, 'M[i][j]': cur[i][j], 'M[j][i]': cur[j][i], action: 'Swap across diagonal' }
            });

            // Perform swap
            const temp = cur[i][j];
            cur[i][j] = cur[j][i];
            cur[j][i] = temp;

            const swappedHl = {};
            for (let d = 0; d < n; d++) swappedHl[`${d},${d}`] = 'diag';
            swappedHl[`${i},${j}`] = 'good';
            swappedHl[`${j},${i}`] = 'good';

            steps.push({
              mat: cur.map(r => [...r]),
              phase: `Swapped M[${i}][${j}] ⇄ M[${j}][${i}]`,
              desc: `Swapped! M[${i}][${j}] is now ${cur[i][j]} and M[${j}][${i}] is ${cur[j][i]}.`,
              highlights: { ...swappedHl },
              vars: { i, j, status: 'SWAPPED', 'New M[i][j]': cur[i][j], 'New M[j][i]': cur[j][i] }
            });
          }
        }

        if (mode === 'rotate90') {
          steps.push({
            mat: cur.map(r => [...r]),
            phase: 'Transpose Done → Now Reverse Each Row',
            desc: `Transpose complete! To finish 90° Clockwise Rotation, we now reverse the elements in each row.`,
            highlights: {},
            vars: { phase: 'Row Reversal for 90° Rotation' }
          });

          for (let r = 0; r < n; r++) {
            let l = 0, right = n - 1;
            while (l < right) {
              const rowHl = {};
              rowHl[`${r},${l}`] = 'active';
              rowHl[`${r},${right}`] = 'active';

              steps.push({
                mat: cur.map(row => [...row]),
                phase: `Reversing Row ${r}`,
                desc: `In Row ${r}: swap M[${r}][${l}] (${cur[r][l]}) with M[${r}][${right}] (${cur[r][right]}).`,
                highlights: { ...rowHl },
                vars: { row: r, left: l, right, 'M[r][left]': cur[r][l], 'M[r][right]': cur[r][right] }
              });

              const t = cur[r][l];
              cur[r][l] = cur[r][right];
              cur[r][right] = t;

              l++;
              right--;
            }
          }
        }
      } else {
        // Rectangular matrix transpose into result
        const res = Array.from({ length: cols }, () => Array(rows).fill(0));
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            res[j][i] = cur[i][j];
            steps.push({
              mat: cur.map(r => [...r]),
              resMat: res.map(r => [...r]),
              phase: `Copy M[${i}][${j}] → Res[${j}][${i}]`,
              desc: `Element M[${i}][${j}] (${cur[i][j]}) copied to transposed position Result[${j}][${i}].`,
              highlights: { [`${i},${j}`]: 'active' },
              vars: { originalRow: i, originalCol: j, value: cur[i][j], newRow: j, newCol: i }
            });
          }
        }
        cur = res;
      }

      const finalHl = {};
      for (let r = 0; r < cur.length; r++) {
        for (let c = 0; c < cur[0].length; c++) {
          finalHl[`${r},${c}`] = 'good';
        }
      }

      steps.push({
        mat: cur.map(r => [...r]),
        phase: mode === 'rotate90' ? '90° Clockwise Rotation Complete ✅' : 'Transposition Complete ✅',
        desc: mode === 'rotate90'
          ? `Matrix successfully rotated 90° clockwise in O(N²) time and O(1) space!`
          : `Matrix transpose successfully completed! Dimensions: ${cur.length} × ${cur[0].length}.`,
        highlights: finalHl,
        vars: {
          finalDimensions: `${cur.length} × ${cur[0].length}`,
          timeComplexity: 'O(R × C)',
          spaceComplexity: isSquare ? 'O(1) in-place' : 'O(R × C) auxiliary'
        }
      });

      return steps;
    }

    function renderMatrixHTML(mat, highlights = {}) {
      if (!mat || mat.length === 0) return '';
      const rCount = mat.length;
      const cCount = mat[0].length;

      const rowsHTML = mat.map((row, r) => {
        const cells = row.map((val, c) => {
          const key = `${r},${c}`;
          const hl = highlights[key] || '';
          let cls = 'matrix-cell';
          if (hl === 'diag') cls += ' matrix-diag';
          else if (hl === 'active') cls += ' matrix-active';
          else if (hl === 'compare') cls += ' matrix-compare';
          else if (hl === 'good') cls += ' matrix-good';

          return `<div class="${cls}" data-pos="${key}"><span class="matrix-pos">${r},${c}</span>${val}</div>`;
        }).join('');
        return `<div class="matrix-row">${cells}</div>`;
      }).join('');

      return `<div class="matrix-grid" style="grid-template-columns: repeat(${cCount}, 52px);">${rowsHTML}</div>`;
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_TRANSPOSE_MATRIX.id;

      stage.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:12px;">
          ${renderMatrixHTML(s.mat, s.highlights)}
          ${s.resMat ? `
            <div style="font-size:11px;font-weight:700;color:var(--teal);margin-top:6px;">TRANSPOSED RESULT (${s.resMat.length} × ${s.resMat[0].length}):</div>
            ${renderMatrixHTML(s.resMat, {})}
          ` : ''}
        </div>
        <div class="equation" style="font-size:15px;margin-top:14px;">
          <span class="op">Status:</span>
          <div class="eq-box hl">${escapeHtml(s.phase)}</div>
        </div>
      `;

      $(`#desc-${id}`).textContent = s.desc;
      $(`#vars-${id}`).innerHTML = varsHTML(s.vars);
    }

    let defaultMats = {
      '3x3': [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      '4x4': [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]],
      '2x3': [[1, 2, 3], [4, 5, 6]]
    };

    let activeMatrix = defaultMats['3x3'];
    let player;

    function rebuild() {
      const size = $('#trn-size').value;
      const mode = $('#trn-mode').value;
      const base = defaultMats[size] || defaultMats['3x3'];
      activeMatrix = base.map(r => [...r]);

      buildSteps(activeMatrix, mode);
      $(`#player-mount-${TOPIC_TRANSPOSE_MATRIX.id}`).innerHTML = '';
      $(`#desc-${TOPIC_TRANSPOSE_MATRIX.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_TRANSPOSE_MATRIX.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    $('#trn-size').addEventListener('change', rebuild);
    $('#trn-mode').addEventListener('change', rebuild);
    $('#trn-apply').addEventListener('click', rebuild);
    $('#trn-random').addEventListener('click', () => {
      const size = $('#trn-size').value;
      const [r, c] = size.split('x').map(Number);
      const randMat = [];
      let val = randomInt(1, 10);
      for (let i = 0; i < r; i++) {
        const row = [];
        for (let j = 0; j < c; j++) {
          row.push(val++);
        }
        randMat.push(row);
      }
      defaultMats[size] = randMat;
      rebuild();
    });

    rebuild();

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`// 1. In-Place N x N Square Matrix Transpose:
function transposeSquare(matrix, n):
    for i from 0 to n - 1:
        for j from i + 1 to n - 1:
            swap(matrix[i][j], matrix[j][i])

// 2. Rotate Matrix 90 Degrees Clockwise:
function rotateMatrix90(matrix, n):
    // Step 1: Transpose matrix in-place
    transposeSquare(matrix, n)
    // Step 2: Reverse every row
    for i from 0 to n - 1:
        reverse(matrix[i])`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// 1. In-Place Transpose of N x N Matrix (O(N²) time, O(1) space)
void transpose(vector<vector<int>>& matrix, int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
}

// 2. Rotate Matrix by 90 Degrees Clockwise (LeetCode 48 / GFG)
void rotate90Clockwise(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Step 1: Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    // Step 2: Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}

// 3. Rectangular M x N Matrix Transpose
vector<vector<int>> transposeRectangular(const vector<vector<int>>& matrix) {
    int r = matrix.size();
    int c = matrix[0].size();
    vector<vector<int>> result(c, vector<int>(r));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}`)}
      ${pythonPanel(this.id,
`# In-Place Transpose of N x N Matrix
def transpose(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

# Rotate 90 Degrees Clockwise
def rotate_90_clockwise(matrix):
    transpose(matrix)
    for row in matrix:
        row.reverse()

# Rectangular M x N Transpose
def transpose_rect(matrix):
    return [list(row) for row in zip(*matrix)]

# Pythonic one-liner
import numpy as np
# np.array(matrix).T`)}

      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Transpose of Matrix', slug: 'transpose-of-matrix-1587115621', track: 'matrix-siddhartha', isBatch: true, company: 'TCS, Infosys, Amazon', hint: 'Swap matrix[i][j] and matrix[j][i] across the diagonal for j > i in O(N²) time and O(1) space.' },
        { lvl: 'medium', title: 'Rotate Matrix by 180 Degree', slug: 'c-matrix-rotation-by-180-degree0745', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Microsoft', hint: '180° rotation equals reversing rows and then reversing columns in-place.' },
        { lvl: 'easy', title: 'Toeplitz Matrix (Constant Diagonals)', slug: 'toeplitz-matrix', track: 'matrix-siddhartha', isBatch: true, company: 'Google, Amazon', hint: 'Verify matrix[i][j] == matrix[i+1][j+1] for all valid adjacent diagonal pairs.' },
        { lvl: 'medium', title: 'Multiply 2 Matrices', slug: 'multiply-2-matrices4144', track: 'matrix-siddhartha', isBatch: true, company: 'Amazon, Adobe', hint: 'Compute dot product of Row i of A with Column j of B in O(N³) time.' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
