/* ============================================================
   UTILITIES & REUSABLE UI ENGINE
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomArray(n, min, max) {
  return Array.from({ length: n }, () => randomInt(min, max));
}

function esc(s) {
  return String(s);
}

function varsHTML(vars) {
  return Object.entries(vars)
    .map(([k, v]) => `<div class="var-tag"><span class="var-k">${k} =</span><span class="var-v">${v}</span></div>`)
    .join('');
}

function boxesHTML(arr, marks = {}) {
  return arr.map((v, i) => {
    const m = marks[i];
    const cls = m && m.cls ? ' ' + m.cls : '';
    const tag = m && m.tag ? `<div class="box-tag">${m.tag}</div>` : '';
    return `<div class="box${cls}"><div class="box-val">${esc(v)}</div>${tag}</div>`;
  }).join('');
}

function createStepPlayer({ mount, totalSteps, onRender, speed = 900 }) {
  let idx = 0, playing = false, timer = null;
  const wrap = document.createElement('div');
  wrap.className = 'player';
  wrap.innerHTML = `
    <div class="player-row">
      <button class="pbtn" data-act="reset" title="Reset">⟲</button>
      <button class="pbtn" data-act="back" title="Step Back">◀</button>
      <button class="pbtn pbtn-play" data-act="play" title="Play / Pause">▶</button>
      <button class="pbtn" data-act="fwd" title="Step">►</button>
      <div class="player-progress"><div class="player-bar"><div class="player-fill"></div></div><span class="player-count">1 / ${totalSteps}</span></div>
      <div class="player-speed"><label>Speed</label><input type="range" min="200" max="2000" step="100" value="${speed}"></div>
    </div>`;
  mount.appendChild(wrap);

  const fill = $('.player-fill', wrap);
  const count = $('.player-count', wrap);
  const playBtn = $('.pbtn-play', wrap);
  const speedInput = $('input[type=range]', wrap);

  function render() {
    onRender(idx);
    const total = Math.max(totalSteps - 1, 1);
    fill.style.width = (idx / total * 100) + '%';
    count.textContent = `${idx + 1} / ${totalSteps}`;
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    playBtn.textContent = '▶';
  }

  function play() {
    if (idx >= totalSteps - 1) idx = 0;
    playing = true;
    playBtn.textContent = '⏸';
    timer = setInterval(() => {
      if (idx < totalSteps - 1) {
        idx++;
        render();
      } else {
        stop();
      }
    }, Number(speedInput.value));
  }

  wrap.addEventListener('click', e => {
    const b = e.target.closest('.pbtn');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'reset') { stop(); idx = 0; render(); }
    else if (act === 'back') { stop(); idx = Math.max(0, idx - 1); render(); }
    else if (act === 'fwd') { stop(); idx = Math.min(totalSteps - 1, idx + 1); render(); }
    else if (act === 'play') { playing ? stop() : play(); }
  });

  speedInput.addEventListener('input', () => {
    if (playing) { stop(); play(); }
  });

  render();

  return {
    goTo(i) {
      stop();
      idx = Math.max(0, Math.min(totalSteps - 1, i));
      render();
    }
  };
}

function tabsHTML(id, tabs) {
  // tabs: [{key, label}]
  const btns = tabs.map((t, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`).join('');
  return `<div class="tabs" id="tabs-${id}">${btns}</div>`;
}

function wireTabs(id) {
  const root = $(`#tabs-${id}`);
  if (!root) return;
  root.addEventListener('click', e => {
    const b = e.target.closest('.tab-btn');
    if (!b) return;
    $$('.tab-btn', root).forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const scope = root.closest('.topic');
    $$('.tab-panel', scope).forEach(p => p.classList.remove('active'));
    $(`#panel-${id}-${b.dataset.tab}`, scope).classList.add('active');
  });
}

function copyWire(btnId, text) {
  const btn = $('#' + btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      const b = $('#' + btnId);
      const old = b.textContent;
      b.textContent = 'Copied!';
      setTimeout(() => b.textContent = old, 1200);
    });
  });
}

const BATCH_SLUG = "dsa-training-siddhartha-academy";

function batchProblem(trackSlug, problemSlug) {
  return `https://www.geeksforgeeks.org/batch/${BATCH_SLUG}/track/${trackSlug}/problem/${problemSlug}`;
}

function gfgProblem(slug) {
  return `https://www.geeksforgeeks.org/problems/${slug}/1`;
}

function practiceHTML(items) {
  return `<div class="practice-grid">${items.map(it => {
    const isBatch = it.isBatch !== false;
    const badgeHtml = isBatch 
      ? `<span class="practice-badge practice-badge-batch">🎯 Siddhartha Batch Problem</span>`
      : `<span class="practice-badge practice-badge-gfg">GFG Standard</span>`;
    
    const lvlClass = `lvl-${(it.lvl || 'easy').toLowerCase()}`;
    let targetLink = it.link;
    if (!targetLink) {
      if (it.track && it.slug) {
        targetLink = batchProblem(it.track, it.slug);
      } else if (it.slug) {
        targetLink = isBatch ? batchProblem(it.track || 'mathematics-siddhartha', it.slug) : gfgProblem(it.slug);
      } else {
        targetLink = `https://www.geeksforgeeks.org/?s=${encodeURIComponent(it.title)}`;
      }
    }

    return `
      <div class="practice-card">
        <div class="practice-card-top">
          ${badgeHtml}
          <span class="lvl ${lvlClass}">${(it.lvl || 'EASY').toUpperCase()}</span>
        </div>
        <a class="practice-title" href="${targetLink}" target="_blank" rel="noopener">
          <span>${escapeHtml(it.title)}</span>
          <svg class="ext-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        ${it.company ? `<div class="co">🏢 Asked at: <b>${escapeHtml(it.company)}</b></div>` : ''}
        ${it.hint ? `<div class="practice-hint">💡 ${escapeHtml(it.hint)}</div>` : ''}
      </div>
    `;
  }).join('')}</div>`;
}

function gfg(q) {
  return `https://www.geeksforgeeks.org/?s=${encodeURIComponent(q)}`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCpp(code) {
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|(\b(?:int|long|double|float|char|bool|void|auto|string|vector|pair|map|set|unordered_map|unordered_set|queue|stack|priority_queue|size_t)\b)|(\b(?:return|if|else|while|for|break|continue|switch|case|default|class|struct|public|private|protected|const|static|new|delete|sizeof|typedef|using|namespace|true|false|nullptr|NULL|function|in)\b)|(\b(?:cout|cin|endl|std|swap|max|min|sort|abs|sqrt|log2|push_back|pop_back|push|pop|top|front|back|size|empty|clear|insert|find|erase|pow)\b)|(\b[a-zA-Z_]\w*(?=\s*\())|(\b\d+(?:\.\d+)?\b)|(->|::|==|!=|<=|>=|&&|\|\||\+\+|--|[+\-*/%=<>!&|^~?:])/g;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }
    const [full, comment, str, type, kw, builtin, func, num, op] = match;
    if (comment) result += `<span class="syn-comment">${escapeHtml(comment)}</span>`;
    else if (str) result += `<span class="syn-string">${escapeHtml(str)}</span>`;
    else if (type) result += `<span class="syn-type">${escapeHtml(type)}</span>`;
    else if (kw) result += `<span class="syn-kw">${escapeHtml(kw)}</span>`;
    else if (builtin) result += `<span class="syn-builtin">${escapeHtml(builtin)}</span>`;
    else if (func) result += `<span class="syn-func">${escapeHtml(func)}</span>`;
    else if (num) result += `<span class="syn-num">${escapeHtml(num)}</span>`;
    else if (op) result += `<span class="syn-op">${escapeHtml(op)}</span>`;
    else result += escapeHtml(full);

    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }
  return result;
}

