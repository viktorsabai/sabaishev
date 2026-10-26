import type { Language } from "@/lib/content";

// Texts of the v2 main scene (CHANGES-2): stages with the client's pain, my solution and
// deliverable cards. Russian is from the handoff; EN/TH are translations to review with the author.

// A deliverable card: what it is, two comment lines on why, and the format you get back.
export type Deliverable = { title: string; why: [string, string]; ret: string };
export type StageV2 = { num: string; name: string; label: string; tag: string; pain: string; solution: string; items: Deliverable[] };

// Hero slogans typed one after another: `lead` in ink, `accent` in the brand gradient.
export type Slogan = { eyebrow: string; lead: string; accent: string; subtitle: string };

export type SceneV2Copy = {
  slogans: Slogan[];
  stageOf: string; pain: string; solution: string; get: string; hint: string;
  toShip: string; decks: string; up: string; down: string; discussStage: string; cut: string;
  stages: StageV2[];
};

const TAGS = ["PROBLEM FRAMING", "DISCOVERY", "PRODUCT LOGIC", "USER EXPERIENCE", "INTERFACE", "AI CORE", "PROTOTYPE", "LAUNCH"];
const withTags = (stages: Omit<StageV2, "num" | "tag">[]): StageV2[] =>
  stages.map((s, i) => ({ ...s, num: `0${i + 1}`, tag: TAGS[i] }));

