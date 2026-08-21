import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Compass,
  Copy,
  Download,
  FileText,
  Filter,
  Layers3,
  Menu,
  Search,
  Sparkles,
  Star,
  Target,
  X,
  Wrench,
} from "lucide-react";

type MaterialType = "PROMPT" | "CHECKLIST" | "FRAMEWORK" | "TEMPLATE" | "CASE" | "METHOD" | "PLAYBOOK";
type ProductLevel = "FREE" | "PAID" | "SERVICE";

type Material = {
  slug: string;
  type: MaterialType;
  level: ProductLevel;
  category: string;
  audience: string;
  title: string;
  question: string;
  outcome: string;
  body: string[];
  steps: string[];
  readTime: string;
  price?: string;
  icon: typeof Sparkles;
  accent: string;
  proof: string;
  cta: { label: string; href: string };
};

const categories = [
  { id: "all", label: "All" },
  { id: "product", label: "Product" },
  { id: "ai", label: "AI & Vibe" },
  { id: "ux", label: "UX / UI" },
  { id: "testing", label: "Testing" },
  { id: "methods", label: "Methods" },
  { id: "business", label: "Business" },
];

const routes = [
  { slug: "vibe-coder", title: "Я уже навайбкодил прототип", text: "Вернуть контроль над тем, что AI уже собрал.", category: "ai", icon: Code2, count: 4 },
  { slug: "new-product", title: "Мне нужно создать продукт", text: "Выбрать формат, MVP и первый рабочий сценарий.", category: "product", icon: Boxes, count: 5 },
  { slug: "broken-funnel", title: "Сайт или процесс не работает", text: "Найти узкое место в UX, воронке или ручной работе.", category: "business", icon: Wrench, count: 4 },
  { slug: "taika", title: "Хочу понять, как строится Taika", text: "Пройти путь от идеи AI-продукта до тестируемой системы.", category: "product", icon: Sparkles, count: 6 },
];

