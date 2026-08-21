import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Compass,
  FileText,
  Layers3,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";

const categories = [
  { id: "all", label: "All materials" },
  { id: "product", label: "Product" },
  { id: "ai", label: "AI & Vibe coding" },
  { id: "ux", label: "UX / UI" },
  { id: "testing", label: "Testing" },
  { id: "methods", label: "Methods" },
  { id: "business", label: "Business / Growth" },
];

const routes = [
  {
    eyebrow: "01 / PROTOTYPE",
    title: "Я уже навайбкодил прототип",
    text: "Проверить, что получилось, вернуть контроль и понять следующий шаг.",
    href: "#materials",
    icon: Code2,
  },
  {
    eyebrow: "02 / PRODUCT",
    title: "Мне нужно создать продукт",
    text: "Отделить идею от решения и выбрать, что действительно стоит строить.",
    href: "#materials",
    icon: Boxes,
  },
  {
    eyebrow: "03 / BUSINESS",
    title: "Сайт или процесс не работает",
    text: "Найти узкое место: в сценарии, воронке, ручной работе или системе.",
    href: "#materials",
    icon: Wrench,
  },
  {
    eyebrow: "04 / CASE STUDY",
    title: "Хочу понять, как строится Taika",
    text: "Пройти путь от идеи AI-продукта до архитектуры, интерфейса и тестов.",
    href: "#real-work",
    icon: Sparkles,
  },
];

const materials = [
  {
    id: "ai-prototype-check",
    type: "CHECKLIST",
    category: "testing",
    audience: "Solo builder",
    title: "Проверка AI-прототипа перед развитием",
    question: "Вы уже собрали экран. Но его можно безопасно менять?",
    outcome: "Поймёте, где у прототипа могут быть проблемы со состояниями, навигацией и данными.",
    time: "5 min",
    icon: ClipboardCheck,
    accent: "text-amber-300",
  },
  {
    id: "project-context",
    type: "PROMPT",
    category: "ai",
    audience: "Vibe coder",
    title: "Как дать AI контекст проекта",
    question: "Почему AI каждый раз предлагает новый вариант решения?",
    outcome: "Соберёте prompt с контекстом, ограничениями и критериями готовности.",
    time: "7 min",
    icon: Sparkles,
    accent: "text-violet-300",
  },
  {
    id: "choose-format",
    type: "FRAMEWORK",
    category: "product",
    audience: "Founder / business",
    title: "App, web, workspace или Telegram Mini App?",
    question: "Вам точно нужен мобильный app?",
    outcome: "Выберете формат под реальный сценарий, частоту использования и бизнес-задачу.",
    time: "6 min",
    icon: Compass,
    accent: "text-cyan-300",
  },
  {
    id: "methods-choice",
    type: "METHOD",
    category: "methods",
    audience: "Product team",
    title: "Как выбрать Scrum, Kanban или Shape Up",
    question: "Почему команда работает по процессу, но продукт не становится понятнее?",
    outcome: "Сопоставите подход с фазой работы, неопределённостью и типом задачи.",
    time: "8 min",
    icon: Layers3,
    accent: "text-emerald-300",
  },
  {
    id: "site-path",
    type: "CASE",
    category: "business",
    audience: "Business owner",
    title: "Почему красивый сайт не ведёт к заявке",
    question: "Редизайн действительно исправит плохие продажи?",
    outcome: "На примере ANX увидите, как разделить сценарий покупки и коммерческого заказа.",
    time: "4 min",
    icon: ArrowUpRight,
    accent: "text-rose-300",
  },
  {
    id: "taika-loop",
    type: "PLAYBOOK",
    category: "product",
    audience: "Founder / maker",
    title: "Taika: от желания до AI-продукта",
    question: "Можно ли сделать полноценное приложение одним большим промптом?",
    outcome: "Увидите связку проблемы, UX, AI-архитектуры, кода и тестирования.",
    time: "12 min",
    icon: BookOpen,
    accent: "text-orange-300",
  },
];

const typeFilters = ["All", "Prompt", "Checklist", "Framework", "Case", "Method", "Playbook"];

