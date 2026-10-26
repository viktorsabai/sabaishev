import type { Language } from "@/lib/content";

// Cases page (CHANGES-2 "Cases"): four live projects shown as browser + phone mockups.
// Russian is from the handoff (build_cases2.py); EN/TH are translations to review with the author.

// Language-independent: links, screenshots (captured from the live sites), accent colour.
// EON is a claude.ai artifact: one screen each (no page scroll), captured without the artifact bar.
// still: a single-screen capture, shown without the scroll-through.
export type CaseMedia = { slug: string; host: string; url: string; desktop?: string; mobile?: string; hue: string; still?: boolean };
export const CASE_MEDIA: CaseMedia[] = [
  { slug: "taika", host: "taikaa.online", url: "https://taikaa.online/", desktop: "/cases/taika-desktop.webp", mobile: "/cases/taika-mobile.webp", hue: "#3B82F6" },
  { slug: "moo", host: "moo-beryl.vercel.app", url: "https://moo-beryl.vercel.app/", desktop: "/cases/moo-desktop.webp", mobile: "/cases/moo-mobile.webp", hue: "#EC4899" },
  { slug: "paradise", host: "paradise-real-estate-orcin.vercel.app", url: "https://paradise-real-estate-orcin.vercel.app/", desktop: "/cases/paradise-desktop.webp", mobile: "/cases/paradise-mobile.webp", hue: "#A855F7" },
  { slug: "eon", host: "eon · wellness", url: "https://claude.ai/artifact/1m6PwCWNGMj42xfU2wUrL4", desktop: "/cases/eon-desktop.webp", mobile: "/cases/eon-mobile.webp", hue: "#3B82F6", still: true },
];

export type CaseText = { name: string; type: string; desc: string; tags: string[]; status: string };
export type CasesCopy = {
  eyebrow: string; onAir: string; open: string; prev: string; next: string; prevAria: string; nextAria: string;
  pause: string; play: string; placeholder: string; screenshot: string;
  cases: CaseText[];
};

export const casesContent: Record<Language, CasesCopy> = {
  ru: {
    eyebrow: "Портфолио", onAir: "В эфире", open: "Открыть проект", prev: "Пред", next: "След",
    prevAria: "Предыдущий проект", nextAria: "Следующий проект", pause: "Пауза", play: "Продолжить",
    placeholder: "Сюда встанет скрин", screenshot: "Скриншот",
    cases: [
      { name: "TAIKA", type: "iOS-приложение · EdTech · AI", desc: "Разговорный тайский для русскоязычных: звук, смысл и тон. Курсы, лайфхаки и Speaker, который можно попробовать прямо на сайте.", tags: ["iOS", "Swift", "AI", "Speech"], status: "Тестирование" },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "Ресторан в Telegram: гости заказывают, платят и следят за статусом без отдельного приложения и комиссии агрегатора. Запуск за 48 часов.", tags: ["Mini App", "Меню и корзина", "QR-оплата", "Подписка"], status: "Тест с заказчиком" },
      { name: "Paradise", type: "Сайт · Недвижимость · Пхукет", desc: "Сайт агентства недвижимости на Пхукете: продажа и аренда вилл и апартаментов, заявка для владельцев, RU/EN. Интерфейс в стилистике чертёжных листов.", tags: ["Продажа", "Аренда", "RU / EN", "Заявки"], status: "Онлайн" },
      { name: "EON", type: "Сайт-погружение · Wellness", desc: "Сайт wellness-пространства: интерактивная сцена, выбор залов, температура и дыхание, покупка Day Pass.", tags: ["Интерактивная сцена", "Залы", "Day Pass", "RU / EN / TH"], status: "Онлайн" },
    ],
  },
  en: {
    eyebrow: "Portfolio", onAir: "On air", open: "Open project", prev: "Prev", next: "Next",
    prevAria: "Previous project", nextAria: "Next project", pause: "Pause", play: "Play",
    placeholder: "Screenshot goes here", screenshot: "Screenshot of",
    cases: [
      { name: "TAIKA", type: "iOS app · EdTech · AI", desc: "Conversational Thai for Russian speakers: sound, meaning and tone. Courses, tips and a Speaker you can try right on the site.", tags: ["iOS", "Swift", "AI", "Speech"], status: "Testing" },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "A restaurant inside Telegram: guests order, pay and track status with no separate app and no aggregator fee. Launch in 48 hours.", tags: ["Mini App", "Menu & cart", "QR payment", "Subscription"], status: "Client testing" },
      { name: "Paradise", type: "Website · Real estate · Phuket", desc: "Site for a Phuket real-estate agency: villas and apartments for sale and rent, owner applications, RU/EN. Interface styled as blueprint sheets.", tags: ["Sale", "Rent", "RU / EN", "Enquiries"], status: "Live" },
      { name: "EON", type: "Immersive site · Wellness", desc: "Site for a wellness space: an interactive scene, choosing halls, temperature and breathing, buying a Day Pass.", tags: ["Interactive scene", "Halls", "Day Pass", "RU / EN / TH"], status: "Live" },
    ],
  },
  th: {
    eyebrow: "ผลงาน", onAir: "ออนแอร์", open: "เปิดโปรเจกต์", prev: "ก่อนหน้า", next: "ถัดไป",
    prevAria: "โปรเจกต์ก่อนหน้า", nextAria: "โปรเจกต์ถัดไป", pause: "หยุด", play: "เล่นต่อ",
    placeholder: "ภาพหน้าจอจะอยู่ตรงนี้", screenshot: "ภาพหน้าจอ",
    cases: [
      { name: "TAIKA", type: "แอป iOS · EdTech · AI", desc: "ภาษาไทยเชิงสนทนาสำหรับคนพูดภาษารัสเซีย: เสียง ความหมาย และวรรณยุกต์ คอร์ส เคล็ดลับ และ Speaker ที่ลองได้บนเว็บไซต์", tags: ["iOS", "Swift", "AI", "Speech"], status: "กำลังทดสอบ" },
      { name: "MOO", type: "Telegram Mini App · FoodTech", desc: "ร้านอาหารใน Telegram: ลูกค้าสั่ง จ่าย และติดตามสถานะได้โดยไม่ต้องมีแอปแยกและไม่เสียค่าคอมแพลตฟอร์ม เปิดตัวใน 48 ชั่วโมง", tags: ["Mini App", "เมนูและตะกร้า", "จ่ายผ่าน QR", "สมาชิก"], status: "ทดสอบกับลูกค้า" },
      { name: "Paradise", type: "เว็บไซต์ · อสังหาฯ · ภูเก็ต", desc: "เว็บไซต์เอเจนซีอสังหาฯ ในภูเก็ต: ขายและเช่าวิลล่าและคอนโด ฟอร์มสำหรับเจ้าของ RU/EN อินเทอร์เฟซสไตล์แบบพิมพ์เขียว", tags: ["ขาย", "เช่า", "RU / EN", "คำขอ"], status: "ออนไลน์" },
      { name: "EON", type: "เว็บไซต์แบบดื่มด่ำ · Wellness", desc: "เว็บไซต์ของพื้นที่ wellness: ฉากอินเทอร์แอกทีฟ เลือกห้อง อุณหภูมิและการหายใจ ซื้อ Day Pass", tags: ["ฉากอินเทอร์แอกทีฟ", "ห้อง", "Day Pass", "RU / EN / TH"], status: "ออนไลน์" },
    ],
  },
};
