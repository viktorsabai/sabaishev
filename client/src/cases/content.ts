import type { Language } from "@/lib/content";

// Cases page (CHANGES-2 "Cases"): three live projects shown as browser + phone mockups, and a
// fourth slot for the service itself, site development, where a site assembles on the screens.
// Russian is from the handoff (build_cases2.py); EN/TH are translations to review with the author.

// Language-independent: links, screenshots (captured from the live sites), accent colour.
// still: a single-screen capture, shown without the scroll-through.
// service: no project behind it; the screens show a site being built and the button opens the brief.
export type CaseMedia = { slug: string; host: string; url?: string; desktop?: string; mobile?: string; hue: string; still?: boolean; service?: boolean };
export const CASE_MEDIA: CaseMedia[] = [
  { slug: "taika", host: "taikaa.online", url: "https://taikaa.online/", desktop: "/cases/taika-desktop.webp", mobile: "/cases/taika-mobile.webp", hue: "#3B82F6" },
  { slug: "moo", host: "moo-beryl.vercel.app", url: "https://moo-beryl.vercel.app/", desktop: "/cases/moo-desktop.webp", mobile: "/cases/moo-mobile.webp", hue: "#EC4899" },
  { slug: "paradise", host: "paradise-real-estate-orcin.vercel.app", url: "https://paradise-real-estate-orcin.vercel.app/", desktop: "/cases/paradise-desktop.webp", mobile: "/cases/paradise-mobile.webp", hue: "#A855F7" },
  { slug: "site", host: "your-business.online", hue: "#3B82F6", service: true },
];

// spec: task / role / result lines, shown as a code block under the description.
export type CaseText = { name: string; type: string; desc: string; tags: string[]; status: string; spec: [string, string, string] };
export type CasesCopy = {
  eyebrow: string; onAir: string; open: string; prev: string; next: string; prevAria: string; nextAria: string;
  pause: string; play: string; placeholder: string; screenshot: string;
  specKeys: [string, string, string]; discuss: string;
  // The site that assembles in the service slot.
  mock: { title: string; accent: string; cta: string; notes: [string, string, string, string]; form: string };
  cases: CaseText[];
};

