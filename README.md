# Biblio

Репозиторий-библиотека для повторного использования материалов при разработке приложений:
- примеры оформления сайтов;
- технические задания (ТЗ);
- промпты;
- скиллы;
- справочники.

## Структура

- `examples/sites/` — сохранённые примеры сайтов (шаблон + источник + связанные материалы).
- `specs/technical-assignments/` — ТЗ в Markdown для прямой работы с AI/разработчиками.
- `templates/site-layouts/` — выделенные шаблоны страниц/блоков (каркасы для новых проектов).
- `prompts/` — рабочие промпты и пресеты.
- `skills/` — скиллы, инструкции и чек-листы.
- `references/` — справочные материалы и методички.
- `ideas/future/` — идеи на будущее и продуктовый AI-бэклог.
- `scripts/` — служебные скрипты импорта/обновления.

## Что уже добавлено

Источник: [5 готовых AI-проектов — библиотека технических заданий](https://aiproject-dr.ru/five-ai-projects/#projects)

- локальная копия шаблона сайта и клиентского кода;
- 5 извлечённых ТЗ (`01`–`05`) в формате `.md`;
- отдельный каталог с оригинальной структурой примера;
- шаблон для быстрого переиспользования: `templates/site-layouts/five-ai-projects-template`.

См.:
- `examples/sites/aiproject-dr-five-ai-projects/README.md`
- `specs/technical-assignments/README.md`

Источник: [50 идей AI-агентов](https://aiproject-dr.ru/ai-agents/)

- локальная копия страницы и клиентского набора данных (`index.html`, `data.js`, `script.js`, `styles.css`);
- отдельный каталог «Идеи на будущее» с 50 идеями AI-агентов;
- структура для дальнейшего отбора идей в MVP.

См.:
- `examples/sites/aiproject-dr-ai-agents/README.md`
- `ideas/future/ai-agents-catalog.md`

## Обновление материалов из источника

Для повторного импорта используйте:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\import-five-ai-projects.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\import-ai-agents.ps1
```

Скрипт заново скачивает ассеты и пересобирает ТЗ в `examples/...` и `specs/...`.

После импорта шаблон автоматически синхронизируется в:

- `templates/site-layouts/five-ai-projects-template`
