import type { Language } from "@/lib/content";

// Copy for the redesigned single-scene site. Draft texts — edited together with the author.
export type Stage = { num: string; name: string; label: string; lead: string; items: string[] };

export type SceneCopy = {
  nav: { services: string; cases: string; process: string; experience: string };
  cta: { project: string; task: string; stage: string; cases: string };
  hero: { eyebrow: string; title: string[]; accent: string; subtitle: string };
  hint: string;
  stage: { cut: string; of: string; output: string; prev: string; next: string; close: string };
  cases: {
    eyebrow: string; title: string; accent: string; lead: string; label: string;
    exhibit: string; challenge: string; role: string; open: string; similar: string; prev: string; next: string;
  };
  shipLabel: string;
  stages: Stage[];
};

export const TELEGRAM_URL = "https://t.me/bayshev";

export const sceneContent: Record<Language, SceneCopy> = {
  ru: {
    nav: { services: "Услуги", cases: "Кейсы", process: "Процесс", experience: "Опыт" },
    cta: { project: "Обсудить проект", task: "Обсудить задачу", stage: "Обсудить этот этап", cases: "Смотреть кейсы" },
    hero: {
      eyebrow: "Продакт под ключ",
      title: ["Продукты,", "которыми", "хочется"],
      accent: "пользоваться.",
      subtitle: "Продакт, UX/UI и AI в одних руках. Разберу задачу, соберу MVP и доведу до запуска.",
    },
    hint: "Нажмите на этап — разверну в разрезе",
    stage: { cut: "Разрез палубы", of: "из", output: "На выходе", prev: "Предыдущий этап", next: "Следующий этап", close: "Корабль" },
    cases: {
      eyebrow: "Кейсы · галерея на борту", title: "Собрано", accent: "под ключ.",
      lead: "Шесть продуктов: от AI-учителя тайского до управления сетью ресторанов. Выберите экспонат.",
      label: "Галерея проектов внутри корабля", exhibit: "Экспонат", challenge: "Задача", role: "Моя роль",
      open: "Открыть проект", similar: "Обсудить похожий проект", prev: "Предыдущий проект", next: "Следующий проект",
    },
    shipLabel: "Чертёж многоуровневого космического корабля — продукта",
    stages: [
      { num: "01", name: "Проблема", label: "Проблема", lead: "Нахожу, что на самом деле болит, и формулирую задачу так, чтобы её можно было решить.", items: ["Problem Statement", "Гипотезы", "Критерии успеха"] },
      { num: "02", name: "Исследование", label: "Исследование", lead: "Разговариваю с людьми и разбираю рынок, чтобы не строить наугад.", items: ["Интервью и конкуренты", "Портрет пользователя", "Карта болей"] },
      { num: "03", name: "Логика", label: "Логика", lead: "Превращаю найденное в понятный продукт: что делаем в первую очередь и зачем.", items: ["User Journey", "Feature Map", "MVP Scope", "Roadmap"] },
      { num: "04", name: "UX", label: "UX", lead: "Проектирую путь пользователя и структуру экранов до того, как рисовать красиво.", items: ["Сценарии", "Структура экранов", "Wireframes"] },
      { num: "05", name: "UI", label: "UI", lead: "Собираю визуальный язык продукта: от цвета и шрифта до состояний кнопок.", items: ["Дизайн-система", "Ключевые экраны", "Анимации и состояния"] },
      { num: "06", name: "AI-ядро", label: "AI-ядро", lead: "Нахожу места, где AI даёт реальный выигрыш, и встраиваю его в продукт.", items: ["Сценарии для AI", "Промпты и пайплайн", "Оценка качества"] },
      { num: "07", name: "Прототип", label: "Прототип", lead: "Собираю работающий MVP и проверяю его на живых людях.", items: ["Рабочий MVP", "Тест с пользователями", "Список правок"] },
      { num: "08", name: "Запуск", label: "Запуск", lead: "Довожу до релиза и настраиваю аналитику, чтобы видеть, что работает.", items: ["Релиз и инфраструктура", "Аналитика", "План роста"] },
    ],
  },
  en: {
    nav: { services: "Services", cases: "Cases", process: "Process", experience: "Experience" },
    cta: { project: "Discuss a project", task: "Discuss your task", stage: "Discuss this stage", cases: "View cases" },
    hero: {
      eyebrow: "End-to-end product",
      title: ["Products", "people", "actually"],
      accent: "want to use.",
      subtitle: "Product, UX/UI and AI in one pair of hands. I'll unpack the problem, build the MVP and take it to launch.",
    },
    hint: "Tap a stage — I'll open the cutaway",
    stage: { cut: "Deck cutaway", of: "of", output: "Deliverables", prev: "Previous stage", next: "Next stage", close: "Ship" },
    cases: {
      eyebrow: "Cases · onboard gallery", title: "Built", accent: "end to end.",
      lead: "Six products, from an AI Thai tutor to running a restaurant group. Pick an exhibit.",
      label: "Project gallery inside the ship", exhibit: "Exhibit", challenge: "Challenge", role: "My role",
      open: "Open project", similar: "Discuss a similar project", prev: "Previous project", next: "Next project",
    },
    shipLabel: "Blueprint of a multi-deck spaceship — the product",
    stages: [
      { num: "01", name: "Problem", label: "Problem", lead: "I find what actually hurts and frame the task so it can be solved.", items: ["Problem Statement", "Hypotheses", "Success criteria"] },
      { num: "02", name: "Research", label: "Research", lead: "I talk to people and study the market so nothing is built on guesswork.", items: ["Interviews & competitors", "User persona", "Pain map"] },
      { num: "03", name: "Logic", label: "Logic", lead: "I turn findings into a clear product: what comes first and why.", items: ["User Journey", "Feature Map", "MVP Scope", "Roadmap"] },
      { num: "04", name: "UX", label: "UX", lead: "I design the user path and screen structure before making anything pretty.", items: ["Scenarios", "Screen structure", "Wireframes"] },
      { num: "05", name: "UI", label: "UI", lead: "I build the product's visual language, from colour and type to button states.", items: ["Design system", "Key screens", "Motion & states"] },
      { num: "06", name: "AI core", label: "AI core", lead: "I find where AI gives a real advantage and build it into the product.", items: ["AI use cases", "Prompts & pipeline", "Quality evaluation"] },
      { num: "07", name: "Prototype", label: "Prototype", lead: "I build a working MVP and test it with real people.", items: ["Working MVP", "User testing", "Fix list"] },
      { num: "08", name: "Launch", label: "Launch", lead: "I take it to release and set up analytics to see what works.", items: ["Release & infrastructure", "Analytics", "Growth plan"] },
    ],
  },
  th: {
    nav: { services: "บริการ", cases: "ผลงาน", process: "กระบวนการ", experience: "ประสบการณ์" },
    cta: { project: "คุยเรื่องโปรเจกต์", task: "คุยเรื่องโจทย์", stage: "คุยเรื่องขั้นตอนนี้", cases: "ดูผลงาน" },
    hero: {
      eyebrow: "โปรดักต์ครบวงจร",
      title: ["โปรดักต์", "ที่คนอยาก"],
      accent: "ใช้งานจริง",
      subtitle: "โปรดักต์ UX/UI และ AI ในคนเดียว วิเคราะห์โจทย์ สร้าง MVP และพาไปจนถึงการเปิดตัว",
    },
    hint: "แตะขั้นตอน — เพื่อเปิดภาพตัดขวาง",
    stage: { cut: "ภาพตัดขวางชั้น", of: "จาก", output: "สิ่งที่ได้", prev: "ขั้นตอนก่อนหน้า", next: "ขั้นตอนถัดไป", close: "ยาน" },
    cases: {
      eyebrow: "ผลงาน · แกลเลอรีบนยาน", title: "สร้าง", accent: "ครบวงจร",
      lead: "หกโปรดักต์ ตั้งแต่ครูสอนภาษาไทยด้วย AI ไปจนถึงระบบบริหารเครือร้านอาหาร เลือกชิ้นงานที่สนใจ",
      label: "แกลเลอรีโปรเจกต์ภายในยาน", exhibit: "ชิ้นงาน", challenge: "โจทย์", role: "บทบาทของผม",
      open: "เปิดโปรเจกต์", similar: "คุยเรื่องโปรเจกต์ที่คล้ายกัน", prev: "โปรเจกต์ก่อนหน้า", next: "โปรเจกต์ถัดไป",
    },
    shipLabel: "พิมพ์เขียวยานอวกาศหลายชั้น — ตัวโปรดักต์",
    stages: [
      { num: "01", name: "ปัญหา", label: "ปัญหา", lead: "ค้นหาสิ่งที่เป็นปัญหาจริง และตั้งโจทย์ให้แก้ได้", items: ["Problem Statement", "สมมติฐาน", "เกณฑ์ความสำเร็จ"] },
      { num: "02", name: "วิจัย", label: "วิจัย", lead: "คุยกับผู้ใช้และศึกษาตลาด เพื่อไม่สร้างแบบเดาสุ่ม", items: ["สัมภาษณ์และคู่แข่ง", "ภาพผู้ใช้", "แผนที่ปัญหา"] },
      { num: "03", name: "ตรรกะ", label: "ตรรกะ", lead: "เปลี่ยนสิ่งที่พบเป็นโปรดักต์ที่ชัดเจน: ทำอะไรก่อนและเพราะอะไร", items: ["User Journey", "Feature Map", "MVP Scope", "Roadmap"] },
      { num: "04", name: "UX", label: "UX", lead: "ออกแบบเส้นทางผู้ใช้และโครงสร้างหน้าจอ ก่อนจะทำให้สวย", items: ["สถานการณ์ใช้งาน", "โครงสร้างหน้าจอ", "Wireframes"] },
      { num: "05", name: "UI", label: "UI", lead: "สร้างภาษาภาพของโปรดักต์ ตั้งแต่สี ฟอนต์ ไปจนถึงสถานะปุ่ม", items: ["ดีไซน์ซิสเต็ม", "หน้าจอหลัก", "แอนิเมชันและสถานะ"] },
      { num: "06", name: "แกน AI", label: "แกน AI", lead: "หาจุดที่ AI ให้ประโยชน์จริง และฝังเข้าไปในโปรดักต์", items: ["กรณีใช้ AI", "พรอมต์และไปป์ไลน์", "การประเมินคุณภาพ"] },
      { num: "07", name: "ต้นแบบ", label: "ต้นแบบ", lead: "สร้าง MVP ที่ใช้งานได้ และทดสอบกับผู้ใช้จริง", items: ["MVP ที่ใช้งานได้", "ทดสอบกับผู้ใช้", "รายการแก้ไข"] },
      { num: "08", name: "เปิดตัว", label: "เปิดตัว", lead: "พาไปจนถึงการปล่อยจริง และตั้งค่าอนาลิติกส์เพื่อดูว่าอะไรได้ผล", items: ["รีลีสและโครงสร้างระบบ", "อนาลิติกส์", "แผนการเติบโต"] },
    ],
  },
};
