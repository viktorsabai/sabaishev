# Workspace — продуктовая инициатива

## Product brief

Workspace — публичный рабочий слой VIKTOR.SYSTEM для хранения и распространения практических материалов: промптов, чеклистов, фреймворков, шаблонов, методик, field notes и кейсов.

Он должен работать не как архив ссылок, а как часть воронки: пользователь приходит из Instagram с проблемой, выбирает понятный маршрут, получает небольшой применимый результат, видит proof из реального опыта и переходит к релевантному действию — материалу, кейсу, аудиту, консультации, брифу или заказной разработке.

## Product hypothesis

Если материалы организовать по реальным ситуациям пользователя, а не только по профессиональным категориям, то посетителю будет легче найти релевантную помощь, понять вашу экспертизу и перейти от бесплатного материала к разговору о своей задаче.

## Target users

| Segment | Situation | Desired outcome |
|---|---|---|
| Solo builder / vibe coder | Уже есть AI-прототип, но нет контроля и структуры | Проверить прототип, настроить workspace, понять следующий шаг |
| Founder / entrepreneur | Есть идея приложения, но непонятно, что строить | Определить формат продукта, MVP и план запуска |
| Business owner | Есть сайт, но мало заявок или непонятен путь клиента | Найти проблему в UX, структуре и воронке |
| Operations-heavy business | Работа держится на таблицах, чатах и ручных переносах | Найти узкое место и спроектировать workspace/автоматизацию |
| Existing product team | Система стала сложной, экраны и данные расходятся | Провести product/UX/architecture-аудит и определить улучшения |

## Core user journeys

### Journey A — «Я уже навайбкодил прототип»

Workspace home → AI & Vibe coding → Project context → Prototype check → Testing & Quality → related Taika proof → audit / workspace / consultation.

### Journey B — «Мне нужно создать продукт»

Workspace home → Product → выбрать app/web/workspace → MVP card → method selection → brief.

### Journey C — «Сайт не даёт заявок»

Workspace home → Business / Growth → user path checklist → ANX case → audit CTA.

### Journey D — «У нас всё в таблицах и чатах»

Workspace home → Business / Growth → process map → automation decision → workspace case → brief.

## Information architecture

### Top-level routes

- `/workspace`
- `/workspace/start-here`
- `/workspace/product`
- `/workspace/ai`
- `/workspace/ux-ui`
- `/workspace/development`
- `/workspace/testing`
- `/workspace/methods`
- `/workspace/business`
- `/workspace/material/:slug`
- `/workspace/route/:slug`

### Categories

| Category | Primary questions |
|---|---|
| Product | Что строить, для кого, как определить MVP и проверить гипотезу |
| AI & Vibe coding | Как передать AI контекст, декомпозировать задачу и проверить результат |
| UX / UI | Как связать сценарий, интерфейс и состояния пользователя |
| Development | Как сохранить архитектуру, data flow и расширяемость |
| Testing & Quality | Как проверить приложение, AI-прототип и регрессии |
| Methods | Когда применять Scrum, Kanban, Shape Up и discovery |
| Business / Growth | Как улучшать сайт, воронку, процессы и автоматизацию |

## Content model

```ts
type WorkspaceMaterial = {
  slug: string;
  title: string;
  type: "prompt" | "checklist" | "framework" | "template" | "case" | "field-note" | "method" | "playbook";
  category: string;
  audience: string[];
  question: string;
  summary: string;
  outcome: string;
  readTime: string;
  status: "published" | "coming-soon";
  relatedProjects?: string[];
  relatedMaterials?: string[];
  cta: {
    label: string;
    href: string;
  };
};
```

## Material page requirements

Каждая страница материала должна содержать:

1. Вопрос или ситуацию пользователя в заголовке.
2. Короткое объяснение, кому материал нужен.
3. Блок «После этого вы сможете…».
4. Сам материал: текст, таблица, prompt, checklist или схема.
5. Proof из реальной практики Виктора.
6. Related materials — что открыть дальше.
7. Relevant CTA — бриф, аудит, консультация, кейс или разработка.

## Funnel logic

| Content layer | User question | Workspace response | Commercial next step |
|---|---|---|---|
| Instagram | «У меня такая проблема?» | Situation-based route | Open material |
| Quick material | «Что сделать прямо сейчас?» | Checklist / prompt / framework | Save, copy, continue |
| Deep material | «Почему это работает?» | Case / field note / playbook | Explore related case |
| Proof | «Можно ли доверять подходу?» | Taika, ANX, Big Tech, workspace | View work |
| Qualification | «Что нужно именно мне?» | Route / diagnostic CTA | Brief / audit / consultation |
| Sale | «Кто это реализует?» | Relevant service path | Project conversation |

## Epics

### Epic 1 — Workspace shell and mode switcher

**Goal:** дать пользователю понятный переход между презентационным сайтом и рабочей библиотекой.

**Stories:**

- Как посетитель, я могу переключиться между VIKTOR.SYSTEM и WORKSPACE.
- Как посетитель, я понимаю разницу между двумя режимами.
- Как посетитель, я могу вернуться на основной лендинг из любой страницы Workspace.
- Как мобильный пользователь, я вижу удобный компактный переключатель.

**Acceptance criteria:** переключатель доступен на desktop/mobile; режим сохраняется при переходе по внутренним страницам; страницы Workspace не ломают текущую навигацию и boot flow.

### Epic 2 — Workspace home and situation-based entry

**Goal:** направлять человека через его проблему, а не заставлять разбираться в терминах.