export const sceneV2Content: Record<Language, SceneV2Copy> = {
  ru: {
    slogans: [
      { eyebrow: "Продакт под ключ", lead: "Продукты, которыми хочется ", accent: "пользоваться.", subtitle: "Продакт, UX/UI и AI в одних руках. Разберу задачу, соберу MVP и доведу до запуска." },
      { eyebrow: "Сайты и лендинги", lead: "Сайты, которые ", accent: "продают.", subtitle: "Каждый экран ведёт к заявке: структура, тексты, дизайн и аналитика — в одной системе." },
      { eyebrow: "Операционка и workspace", lead: "Рутину — системе. Вам — ", accent: "развитие.", subtitle: "Соберу рабочее место для команды, автоматизирую ручные процессы или просто проведу аудит операционки." },
    ],
    stageOf: "Этап", pain: "Знакомо?", solution: "Что делаю я", get: "получите", hint: "наведи или тапни",
    toShip: "← На корабль", decks: "Палубы", up: "Палуба выше", down: "Палуба ниже", discussStage: "Обсудить этот этап", cut: "Разрез палубы",
    stages: withTags([
      { name: "Проблема", label: "Проблема", pain: "Идея есть, но непонятно, что именно строить и для кого.", solution: "Одна чёткая формулировка задачи и критерии успеха: команда перестаёт спорить.", items: [
        { title: "Problem Statement", why: ["одна фраза: чью боль решаем", "и как поймём, что решили"], ret: "Notion / PDF, 1 страница" },
        { title: "Гипотезы", why: ["что должно быть правдой,", "чтобы продукт сработал"], ret: "список с приоритетами" },
        { title: "Критерии успеха", why: ["метрики до старта: что считаем", "победой, а что провалом"], ret: "цели в цифрах" },
      ] },
      { name: "Исследование", label: "Исследование", pain: "Страшно вложиться в то, что окажется никому не нужным.", solution: "Знаю, кому и зачем это нужно — по интервью и рынку, а не по догадкам.", items: [
        { title: "Интервью и конкуренты", why: ["8–10 разговоров с живыми людьми", "и разбор 5 конкурентов"], ret: "сводная таблица" },
        { title: "Портрет пользователя", why: ["кто он, что делает сегодня", "и почему этим недоволен"], ret: "1 страница" },
        { title: "Карта болей", why: ["где люди теряют время и деньги", "по убыванию важности"], ret: "ранжированный список" },
      ] },
      { name: "Логика", label: "Логика", pain: "Хочется всего сразу — бюджет и сроки растут.", solution: "Понятный MVP: что делаем первым, а что честно откладываем.", items: [
        { title: "User Journey", why: ["путь от «узнал» до «оплатил»", "со всеми точками трения"], ret: "схема в Figma" },
        { title: "Feature Map", why: ["все функции на одной карте:", "нужное, желаемое, лишнее"], ret: "карта функций" },
        { title: "MVP Scope", why: ["что войдёт в первую версию,", "а что осознанно отложим"], ret: "границы MVP" },
        { title: "Roadmap", why: ["порядок работ по неделям", "с понятным результатом"], ret: "план на 3 месяца" },
      ] },
      { name: "UX", label: "UX", pain: "Продукт путает людей, и они уходят.", solution: "Продуманный путь от входа до результата — ещё до того, как рисовать.", items: [
        { title: "Сценарии", why: ["кто, зачем и что нажимает:", "каждый шаг расписан"], ret: "user flows" },
        { title: "Структура экранов", why: ["карта всех экранов", "и переходов между ними"], ret: "sitemap" },
        { title: "Wireframes", why: ["макеты без дизайна: проверяем", "логику, а не вкус"], ret: "кликабельный прототип" },
      ] },
      { name: "UI", label: "UI", pain: "Выглядит как у всех и не вызывает доверия.", solution: "Узнаваемый дизайн-язык: продукт, которым хочется пользоваться.", items: [
        { title: "Дизайн-система", why: ["цвета, шрифты, компоненты —", "один раз на весь продукт"], ret: "библиотека в Figma" },
        { title: "Ключевые экраны", why: ["главные экраны в финале,", "готовые к разработке"], ret: "макеты в Figma" },
        { title: "Анимации и состояния", why: ["наведение, загрузка, ошибки —", "то, что оживляет продукт"], ret: "спецификация motion" },
      ] },
      { name: "AI-ядро", label: "AI-ядро", pain: "Все говорят про AI, но непонятно, где он реально нужен.", solution: "AI только там, где он экономит время или деньги.", items: [
        { title: "Сценарии для AI", why: ["где AI экономит время и деньги,", "а где только мешает"], ret: "карта применений" },
        { title: "Промпты и пайплайн", why: ["рабочие промпты, цепочки", "вызовов и данные для них"], ret: "работающий пайплайн" },
        { title: "Оценка качества", why: ["как измеряем, что AI отвечает", "верно и когда ошибается"], ret: "тест-набор и метрики" },
      ] },
      { name: "Прототип", label: "Прототип", pain: "Долго и дорого узнавать, что что-то не работает.", solution: "Рабочий MVP за недели, проверенный на живых людях.", items: [
        { title: "Рабочий MVP", why: ["живая версия, которой можно", "пользоваться уже сейчас"], ret: "деплой по ссылке" },
        { title: "Тест с пользователями", why: ["5–8 человек проходят сценарии,", "я вижу, где они спотыкаются"], ret: "записи и выводы" },
        { title: "Список правок", why: ["что чиним сразу, что потом:", "приоритеты без споров"], ret: "бэклог" },
      ] },
      { name: "Запуск", label: "Запуск", pain: "Запустили — и тишина. Непонятно, что дальше.", solution: "Релиз, аналитика и план роста: видно, что работает.", items: [
        { title: "Релиз и инфраструктура", why: ["домен, хостинг, мониторинг —", "всё настроено и работает"], ret: "продукт в проде" },
        { title: "Аналитика", why: ["события и дашборд: видно, что", "делают люди и где уходят"], ret: "дашборд метрик" },
        { title: "План роста", why: ["что улучшать дальше", "и в каком порядке"], ret: "roadmap на квартал" },
      ] },
    ]),
  },
  en: {
    slogans: [
      { eyebrow: "End-to-end product", lead: "Products people actually ", accent: "want to use.", subtitle: "Product, UX/UI and AI in one pair of hands. I'll unpack the problem, build the MVP and take it to launch." },
      { eyebrow: "Websites & landing pages", lead: "Websites that ", accent: "actually sell.", subtitle: "Every screen leads to a request: structure, copy, design and analytics in one system." },
      { eyebrow: "Operations & workspace", lead: "Routine to systems. ", accent: "Growth to you.", subtitle: "I'll build a workspace for your team, automate manual processes, or simply audit how operations run." },
    ],
    stageOf: "Stage", pain: "Sound familiar?", solution: "What I do", get: "youGet", hint: "hover or tap",
    toShip: "← Back to ship", decks: "Decks", up: "Deck above", down: "Deck below", discussStage: "Discuss this stage", cut: "Deck cutaway",
    stages: withTags([
      { name: "Problem", label: "Problem", pain: "There's an idea, but it's unclear what exactly to build and for whom.", solution: "One clear problem statement and success criteria: the team stops arguing.", items: [
        { title: "Problem Statement", why: ["one sentence: whose pain we solve", "and how we'll know it's solved"], ret: "Notion / PDF, 1 page" },
        { title: "Hypotheses", why: ["what has to be true", "for the product to work"], ret: "prioritised list" },
        { title: "Success criteria", why: ["metrics before we start: what", "counts as a win or a failure"], ret: "goals in numbers" },
      ] },
      { name: "Research", label: "Research", pain: "Scared to invest in something nobody turns out to need.", solution: "I know who needs it and why — from interviews and the market, not guesses.", items: [
        { title: "Interviews & competitors", why: ["8–10 talks with real people", "and a review of 5 competitors"], ret: "summary table" },
        { title: "User persona", why: ["who they are, what they do today", "and why they're unhappy with it"], ret: "1 page" },
        { title: "Pain map", why: ["where people lose time and money,", "most important first"], ret: "ranked list" },
      ] },
      { name: "Logic", label: "Logic", pain: "You want everything at once — budget and timeline keep growing.", solution: "A clear MVP: what we build first and what we honestly postpone.", items: [
        { title: "User Journey", why: ["the path from \"heard of it\" to", "\"paid\", with every friction point"], ret: "Figma diagram" },
        { title: "Feature Map", why: ["every feature on one map:", "must, nice-to-have, cut"], ret: "feature map" },
        { title: "MVP Scope", why: ["what goes into version one", "and what we knowingly defer"], ret: "MVP boundaries" },
        { title: "Roadmap", why: ["work order week by week", "with a clear outcome"], ret: "3-month plan" },
      ] },
      { name: "UX", label: "UX", pain: "The product confuses people, and they leave.", solution: "A thought-through path from entry to result — before anything gets drawn.", items: [
        { title: "Scenarios", why: ["who, why and what they tap:", "every step written out"], ret: "user flows" },
        { title: "Screen structure", why: ["a map of every screen", "and how they connect"], ret: "sitemap" },
        { title: "Wireframes", why: ["layouts without styling: we test", "the logic, not the taste"], ret: "clickable prototype" },
      ] },
      { name: "UI", label: "UI", pain: "It looks like everyone else's and doesn't inspire trust.", solution: "A recognisable design language: a product people want to use.", items: [
        { title: "Design system", why: ["colours, type, components —", "once for the whole product"], ret: "Figma library" },
        { title: "Key screens", why: ["the main screens, final", "and ready for development"], ret: "Figma mockups" },
        { title: "Motion & states", why: ["hover, loading, errors —", "what brings the product to life"], ret: "motion spec" },
      ] },
      { name: "AI core", label: "AI core", pain: "Everyone talks about AI, but it's unclear where it's really needed.", solution: "AI only where it saves time or money.", items: [
        { title: "AI use cases", why: ["where AI saves time and money", "and where it only gets in the way"], ret: "use-case map" },
        { title: "Prompts & pipeline", why: ["working prompts, call chains", "and the data they need"], ret: "working pipeline" },
        { title: "Quality evaluation", why: ["how we measure that AI answers", "right and when it fails"], ret: "test set & metrics" },
      ] },
      { name: "Prototype", label: "Prototype", pain: "Finding out something doesn't work takes long and costs a lot.", solution: "A working MVP in weeks, tested with real people.", items: [
        { title: "Working MVP", why: ["a live version you can", "already use today"], ret: "deployed link" },
        { title: "User testing", why: ["5–8 people run the scenarios,", "I see where they stumble"], ret: "recordings & findings" },
        { title: "Fix list", why: ["what we fix now, what later:", "priorities without arguments"], ret: "backlog" },
      ] },
      { name: "Launch", label: "Launch", pain: "Launched — and silence. Unclear what to do next.", solution: "Release, analytics and a growth plan: you can see what works.", items: [
        { title: "Release & infrastructure", why: ["domain, hosting, monitoring —", "all set up and running"], ret: "product in production" },
        { title: "Analytics", why: ["events and a dashboard: see what", "people do and where they drop off"], ret: "metrics dashboard" },
        { title: "Growth plan", why: ["what to improve next", "and in what order"], ret: "quarterly roadmap" },
      ] },
    ]),
  },
  th: {
    slogans: [
      { eyebrow: "โปรดักต์ครบวงจร", lead: "โปรดักต์ที่คนอยาก", accent: "ใช้งานจริง", subtitle: "โปรดักต์ UX/UI และ AI ในคนเดียว วิเคราะห์โจทย์ สร้าง MVP และพาไปจนถึงการเปิดตัว" },
      { eyebrow: "เว็บไซต์และแลนดิ้งเพจ", lead: "เว็บไซต์ที่", accent: "ขายได้จริง", subtitle: "ทุกหน้าจอพาไปสู่การติดต่อ: โครงสร้าง ข้อความ ดีไซน์ และอนาลิติกส์ในระบบเดียว" },
      { eyebrow: "งานปฏิบัติการและ workspace", lead: "งานรูทีนให้ระบบ ", accent: "การเติบโตให้คุณ", subtitle: "สร้าง workspace ให้ทีม ทำงานที่ทำมือให้เป็นอัตโนมัติ หรือแค่ตรวจสอบกระบวนการทำงาน" },
    ],
    stageOf: "ขั้นตอน", pain: "คุ้นๆ ไหม?", solution: "สิ่งที่ผมทำ", get: "สิ่งที่ได้", hint: "ชี้หรือแตะ",
    toShip: "← กลับไปที่ยาน", decks: "ชั้น", up: "ชั้นบน", down: "ชั้นล่าง", discussStage: "คุยเรื่องขั้นตอนนี้", cut: "ภาพตัดขวางชั้น",
    stages: withTags([
      { name: "ปัญหา", label: "ปัญหา", pain: "มีไอเดีย แต่ยังไม่ชัดว่าจะสร้างอะไรและเพื่อใคร", solution: "โจทย์ที่ชัดเจนหนึ่งประโยคพร้อมเกณฑ์ความสำเร็จ: ทีมเลิกเถียงกัน", items: [
        { title: "Problem Statement", why: ["หนึ่งประโยค: แก้ปัญหาของใคร", "และรู้ได้อย่างไรว่าแก้แล้ว"], ret: "Notion / PDF 1 หน้า" },
        { title: "สมมติฐาน", why: ["อะไรต้องเป็นจริง", "เพื่อให้โปรดักต์ได้ผล"], ret: "รายการตามลำดับความสำคัญ" },
        { title: "เกณฑ์ความสำเร็จ", why: ["ตัวชี้วัดก่อนเริ่ม: อะไรคือ", "ความสำเร็จ อะไรคือความล้มเหลว"], ret: "เป้าหมายเป็นตัวเลข" },
      ] },
      { name: "วิจัย", label: "วิจัย", pain: "กลัวลงทุนกับสิ่งที่สุดท้ายไม่มีใครต้องการ", solution: "รู้ว่าใครต้องการและเพราะอะไร จากการสัมภาษณ์และตลาด ไม่ใช่การเดา", items: [
        { title: "สัมภาษณ์และคู่แข่ง", why: ["คุยกับผู้ใช้จริง 8–10 คน", "และวิเคราะห์คู่แข่ง 5 ราย"], ret: "ตารางสรุป" },
        { title: "ภาพผู้ใช้", why: ["เขาคือใคร ทำอะไรอยู่ทุกวันนี้", "และทำไมถึงไม่พอใจ"], ret: "1 หน้า" },
        { title: "แผนที่ปัญหา", why: ["ผู้คนเสียเวลาและเงินตรงไหน", "เรียงจากสำคัญที่สุด"], ret: "รายการจัดอันดับ" },
      ] },
      { name: "ตรรกะ", label: "ตรรกะ", pain: "อยากได้ทุกอย่างพร้อมกัน งบและเวลาเลยบานปลาย", solution: "MVP ที่ชัดเจน: ทำอะไรก่อน และอะไรเลื่อนออกไปอย่างตรงไปตรงมา", items: [
        { title: "User Journey", why: ["เส้นทางจาก \"รู้จัก\" ถึง \"จ่ายเงิน\"", "พร้อมทุกจุดที่ติดขัด"], ret: "แผนภาพใน Figma" },
        { title: "Feature Map", why: ["ทุกฟีเจอร์ในแผนที่เดียว:", "จำเป็น อยากได้ และไม่ต้องมี"], ret: "แผนที่ฟีเจอร์" },
        { title: "MVP Scope", why: ["อะไรอยู่ในเวอร์ชันแรก", "และอะไรตั้งใจเลื่อนออกไป"], ret: "ขอบเขต MVP" },
        { title: "Roadmap", why: ["ลำดับงานรายสัปดาห์", "พร้อมผลลัพธ์ที่ชัดเจน"], ret: "แผน 3 เดือน" },
      ] },
      { name: "UX", label: "UX", pain: "โปรดักต์ทำให้ผู้ใช้สับสน แล้วพวกเขาก็จากไป", solution: "เส้นทางที่คิดมาแล้วตั้งแต่เข้าจนได้ผลลัพธ์ ก่อนจะเริ่มวาด", items: [
        { title: "สถานการณ์ใช้งาน", why: ["ใคร ทำไม และกดอะไร:", "ทุกขั้นตอนเขียนไว้ชัด"], ret: "user flows" },
        { title: "โครงสร้างหน้าจอ", why: ["แผนที่ทุกหน้าจอ", "และการเชื่อมต่อระหว่างกัน"], ret: "sitemap" },
        { title: "Wireframes", why: ["เลย์เอาต์ไม่มีดีไซน์: ทดสอบ", "ตรรกะ ไม่ใช่รสนิยม"], ret: "ต้นแบบที่คลิกได้" },
      ] },
      { name: "UI", label: "UI", pain: "ดูเหมือนของคนอื่นทั่วไป และไม่น่าเชื่อถือ", solution: "ภาษาดีไซน์ที่จดจำได้: โปรดักต์ที่คนอยากใช้", items: [
        { title: "ดีไซน์ซิสเต็ม", why: ["สี ฟอนต์ คอมโพเนนต์", "ทำครั้งเดียวใช้ทั้งโปรดักต์"], ret: "ไลบรารีใน Figma" },
        { title: "หน้าจอหลัก", why: ["หน้าจอสำคัญฉบับสมบูรณ์", "พร้อมพัฒนา"], ret: "ม็อกอัปใน Figma" },
        { title: "แอนิเมชันและสถานะ", why: ["hover โหลด ข้อผิดพลาด", "สิ่งที่ทำให้โปรดักต์มีชีวิต"], ret: "สเปก motion" },
      ] },
      { name: "แกน AI", label: "แกน AI", pain: "ใครๆ ก็พูดถึง AI แต่ไม่ชัดว่าต้องใช้ตรงไหนจริงๆ", solution: "ใช้ AI เฉพาะตรงที่ช่วยประหยัดเวลาหรือเงิน", items: [
        { title: "กรณีใช้ AI", why: ["AI ช่วยประหยัดเวลาและเงินตรงไหน", "และตรงไหนแค่เกะกะ"], ret: "แผนที่การใช้งาน" },
        { title: "พรอมต์และไปป์ไลน์", why: ["พรอมต์ที่ใช้งานได้ ลำดับการเรียก", "และข้อมูลที่ต้องใช้"], ret: "ไปป์ไลน์ที่ใช้งานได้" },
        { title: "การประเมินคุณภาพ", why: ["วัดอย่างไรว่า AI ตอบถูก", "และผิดพลาดเมื่อไร"], ret: "ชุดทดสอบและตัวชี้วัด" },
      ] },
      { name: "ต้นแบบ", label: "ต้นแบบ", pain: "กว่าจะรู้ว่าอะไรใช้ไม่ได้ ก็ใช้เวลานานและแพง", solution: "MVP ที่ใช้งานได้ภายในไม่กี่สัปดาห์ ทดสอบกับผู้ใช้จริง", items: [
        { title: "MVP ที่ใช้งานได้", why: ["เวอร์ชันจริงที่ใช้งาน", "ได้ตั้งแต่ตอนนี้"], ret: "ลิงก์ที่ deploy แล้ว" },
        { title: "ทดสอบกับผู้ใช้", why: ["5–8 คนลองใช้งานตามสถานการณ์", "ผมเห็นว่าพวกเขาติดตรงไหน"], ret: "บันทึกและข้อสรุป" },
        { title: "รายการแก้ไข", why: ["อะไรแก้ทันที อะไรแก้ทีหลัง:", "ลำดับความสำคัญไม่ต้องเถียง"], ret: "แบ็กล็อก" },
      ] },
      { name: "เปิดตัว", label: "เปิดตัว", pain: "เปิดตัวแล้วเงียบ ไม่รู้จะทำอะไรต่อ", solution: "รีลีส อนาลิติกส์ และแผนการเติบโต: เห็นชัดว่าอะไรได้ผล", items: [
        { title: "รีลีสและโครงสร้างระบบ", why: ["โดเมน โฮสติ้ง มอนิเตอร์", "ตั้งค่าครบและทำงานได้"], ret: "โปรดักต์บน production" },
        { title: "อนาลิติกส์", why: ["อีเวนต์และแดชบอร์ด: เห็นว่า", "ผู้ใช้ทำอะไรและหลุดตรงไหน"], ret: "แดชบอร์ดตัวชี้วัด" },
        { title: "แผนการเติบโต", why: ["ควรปรับปรุงอะไรต่อ", "และในลำดับไหน"], ret: "roadmap รายไตรมาส" },
      ] },
    ]),
  },
};