export const casesContent: Record<Language, CasesCopy> = {
  ru: {
    eyebrow: "Портфолио", onAir: "В эфире", open: "Открыть проект", prev: "Пред", next: "След",
    prevAria: "Предыдущий проект", nextAria: "Следующий проект", pause: "Пауза", play: "Продолжить",
    placeholder: "Сюда встанет скрин", screenshot: "Скриншот",
    specKeys: ["задача", "роль", "итог"], discuss: "Обсудить сайт",
    mock: { title: "Ваш бизнес.", accent: "Онлайн.", cta: "Оставить заявку", notes: ["навигация", "оффер → заявка", "доверие", "форма"], form: "Заявка" },
    cases: [
      { name: "TAIKA", type: "iOS-приложение · EdTech · AI", desc: "Разговорный тайский для русскоязычных: звук, смысл и тон. Курсы, лайфхаки и Speaker, который можно попробовать прямо на сайте.", tags: ["iOS", "Swift", "AI", "Speech"], status: "Тестирование", spec: ["тайский живым и ежедневным, а не академическим", "продукт, UX/UI, AI-сценарии, прототип iOS", "MVP: онбординг, уроки, голосовая практика"] },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "Ресторан в Telegram: гости заказывают, платят и следят за статусом без отдельного приложения и комиссии агрегатора. Запуск за 48 часов.", tags: ["Mini App", "Меню и корзина", "QR-оплата", "Подписка"], status: "Тест с заказчиком", spec: ["заказ еды без приложения и комиссии агрегатора", "продуктовая логика, UX/UI, mobile-flow", "меню, корзина, оплата и статус в Telegram"] },
      { name: "Paradise", type: "Сайт · Недвижимость · Пхукет", desc: "Сайт агентства недвижимости на Пхукете: продажа и аренда вилл и апартаментов, заявка для владельцев, RU/EN. Интерфейс в стилистике чертёжных листов.", tags: ["Продажа", "Аренда", "RU / EN", "Заявки"], status: "Онлайн", spec: ["витрина, которая приводит покупателей и владельцев", "структура, дизайн и разработка сайта", "каталог, аренда, заявки — онлайн на двух языках"] },
      { name: "Сайты", type: "Услуга · Разработка сайтов", desc: "Соберу сайт под ваш бизнес: структура, тексты, дизайн и разработка в одних руках. Каждый экран ведёт к заявке, а не просто красиво выглядит.", tags: ["Лендинг", "Сайт-каталог", "RU / EN / TH", "Заявки"], status: "Слот открыт", spec: ["сайт, где каждый экран ведёт к заявке", "структура, тексты, дизайн, разработка, запуск", "сайт онлайн, аналитика, заявки приходят вам"] },
    ],
  },
  en: {
    eyebrow: "Portfolio", onAir: "On air", open: "Open project", prev: "Prev", next: "Next",
    prevAria: "Previous project", nextAria: "Next project", pause: "Pause", play: "Play",
    placeholder: "Screenshot goes here", screenshot: "Screenshot of",
    specKeys: ["task", "role", "result"], discuss: "Discuss a site",
    mock: { title: "Your business.", accent: "Online.", cta: "Send a request", notes: ["navigation", "offer → request", "trust", "form"], form: "Request" },
    cases: [
      { name: "TAIKA", type: "iOS app · EdTech · AI", desc: "Conversational Thai for Russian speakers: sound, meaning and tone. Courses, tips and a Speaker you can try right on the site.", tags: ["iOS", "Swift", "AI", "Speech"], status: "Testing", spec: ["Thai as a living daily habit, not a textbook", "product, UX/UI, AI flows, iOS prototype", "MVP: onboarding, lessons, speech practice"] },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "A restaurant inside Telegram: guests order, pay and track status with no separate app and no aggregator fee. Launch in 48 hours.", tags: ["Mini App", "Menu & cart", "QR payment", "Subscription"], status: "Client testing", spec: ["food ordering with no app and no aggregator fee", "product logic, UX/UI, mobile flow", "menu, cart, payment and status in Telegram"] },
      { name: "Paradise", type: "Website · Real estate · Phuket", desc: "Site for a Phuket real-estate agency: villas and apartments for sale and rent, owner applications, RU/EN. Interface styled as blueprint sheets.", tags: ["Sale", "Rent", "RU / EN", "Enquiries"], status: "Live", spec: ["a showcase that brings in buyers and owners", "structure, design and development", "catalogue, rentals, enquiries — live in two languages"] },
      { name: "Websites", type: "Service · Website development", desc: "I build a site for your business: structure, copy, design and code in one pair of hands. Every screen leads to a request, not just looks good.", tags: ["Landing page", "Catalogue site", "RU / EN / TH", "Enquiries"], status: "Slot open", spec: ["a site where every screen leads to a request", "structure, copy, design, development, launch", "site live, analytics on, requests come to you"] },
    ],
  },
  th: {
    eyebrow: "ผลงาน", onAir: "ออนแอร์", open: "เปิดโปรเจกต์", prev: "ก่อนหน้า", next: "ถัดไป",
    prevAria: "โปรเจกต์ก่อนหน้า", nextAria: "โปรเจกต์ถัดไป", pause: "หยุด", play: "เล่นต่อ",
    placeholder: "ภาพหน้าจอจะอยู่ตรงนี้", screenshot: "ภาพหน้าจอ",
    specKeys: ["โจทย์", "บทบาท", "ผลลัพธ์"], discuss: "คุยเรื่องเว็บไซต์",
    mock: { title: "ธุรกิจของคุณ", accent: "ออนไลน์", cta: "ส่งคำขอ", notes: ["เมนู", "ข้อเสนอ → คำขอ", "ความน่าเชื่อถือ", "ฟอร์ม"], form: "คำขอ" },
    cases: [
      { name: "TAIKA", type: "แอป iOS · EdTech · AI", desc: "ภาษาไทยเชิงสนทนาสำหรับคนพูดภาษารัสเซีย: เสียง ความหมาย และวรรณยุกต์ คอร์ส เคล็ดลับ และ Speaker ที่ลองได้บนเว็บไซต์", tags: ["iOS", "Swift", "AI", "Speech"], status: "กำลังทดสอบ", spec: ["ภาษาไทยที่มีชีวิตและใช้ทุกวัน ไม่ใช่ตำรา", "โปรดักต์ UX/UI ฉาก AI ต้นแบบ iOS", "MVP: ออนบอร์ดดิ้ง บทเรียน ฝึกพูด"] },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "ร้านอาหารใน Telegram: ลูกค้าสั่ง จ่าย และติดตามสถานะได้โดยไม่ต้องมีแอปแยกและไม่เสียค่าคอมแพลตฟอร์ม เปิดตัวใน 48 ชั่วโมง", tags: ["Mini App", "เมนูและตะกร้า", "จ่ายผ่าน QR", "สมาชิก"], status: "ทดสอบกับลูกค้า", spec: ["สั่งอาหารโดยไม่ต้องมีแอปและไม่เสียค่าคอม", "ลอจิกโปรดักต์ UX/UI โฟลว์มือถือ", "เมนู ตะกร้า ชำระเงิน และสถานะใน Telegram"] },
      { name: "Paradise", type: "เว็บไซต์ · อสังหาฯ · ภูเก็ต", desc: "เว็บไซต์เอเจนซีอสังหาฯ ในภูเก็ต: ขายและเช่าวิลล่าและคอนโด ฟอร์มสำหรับเจ้าของ RU/EN อินเทอร์เฟซสไตล์แบบพิมพ์เขียว", tags: ["ขาย", "เช่า", "RU / EN", "คำขอ"], status: "ออนไลน์", spec: ["หน้าร้านที่พาผู้ซื้อและเจ้าของมาหา", "โครงสร้าง ดีไซน์ และพัฒนาเว็บไซต์", "แคตตาล็อก เช่า คำขอ — ออนไลน์สองภาษา"] },
      { name: "เว็บไซต์", type: "บริการ · พัฒนาเว็บไซต์", desc: "ทำเว็บไซต์ให้ธุรกิจของคุณ: โครงสร้าง ข้อความ ดีไซน์ และโค้ดในมือเดียว ทุกหน้าจอพาไปสู่การติดต่อ ไม่ใช่แค่สวย", tags: ["แลนดิ้ง", "เว็บแคตตาล็อก", "RU / EN / TH", "คำขอ"], status: "รับงาน", spec: ["เว็บไซต์ที่ทุกหน้าจอพาไปสู่การติดต่อ", "โครงสร้าง ข้อความ ดีไซน์ พัฒนา เปิดตัว", "เว็บออนไลน์ มีอนาลิติกส์ คำขอส่งถึงคุณ"] },
    ],
  },
};