const materials: Material[] = [
  {
    slug: "ai-prototype-check",
    type: "CHECKLIST",
    level: "FREE",
    category: "testing",
    audience: "Solo builder",
    title: "Проверка AI-прототипа перед развитием",
    question: "Вы уже собрали экран. Но его можно безопасно менять?",
    outcome: "Поймёте, где прототип может рассыпаться: в состояниях, навигации, данных и границах ответственности AI.",
    body: [
      "Первый успешный экран — это ещё не продукт. После vibe coding обычно остаётся невидимый слой: что происходит при пустом состоянии, ошибке, повторной отправке и возвращении пользователя назад.",
      "Этот чеклист нужен перед тем, как добавлять новые фичи. Он помогает не ускорять хаос, а найти места, которые будут стоить дороже всего после запуска.",
    ],
    steps: ["Проверить главный пользовательский сценарий", "Разложить loading, empty, error и success states", "Проверить, где живут данные и кто отвечает за изменение", "Записать три риска до следующей итерации"],
    readTime: "5 min",
    icon: ClipboardCheck,
    accent: "text-amber-300",
    proof: "Этот подход использую в Taika, когда первый AI-прототип уже выглядит убедительно, но его нужно превращать в систему.",
    cta: { label: "Запросить AI Prototype Audit", href: "/#contact" },
  },
  {
    slug: "project-context",
    type: "PROMPT",
    level: "FREE",
    category: "ai",
    audience: "Vibe coder",
    title: "Как дать AI контекст проекта",
    question: "Почему AI каждый раз предлагает новый вариант решения?",
    outcome: "Соберёте prompt с контекстом, ограничениями и критериями готовности.",
    body: [
      "AI не видит ваш продукт целиком. Он видит только то, что вы дали ему в конкретном сообщении. Поэтому просьба «сделай экран профиля» почти всегда приводит к красивому, но чужому решению.",
      "В контексте должны жить не только технологии. Нужны пользователь, задача, уже принятые решения, запреты, состояния и понятный definition of done.",
    ],
    steps: ["Контекст: что строим и для кого", "Ограничения: что нельзя менять", "Существующая система: компоненты, данные и паттерны", "Критерии готовности: как поймём, что задача решена"],
    readTime: "7 min",
    icon: Sparkles,
    accent: "text-violet-300",
    proof: "В Taika контекст проекта живёт отдельно от единичных промптов: так AI не приходится каждый раз заново угадывать продукт.",
    cta: { label: "Открыть AI Product Starter Kit", href: "#paid" },
  },
  {
    slug: "choose-format",
    type: "FRAMEWORK",
    level: "FREE",
    category: "product",
    audience: "Founder / business",
    title: "App, web, workspace или Telegram Mini App?",
    question: "Вам точно нужен мобильный app?",
    outcome: "Выберете формат под реальный сценарий, частоту использования и бизнес-задачу.",
    body: [
      "Формат — это не вопрос вкуса и не приз за серьёзность идеи. Мобильное приложение имеет смысл, когда важны частое возвращение, нативные возможности, уведомления или особый сценарий использования.",
      "В других случаях web-продукт, workspace или Telegram Mini App быстрее проверят идею и дешевле покажут, где настоящая ценность.",
    ],
    steps: ["Как часто пользователь будет возвращаться?", "Нужны ли камера, микрофон, push или офлайн?", "Кто платит и где происходит ключевое действие?", "Какой самый дешёвый формат проверит гипотезу?"],
    readTime: "6 min",
    icon: Compass,
    accent: "text-cyan-300",
    proof: "В портфолио есть iOS, mobile web, Telegram Mini Apps и internal systems — формат выбирался из сценария, а не наоборот.",
    cta: { label: "Собрать бриф на продукт", href: "/#contact" },
  },
  {
    slug: "methods-choice",
    type: "METHOD",
    level: "FREE",
    category: "methods",
    audience: "Product team",
    title: "Как выбрать Scrum, Kanban или Shape Up",
    question: "Почему команда работает по процессу, но продукт не становится понятнее?",
    outcome: "Сопоставите подход с фазой работы, неопределённостью и типом задачи.",
    body: [
      "Методология не спасает задачу, если вы выбрали её до того, как поняли контекст. Scrum полезен там, где нужна регулярная проверка и командный ритм. Kanban — когда поток задач важнее спринтов. Shape Up — когда команде нужно защищённое время на решение очерченной проблемы.",
      "Я выбираю не «любимый фреймворк», а минимальный процесс, который помогает принять следующее решение и не потерять обратную связь.",
    ],
    steps: ["Определить уровень неопределённости", "Понять, есть ли стабильный поток задач", "Выбрать горизонт планирования", "Проверить, какой ритм помогает принимать решения"],
    readTime: "8 min",
    icon: Layers3,
    accent: "text-emerald-300",
    proof: "Опыт в Big Tech научил меня отличать процесс, который помогает продукту, от процесса, который просто красиво выглядит на доске.",
    cta: { label: "Обсудить процесс команды", href: "/#contact" },
  },
  {
    slug: "site-path",
    type: "CASE",
    level: "FREE",
    category: "business",
    audience: "Business owner",
    title: "Почему красивый сайт не ведёт к заявке",
    question: "Редизайн действительно исправит плохие продажи?",
    outcome: "На примере ANX увидите, как разделить сценарий покупки и коммерческого заказа.",
    body: [
      "Часто сайт выглядит как один красивый экран, хотя внутри него живут разные люди с разными намерениями. Один хочет купить готовый продукт. Другой хочет заказать разработку. Третий просто изучает компанию.",
      "Если всем дать один CTA и одну дорогу, проблема будет не в цвете кнопки. Проблема в том, что сайт не помогает человеку узнать себя и выбрать следующий шаг.",
    ],
    steps: ["Разделить намерения пользователя", "Назвать следующий шаг словами клиента", "Показать proof рядом с решением", "Убрать лишние развилки после первого клика"],
    readTime: "4 min",
    icon: ArrowUpRight,
    accent: "text-rose-300",
    proof: "В ANX разделение studio и shop стало не декоративным приёмом, а способом развести два разных пользовательских сценария.",
    cta: { label: "Запросить UX / Conversion Audit", href: "/#contact" },
  },
  {
    slug: "taika-loop",
    type: "PLAYBOOK",
    level: "PAID",
    category: "product",
    audience: "Founder / maker",
    title: "Taika: от желания до AI-продукта",
    question: "Можно ли сделать полноценное приложение одним большим промптом?",
    outcome: "Увидите связку проблемы, UX, AI-архитектуры, кода и тестирования на реальном проекте.",
    body: [
      "Taika началась не с промпта «сделай приложение для изучения тайского». Сначала пришлось определить, что именно человек должен сделать в первый день, почему он вернётся завтра и где AI действительно добавляет ценность.",
      "В playbook я показываю полный product loop: проблема → пользовательский сценарий → визуальная система → архитектура → AI-фича → тесты → следующая итерация.",
    ],
    steps: ["Сформулировать первую ценность", "Спроектировать learning loop и onboarding", "Разделить AI, контент, данные и интерфейс", "Проверить сценарий на реальном использовании", "Решить, что строить в следующей итерации"],
    readTime: "12 min",
    price: "€19",
    icon: BookOpen,
    accent: "text-orange-300",
    proof: "Taika — живой пример того, как AI-продукт собирается из продуктовых решений, а не из последовательности красивых промптов.",
    cta: { label: "Получить playbook", href: "#paid" },
  },
  {
    slug: "ai-starter-kit",
    type: "TEMPLATE",
    level: "PAID",
    category: "ai",
    audience: "Founder / maker",
    title: "AI Product Starter Kit",
    question: "Хочу использовать AI в продукте, но не хочу собрать неуправляемый прототип",
    outcome: "Набор шаблонов для контекста, архитектуры, проверки и запуска первой AI-фичи.",
    body: [
      "Это не коллекция из сотни промптов. Это рабочая система из нескольких документов, которые помогают принимать решения до, во время и после генерации кода.",
      "Kit подойдёт, если вы хотите двигаться самостоятельно, но не хотите каждый раз изобретать структуру задачи и надеяться, что AI сам догадается о правилах.",
    ],
    steps: ["Project context template", "AI feature brief", "Architecture decision record", "Prototype review checklist", "Testing prompt pack"],
    readTime: "Self-paced",
    price: "€29",
    icon: Target,
    accent: "text-sky-300",
    proof: "Собран из тех же рабочих принципов, которые использую в собственных продуктах и AI-assisted development.",
    cta: { label: "Купить Starter Kit", href: "#paid" },
  },
];

