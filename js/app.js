/* ============================================================
   APPLICATION CONTROLLER & ROUTER
   ============================================================ */

function renderSidebar() {
  const sb = $('#sidebar');
  if (!sb) return;

  sb.innerHTML = `<div class="brand"><span class="brand-badge">DSA</span> Visual Lab</div>` +
    DAYS.map(day => `
      <div class="day-block ${day.status} ${day.id === 'day1' ? 'expanded' : ''}" data-day="${day.id}">
        <div class="day-head">
          <div class="day-head-title">
            <span class="day-arrow">${day.status === 'active' ? (day.id === 'day1' ? '▾' : '▸') : '▸'}</span>
            <span>${day.label}</span>
          </div>
          <span class="badge">${day.status === 'active' ? day.topics.length + ' topics' : 'soon'}</span>
        </div>
        <ul class="topic-list">
          ${day.topics.map(t => `<li data-day="${day.id}" data-topic="${t.id}"><span class="num">${t.num}</span>${t.title}</li>`).join('')}
        </ul>
      </div>
    `).join('');

  sb.addEventListener('click', e => {
    const li = e.target.closest('li[data-topic]');
    if (li) {
      openTopic(li.dataset.day, li.dataset.topic);
      return;
    }

    const head = e.target.closest('.day-head');
    if (head) {
      const block = head.closest('.day-block');
      if (block && block.classList.contains('active')) {
        block.classList.toggle('expanded');
        const arrow = head.querySelector('.day-arrow');
        if (arrow) {
          arrow.textContent = block.classList.contains('expanded') ? '▾' : '▸';
        }
      }
    }
  });
}

function openTopic(dayId, topicId) {
  const day = DAYS.find(d => d.id === dayId);
  if (!day) return;
  const topic = day.topics.find(t => t.id === topicId);
  if (!topic) return;

  const targetBlock = $(`.day-block[data-day="${dayId}"]`);
  if (targetBlock) {
    targetBlock.classList.add('expanded');
    const arrow = targetBlock.querySelector('.day-arrow');
    if (arrow) arrow.textContent = '▾';
  }

  $$('.topic-list li').forEach(li => li.classList.remove('active'));
  const active = $(`.topic-list li[data-day="${dayId}"][data-topic="${topicId}"]`);
  if (active) active.classList.add('active');

  const pageTitle = $('#pageTitle');
  const pagePath = $('#pagePath');
  const topicRoot = $('#topicRoot');

  if (pageTitle) pageTitle.textContent = topic.title;
  if (pagePath) pagePath.textContent = `${day.label.split('—')[0].trim()} · ${topic.tag}`;
  if (topicRoot) topic.mount(topicRoot);
}

// In-memory fallback (avoid relying on localStorage persistence issues in sandboxed/file viewers)
let _themeMem = null;
function localStorageSafe(key, val) {
  try {
    if (val === undefined) {
      return localStorage.getItem(key) || _themeMem;
    }
    localStorage.setItem(key, val);
    _themeMem = val;
    return val;
  } catch (e) {
    if (val !== undefined) _themeMem = val;
    return _themeMem;
  }
}

function initTheme() {
  const saved = localStorageSafe('dsa-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorageSafe('dsa-theme', next);
    });
  }
}

function initPresent() {
  const presentBtn = $('#presentBtn');
  const app = $('#app');
  if (presentBtn && app) {
    presentBtn.addEventListener('click', () => {
      app.classList.toggle('present');
      presentBtn.classList.toggle('on');
    });
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  initTheme();
  initPresent();
  openTopic('day1', 'complexity');
  const firstActive = $('.topic-list li[data-topic="complexity"]');
  if (firstActive) firstActive.classList.add('active');
});
