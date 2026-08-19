/* ---------- 7. KADANE'S ---------- */
const TOPIC_KADANE = {
  id: 'kadane',
  num: '08',
  title: "Kadane's Algorithm — Max Subarray Sum",
  tag: 'Arrays',
  intuition: 'At every index ask one question: does the running sum help me, or is it dragging me down? If it\'s negative, drop it and restart from here.',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>Array</label><input type="text" class="arr-input" id="kd-arr" value="-2,1,-3,4,-1,2,1,-5,4"><button class="primary" id="kd-apply">Apply</button><button id="kd-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [], arr = [];
    function build(a) {
      arr = a;
      steps = [];
      let currentSum = arr[0], bestSum = arr[0], tempStart = 0, start = 0, end = 0;
      steps.push({ i: 0, currentSum, bestSum, start, end, decision: `Start: currentSum = bestSum = ${arr[0]}` });
      for (let i = 1; i < arr.length; i++) {
        let decision;
        if (arr[i] > currentSum + arr[i]) {
          currentSum = arr[i];
          tempStart = i;
          decision = `arr[${i}]=${arr[i]} alone beats extending (${currentSum - arr[i] + arr[i]} vs prior) → RESTART here`;
        } else {
          currentSum += arr[i];
          decision = `Extending: currentSum + arr[${i}] is better than restarting → EXTEND`;
        }
        if (currentSum > bestSum) {
          bestSum = currentSum;
          start = tempStart;
          end = i;
        }
        steps.push({ i, currentSum, bestSum, start, end, decision });
      }
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_KADANE.id;
      const marks = {};
      for (let k = 0; k < arr.length; k++) {
        if (k >= s.start && k <= s.end) marks[k] = { cls: 'max' };
      }
      marks[s.i] = { ...(marks[s.i] || {}), cls: ((marks[s.i] && marks[s.i].cls) || '') + ' active', tag: 'i' };
      stage.innerHTML = `<div class="boxes">${boxesHTML(arr, marks)}</div>
        <div class="equation" style="font-size:16px;"><span class="op">currentSum →</span><div class="eq-box hl">${s.currentSum}</div><span class="op">bestSum →</span><div class="eq-box res">${s.bestSum}</div></div>
        <div class="decision">Extend previous subarray? <b>OR</b> Start a new subarray? → <b>${s.decision.includes('RESTART') ? 'RESTART' : 'EXTEND'}</b></div>`;
      $(`#desc-${id}`).textContent = s.decision;
      $(`#vars-${id}`).innerHTML = varsHTML({ i: s.i, currentSum: s.currentSum, bestSum: s.bestSum, window: `[${s.start}..${s.end}]` });
    }
    let player;
    function rebuild() {
      const a = $('#kd-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      build(a.length ? a : [0]);
      $(`#player-mount-${TOPIC_KADANE.id}`).innerHTML = '';
      $(`#desc-${TOPIC_KADANE.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_KADANE.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#kd-apply').addEventListener('click', rebuild);
    $('#kd-random').addEventListener('click', () => {
      $('#kd-arr').value = randomArray(9, -8, 8).join(',');
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`currentSum = bestSum = arr[0]
for i from 1 to n-1:
    currentSum = max(arr[i], currentSum + arr[i])
    bestSum = max(bestSum, currentSum)
return bestSum`)}
      ${cppPanel(this.id,
`int maxSubArray(vector<int>& arr){
    int currentSum = arr[0], bestSum = arr[0];
    for(int i=1; i<(int)arr.size(); i++){
        currentSum = max(arr[i], currentSum + arr[i]);
        bestSum = max(bestSum, currentSum);
    }
    return bestSum;
}

// Variant that also returns the subarray bounds
int maxSubArrayWithBounds(vector<int>& arr, int &start, int &end){
    int currentSum=arr[0], bestSum=arr[0], tempStart=0;
    start=0; end=0;
    for(int i=1;i<(int)arr.size();i++){
        if(arr[i] > currentSum+arr[i]){ currentSum=arr[i]; tempStart=i; }
        else currentSum += arr[i];
        if(currentSum>bestSum){ bestSum=currentSum; start=tempStart; end=i; }
    }
    return bestSum;
}`)}
      ${pythonPanel(this.id,
`# Kadane's Algorithm — Max Subarray Sum O(n)
def max_sub_array(arr):
    current_sum = best_sum = arr[0]
    for i in range(1, len(arr)):
        current_sum = max(arr[i], current_sum + arr[i])
        best_sum = max(best_sum, current_sum)
    return best_sum

# Variant with subarray bounds
def max_sub_array_bounds(arr):
    current_sum = best_sum = arr[0]
    start = end = temp_start = 0
    for i in range(1, len(arr)):
        if arr[i] > current_sum + arr[i]:
            current_sum = arr[i]
            temp_start = i
        else:
            current_sum += arr[i]
        if current_sum > best_sum:
            best_sum = current_sum
            start, end = temp_start, i
    return best_sum, start, end`)}
      ${practicePanel(this.id, [
        { lvl: 'medium', title: "Kadane's Algorithm — Max Subarray Sum", slug: 'kadanes-algorithm-1587115620', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Samsung, Flipkart', hint: 'Find contiguous subarray having the maximum possible sum in O(N) time and O(1) space.' },
        { lvl: 'medium', title: 'Max Sum Subarray by Removing at Most One Element', slug: 'max-sum-subarray-by-removing-at-most-one-element', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google', hint: 'Maintain forward and backward Kadane arrays to compute max sum after optional single deletion.' },
        { lvl: 'hard', title: 'Max Circular Subarray Sum', slug: 'max-circular-subarray-sum-1587115620', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Directi', hint: 'Answer is max(Standard Kadane, Total Sum - Minimum Subarray Sum).' },
        { lvl: 'medium', title: 'Longest Subarray of Evens and Odds', slug: 'longest-subarray-of-evens-and-odds', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, PayU', hint: 'Kadane-style transition tracking alternating parity of adjacent elements.' },
        { lvl: 'easy', title: 'Split an Array into Two Equal Sum Subarrays', slug: 'split-an-array-into-two-equal-sum-subarrays', track: 'array-fundamental-siddhartha', isBatch: true, company: 'TCS, Infosys', hint: 'Compute total sum and check if prefix sum ever equals total / 2.' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
    copyWire('copy-py-' + this.id, $(`#panel-${this.id}-python code`).textContent);
  }
};