const productizedServices = [
  { title: "Product Clarity Sprint", text: "Зафиксировать проблему, пользователя, формат решения и MVP scope.", result: "1 sprint · product brief", href: "/#contact" },
  { title: "AI Prototype Audit", text: "Проверить AI-прототип: состояния, архитектуру, риски и следующий шаг.", result: "audit · risk map", href: "/#contact" },
  { title: "UX / Conversion Audit", text: "Найти, где сайт или продукт теряет человека до целевого действия.", result: "audit · priorities", href: "/#contact" },
  { title: "Process-to-Workspace", text: "Превратить ручной процесс в понятную внутреннюю систему.", result: "system concept", href: "/#contact" },
];

function getMaterial(slug?: string) {
  return materials.find((material) => material.slug === slug);
}

export default function Workspace() {
  const [, setLocation] = useLocation();
  const [, materialParams] = useRoute("/workspace/material/:slug");
  const [, routeParams] = useRoute("/workspace/route/:slug");
  if (materialParams?.slug) return <MaterialPage material={getMaterial(materialParams.slug)} />;
  if (routeParams?.slug) return <RoutePage slug={routeParams.slug} />;
  return <WorkspaceHome onOpenMaterial={(slug) => setLocation(`/workspace/material/${slug}`)} />;
}

function WorkspaceShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0B0D]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"><Menu className="h-5 w-5" /></button>
            <Link href="/" className="group flex items-center gap-3"><span className="font-mono text-[10px] tracking-[0.22em] text-white/45">VIKTOR.SYSTEM</span><span className="h-3 w-px bg-white/20" /><span className="font-mono text-[10px] tracking-[0.22em] text-cyan-100 transition-colors group-hover:text-cyan-200">WORKSPACE</span></Link>
          </div>
          <div className="flex items-center gap-3"><span className="hidden font-mono text-[10px] tracking-[0.15em] text-white/30 sm:inline">PUBLIC KNOWLEDGE LAYER</span><Link href="/#contact" className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-cyan-200/40 hover:text-white sm:inline-flex">Discuss a project</Link></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-white/[0.08] px-5 py-7 lg:flex">
          <SideNav onNavigate={() => undefined} />
        </aside>
        {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} /><aside className="relative h-full w-[280px] border-r border-white/10 bg-[#101014] px-5 py-7 shadow-2xl"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.2em] text-white/45">WORKSPACE MENU</span><button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button></div><SideNav onNavigate={() => setMobileOpen(false)} /></aside></div>}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function SideNav({ onNavigate }: { onNavigate: () => void }) {
  const links = [{ label: "Workspace home", href: "/workspace" }, { label: "Start here", href: "/workspace#routes" }, { label: "Library", href: "/workspace#library" }, { label: "Playbooks", href: "/workspace#paid" }, { label: "Cases", href: "/workspace#real-work" }, { label: "Services", href: "/workspace#services" }];
  return <nav className="flex flex-col gap-1"><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Navigate</p>{links.map((link, index) => <a key={link.href} href={link.href} onClick={onNavigate} className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${index === 0 ? "bg-white/[0.08] text-white" : "text-white/50 hover:bg-white/[0.05] hover:text-white"}`}><span>{link.label}</span>{index === 0 ? <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" /> : <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />}</a>)}</nav>;
}

function WorkspaceHome({ onOpenMaterial }: { onOpenMaterial: (slug: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevel, setActiveLevel] = useState<ProductLevel | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem("workspace-saved") || "[]"));
  const [completed, setCompleted] = useState<string[]>(() => JSON.parse(localStorage.getItem("workspace-completed") || "[]"));
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => { localStorage.setItem("workspace-saved", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem("workspace-completed", JSON.stringify(completed)); }, [completed]);

  const filteredMaterials = useMemo(() => materials.filter((material) => {
    const categoryMatch = activeCategory === "all" || material.category === activeCategory;
    const levelMatch = activeLevel === "ALL" || material.level === activeLevel;
    const savedMatch = !showSaved || saved.includes(material.slug);
    const normalizedQuery = query.trim().toLowerCase();
    const queryMatch = !normalizedQuery || [material.title, material.question, material.outcome, material.audience].join(" ").toLowerCase().includes(normalizedQuery);
    return categoryMatch && levelMatch && savedMatch && queryMatch;
  }), [activeCategory, activeLevel, query, saved, showSaved]);

  const toggleSaved = (slug: string) => setSaved((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  const toggleCompleted = (slug: string) => setCompleted((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
  const completion = Math.round((completed.length / materials.length) * 100);

  return <WorkspaceShell><main>
    <section className="relative overflow-hidden border-b border-white/[0.08]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(49,130,206,0.16),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(151,71,255,0.10),transparent_28%)]" /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 md:pb-20 md:pt-20 lg:px-12"><div className="mb-12 flex items-center justify-between gap-4"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />Workspace / v0.2</div><div className="hidden font-mono text-[10px] text-white/30 sm:block">knowledge → action → build</div></div><div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end"><div><p className="mb-5 max-w-xl text-sm leading-6 text-cyan-100/70">A MARKETPLACE OF WORKING KNOWLEDGE</p><h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">Не просто знания.<br /><span className="text-white/40">Готовые следующие шаги.</span></h1><p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">Промпты, шаблоны, чеклисты, playbooks и реальные разборы для тех, кто создаёт или улучшает digital-продукты.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#routes" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">Найти свою ситуацию <ChevronRight className="h-4 w-4" /></a><a href="#library" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/75 transition-colors hover:border-white/35 hover:text-white">Открыть библиотеку <ArrowRight className="h-4 w-4" /></a></div></div><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm"><div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/35"><span>Current focus</span><span className="text-amber-200/70">FREE / 5 MIN</span></div><div className="border-l border-cyan-200/40 pl-4"><p className="text-xs uppercase tracking-[0.16em] text-cyan-200/70">AI & Vibe coding</p><h2 className="mt-3 text-2xl font-medium leading-tight text-white">Я навайбкодил прототип. Что дальше?</h2><p className="mt-3 text-sm leading-6 text-white/55">Проверить состояния, контекст, тесты и следующий шаг до того, как добавлять новые фичи.</p></div><button onClick={() => onOpenMaterial("ai-prototype-check")} className="mt-7 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-cyan-200">Open focus <ArrowUpRight className="h-4 w-4" /></button></div></div></div></section>

    <section id="routes" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">Start with the problem</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">С чем вы пришли?</h2></div><span className="hidden font-mono text-[10px] text-white/25 sm:block">choose / learn / apply</span></div><div className="grid gap-3 md:grid-cols-2">{routes.map((route) => { const Icon = route.icon; return <Link key={route.slug} href={`/workspace/route/${route.slug}`} className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05]"><div className="flex items-start justify-between gap-4"><Icon className="h-5 w-5 text-white/55 transition-colors group-hover:text-cyan-200" /><span className="font-mono text-[10px] tracking-[0.16em] text-white/30">0{route.count} MATERIALS</span></div><h3 className="mt-8 text-xl font-medium text-white">{route.title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-white/50">{route.text}</p><span className="mt-7 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-white">Open route <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span></Link>; })}</div></section>

    <section id="library" className="border-y border-white/[0.08] bg-black/10"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">Library / {materials.length} materials</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Выберите следующий шаг</h2></div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative lg:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search materials" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-200/50" /></div><button onClick={() => setShowSaved((value) => !value)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs transition-colors ${showSaved ? "border-cyan-200/50 bg-cyan-200/10 text-cyan-100" : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"}`}><Star className="h-3.5 w-3.5" />Saved ({saved.length})</button></div></div><div className="mt-9 flex gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs transition-colors ${activeCategory === category.id ? "border-white/50 bg-white text-black" : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"}`}>{category.label}</button>)}</div><div className="mt-3 flex flex-wrap items-center gap-4"><span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/25"><Filter className="h-3.5 w-3.5" />Access</span>{(["ALL", "FREE", "PAID", "SERVICE"] as const).map((level) => <button key={level} onClick={() => setActiveLevel(level)} className={`text-[10px] uppercase tracking-[0.18em] transition-colors ${activeLevel === level ? "text-cyan-200" : "text-white/35 hover:text-white"}`}>{level}</button>)}</div><div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filteredMaterials.map((material) => <MaterialCard key={material.slug} material={material} saved={saved.includes(material.slug)} completed={completed.includes(material.slug)} onSave={() => toggleSaved(material.slug)} onComplete={() => toggleCompleted(material.slug)} onOpen={() => onOpenMaterial(material.slug)} />)}</div>{filteredMaterials.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm text-white/45">Ничего не найдено. Попробуйте изменить фильтр или запрос.</div>}</div></section>

    <section id="paid" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/50">Paid layer / build faster</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Если хотите не только понять</h2></div><span className="hidden max-w-xs text-right text-xs leading-5 text-white/35 sm:block">Платные материалы собирают путь целиком и экономят время на самостоятельной сборке.</span></div><div className="grid gap-4 lg:grid-cols-2">{materials.filter((material) => material.level === "PAID").map((material) => <div key={material.slug} className="group rounded-2xl border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(92,180,255,0.10),rgba(255,255,255,0.025))] p-6 transition-all hover:border-cyan-200/35"><div className="flex items-start justify-between"><span className={`font-mono text-[10px] tracking-[0.18em] ${material.accent}`}>{material.type} / {material.price}</span><Sparkles className="h-5 w-5 text-white/35" /></div><h3 className="mt-10 max-w-lg text-2xl font-medium text-white">{material.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">{material.outcome}</p><div className="mt-7 flex flex-wrap items-center gap-3"><button onClick={() => onOpenMaterial(material.slug)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black">Preview <ArrowUpRight className="h-3.5 w-3.5" /></button><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">{material.audience}</span></div></div>)}</div></section>

    <section id="services" className="border-y border-white/[0.08] bg-white/[0.02]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">Productized services</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Если задачу нужно пройти вместе</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/50">Фиксированные форматы для тех, кому нужен не ещё один материал, а ясный результат под свой контекст.</p></div><div className="grid gap-3 sm:grid-cols-2">{productizedServices.map((service, index) => <a key={service.title} href={service.href} className="group rounded-2xl border border-white/[0.09] bg-[#111116] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25"><div className="flex justify-between font-mono text-[10px] text-white/25"><span>0{index + 1}</span><span>{service.result}</span></div><h3 className="mt-9 text-lg font-medium text-white">{service.title}</h3><p className="mt-2 text-sm leading-6 text-white/50">{service.text}</p><span className="mt-7 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-cyan-200">Discuss this format <ArrowUpRight className="h-3.5 w-3.5" /></span></a>)}</div></div></div></section>

    <section id="real-work" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">From real work</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white sm:text-4xl">Теория должна выдерживать реальный продукт.</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/50">Taika, ANX, MOO, Hospital AI, Big Tech и собственный workspace — здесь материалы связаны с тем, что я реально проектирую и проверяю.</p></div><div className="flex gap-3 overflow-x-auto pb-3 snap-x">{["TAIKA / AI learning product", "ANX / site & conversion flow", "MOO / subscription product", "Big Tech / complex operations"].map((item, index) => <div key={item} className="min-w-[230px] snap-start rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5"><div className="flex items-center justify-between font-mono text-[10px] text-white/30"><span>0{index + 1}</span><CheckCircle2 className="h-4 w-4 text-emerald-200/60" /></div><p className="mt-12 text-sm font-medium text-white/80">{item}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12"><div className="rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(92,180,255,0.12),rgba(255,255,255,0.03))] p-7 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/60">Choose your next step</p><div className="mt-4 flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><h2 className="max-w-2xl text-3xl font-medium tracking-[-0.035em] text-white">Не нашли точный материал?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Опишите задачу в коротком брифе. Я помогу понять, нужен ли вам app, web-продукт, workspace, автоматизация или сначала более ясная логика.</p></div><a href="/#contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">Собрать бриф <ArrowUpRight className="h-4 w-4" /></a></div></div></section>
  </main></WorkspaceShell>;
}

function MaterialCard({ material, saved, completed, onSave, onComplete, onOpen }: { material: Material; saved: boolean; completed: boolean; onSave: () => void; onComplete: () => void; onOpen: () => void }) {
  const Icon = material.icon;
  return <article className="group flex min-h-[315px] flex-col rounded-2xl border border-white/[0.09] bg-[#111116] p-5 transition-all hover:-translate-y-0.5 hover:border-white/25"><div className="flex items-center justify-between"><span className={`font-mono text-[10px] tracking-[0.18em] ${material.accent}`}>{material.type}</span><div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 font-mono text-[9px] tracking-[0.12em] ${material.level === "FREE" ? "bg-emerald-200/10 text-emerald-200" : material.level === "PAID" ? "bg-cyan-200/10 text-cyan-200" : "bg-violet-200/10 text-violet-200"}`}>{material.level}{material.price ? ` · ${material.price}` : ""}</span><Icon className="h-4 w-4 text-white/35" /></div></div><button onClick={onOpen} className="mt-7 text-left"><p className="text-sm leading-6 text-white/45">{material.question}</p><h3 className="mt-3 text-xl font-medium leading-tight text-white transition-colors group-hover:text-cyan-100">{material.title}</h3><p className="mt-3 text-sm leading-6 text-white/50">{material.outcome}</p></button><div className="mt-auto flex items-center justify-between gap-3 pt-8"><span className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/30">{material.audience} · {material.readTime}</span><div className="flex items-center gap-1"><button aria-label="Save material" onClick={onSave} className={`rounded-lg p-2 transition-colors ${saved ? "text-amber-200" : "text-white/35 hover:bg-white/10 hover:text-white"}`}><Star className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} /></button><button aria-label="Mark complete" onClick={onComplete} className={`rounded-lg p-2 transition-colors ${completed ? "text-emerald-200" : "text-white/35 hover:bg-white/10 hover:text-white"}`}><Check className="h-3.5 w-3.5" /></button><button onClick={onOpen} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-white/65 transition-colors hover:text-white">Open <ArrowUpRight className="h-3.5 w-3.5" /></button></div></div></article>;
}