function baseTopicShell(root, { id, title, intuition, time, space, extraControls = '' }) {
  root.innerHTML = `
    <div class="topic">
      <h2>${title}</h2>
      <p class="intuition">${intuition}</p>
      <div class="complexity-row">
        <span class="chip time">TIME ${time}</span>
        <span class="chip space">SPACE ${space}</span>
      </div>
      <div class="controls" id="ctrl-${id}">${extraControls}</div>
      <div id="player-mount-${id}"></div>
      <div class="stage" id="stage-${id}"></div>
      <div class="step-desc" id="desc-${id}" style="display:none;margin:0 auto 16px;"></div>
      <div class="vars-panel" id="vars-${id}"></div>
      ${tabsHTML(id, [
        { key: 'pseudo', label: 'Pseudocode' },
        { key: 'cpp', label: 'C++ Solution' },
        { key: 'practice', label: 'Practice' }
      ])}
    </div>
  `;
}

function pseudoPanel(id, text) {
  return `<div class="tab-panel active" id="panel-${id}-pseudo"><div class="pseudo">${escapeHtml(text)}</div></div>`;
}

function cppPanel(id, code) {
  return `<div class="tab-panel" id="panel-${id}-cpp">
    <div class="code-wrap">
      <div class="code-header">
        <span class="code-lang-tag">C++ Solution</span>
        <button class="copy-btn" id="copy-${id}">Copy</button>
      </div>
      <pre class="vscode-theme"><code>${highlightCpp(code)}</code></pre>
    </div>
  </div>`;
}

function practicePanel(id, items) {
  return `<div class="tab-panel" id="panel-${id}-practice">${practiceHTML(items)}</div>`;
}