**Stories:**

- Я вижу Current focus.
- Я могу выбрать «С чем вы пришли?».
- Я вижу Start here для первого знакомства.
- Я вижу последние материалы и real work proof.

**Acceptance criteria:** с первого экрана понятны назначение Workspace и минимум четыре пользовательских маршрута.

### Epic 3 — Categories, filters and search

**Goal:** дать структурированный доступ к материалам.

**Stories:**

- Я могу открыть категорию Product, AI, UX/UI, Development, Testing, Methods или Business.
- Я могу фильтровать материалы по типу.
- Я могу фильтровать по аудитории и уровню глубины.
- Я вижу понятное empty state, если результатов нет.

**Acceptance criteria:** фильтры работают без перезагрузки; URL можно использовать как ссылку из Instagram; на мобильном фильтры не занимают весь экран.

### Epic 4 — Material pages and content primitives

**Goal:** превратить каждый материал в маленький самостоятельный продукт.

**Stories:**

- Я понимаю, какую проблему решает материал.
- Я вижу результат до чтения.
- Я могу скопировать prompt или checklist.
- Я вижу related material и следующий шаг.

**Acceptance criteria:** у каждой опубликованной страницы есть question, outcome, proof, related content и CTA.

### Epic 5 — Start here and guided routes

**Goal:** провести нового пользователя от проблемы к правильному набору материалов.

**Stories:**

- Я могу выбрать свой сценарий.
- Я вижу последовательность из 3–5 материалов.
- Я понимаю, когда мне достаточно бесплатного материала, а когда нужен аудит или бриф.

**Acceptance criteria:** минимум четыре маршрута работают end-to-end и заканчиваются релевантным CTA.

### Epic 6 — Real work proof and cases

**Goal:** связывать теорию с реальной практикой.

**Stories:**

- Я вижу, где материал применялся в Taika, ANX, Moo, Hospital AI, Don HazzA или workspace.
- Я могу открыть связанный кейс.
- Я понимаю роль Виктора в проекте.

**Acceptance criteria:** минимум шесть материалов имеют real work proof или явный статус «пример будет добавлен».

### Epic 7 — Commercial qualification and CTA

**Goal:** переводить интерес к материалам в квалифицированное действие.

**Stories:**

- Я вижу CTA, соответствующий моей ситуации.
- Я могу перейти к брифу, аудиту, консультации или странице услуги.
- Я понимаю, что будет после отправки заявки.

**Acceptance criteria:** CTA не одинаковый для всех материалов; ссылки ведут на существующие страницы или явно помечены как coming soon.

### Epic 8 — Analytics and learning loop

**Goal:** понять, какие проблемы и материалы приводят к коммерческому интересу.

**Events:** `workspace_view`, `route_select`, `category_select`, `material_open`, `copy_prompt`, `download_material`, `related_case_open`, `cta_click`, `brief_start`, `brief_submit`.

**Acceptance criteria:** аналитика не мешает работе сайта; события имеют source/medium/campaign при переходах из Instagram; можно сравнивать маршруты.

## MVP scope

Первый вертикальный срез включает shell, Workspace home, четыре маршрута по ситуациям, семь категорий, фильтр по типу, Start here, страницу материала и шесть реальных/подготовленных материалов.

### Initial content set

| Material | Type | Category | CTA |
|---|---|---|---|
| Как выбрать app, web, workspace или Telegram Mini App | Framework | Product | Brief |
| Как дать AI контекст проекта | Prompt | AI & Vibe coding | Prompt template |
| Проверка AI-прототипа перед развитием | Checklist | Testing & Quality | Audit |
| Как выбрать Scrum, Kanban или Shape Up | Method | Methods | Consultation |
| Почему красивый сайт не ведёт к заявке | Case | Business / Growth | Site audit |
| Taika: от идеи до полноценного AI-продукта | Case / Playbook | Product + AI | Taika case |

## Non-goals for MVP

В первой версии не делаем полноценную CMS, аккаунты пользователей, платный доступ, email-gating каждого материала, сложную персонализацию, комментарии и отдельную админку.

Контент храним в статическом TypeScript-слое, чтобы быстро проверить архитектуру, навигацию и коммерческую логику. CMS подключаем после появления устойчивой библиотеки материалов и понимания, какие маршруты реально используются.

## Definition of Done for MVP

- Пользователь может попасть в Workspace из основного лендинга.
- Пользователь может выбрать ситуацию и пройти маршрут.
- Пользователь может открыть категорию, отфильтровать материалы и открыть отдельный материал.
- Каждая опубликованная карточка содержит вопрос, outcome, тип, аудиторию, proof и CTA.
- Есть минимум один материал по Product, AI, Testing, Methods, Business/Growth и Taika.
- На desktop и mobile нет горизонтального скролла и сломанных переходов.
- Существующий режим VIKTOR.SYSTEM продолжает работать.
- Все ссылки на будущие функции помечены как coming soon или не показываются.

## Open decisions

1. Финальное название режима: `WORKSPACE`, `VIKTOR WORKSPACE` или `FIELD NOTES`.
2. Нужен ли отдельный маршрут `/workspace/material/:slug` или на первом этапе достаточно модального просмотра.
3. Какие материалы готовы к публикации сразу, а какие требуют сначала написать контент.
4. Нужен ли сбор email при скачивании материалов или первый MVP остаётся полностью открытым.
5. Какая коммерческая цель главная в первой версии: бриф, аудит, консультация или заказная разработка.