function MaterialPage({ material }: { material?: Material }) {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  if (!material) return <WorkspaceShell><div className="mx-auto max-w-3xl px-6 py-24"><Link href="/workspace" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to Workspace</Link><h1 className="mt-10 text-4xl text-white">Материал не найден</h1></div></WorkspaceShell>;
  const isPrompt = material.type === "PROMPT";
  const copyMaterial = async () => { await navigator.clipboard?.writeText(material.steps.join("\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return <WorkspaceShell><main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-12"><button onClick={() => setLocation("/workspace#library")} className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" />Back to library</button><div className="mt-14 flex flex-wrap items-center gap-3"><span className={`font-mono text-[10px] tracking-[0.18em] ${material.accent}`}>{material.type}</span><span className="rounded-full bg-white/[0.08] px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-white/55">{material.level}{material.price ? ` · ${material.price}` : ""}</span><span className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/30">{material.audience} · {material.readTime}</span></div><h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">{material.title}</h1><p className="mt-7 max-w-3xl text-xl leading-8 text-white/55">{material.question}</p><div className="mt-10 rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.05] p-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/60">After this material</p><p className="mt-3 text-lg leading-7 text-white">{material.outcome}</p></div><div className="mt-12 space-y-6 text-base leading-8 text-white/65">{material.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mt-12 rounded-2xl border border-white/10 bg-[#111116] p-6"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Working material</p><h2 className="mt-2 text-2xl font-medium text-white">{isPrompt ? "Структура, которую можно забрать себе" : "Пройдите по шагам"}</h2></div>{isPrompt && <button onClick={copyMaterial} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 hover:border-white/35 hover:text-white">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy"}</button>}</div><div className="mt-7 space-y-3">{material.steps.map((step, index) => <div key={step} className="flex gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><span className="font-mono text-xs text-cyan-200/70">0{index + 1}</span><span className="text-sm leading-6 text-white/70">{step}</span></div>)}</div><button onClick={() => setCompleted((value) => !value)} className={`mt-6 inline-flex items-center gap-2 text-sm transition-colors ${completed ? "text-emerald-200" : "text-white/55 hover:text-white"}`}>{completed ? <CheckCircle2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}{completed ? "Marked complete" : "Mark as complete"}</button></div><div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">From real work</p><p className="mt-3 text-base leading-7 text-white/70">{material.proof}</p></div><div className="mt-10 flex flex-col justify-between gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center"><div><p className="text-sm text-white/45">Если у вас похожая задача</p><p className="mt-1 text-lg text-white">{material.cta.label}</p></div><a href={material.cta.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Следующий шаг <ArrowUpRight className="h-4 w-4" /></a></div></main></WorkspaceShell>;
}

function RoutePage({ slug }: { slug: string }) {
  const route = routes.find((item) => item.slug === slug) || routes[0];
  const routeMaterials = materials.filter((material) => material.category === route.category || (route.slug === "vibe-coder" && ["ai", "testing"].includes(material.category)));
  return <WorkspaceShell><main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12"><Link href="/workspace" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to Workspace</Link><div className="mt-14 max-w-3xl"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/60">Guided route / {route.count} steps</p><h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">{route.title}</h1><p className="mt-6 text-xl leading-8 text-white/55">{route.text} Собрал короткий маршрут: сначала разобраться, потом применить, затем решить, нужна ли помощь.</p></div><div className="mt-14 grid gap-4 lg:grid-cols-[0.24fr_0.76fr]"><div className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.025] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Your path</p><div className="mt-6 space-y-4">{["Situation", "Understand", "Apply", "Build"].map((step, index) => <div key={step} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${index === 0 ? "bg-white text-black" : "border border-white/15 text-white/45"}`}>{index + 1}</span><span className="text-sm text-white/55">{step}</span></div>)}</div></div></div><div className="space-y-3">{routeMaterials.map((material, index) => <Link key={material.slug} href={`/workspace/material/${material.slug}`} className="group flex gap-5 rounded-2xl border border-white/[0.09] bg-[#111116] p-5 transition-colors hover:border-white/25"><div className="font-mono text-sm text-cyan-200/70">0{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><span className="font-mono text-[10px] tracking-[0.16em] text-white/35">{material.type}</span><span className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/25">{material.readTime}</span></div><h2 className="mt-3 text-xl font-medium text-white group-hover:text-cyan-100">{material.title}</h2><p className="mt-2 text-sm leading-6 text-white/50">{material.outcome}</p></div><ChevronRight className="mt-1 h-5 w-5 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white" /></Link>)}<div className="mt-5 rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.05] p-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100/60">After the route</p><h2 className="mt-3 text-2xl font-medium text-white">Поняли, что нужно двигаться дальше?</h2><p className="mt-3 text-sm leading-6 text-white/55">Опишите контекст. Я помогу выбрать между самостоятельной сборкой, аудитом, спринтом и полноценной разработкой.</p><a href="/#contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black">Собрать бриф <ArrowUpRight className="h-3.5 w-3.5" /></a></div></div></div></main></WorkspaceShell>;
}
