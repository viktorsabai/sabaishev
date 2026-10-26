import type { Language } from "@/lib/content";

// Process page (CHANGES-2 "Процесс"): pick a business, then walk a Gantt chart layer by layer.
// Russian is from the handoff (build_stages2.py); EN/TH are translations to review with the author.

// Gantt geometry: start week (0-based) and duration in weeks; same in every language.
export const STAGE_WEEKS: { s: number; d: number }[] = [
  { s: 0, d: 1 }, { s: 1, d: 1 }, { s: 2, d: 2 }, { s: 3, d: 5 }, { s: 7, d: 2 }, { s: 8, d: 1 }, { s: 9, d: 1 },
];

// Documents shown behind the Gantt, one per item of the stage's output. Real artifacts from
// /artifacts/process are captioned with their real names; `light` ones are inverted to sit on
// the dark background. Stages without a real artifact show the handoff's wireframe placeholder.
export type StageDoc = { name: string; img?: string; light?: boolean };
const art = (id: string) => `/artifacts/process/process-${id}.webp`;
export const STAGE_DOCS: StageDoc[][] = [
  [{ name: "Problem Statement · TAIKA", img: art("0-0") }, { name: "Opportunity Tree", img: art("2-1") }, { name: "Success Metrics · TAIKA", img: art("0-4") }],
  [{ name: "Market Insights · MOO", img: art("1-4") }, { name: "User Interviews · MOO", img: art("1-0") }, { name: "SEO-Audit.pdf" }],
  [{ name: "User Journey Map", img: art("2-0") }, { name: "Wireframes · TAIKA", img: art("3-1"), light: true }, { name: "Design System · TAIKA", img: art("4-0") }],
  [{ name: "JSON / API · TAIKA", img: art("5-2") }, { name: "Integration pipeline · n8n", img: art("5-3") }, { name: "Prompt System · TAIKA", img: art("5-0") }],
  [{ name: "Usability Testing · MOO", img: art("6-3") }, { name: "Interaction States · MOO", img: art("6-2") }, { name: "Prototype Iterations · MOO", img: art("6-4") }],
  [{ name: "Docs.md" }, { name: "Video-Guides.mp4" }, { name: "Training.pdf" }],
  [{ name: "Launch Plan · TAIKA", img: art("7-0") }, { name: "Analytics Dashboard · TAIKA", img: art("7-1") }, { name: "Roadmap · TAIKA", img: art("7-3") }],
];

export type ProcStage = { name: string; out: { doc: string; inside: [string, string, string]; can: string }; proof: string };
export type Business = { name: string; hint: string; p: [string, string][] };

export type ProcessCopy = {
  eyebrow: string; title: string; accent: string; lead: string;
  familiar: string; whatIDo: string; output: string;
  business: string; stage: string; layer: string; next: string; restart: string;
  autoOn: string; autoOff: string; discuss: string; weeksNote: string; docOfStage: string;
  prevLayer: string;
  code: { out: string; doc: string; inside: string; can: string; proof: string };
  stages: ProcStage[];
  biz: Business[];
};

