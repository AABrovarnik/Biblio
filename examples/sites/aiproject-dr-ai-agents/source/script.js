const agents = window.AGENTS;
const sections = [
  { id: 'front', number: '01', range: '01—15', title: 'Клиенты и продажи', display: 'Front <em>Office</em>', subtitle: 'Агенты на первой линии: отвечают, консультируют, помогают выбрать и поддерживают контакт с клиентом.', label: 'B2B / ВНЕШНИЕ ПРОЦЕССЫ' },
  { id: 'back', number: '02', range: '16—35', title: 'Внутри компании', display: 'Back <em>Office</em>', subtitle: 'Агенты для команды и процессов: документы, аналитика, управление, обучение и операционная работа.', label: 'B2B / ВНУТРЕННИЕ ПРОЦЕССЫ' },
  { id: 'personal', number: '03', range: '36—50', title: 'Для себя', display: 'Для <em>жизни</em>', subtitle: 'Личные помощники для учёбы, карьеры, повседневных решений и заботы о себе.', label: 'B2C / ЛИЧНОЕ ИСПОЛЬЗОВАНИЕ' },
];

const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const num = value => String(value).padStart(2, '0');
const agentId = value => `agent-${num(value)}`;
const agentLink = (agent, className) => `<a class="${className}" href="#${agentId(agent.number)}"><b>${num(agent.number)}</b><span>${esc(agent.title)}</span></a>`;

document.getElementById('agent-sections').innerHTML = sections.map(section => {
  const group = agents.filter(agent => agent.section === section.id);
  return `<section class="chapter" id="${section.id}" data-section="${section.id}">
    <div class="chapter-cover">
      <div class="chapter-top"><span>РАЗДЕЛ ${section.number} / 03</span><span>${section.label}</span></div>
      <span class="chapter-kicker">${section.number} / ${section.title.toUpperCase()}</span>
      <h2>${section.display}</h2>
      <p>${section.subtitle}</p>
      <div class="chapter-meta"><span>${section.range} / 50</span><span>${group.length} АГЕНТОВ ↓</span></div>
    </div>
    <div class="agents-wrap">${group.map(agent => {
      const next = agents[agent.number];
      return `<article class="agent-card" id="${agentId(agent.number)}" data-agent-number="${agent.number}">
        <div class="agent-heading"><span class="agent-num">${num(agent.number)}</span><h3>${esc(agent.title)}</h3><span class="agent-family">${section.label}</span></div>
        <div class="agent-content">
          <div class="agent-block"><span class="block-label"><i></i> ЧТО ДЕЛАЕТ</span><p>${esc(agent.description)}</p></div>
          <div class="agent-block example"><span class="block-label"><i></i> ПРИМЕР ПРИМЕНЕНИЯ</span><p>${esc(agent.example)}</p></div>
        </div>
        <div class="agent-next"><span>АГЕНТ ${num(agent.number)} / 50</span>${next ? `<a href="#${agentId(next.number)}">СЛЕДУЮЩИЙ АГЕНТ ↗</a>` : '<a href="#finish">К ЗАВЕРШЕНИЮ ↗</a>'}</div>
      </article>`;
    }).join('')}</div>
  </section>`;
}).join('');

document.getElementById('side-list').innerHTML = sections.map(section => `<div class="side-group"><div class="side-group-title">${section.number} / ${section.title.toUpperCase()}</div>${agents.filter(agent => agent.section === section.id).map(agent => agentLink(agent, 'side-agent')).join('')}</div>`).join('');
document.getElementById('drawer-chapters').innerHTML = sections.map(section => `<a href="#${section.id}">${section.title}</a>`).join('');

const drawer = document.getElementById('mobile-drawer');
const backdrop = document.getElementById('drawer-backdrop');
const search = document.getElementById('agent-search');
const triggers = [document.querySelector('.menu-trigger'), document.getElementById('mobile-dock')];
let lastFocus = null;

function renderDrawer(query = '') {
  const normalized = query.trim().toLocaleLowerCase('ru');
  const html = sections.map(section => {
    const group = agents.filter(agent => agent.section === section.id && (!normalized || agent.title.toLocaleLowerCase('ru').includes(normalized) || String(agent.number).includes(normalized)));
    if (!group.length) return '';
    return `<div class="drawer-group">${section.number} / ${section.title.toUpperCase()}</div>${group.map(agent => agentLink(agent, 'drawer-agent')).join('')}`;
  }).join('');
  document.getElementById('drawer-list').innerHTML = html || '<p class="drawer-empty">По вашему запросу агенты не найдены.</p>';
}
renderDrawer();

function setDrawer(open) {
  if (open) lastFocus = document.activeElement;
  drawer.hidden = !open;
  backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  triggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(open)));
  if (open) { search.value = ''; renderDrawer(); search.focus(); }
  else if (lastFocus instanceof HTMLElement) lastFocus.focus();
}
triggers.forEach(trigger => trigger.addEventListener('click', () => setDrawer(true)));
document.getElementById('drawer-close').addEventListener('click', () => setDrawer(false));
backdrop.addEventListener('click', () => setDrawer(false));
search.addEventListener('input', () => renderDrawer(search.value));
drawer.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) setDrawer(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !drawer.hidden) setDrawer(false);
});

const sideAgents = [...document.querySelectorAll('.side-agent')];
const sideChapters = [...document.querySelectorAll('.chapter-nav a')];
const dockCount = document.getElementById('dock-count');
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const number = Number(entry.target.dataset.agentNumber);
    sideAgents.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${agentId(number)}`));
    const section = agents[number - 1].section;
    sideChapters.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${section}`));
    dockCount.textContent = `${num(number)} / 50`;
  }
}, { rootMargin: '-15% 0px -70% 0px' });
document.querySelectorAll('.agent-card').forEach(card => observer.observe(card));

if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
