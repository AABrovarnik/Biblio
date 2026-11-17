# Шаблон каталога ТЗ (SPA)

Источник шаблона: `examples/sites/aiproject-dr-five-ai-projects/source/`

## Состав шаблона

- `header` — бренд + навигация.
- `hero` + `cards grid` — каталог проектов.
- `project page` — баннер проекта, оглавление, рендер Markdown.
- `toolbar` — кнопки копирования и скачивания `.md/.txt`.
- `toc` + `scroll tracking` — активный раздел при прокрутке.

## Что менять при адаптации

1. В `app.js` обновить массив `PROJECTS` (id, title, tags, file).
2. Подложить свои Markdown-файлы в `docs-bundle.js` или отдельную директорию `docs`.
3. Подправить тексты бренда и футера.
4. При необходимости изменить палитру/типографику в `styles.css`.

## Для быстрого старта

Базовые файлы для копирования:
- `examples/sites/aiproject-dr-five-ai-projects/source/index.html`
- `examples/sites/aiproject-dr-five-ai-projects/source/styles.css`
- `examples/sites/aiproject-dr-five-ai-projects/source/app.js`