export const processContent: Record<Language, ProcessCopy> = {
  ru: {
    eyebrow: "Процесс", title: "Какой у вас ", accent: "бизнес?",
    lead: "Выберите — и я покажу ваш путь от боли до запуска: слой за слоем, с тем, что вы получите на каждом этапе.",
    familiar: "Знакомо?", whatIDo: "Что делаю я", output: "На выходе этапа — вы получаете",
    business: "Бизнес", stage: "Этап", layer: "Слой", next: "Дальше", restart: "Сначала",
    autoOn: "Автоплей · вкл", autoOff: "Автоплей · выкл", discuss: "Обсудить мой путь",
    weeksNote: "Ориентир по неделям · сроки уточняются под задачу", docOfStage: "Документ этапа",
    prevLayer: "Предыдущий слой",
    code: { out: "выход", doc: "документ", inside: "внутри", can: "вы_сможете", proof: "так было в" },
    stages: [
      { name: "Формулируем", out: { doc: "Карта продукта", inside: ["цель и метрики успеха", "гипотезы по приоритету", "границы первой версии"], can: "объяснить продукт за 5 минут" }, proof: "TAIKA · MOO" },
      { name: "Аудируем", out: { doc: "Аудит и карта болей", inside: ["что работает и что нет", "сравнение с конкурентами", "SEO-аудит"], can: "решить, что чинить первым" }, proof: "Paradise" },
      { name: "Проектируем", out: { doc: "Архитектура продукта", inside: ["путь клиента и структура экранов", "кликабельный прототип", "дизайн-система"], can: "отдать любой команде в работу" }, proof: "TAIKA · EON" },
      { name: "Собираем", out: { doc: "Продукт и описание интеграций", inside: ["код и API", "схема интеграций", "все доступы"], can: "развивать продукт без меня" }, proof: "MOO · Paradise" },
      { name: "Тестируем", out: { doc: "Отчёт по тестам", inside: ["записи тестов с людьми", "найденные ошибки", "список правок"], can: "увидеть, что проверено на людях" }, proof: "MOO — тест с заказчиком" },
      { name: "Обучаем", out: { doc: "Инструкции и обучение", inside: ["документация", "видео-гайды", "сессия с вашей командой"], can: "работать командой самостоятельно" }, proof: "" },
      { name: "Запускаем", out: { doc: "План запуска и роста", inside: ["чек-лист релиза и SEO", "дашборд аналитики", "roadmap роста"], can: "видеть результат в цифрах" }, proof: "Paradise · EON — онлайн" },
    ],
    biz: [
      { name: "Недвижимость", hint: "Каталог, заявки, лиды с сайта", p: [
        ["Объектов много, а заявок мало — непонятно, что чинить.", "Формулирую одну цель: сколько заявок, от кого и за какой срок."],
        ["Клиенты смотрят и уходят к агрегаторам.", "Разбираю воронку и конкурентов: где именно теряются лиды."],
        ["Фильтры и карточки путают покупателя.", "Проектирую поиск объекта за три касания."],
        ["Сайт на конструкторе, CRM живёт отдельно.", "Собираю сайт, каталог и интеграцию с вашей CRM."],
        ["Выпустили, а звонков нет.", "Проверяю путь покупателя на живых людях до релиза."],
        ["Менеджеры не понимают новую систему.", "Обучаю агентов работать с каталогом и заявками."],
        ["Запустили, а в поиске тишина.", "Запускаю с SEO и аналитикой заявок."],
      ] },
      { name: "Фудтех", hint: "Заказы без комиссии агрегаторов", p: [
        ["Агрегаторы забирают комиссию и клиентов.", "Задаю цель: свои заказы и свои гости, без комиссии."],
        ["Не знаю, где гости бросают заказ.", "Смотрю путь гостя и разбираю конкурентов по меню."],
        ["Заказ слишком долгий и запутанный.", "Проектирую заказ за минуту, без регистрации."],
        ["Своё приложение — дорого и долго.", "Собираю Telegram Mini App с оплатой за недели."],
        ["Гости путаются в корзине.", "Тестирую заказ на живых гостях."],
        ["Персонал не знает, как принимать заказы.", "Обучаю кухню и зал за один час."],
        ["Запустили, а гости не заходят.", "Запускаю с QR на столах и аналитикой."],
      ] },
      { name: "Спорт-центр", hint: "Запись, абонементы, продления", p: [
        ["Записываются, но не доходят.", "Формулирую цель: посещаемость и продления."],
        ["Непонятно, почему уходят после двух месяцев.", "Разбираю отток и сравниваю с рынком."],
        ["Запись и абонементы запутаны.", "Проектирую запись и абонемент в пару касаний."],
        ["Расписание в таблицах и мессенджерах.", "Собираю расписание, оплату и напоминания."],
        ["Тренеры ломают сценарии.", "Проверяю сценарии вместе с тренерами и клиентами."],
        ["Администраторы работают по-старому.", "Обучаю администраторов и тренеров."],
        ["Запустили, но не продлевают.", "Запускаю воронку продлений с аналитикой."],
      ] },
      { name: "Бьюти", hint: "Онлайн-запись и возвраты клиентов", p: [
        ["Окна в расписании простаивают.", "Формулирую цель: заполнить окна и вернуть клиентов."],
        ["Записи приходят хаотично из соцсетей.", "Смотрю, где теряются записи."],
        ["Онлайн-запись неудобная.", "Проектирую запись к мастеру за 30 секунд."],
        ["Записи в тетради и в директе.", "Собираю запись, напоминания и лояльность."],
        ["Клиенты не доходят до записи.", "Тестирую запись на живых клиентах."],
        ["Мастера не хотят новых систем.", "Показываю мастерам, как это экономит время."],
        ["Новая запись не приводит новых клиентов.", "Запускаю с отзывами, акциями и аналитикой."],
      ] },
      { name: "Клиника", hint: "Запись, no-show, AI-помощник", p: [
        ["Пациенты не могут быстро записаться.", "Формулирую цель: быстрая запись и меньше неявок."],
        ["Регистратура перегружена звонками.", "Разбираю нагрузку и путь пациента."],
        ["Сложные процессы и чувствительные данные.", "Проектирую безопасный и понятный путь пациента."],
        ["Нужны AI и интеграция с МИС.", "Собираю запись, AI-помощника и интеграции."],
        ["Ошибки недопустимы.", "Тестирую сценарии вместе с врачами и пациентами."],
        ["Врачи и регистратура не готовы.", "Обучаю персонал и пишу регламенты."],
        ["Нужен запуск без сбоев.", "Запускаю по этапам с мониторингом."],
      ] },
    ],
  },
  en: {
    eyebrow: "Process", title: "What's your ", accent: "business?",
    lead: "Pick one and I'll show your path from pain to launch, layer by layer, with what you get at every stage.",
    familiar: "Sound familiar?", whatIDo: "What I do", output: "Stage output — what you get",
    business: "Business", stage: "Stage", layer: "Layer", next: "Next", restart: "Start over",
    autoOn: "Autoplay · on", autoOff: "Autoplay · off", discuss: "Discuss my path",
    weeksNote: "Approximate weeks · timing is set per project", docOfStage: "Stage document",
    prevLayer: "Previous layer",
    code: { out: "output", doc: "document", inside: "inside", can: "you_can", proof: "done for" },
    stages: [
      { name: "Frame", out: { doc: "Product map", inside: ["goal and success metrics", "prioritised hypotheses", "scope of version one"], can: "explain the product in 5 minutes" }, proof: "TAIKA · MOO" },
      { name: "Audit", out: { doc: "Audit and pain map", inside: ["what works and what doesn't", "competitor comparison", "SEO audit"], can: "decide what to fix first" }, proof: "Paradise" },
      { name: "Design", out: { doc: "Product architecture", inside: ["customer path and screen structure", "clickable prototype", "design system"], can: "hand it to any team to build" }, proof: "TAIKA · EON" },
      { name: "Build", out: { doc: "Product and integration docs", inside: ["code and API", "integration map", "all access"], can: "grow the product without me" }, proof: "MOO · Paradise" },
      { name: "Test", out: { doc: "Test report", inside: ["recordings of user tests", "bugs found", "fix list"], can: "see what was tested with people" }, proof: "MOO — client testing" },
      { name: "Train", out: { doc: "Guides and training", inside: ["documentation", "video guides", "session with your team"], can: "run it as a team on your own" }, proof: "" },
      { name: "Launch", out: { doc: "Launch and growth plan", inside: ["release and SEO checklist", "analytics dashboard", "growth roadmap"], can: "see results in numbers" }, proof: "Paradise · EON — live" },
    ],
    biz: [
      { name: "Real estate", hint: "Listings, enquiries, leads from the site", p: [
        ["Lots of listings, few enquiries — unclear what to fix.", "I set one goal: how many enquiries, from whom, by when."],
        ["Visitors browse and leave for aggregators.", "I take apart the funnel and competitors: where leads get lost."],
        ["Filters and cards confuse buyers.", "I design finding a property in three taps."],
        ["The site is on a builder and the CRM lives apart.", "I build the site, the catalogue and your CRM integration."],
        ["Released, and the phone is silent.", "I test the buyer's path with real people before release."],
        ["Managers don't get the new system.", "I train agents to work with listings and enquiries."],
        ["Launched, and search is silent.", "I launch with SEO and enquiry analytics."],
      ] },
      { name: "Food tech", hint: "Orders without aggregator fees", p: [
        ["Aggregators take the fee and the customers.", "I set the goal: your own orders and guests, no fees."],
        ["I don't know where guests drop their order.", "I trace the guest's path and review competitors' menus."],
        ["Ordering is too long and confusing.", "I design a one-minute order with no sign-up."],
        ["An own app is expensive and slow.", "I build a Telegram Mini App with payments in weeks."],
        ["Guests get lost in the cart.", "I test ordering with real guests."],
        ["Staff don't know how to take orders.", "I train kitchen and floor in an hour."],
        ["Launched, and guests don't come.", "I launch with table QR codes and analytics."],
      ] },
      { name: "Sports centre", hint: "Bookings, memberships, renewals", p: [
        ["People book but don't show up.", "I set the goal: attendance and renewals."],
        ["Unclear why people leave after two months.", "I analyse churn and compare with the market."],
        ["Booking and memberships are confusing.", "I design booking and membership in a couple of taps."],
        ["The schedule lives in spreadsheets and chats.", "I build the schedule, payments and reminders."],
        ["Coaches break the flows.", "I test the flows with coaches and clients."],
        ["Admins work the old way.", "I train admins and coaches."],
        ["Launched, but nobody renews.", "I launch a renewal funnel with analytics."],
      ] },
      { name: "Beauty", hint: "Online booking and returning clients", p: [
        ["Gaps in the schedule sit empty.", "I set the goal: fill the gaps and bring clients back."],
        ["Bookings arrive chaotically from social media.", "I find where bookings get lost."],
        ["Online booking is awkward.", "I design booking a specialist in 30 seconds."],
        ["Bookings live in a notebook and in DMs.", "I build booking, reminders and loyalty."],
        ["Clients don't finish booking.", "I test booking with real clients."],
        ["Specialists don't want new systems.", "I show specialists how it saves them time."],
        ["New booking doesn't bring new clients.", "I launch with reviews, offers and analytics."],
      ] },
      { name: "Clinic", hint: "Booking, no-shows, AI assistant", p: [
        ["Patients can't book quickly.", "I set the goal: fast booking and fewer no-shows."],
        ["Reception is swamped with calls.", "I analyse the load and the patient's path."],
        ["Complex processes and sensitive data.", "I design a safe, clear patient path."],
        ["You need AI and an integration with the clinic system.", "I build booking, an AI assistant and integrations."],
        ["Mistakes are not acceptable.", "I test the flows with doctors and patients."],
        ["Doctors and reception aren't ready.", "I train the staff and write the procedures."],
        ["The launch must go without a hitch.", "I launch in stages with monitoring."],
      ] },
    ],
  },
  th: {
    eyebrow: "กระบวนการ", title: "ธุรกิจของคุณ", accent: "คืออะไร?",
    lead: "เลือกแล้วผมจะแสดงเส้นทางจากปัญหาถึงการเปิดตัว ทีละชั้น พร้อมสิ่งที่คุณได้ในแต่ละขั้นตอน",
    familiar: "คุ้นๆ ไหม?", whatIDo: "สิ่งที่ผมทำ", output: "ผลลัพธ์ของขั้นตอน — สิ่งที่คุณได้",
    business: "ธุรกิจ", stage: "ขั้นตอน", layer: "ชั้น", next: "ถัดไป", restart: "เริ่มใหม่",
    autoOn: "เล่นอัตโนมัติ · เปิด", autoOff: "เล่นอัตโนมัติ · ปิด", discuss: "คุยเรื่องเส้นทางของฉัน",
    weeksNote: "สัปดาห์โดยประมาณ · ระยะเวลาปรับตามงาน", docOfStage: "เอกสารของขั้นตอน",
    prevLayer: "ชั้นก่อนหน้า",
    code: { out: "output", doc: "document", inside: "inside", can: "you_can", proof: "done for" },
    stages: [
      { name: "กำหนดโจทย์", out: { doc: "แผนที่โปรดักต์", inside: ["เป้าหมายและตัวชี้วัด", "สมมติฐานตามลำดับ", "ขอบเขตเวอร์ชันแรก"], can: "อธิบายโปรดักต์ได้ใน 5 นาที" }, proof: "TAIKA · MOO" },
      { name: "ตรวจสอบ", out: { doc: "ผลตรวจสอบและแผนที่ปัญหา", inside: ["อะไรได้ผลและอะไรไม่", "เทียบกับคู่แข่ง", "ตรวจ SEO"], can: "ตัดสินใจว่าจะแก้อะไรก่อน" }, proof: "Paradise" },
      { name: "ออกแบบ", out: { doc: "สถาปัตยกรรมโปรดักต์", inside: ["เส้นทางลูกค้าและโครงหน้าจอ", "ต้นแบบที่คลิกได้", "ดีไซน์ซิสเต็ม"], can: "ส่งให้ทีมไหนก็ทำต่อได้" }, proof: "TAIKA · EON" },
      { name: "สร้าง", out: { doc: "โปรดักต์และเอกสารการเชื่อมต่อ", inside: ["โค้ดและ API", "แผนผังการเชื่อมต่อ", "สิทธิ์เข้าถึงทั้งหมด"], can: "พัฒนาต่อได้เองโดยไม่ต้องมีผม" }, proof: "MOO · Paradise" },
      { name: "ทดสอบ", out: { doc: "รายงานการทดสอบ", inside: ["บันทึกการทดสอบกับผู้ใช้", "ข้อผิดพลาดที่พบ", "รายการแก้ไข"], can: "เห็นว่าอะไรทดสอบกับคนจริงแล้ว" }, proof: "MOO — ทดสอบกับลูกค้า" },
      { name: "ฝึกอบรม", out: { doc: "คู่มือและการอบรม", inside: ["เอกสาร", "วิดีโอแนะนำ", "เซสชันกับทีมของคุณ"], can: "ทีมทำงานได้เองอย่างอิสระ" }, proof: "" },
      { name: "เปิดตัว", out: { doc: "แผนเปิดตัวและการเติบโต", inside: ["เช็กลิสต์รีลีสและ SEO", "แดชบอร์ดอนาลิติกส์", "roadmap การเติบโต"], can: "เห็นผลลัพธ์เป็นตัวเลข" }, proof: "Paradise · EON — ออนไลน์" },
    ],
    biz: [
      { name: "อสังหาฯ", hint: "รายการทรัพย์ คำขอ ลีดจากเว็บไซต์", p: [
        ["ทรัพย์เยอะ แต่คำขอน้อย ไม่รู้จะแก้ตรงไหน", "ตั้งเป้าหมายเดียว: คำขอกี่ราย จากใคร ภายในเมื่อไร"],
        ["ลูกค้าดูแล้วไปใช้เว็บรวมประกาศ", "วิเคราะห์ funnel และคู่แข่ง: ลีดหายไปตรงไหน"],
        ["ตัวกรองและการ์ดทำให้ผู้ซื้อสับสน", "ออกแบบการค้นหาทรัพย์ภายในสามแตะ"],
        ["เว็บทำจากเครื่องมือสำเร็จรูป CRM แยกกัน", "สร้างเว็บไซต์ แคตตาล็อก และเชื่อมกับ CRM ของคุณ"],
        ["เปิดแล้ว แต่ไม่มีใครโทรมา", "ทดสอบเส้นทางผู้ซื้อกับคนจริงก่อนรีลีส"],
        ["ทีมขายไม่เข้าใจระบบใหม่", "อบรมเอเจนต์ให้ใช้แคตตาล็อกและคำขอ"],
        ["เปิดแล้ว แต่ไม่ขึ้นในการค้นหา", "เปิดตัวพร้อม SEO และอนาลิติกส์คำขอ"],
      ] },
      { name: "ฟู้ดเทค", hint: "ออร์เดอร์โดยไม่เสียค่าคอมแพลตฟอร์ม", p: [
        ["แพลตฟอร์มเดลิเวอรีเอาทั้งค่าคอมและลูกค้าไป", "ตั้งเป้า: ออร์เดอร์และลูกค้าของคุณเอง ไม่มีค่าคอม"],
        ["ไม่รู้ว่าลูกค้าทิ้งออร์เดอร์ตรงไหน", "ดูเส้นทางลูกค้าและวิเคราะห์เมนูของคู่แข่ง"],
        ["การสั่งยาวและซับซ้อนเกินไป", "ออกแบบการสั่งภายในหนึ่งนาที ไม่ต้องสมัคร"],
        ["ทำแอปเองแพงและนาน", "สร้าง Telegram Mini App พร้อมชำระเงินในไม่กี่สัปดาห์"],
        ["ลูกค้าสับสนกับตะกร้า", "ทดสอบการสั่งกับลูกค้าจริง"],
        ["พนักงานไม่รู้วิธีรับออร์เดอร์", "อบรมครัวและหน้าร้านในหนึ่งชั่วโมง"],
        ["เปิดแล้ว แต่ลูกค้าไม่เข้ามา", "เปิดตัวพร้อม QR บนโต๊ะและอนาลิติกส์"],
      ] },
      { name: "ศูนย์กีฬา", hint: "การจอง สมาชิก การต่ออายุ", p: [
        ["จองแล้วแต่ไม่มา", "ตั้งเป้า: อัตราการเข้าใช้และการต่ออายุ"],
        ["ไม่รู้ว่าทำไมสมาชิกเลิกหลังสองเดือน", "วิเคราะห์การเลิกใช้และเทียบกับตลาด"],
        ["การจองและแพ็กเกจสมาชิกซับซ้อน", "ออกแบบการจองและสมาชิกในไม่กี่แตะ"],
        ["ตารางอยู่ในสเปรดชีตและแชต", "สร้างตารางเวลา การชำระเงิน และการแจ้งเตือน"],
        ["เทรนเนอร์ทำให้ขั้นตอนพัง", "ทดสอบขั้นตอนร่วมกับเทรนเนอร์และลูกค้า"],
        ["แอดมินยังทำงานแบบเดิม", "อบรมแอดมินและเทรนเนอร์"],
        ["เปิดแล้ว แต่ไม่มีใครต่ออายุ", "เปิด funnel การต่ออายุพร้อมอนาลิติกส์"],
      ] },
      { name: "บิวตี้", hint: "จองออนไลน์และลูกค้ากลับมาใช้ซ้ำ", p: [
        ["ช่วงเวลาในตารางว่าง", "ตั้งเป้า: เติมช่วงว่างและดึงลูกค้ากลับมา"],
        ["การจองเข้ามาจากโซเชียลแบบไม่เป็นระบบ", "หาว่าการจองหายไปตรงไหน"],
        ["จองออนไลน์ใช้ยาก", "ออกแบบการจองช่างภายใน 30 วินาที"],
        ["การจองอยู่ในสมุดและแชต", "สร้างระบบจอง การแจ้งเตือน และสะสมแต้ม"],
        ["ลูกค้าจองไม่สำเร็จ", "ทดสอบการจองกับลูกค้าจริง"],
        ["ช่างไม่อยากใช้ระบบใหม่", "แสดงให้ช่างเห็นว่าช่วยประหยัดเวลาอย่างไร"],
        ["ระบบจองใหม่ไม่ได้ลูกค้าใหม่", "เปิดตัวพร้อมรีวิว โปรโมชัน และอนาลิติกส์"],
      ] },
      { name: "คลินิก", hint: "การจอง ลดการไม่มาตามนัด ผู้ช่วย AI", p: [
        ["คนไข้จองนัดได้ไม่เร็ว", "ตั้งเป้า: จองเร็วและลดการไม่มาตามนัด"],
        ["เคาน์เตอร์รับสายไม่ไหว", "วิเคราะห์ภาระงานและเส้นทางคนไข้"],
        ["กระบวนการซับซ้อนและข้อมูลอ่อนไหว", "ออกแบบเส้นทางคนไข้ที่ปลอดภัยและเข้าใจง่าย"],
        ["ต้องการ AI และเชื่อมกับระบบคลินิก", "สร้างระบบจอง ผู้ช่วย AI และการเชื่อมต่อ"],
        ["ผิดพลาดไม่ได้", "ทดสอบขั้นตอนร่วมกับแพทย์และคนไข้"],
        ["แพทย์และเคาน์เตอร์ยังไม่พร้อม", "อบรมบุคลากรและเขียนคู่มือการทำงาน"],
        ["ต้องเปิดตัวโดยไม่สะดุด", "เปิดตัวเป็นระยะพร้อมการมอนิเตอร์"],
      ] },
    ],
  },
};
