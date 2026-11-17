const PROJECTS = [
  {id:'english-tutor', file:'01-english-tutor.md', number:'01', label:'Обучение', title:'AI-репетитор английского языка', short:'Личный преподаватель, который подстраивает уроки под уровень, объясняет ошибки и помогает выстроить регулярную практику.', tags:['Диагностика','Уроки','Прогресс'], icon:'Aa', hue:'blue'},
  {id:'ai-sales-agent', file:'02-ai-sales-agent.md', number:'02', label:'Продажи', title:'Универсальный AI-продажник', short:'Настраиваемый менеджер ведёт диалог, разбирается в потребности клиента и помогает перейти к заявке или консультации.', tags:['Диалоги','База знаний','Заявки'], icon:'↗', hue:'orange'},
  {id:'rag-consultant', file:'03-rag-consultant.md', number:'03', label:'Знания', title:'AI-консультант с RAG', short:'Загрузите собственные документы и получите справочного ассистента, который отвечает по базе и показывает источники.', tags:['Документы','Поиск','Источники'], icon:'▤', hue:'blue'},
  {id:'meeting-secretary', file:'04-meeting-secretary.md', number:'04', label:'Продуктивность', title:'AI-секретарь совещаний', short:'Превращает запись встречи в расшифровку, протокол, список задач и удобный чат по содержанию разговора.', tags:['Аудио','Протокол','Задачи'], icon:'◉', hue:'orange'},
  {id:'ai-developer-website', file:'05-ai-developer-website.md', number:'05', label:'Бизнес', title:'Сайт AI-разработчика с AI-аудитором бизнеса', short:'Персональный сайт с анализом компании посетителя, идеями внедрения AI и мини-CRM для полученных заявок.', tags:['AI-аудит','Идеи','CRM'], icon:'✳', hue:'blue'},
];

const app = document.getElementById('app');
const toast = document.getElementById('toast');
const md = window.markdownit({html:false, linkify:true, typographer:true, breaks:false});
const BASE_PATH = window.APP_BASE_PATH || '/';
let rawDocument = '';
let currentProject = null;
let scrollHandler = null;
let toastTimer;

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); }
function projectPath(p) { return `${BASE_PATH}projects/${p.id}/`; }
function applyBaseLinks() { if(BASE_PATH === '/') return; document.querySelectorAll('a[href="/"]').forEach(a=>a.href=BASE_PATH); document.querySelectorAll('a[href="/#how-it-works"]').forEach(a=>a.href=`${BASE_PATH}#how-it-works`); }
function header(dark=false) { return `<header class="site-header ${dark?'on-dark':''}"><div class="wrap header-inner"><a href="/" class="brand" data-link aria-label="5 готовых AI-проектов — на главную"><span class="brand-mark">5<span>.</span></span><span class="brand-words">ГОТОВЫХ<br>AI-ПРОЕКТОВ</span></a><nav class="header-nav" aria-label="Основная навигация"><a href="/" data-link>Каталог</a><a href="/#how-it-works">Как использовать</a></nav><span class="header-edition">БИБЛИОТЕКА ТЗ <b>01—05</b></span></div></header>`; }
function card(p) { return `<a class="project-card ${p.hue}" href="${projectPath(p)}" data-link aria-label="Открыть техническое задание: ${p.title}"><div class="card-top"><span class="card-number">${p.number} <i>/ 05</i></span><span class="card-label">${p.label}</span></div><div class="card-art" aria-hidden="true"><span class="art-ring ring-one"></span><span class="art-ring ring-two"></span><span class="art-symbol">${p.icon}</span><span class="art-dot"></span></div><div class="card-body"><h3>${p.title}</h3><p>${p.short}</p><div class="tags">${p.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div><span class="card-link">Открыть техническое задание <span aria-hidden="true">↗</span></span></a>`; }
function renderHome() {
  if(scrollHandler){window.removeEventListener('scroll',scrollHandler);scrollHandler=null;}
  currentProject=null; rawDocument=''; document.title='5 готовых AI-проектов — библиотека технических заданий';
  app.innerHTML=`<div class="home">${header(true)}<main id="main"><section class="hero"><div class="hero-grid" aria-hidden="true"></div><div class="wrap hero-content"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-line"></span> ПРАКТИЧЕСКАЯ БИБЛИОТЕКА ДЛЯ ВЕБИНАРА</div><h1>5 готовых<br><em>AI-проектов<span class="orange-period">.</span></em></h1><p>Подробные технические задания для создания собственных AI-приложений с помощью Codex и других AI-инструментов разработки.</p><div class="hero-actions"><a href="#projects" class="btn btn-orange">Смотреть проекты <span>↘</span></a><span class="hero-note">Выберите проект.<br>Скопируйте ТЗ. Создайте приложение.</span></div></div><div class="hero-visual" aria-hidden="true"><div class="visual-orbit orbit-a"></div><div class="visual-orbit orbit-b"></div><div class="visual-disc"><div class="disc-mesh"></div><span>AI</span></div><div class="floating-label label-one">01 <strong>ИДЕЯ</strong></div><div class="floating-label label-two">05 <strong>ПРОЕКТОВ</strong></div><div class="visual-spark spark-one">✳</div><div class="visual-spark spark-two">✳</div></div></div><div class="wrap hero-bottom"><span>ОТ ИДЕИ К РАБОТАЮЩЕМУ ПРОДУКТУ</span><span>ПРОКРУТИТЕ ВНИЗ <b>↓</b></span></div></section><section class="intro-strip"><div class="wrap strip-inner"><div><strong>05</strong><span>прикладных направлений</span></div><div><strong>24</strong><span>раздела в каждом ТЗ</span></div><div><strong>100%</strong><span>текст доступен для копирования</span></div></div></section><section id="projects" class="catalog wrap"><div class="section-heading"><div><div class="section-kicker">01 / ВЫБЕРИТЕ НАПРАВЛЕНИЕ</div><h2>Проект под вашу<br><em>задачу</em></h2></div><p>От обучения и продаж до работы с документами и анализа бизнеса. Каждое ТЗ описывает полноценное приложение: интерфейсы, данные, AI-логику, безопасность и запуск.</p></div><div class="cards">${PROJECTS.map(card).join('')}</div></section><section id="how-it-works" class="how"><div class="wrap how-inner"><div class="how-head"><div class="section-kicker">02 / КАК ЭТО РАБОТАЕТ</div><h2>Три шага<br>до собственного<br><em>приложения</em></h2></div><div class="steps"><div class="step"><span>01</span><div><h3>Выберите проект</h3><p>Откройте подробное техническое задание для нужной задачи.</p></div></div><div class="step"><span>02</span><div><h3>Скопируйте ТЗ</h3><p>Передайте полный Markdown в Codex, Replit или другую среду AI-разработки.</p></div></div><div class="step"><span>03</span><div><h3>Ответьте на вопросы</h3><p>AI-разработчик уточнит важные настройки и создаст приложение по инструкции.</p></div></div></div></div></section><section class="closing wrap"><div><span class="section-kicker">МОЖНО НАЧАТЬ ПРЯМО СЕЙЧАС</span><h2>Выберите идею.<br><em>Сделайте её своей.</em></h2></div><a href="#projects" class="btn btn-dark">К каталогу проектов <span>↗</span></a></section></main><footer class="footer"><div class="wrap footer-inner"><span>5 ГОТОВЫХ AI-ПРОЕКТОВ</span><span>Технические задания для самостоятельной разработки</span><a href="#main">Наверх ↑</a></div></footer></div>`;
  applyBaseLinks();
}

