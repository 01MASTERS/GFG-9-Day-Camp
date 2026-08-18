/* ---------- 9. MEDIAN ---------- */
const TOPIC_MEDIAN = {
  id: 'median',
  num: '10',
  title: 'Median of an Array',
  tag: 'Arrays',
  intuition: 'Median needs order. Sort the array first — then the median is just the middle element (odd length) or the average of the two middle elements (even length).',
  time: 'O(n log n)',
  space: 'O(1) extra (in-place sort)',
  mount(root) {
    baseTopicShell(root, {
      id: this.id,
      title: this.title,
      intuition: this.intuition,
      time: this.time,
      space: this.space,
      extraControls: `<label>Array</label><input type="text" class="arr-input" id="md-arr" value="9,3,7,1,5,8,2"><button class="primary" id="md-apply">Apply</button><button id="md-random">🎲 Random</button>`
    });
    const stage = $(`#stage-${this.id}`);
    let steps = [], original = [];
    function build(a) {
      original = [...a];
      steps = [];
      let arr = [...a];
      steps.push({ snap: [...arr], i: -1, j: -1, swapped: false, note: 'Original (unsorted) array' });
      for (let i = 1; i < arr.length; i++) {
        let j = i - 1, keyVal = arr[i];
        steps.push({ snap: [...arr], i, j: i, swapped: false, note: `Consider element at index ${i} (value ${keyVal}) to insert into sorted part` });
        while (j >= 0 && arr[j] > keyVal) {
          arr[j + 1] = arr[j];
          steps.push({ snap: [...arr], i: j, j: j + 1, swapped: true, note: `${arr[j + 1]} > ${keyVal} → shift right` });
          j--;
        }
        arr[j + 1] = keyVal;
        steps.push({ snap: [...arr], i: j + 1, j: j + 1, swapped: false, note: `Insert ${keyVal} at index ${j + 1}` });
      }
      const n = arr.length;
      const mid = Math.floor(n / 2);
      const median = n % 2 === 1 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
      steps.push({ snap: [...arr], phase: 'result', median, mid, n, odd: n % 2 === 1 });
      return steps;
    }
    function draw(i) {
      const s = steps[i];
      const id = TOPIC_MEDIAN.id;
      const marks = {};
      if (s.phase === 'result') {
        if (s.odd) marks[s.mid] = { cls: 'max', tag: 'median' };
        else {
          marks[s.mid - 1] = { cls: 'max', tag: 'median' };
          marks[s.mid] = { cls: 'max', tag: 'median' };
        }
        stage.innerHTML = `<div class="boxes">${boxesHTML(s.snap, marks)}</div><div class="equation"><div class="eq-box res">Median = ${s.median}</div></div>`;
        $(`#desc-${id}`).textContent = `Array is sorted. n=${s.n} is ${s.odd ? 'odd' : 'even'} → median is ${s.odd ? 'the single middle element' : 'the average of the two middle elements'}.`;
        $(`#vars-${id}`).innerHTML = varsHTML({ n: s.n, median: s.median });
      } else {
        if (s.i >= 0) marks[s.i] = { cls: s.swapped ? 'bad' : 'active', tag: s.i === s.j ? '' : '' };
        if (s.j >= 0) marks[s.j] = { cls: 'active', tag: 'j' };
        stage.innerHTML = `<div class="boxes">${boxesHTML(s.snap, marks)}</div>`;
        $(`#desc-${id}`).textContent = s.note;
        $(`#vars-${id}`).innerHTML = varsHTML({});
      }
    }
    let player;
    function rebuild() {
      const a = $('#md-arr').value.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      build(a.length ? a : [0]);
      $(`#player-mount-${TOPIC_MEDIAN.id}`).innerHTML = '';
      $(`#desc-${TOPIC_MEDIAN.id}`).style.display = 'block';
      player = createStepPlayer({ mount: $(`#player-mount-${TOPIC_MEDIAN.id}`), totalSteps: steps.length, onRender: draw });
    }
    rebuild();
    $('#md-apply').addEventListener('click', rebuild);
    $('#md-random').addEventListener('click', () => {
      $('#md-arr').value = randomArray(7, 1, 60).join(',');
      rebuild();
    });
    $(`#tabs-${this.id}`).insertAdjacentHTML('afterend', `
      ${pseudoPanel(this.id,
`sort(array)
n = length(array)
if n is odd:  median = array[n/2]
else:         median = (array[n/2 - 1] + array[n/2]) / 2`)}
      ${cppPanel(this.id,
`double findMedian(vector<int> arr){
    sort(arr.begin(), arr.end());
    int n = arr.size();
    if(n % 2 == 1) return arr[n/2];
    return (arr[n/2 - 1] + arr[n/2]) / 2.0;
}`)}
      ${practicePanel(this.id, [
        { lvl: 'easy', title: 'Segregate 0s and 1s (Two-Pointer In-Place Partition)', slug: 'segregate-0s-and-1s5106', track: 'array-fundamental-siddhartha', isBatch: true, company: 'Amazon, Paytm, Infosys', hint: 'Two-pointer approach or Dutch National Flag partition in single pass.' },
        { lvl: 'medium', title: 'Reverse Array in Groups of Size K', slug: 'reverse-array-in-groups0255', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Adobe', hint: 'Loop i by step k and reverse subarray from i to min(i+k-1, n-1).' },
        { lvl: 'medium', title: 'Rearrange an Array with O(1) Extra Space (A[i] = A[A[i]])', slug: 'rearrange-an-array-with-o1-extra-space3142', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Samsung', hint: 'Encode two numbers at one index using formula: arr[i] += (arr[arr[i]] % n) * n.' },
        { lvl: 'medium', title: 'Stock Buy and Sell (Multiple Transactions Allowed)', slug: 'stock-buy-and-sell2615', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Flipkart', hint: 'Greedy valley-to-peak approach accumulating profit whenever arr[i] > arr[i-1].' },
        { lvl: 'hard', title: 'Trapping Rain Water', slug: 'trapping-rain-water-1587115621', track: 'array-practice-siddhartha', isBatch: true, company: 'Amazon, Microsoft, Google', hint: 'Two pointers tracking left_max and right_max to calculate water trapped above each bar.' },
        { lvl: 'hard', title: 'Median of 2 Sorted Arrays of Different Sizes', slug: 'median-of-2-sorted-arrays-of-different-sizes', isBatch: false, company: 'Amazon, Microsoft, Google', hint: 'Binary search on smaller array to partition both arrays in O(log(min(N, M))).' }
      ])}
    `);
    wireTabs(this.id);
    copyWire('copy-' + this.id, $(`#panel-${this.id}-cpp code`).textContent);
  }
};