export default function Workspace() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");

  const filteredMaterials = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return materials.filter((material) => {
      const categoryMatches = activeCategory === "all" || material.category === activeCategory;
      const typeMatches = activeType === "All" || material.type === activeType.toUpperCase();
      const queryMatches = !normalizedQuery || [material.title, material.question, material.outcome, material.audience]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return categoryMatches && typeMatches && queryMatches;
    });
  }, [activeCategory, activeType, query]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0B0B0D]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] text-muted">VIKTOR.SYSTEM</span>
            <span className="h-3 w-px bg-white/20" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-white transition-colors group-hover:text-cyan-200">WORKSPACE</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-muted sm:inline">public knowledge layer</span>
            <Link href="/" className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/75 transition-colors hover:border-white/35 hover:text-white">
              Back to system
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/[0.08]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(49,130,206,0.16),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(151,71,255,0.10),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24 lg:px-8">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                Workspace / v0.1
              </div>
              <div className="hidden font-mono text-[10px] text-muted sm:block">updated / field notes in progress</div>
            </div>
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="mb-5 max-w-xl text-sm leading-6 text-cyan-100/70">WORKING MATERIALS FOR PEOPLE WHO BUILD DIGITAL PRODUCTS</p>
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Не просто ссылки.<br /><span className="text-white/45">А следующий шаг.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
                  Промпты, чеклисты, фреймворки и реальные разборы — чтобы понять, что строить, как проверить идею и где продукт начинает рассыпаться.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#routes" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Найти свою ситуацию <ChevronRight className="h-4 w-4" />
                  </a>
                  <a href="#materials" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/75 transition-colors hover:border-white/35 hover:text-white">
                    Все материалы
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  <span>Current focus</span><span className="text-amber-200/70">01 / 06</span>
                </div>
                <div className="border-l border-cyan-200/40 pl-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">AI & Vibe coding</p>
                  <h2 className="mt-3 text-2xl font-medium leading-tight text-white">Я навайбкодил прототип. Что дальше?</h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">Проверка того, что осталось за пределами первого успешного запуска: состояния, контекст, тесты и следующий шаг.</p>
                </div>
                <a href="#materials" className="mt-7 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-cyan-200">Open focus <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="routes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Start with the problem</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">С чем вы пришли?</h2>
            </div>
            <span className="hidden font-mono text-[10px] text-muted sm:block">choose / continue / build</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <a key={route.title} href={route.href} className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05]">
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-5 w-5 text-white/55 transition-colors group-hover:text-cyan-200" />
                    <span className="font-mono text-[10px] tracking-[0.16em] text-muted">{route.eyebrow}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-medium text-white">{route.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/50">{route.text}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-white">Open route <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </a>
              );
            })}
          </div>
        </section>

        <section id="materials" className="border-y border-white/[0.08] bg-black/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Library / 06 materials</p>
                <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Материалы, которые можно применить</h2>
              </div>
              <div className="relative w-full lg:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200/50" />
              </div>
            </div>

            <div className="mt-9 flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs transition-colors ${activeCategory === category.id ? "border-white/50 bg-white text-black" : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"}`}>
                  {category.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {typeFilters.map((type) => (
                <button key={type} onClick={() => setActiveType(type)} className={`whitespace-nowrap px-2 py-1 text-[10px] uppercase tracking-[0.18em] transition-colors ${activeType === type ? "text-cyan-200" : "text-muted hover:text-white"}`}>
                  {type}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredMaterials.map((material) => {
                const Icon = material.icon;
                return (
                  <article key={material.id} className="group flex min-h-[280px] flex-col rounded-2xl border border-white/[0.09] bg-[#111116] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[10px] tracking-[0.18em] ${material.accent}`}>{material.type}</span>
                      <Icon className="h-4 w-4 text-white/35 transition-colors group-hover:text-white/70" />
                    </div>
                    <p className="mt-8 text-sm leading-6 text-white/45">{material.question}</p>
                    <h3 className="mt-3 text-xl font-medium leading-tight text-white">{material.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">{material.outcome}</p>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{material.audience} · {material.time}</span>
                      <button className="inline-flex items-center gap-1 text-xs text-white/65 transition-colors hover:text-cyan-200">Open <ArrowUpRight className="h-3.5 w-3.5" /></button>
                    </div>
                  </article>
                );
              })}
            </div>
            {filteredMaterials.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm text-white/45">Ничего не найдено. Попробуйте изменить фильтр или запрос.</div>
            )}
          </div>
        </section>

        <section id="real-work" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">From real work</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Теория должна выдерживать реальный продукт.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/50">Каждый материал здесь связан с тем, что я проектирую, собираю или проверяю сам — в Taika, клиентских проектах и собственном workspace.</p>
              <Link href="/" className="mt-7 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-cyan-200">Посмотреть VIKTOR.SYSTEM <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["TAIKA / AI learning product", "ANX / site & conversion flow", "MOO / subscription product", "Big Tech / complex operations"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted"><span>0{index + 1}</span><CheckCircle2 className="h-4 w-4 text-emerald-200/60" /></div>
                  <p className="mt-12 text-sm font-medium text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(92,180,255,0.12),rgba(255,255,255,0.03))] p-7 sm:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/60">If this is your situation</p>
            <div className="mt-4 flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.035em] text-white">Не нашли точный материал?</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Опишите задачу в коротком брифе. Я помогу понять, нужен ли вам app, web-продукт, workspace, автоматизация или сначала просто более ясная логика.</p>
              </div>
              <a href="/#contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">Собрать бриф <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