function download(name, text) { const blob=new Blob([text],{type:'text/plain;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1500); }
async function copyDocument() { try { await navigator.clipboard.writeText(rawDocument); notify('Полное ТЗ скопировано'); } catch { const area=document.createElement('textarea'); area.value=rawDocument; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select(); const ok=document.execCommand('copy'); area.remove(); notify(ok?'Полное ТЗ скопировано':'Не удалось скопировать текст'); } }

function buildSections(html) {
  const temp=document.createElement('div'); temp.innerHTML=html;
  const nodes=[...temp.childNodes]; const sections=[]; let section=null; let intro=[];
  for(const node of nodes){
    if(node.nodeType===1 && node.tagName==='H2'){
      if(section) sections.push(section);
      section={title:node.textContent, nodes:[node]};
    } else if(section) section.nodes.push(node); else intro.push(node);
  }
  if(section) sections.push(section);
  const introHtml=intro.map(n=>n.outerHTML||n.textContent).join('');
  const rendered=sections.map((s,i)=>{
    const id=`section-${i+1}`;
    return `<section class="doc-section" id="${id}"><div class="doc-section-head"><span class="section-index">${String(i+1).padStart(2,'0')}</span><button class="collapse-btn" aria-label="Свернуть или развернуть раздел ${escapeHTML(s.title)}" aria-expanded="true" data-collapse="${id}">−</button></div><div class="doc-section-content">${s.nodes.map(n=>n.outerHTML||n.textContent).join('')}</div></section>`;
  }).join('');
  return {introHtml, rendered, toc:sections.map((s,i)=>({id:`section-${i+1}`,title:s.title}))};
}

async function renderProject(p) {
  currentProject=p; document.title=`${p.title} — 5 готовых AI-проектов`;
  app.innerHTML=`${header()}<main id="main" class="project-page"><div class="wrap loading">Загружаем техническое задание…</div></main>`;
  try {
    let raw;
    try {const res=await fetch(`${BASE_PATH}docs/${p.file}`,{cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status); raw=await res.text();}
    catch(error) {raw=window.TZ_DOCS?.[p.file]; if(!raw) throw error;}
    if(currentProject!==p) return; rawDocument=raw;
    const safe=DOMPurify.sanitize(md.render(raw),{USE_PROFILES:{html:true}});
    const {introHtml,rendered,toc}=buildSections(safe);
    const words=raw.trim().split(/\s+/).length;
    const minutes=Math.max(1,Math.ceil(words/180));
    app.innerHTML=`${header()}<main id="main" class="project-page"><div class="project-banner"><div class="wrap banner-inner"><div><a href="/" data-link class="back-link">← Вернуться в каталог</a><div class="banner-kicker">ПРОЕКТ ${p.number} / ${p.label.toUpperCase()}</div><h1>${p.title}</h1><p>${p.short}</p><div class="banner-meta"><span>ПОЛНОЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ</span><span>${toc.length} РАЗДЕЛОВ</span><span>≈ ${minutes} МИН ЧТЕНИЯ</span></div></div><div class="banner-icon ${p.hue}" aria-hidden="true"><span>${p.icon}</span></div></div></div><div class="wrap document-layout"><aside class="toc"><div class="toc-title">СОДЕРЖАНИЕ <span>${toc.length}</span></div><nav aria-label="Оглавление технического задания">${toc.map((item,i)=>`<a href="#${item.id}" class="toc-link ${i===0?'active':''}" data-toc="${item.id}"><b>${String(i+1).padStart(2,'0')}</b><span>${escapeHTML(item.title.replace(/^\d+\.\s*/,''))}</span></a>`).join('')}</nav></aside><div class="document-main"><div class="toolbar"><div class="toolbar-copy"><strong>Техническое задание</strong><span>Оригинальный Markdown · ${words.toLocaleString('ru-RU')} слов</span></div><div class="toolbar-actions"><button class="action-btn primary" id="copy-button">Скопировать всё ТЗ <span>⧉</span></button><button class="action-btn" id="md-button">Скачать Markdown <span>↓</span></button><button class="action-btn" id="txt-button">Скачать TXT <span>↓</span></button></div></div><article class="document"><div class="doc-intro">${introHtml}</div>${rendered}</article><div class="document-end"><span>КОНЕЦ ТЕХНИЧЕСКОГО ЗАДАНИЯ</span><button class="action-btn primary" id="copy-bottom">Скопировать всё ТЗ <span>⧉</span></button><a href="/" data-link>← Все проекты</a></div></div></div><button class="back-to-top" id="back-top" aria-label="Вернуться наверх">↑</button></main><footer class="footer"><div class="wrap footer-inner"><span>5 ГОТОВЫХ AI-ПРОЕКТОВ</span><span>Полные технические задания в Markdown</span><a href="/" data-link>Каталог ↑</a></div></footer>`;
    applyBaseLinks();
    document.getElementById('copy-button').addEventListener('click',copyDocument);
    document.getElementById('copy-bottom').addEventListener('click',copyDocument);
    document.getElementById('md-button').addEventListener('click',()=>download(p.file,rawDocument));
    document.getElementById('txt-button').addEventListener('click',()=>download(p.file.replace(/\.md$/,'.txt'),rawDocument));
    document.getElementById('back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.querySelectorAll('[data-collapse]').forEach(button=>button.addEventListener('click',()=>{
      const section=document.getElementById(button.dataset.collapse); const collapsed=section.classList.toggle('collapsed'); button.setAttribute('aria-expanded',String(!collapsed)); button.textContent=collapsed?'+':'−';
    }));
    document.querySelectorAll('[data-toc]').forEach(link=>link.addEventListener('click',event=>{
      event.preventDefault();
      const target=document.getElementById(link.dataset.toc);
      if(!target) return;
      history.replaceState(null,'',`#${target.id}`);
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    if(scrollHandler) window.removeEventListener('scroll',scrollHandler);
    const sections=[...document.querySelectorAll('.doc-section')];
    scrollHandler=()=>{
      let active=sections[0];
      for(const section of sections){if(section.getBoundingClientRect().top<=135) active=section; else break;}
      document.querySelectorAll('.toc-link').forEach(a=>a.classList.toggle('active',a.dataset.toc===active?.id));
    };
    window.addEventListener('scroll',scrollHandler,{passive:true});
    scrollHandler();
  } catch(error) { app.innerHTML=`${header()}<main id="main" class="wrap error-page"><h1>Не удалось открыть документ</h1><p>Проверьте, что локальный сервер запущен и файл ТЗ находится в папке docs.</p><a class="btn btn-dark" href="/" data-link>Вернуться в каталог</a></main>`; applyBaseLinks(); console.error(error); }
}

function route(){ const path=location.pathname.startsWith(BASE_PATH)?location.pathname.slice(BASE_PATH.length-1):location.pathname; const match=path.match(/^\/projects\/([a-z0-9-]+)\/?$/); const p=match&&PROJECTS.find(p=>p.id===match[1]); if(p) renderProject(p); else renderHome(); window.scrollTo(0,0); }
document.addEventListener('click',event=>{const a=event.target.closest('a[data-link]'); if(!a || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || a.target) return; event.preventDefault(); history.pushState(null,'',a.href); route();});
window.addEventListener('popstate',route);
route();
