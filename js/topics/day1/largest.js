/* ---------- 5. LARGEST / SECOND LARGEST ---------- */
const TOPIC_LARGEST = {
  id: 'largest',
  num: '06',
  title: 'Largest & Second Largest Element',
  tag: 'Arrays',
  intuition: 'One pass, two trackers. Walk the array once; whenever you beat the current max, the old max slides down into second place.',
  time: 'O(n)',
  space: 'O(1)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>Array</label><input type="text" class="arr-input" id="lg-arr" value="10,7,25,3,18,25,40,12"><button class="primary" id="lg-apply">Apply</button><button id="lg-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [], arr = [];
    function build(a) {
      arr = a;
      steps = [];
      let max = -Infinity, second = -Infinity;
      steps.push({ i: -1, max, second, note: 'Start: max = second = -∞' });
      for (let i = 0; i < arr.length; i++) {
        let note;
        if (arr[i] > max) {
          second = max;
          max = arr[i];
          note = `${arr[i]} beats current max → new max, old max becomes second`;
        } else if (arr[i] > second && arr[i] !== max) {
          second = arr[i];
          note = `${arr[i]} beats second (but not max) → new second`;
        } else {
          note = `${arr[i]} doesn't beat max or second → no change`;
        }
        steps.push({ i, max, second, note });
      }
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_LARGEST.id;
      const marks = {};
      if (s.i >= 0) marks[s.i] = { cls: 'active', tag: 'i' };
      arr.forEach((v, idx) => {
        if (v === s.max && idx <= s.i) marks[idx] = { ...(marks[idx] || {}), cls: ((marks[idx] && marks[idx].cls) || '') + ' max' };
      });
      stage.innerHTML = `<div class="boxes">${boxesHTML(arr, marks)}</div>`;
      $(`#desc-${id}`).textContent = s.note;
      $(`#vars-${id}`).innerHTML = varsHTML({
        i: s.i < 0 ? '—' : s.i,
        max: s.max === -Infinity ? '—' : s.max,
        second: s.second === -Infinity ? '—' : s.second
      });
    }
    let player;
    function rebuild() {
      const a = $('#lg-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      build(a.length ? a : [1]);
      $(`#player-mount-${TOPIC_LARGEST.id}`).innerHTML = '';
      $(`#desc-${TOPIC_LARGEST.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_LARGEST.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#lg-apply').addEventListener('click', rebuild);
    $('#lg-random').addEventListener('click', () => {
      $('#lg-arr').value = randomArray(8, 1, 60).join(',');
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`max = second = -infinity
for each x in array:
    if x > max:
        second = max
        max = x
    else if x > second and x != max:
        second = x`)}
      ${cppPanel(this.id,
`pair<int,int> largestAndSecond(vector<int>& arr){
    long long maxV = LLONG_MIN, secondV = LLONG_MIN;
    for(int x : arr){
        if(x > maxV){ secondV = maxV; maxV = x; }
        else if(x > secondV && x != maxV){ secondV = x; }
    }
    return {maxV, secondV};
}`)}
      ${practicePanel(this.id, [
        { lvl: 'basic', title: 'Array Insert at Index', slug: 'array-insert-at-index', track: 'array-fundamental-siddhartha', isBatch: true, company: 'TCS, Wipro', hint: 'Shift elements to right to insert value at index in 0-indexed array.' },
        { lvl: 'easy', title: 'Buildings Receiving Sunlight (Prefix Max)', slug: 'buildings-receiving-sunlight3032', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Infosys', hint: 'Building sees sunlight if its height is strictly greater than all preceding buildings.' },
        { lvl: 'easy', title: 'Second Largest Element in Array', slug: 'second-largest3735', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Adobe', hint: 'One pass with two variables to track largest and strictly smaller second largest.' },
        { lvl: 'medium', title: 'Maximum Index — Max (j - i) such that A[j] >= A[i]', slug: 'maximum-index-1587115620', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft, MakeMyTrip', hint: 'Precompute prefix minimums and suffix maximums, then use two pointers.' },
        { lvl: 'medium', title: 'Rotate Array by N Elements (O(1) Auxiliary Space)', slug: 'rotate-array-by-n-elements-1587115621', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Flipkart', hint: 'Reverse subarray 0..d-1, reverse d..n-1, then reverse entire array 0..n-1.' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
