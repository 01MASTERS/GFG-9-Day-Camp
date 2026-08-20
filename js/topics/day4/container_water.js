/* ============================================================
   DAY 4 — TOPIC 05: CONTAINER WITH MOST WATER
   Two-pointer approach on heights array: start with widest
   container, then move the shorter side inward.
   ============================================================ */

const TOPIC_CONTAINER_WATER = {
  id: 'container-water',
  num: '05',
  title: 'Container With Most Water — Two Pointers',
  tag: 'Two Pointers',
  intuition: 'Start with the widest container (left=0, right=n-1). The area is min(height[L], height[R]) × (R-L). To possibly find a larger area, move the pointer with the shorter height inward — moving the taller one can only decrease or keep the area the same.',
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
        <label>Heights</label>
        <input type="text" class="arr-input" id="cw-arr" value="1, 8, 6, 2, 5, 4, 8, 3, 7">
        <button class="primary" id="cw-apply">Apply</button>
        <button id="cw-random">🎲 Random</button>
      `
    });

    const stage = $(`#stage-${this.id}`);
    let steps = [];

    function buildSteps(arr) {
      steps = [];
      const n = arr.length;
      if (n < 2) {
        steps.push({ arr: [...arr], phase: 'Too Short', desc: 'Need at least 2 bars.', marks: {}, vars: {}, left: 0, right: 0, maxArea: 0, bestL: 0, bestR: 0 });
        return;
      }

      let left = 0, right = n - 1;
      let maxArea = 0, bestL = 0, bestR = 0;

      steps.push({
        arr: [...arr], phase: 'Initialize',
        desc: `Start with widest container: left=0 (h=${arr[0]}), right=${right} (h=${arr[right]}).`,
        marks: { 0: { cls: 'active', tag: 'L' }, [right]: { cls: 'active', tag: 'R' } },
        vars: { left: 0, right, width: right },
        left: 0, right, maxArea: 0, bestL: 0, bestR: 0
      });

      while (left < right) {
        const width = right - left;
        const minH = Math.min(arr[left], arr[right]);
        const area = minH * width;
        const improved = area > maxArea;
        if (improved) {
          maxArea = area;
          bestL = left;
          bestR = right;
        }

        const marks = {};
        for (let i = 0; i < n; i++) {
          if (i === left) marks[i] = { cls: 'active', tag: 'L' };
          else if (i === right) marks[i] = { cls: 'active', tag: 'R' };
          else if (i > left && i < right) marks[i] = { cls: 'compare' };
        }

        const moveLeft = arr[left] <= arr[right];
        const moveDesc = moveLeft
          ? `h[L]=${arr[left]} ≤ h[R]=${arr[right]} → move L right`
          : `h[R]=${arr[right]} < h[L]=${arr[left]} → move R left`;

        steps.push({
          arr: [...arr], phase: improved ? '✦ New Max!' : 'Compare',
          desc: `Area = min(${arr[left]}, ${arr[right]}) × ${width} = ${minH} × ${width} = ${area}. ${improved ? 'New maxArea!' : 'maxArea stays ' + maxArea + '.'} ${moveDesc}.`,
          marks,
          vars: { left, right, 'h[L]': arr[left], 'h[R]': arr[right], area, maxArea: improved ? area : maxArea },
          left, right, maxArea: improved ? area : maxArea, bestL, bestR
        });

        if (moveLeft) left++;
        else right--;
      }

      // Final
      const fMarks = {};
      for (let i = 0; i < n; i++) {
        if (i === bestL || i === bestR) fMarks[i] = { cls: 'good', tag: i === bestL ? 'best L' : 'best R' };
        else if (i > bestL && i < bestR) fMarks[i] = { cls: 'good' };
      }
      steps.push({
        arr: [...arr], phase: 'Result',
        desc: `Maximum water = ${maxArea}. Container between indices ${bestL} (h=${arr[bestL]}) and ${bestR} (h=${arr[bestR]}).`,
        marks: fMarks,
        vars: { maxArea, container: `[${bestL}, ${bestR}]`, width: bestR - bestL, minHeight: Math.min(arr[bestL], arr[bestR]) },
        left: bestL, right: bestR, maxArea, bestL, bestR
      });
    }

    function draw(stepIdx) {
      const s = steps[stepIdx];
      const id = TOPIC_CONTAINER_WATER.id;
      const maxH = Math.max(...s.arr, 1);

      // Bar-chart style visualization
      const barsHTML = s.arr.map((v, i) => {
        const m = s.marks[i];
        const cls = m && m.cls ? m.cls : '';
        const tag = m && m.tag ? `<div class="box-tag">${m.tag}</div>` : '';
        const pct = (v / maxH * 100).toFixed(1);
        return `<div class="box ${cls}" style="height:${pct}%;min-height:24px;align-self:flex-end;display:flex;flex-direction:column;justify-content:flex-end;">
          <div class="box-val">${v}</div>${tag}
        </div>`;
      }).join('');

      stage.innerHTML = `
        <div class="boxes" style="align-items:flex-end;min-height:120px;">${barsHTML}</div>
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
      const raw = $('#cw-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      const a = raw.length >= 2 ? raw : [1, 8, 6, 2, 5, 4, 8, 3, 7];
      $('#cw-arr').value = a.join(', ');
      buildSteps(a);
      $(`#player-mount-${TOPIC_CONTAINER_WATER.id}`).innerHTML = '';
      $(`#desc-${TOPIC_CONTAINER_WATER.id}`).style.display = 'block';
      player = createStepPlayer({
        mount: $(`#player-mount-${TOPIC_CONTAINER_WATER.id}`),
        totalSteps: steps.length,
        onRender: draw
      });
    }

    rebuild();
    $('#cw-apply').addEventListener('click', rebuild);
    $('#cw-random').addEventListener('click', () => {
      const len = randomInt(7, 12);
      const arr = randomArray(len, 1, 15);
      $('#cw-arr').value = arr.join(', ');
      rebuild();
    });

    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`function maxWater(height):
    left = 0, right = n - 1
    maxArea = 0
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        maxArea = max(maxArea, w * h)
        if height[left] <= height[right]:
            left++
        else:
            right--
    return maxArea`)}

      ${cppPanel(this.id,
`#include <vector>
#include <algorithm>
using namespace std;

// Two Pointers — O(n) time, O(1) space
int maxWater(vector<int>& height) {
    int left = 0, right = (int)height.size() - 1;
    int maxArea = 0;
    while (left < right) {
        int w = right - left;
        int h = min(height[left], height[right]);
        maxArea = max(maxArea, w * h);
        if (height[left] <= height[right])
            left++;
        else
            right--;
    }
    return maxArea;
}`)}

      ${pythonPanel(this.id,
`# Two Pointers — O(n) time, O(1) space
def max_water(height):
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        w = right - left
        h = min(height[left], height[right])
        max_area = max(max_area, w * h)
        if height[left] <= height[right]:
            left += 1
        else:
            right -= 1
    return max_area`)}

      ${practicePanel(this.id, [
        { lvl: 'medium', title: 'Container With Most Water', slug: 'container-with-most-water0535', isBatch: false, company: 'Amazon, Google, Microsoft, Goldman Sachs', statement: 'Given n non-negative integers height[] where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water the container can store.', hint: 'Two pointers from ends. Move the shorter side inward — only way to potentially increase area.' },
        { lvl: 'hard', title: 'Trapping Rain Water', slug: 'trapping-rain-water-1587115621', isBatch: false, company: 'Amazon, Microsoft, Google, Goldman Sachs', statement: 'Given an array height[] representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', hint: 'Two-pointer variant: water at each position = min(leftMax, rightMax) - height[i].' }
      ])}
    `);

    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
