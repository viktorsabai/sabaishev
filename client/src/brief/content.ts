import type { Language } from "@/lib/content";

// Brief: one compact screen in the order a client thinks about it — who you are, what you need,
// when, how much — with the request written up live at the side, and where to reply. The answers
// go out as a prefilled message (Telegram, email or Instagram), like the site's previous brief.
// when / budget options are the stops of a slider; budget "b0" is the "not sure yet" switch.

export type Option = { id: string; title: string; desc?: string };
export type Currency = "RUB" | "THB" | "USD";

export type BriefCopy = {
  hud: { console: string; channel: string; secure: string; signal: string; payload: string };
  questions: {
    biz: { title: string; hint: string; options: Option[] };
    need: { title: string; hint: string; options: Option[] };
    when: { title: string; hint: string; options: Option[] };
    budget: { title: string; hint: string; options: Record<Currency, Option[]> };
    send: { title: string; hint: string; channels: Option[] };
  };
  summary: { context: string; biz: string; need: string; when: string; budget: string; channel: string };
  window: { title: string; hint: string; log: string; unknown: string; required: string; replyHint: string };
  back: string; next: string; choose: string; send: string; close: string; edit: string;
  sentTitle: string; sentText: string; reopen: string; footer: string; message: string; subject: string;
};

const CHANNELS_RU = [{ id: "telegram", title: "Telegram", desc: "Самый быстрый: отвечаю в течение дня" }, { id: "email", title: "Почта", desc: "Если удобнее письмом" }, { id: "instagram", title: "Instagram", desc: "Напишите в директ" }];

export const briefContent: Record<Language, BriefCopy> = {
  ru: {
    hud: { console: "Консоль связи", channel: "Канал 07", secure: "Линия защищена", signal: "Сигнал", payload: "Пакет" },
    questions: {
      biz: {
        title: "Какой у вас бизнес?", hint: "Так я сразу пойму контекст и покажу похожий опыт.",
        options: [
          { id: "realestate", title: "Недвижимость" }, { id: "food", title: "Ресторан или фудтех" },
          { id: "sport", title: "Спорт и фитнес" }, { id: "beauty", title: "Бьюти" },
          { id: "clinic", title: "Клиника, медицина" }, { id: "ecommerce", title: "Магазин, e-commerce" },
          { id: "edu", title: "Обучение, EdTech" }, { id: "other", title: "Другое" },
        ],
      },
      need: {
        title: "Что нужно сделать?", hint: "Можно выбрать несколько — это не обязательство, просто ориентир.",
        options: [
          { id: "product", title: "Новый продукт или MVP", desc: "Есть идея — нужно понять, что строить, и собрать первую версию" },
          { id: "site", title: "Сайт, который продаёт", desc: "Лендинг или сайт, где каждый экран ведёт к заявке" },
          { id: "app", title: "Приложение или Telegram Mini App", desc: "Мобильный продукт для ваших клиентов" },
          { id: "ai", title: "AI-функция или ассистент", desc: "Там, где AI реально экономит время или деньги" },
          { id: "workspace", title: "Автоматизация и рабочее место", desc: "Убрать ручную рутину из таблиц и чатов" },
          { id: "audit", title: "Аудит или консультация", desc: "Свежий взгляд на продукт, процесс или воронку" },
        ],
      },
      when: {
        title: "Когда хотите начать?", hint: "Так я пойму, как спланировать работу.",
        options: [{ id: "asap", title: "Как можно скорее" }, { id: "month", title: "В течение месяца" }, { id: "quarter", title: "В ближайшие 1–3 месяца" }, { id: "explore", title: "Пока присматриваюсь" }],
      },
      budget: {
        title: "Какой бюджет закладываете?", hint: "Ориентир, не обязательство. Точную смету посчитаю после короткого разговора.",
        options: {
          RUB: [{ id: "b1", title: "До 300 тыс. ₽" }, { id: "b2", title: "300 тыс. – 1 млн ₽" }, { id: "b3", title: "1–3 млн ₽" }, { id: "b4", title: "От 3 млн ₽" }, { id: "b0", title: "Пока не знаю" }],
          THB: [{ id: "b1", title: "До ฿100 000" }, { id: "b2", title: "฿100 000 – 350 000" }, { id: "b3", title: "฿350 000 – 1 млн" }, { id: "b4", title: "От ฿1 млн" }, { id: "b0", title: "Пока не знаю" }],
          USD: [{ id: "b1", title: "До $3 000" }, { id: "b2", title: "$3 000 – 10 000" }, { id: "b3", title: "$10 000 – 30 000" }, { id: "b4", title: "От $30 000" }, { id: "b0", title: "Пока не знаю" }],
        },
      },
      send: { title: "Куда ответить?", hint: "Проверьте, всё ли я понял. Откроется чат с готовым текстом — останется нажать «Отправить».", channels: CHANNELS_RU },
    },
    window: { title: "Обсудить проект", hint: "Пара отметок — и я пойму задачу. Отвечаю в течение дня.", log: "заявка", unknown: "Пока не знаю", required: "Отметьте бизнес и задачу", replyHint: "Откроется чат с готовым текстом" },
    summary: { context: "Контекст", biz: "Бизнес", need: "Задача", when: "Старт", budget: "Бюджет", channel: "Связь" },
    back: "Назад", next: "Дальше", choose: "Выберите хотя бы один вариант", send: "Отправить заявку", close: "Закрыть", edit: "изменить",
    sentTitle: "Заявка готова", sentText: "Чат открылся в новой вкладке с готовым текстом. Если не открылся — нажмите кнопку ниже.", reopen: "Открыть ещё раз",
    footer: "Ответ в течение дня", message: "Привет! Хочу обсудить проект.", subject: "Заявка · SABAISHEV.ONLINE",
  },
  en: {
    hud: { console: "Comms console", channel: "Channel 07", secure: "Secure line", signal: "Signal", payload: "Payload" },
    questions: {
      biz: {
        title: "What's your business?", hint: "So I get the context right away and show relevant experience.",
        options: [
          { id: "realestate", title: "Real estate" }, { id: "food", title: "Restaurant or food tech" },
          { id: "sport", title: "Sports and fitness" }, { id: "beauty", title: "Beauty" },
          { id: "clinic", title: "Clinic, healthcare" }, { id: "ecommerce", title: "Shop, e-commerce" },
          { id: "edu", title: "Education, EdTech" }, { id: "other", title: "Something else" },
        ],
      },
      need: {
        title: "What needs to be done?", hint: "Pick as many as fit — it's a guide, not a commitment.",
        options: [
          { id: "product", title: "A new product or MVP", desc: "There's an idea — work out what to build and ship version one" },
          { id: "site", title: "A website that sells", desc: "A landing page or site where every screen leads to a request" },
          { id: "app", title: "An app or Telegram Mini App", desc: "A mobile product for your customers" },
          { id: "ai", title: "An AI feature or assistant", desc: "Where AI really saves time or money" },
          { id: "workspace", title: "Automation and a workspace", desc: "Take the manual routine out of spreadsheets and chats" },
          { id: "audit", title: "An audit or consultation", desc: "A fresh look at a product, process or funnel" },
        ],
      },
      when: {
        title: "When would you like to start?", hint: "So I can plan the work.",
        options: [{ id: "asap", title: "As soon as possible" }, { id: "month", title: "Within a month" }, { id: "quarter", title: "In the next 1–3 months" }, { id: "explore", title: "Just exploring" }],
      },
      budget: {
        title: "What budget do you have in mind?", hint: "A guide, not a commitment. I'll give an exact estimate after a short call.",
        options: {
          RUB: [{ id: "b1", title: "Up to 300k ₽" }, { id: "b2", title: "300k – 1M ₽" }, { id: "b3", title: "1–3M ₽" }, { id: "b4", title: "3M ₽ and up" }, { id: "b0", title: "Not sure yet" }],
          THB: [{ id: "b1", title: "Up to ฿100,000" }, { id: "b2", title: "฿100,000 – 350,000" }, { id: "b3", title: "฿350,000 – 1M" }, { id: "b4", title: "฿1M and up" }, { id: "b0", title: "Not sure yet" }],
          USD: [{ id: "b1", title: "Up to $3,000" }, { id: "b2", title: "$3,000 – 10,000" }, { id: "b3", title: "$10,000 – 30,000" }, { id: "b4", title: "$30,000 and up" }, { id: "b0", title: "Not sure yet" }],
        },
      },
      send: {
        title: "Where should I reply?", hint: "Check I got it right. A chat opens with the text ready — just press Send.",
        channels: [{ id: "telegram", title: "Telegram", desc: "Fastest: I reply within a day" }, { id: "email", title: "Email", desc: "If you prefer writing" }, { id: "instagram", title: "Instagram", desc: "Send a DM" }],
      },
    },
    window: { title: "Discuss a project", hint: "A few marks and I'll get the task. I reply within a day.", log: "request", unknown: "Not sure yet", required: "Pick a business and a task", replyHint: "A chat opens with the text ready" },
    summary: { context: "Context", biz: "Business", need: "Task", when: "Start", budget: "Budget", channel: "Reply via" },
    back: "Back", next: "Next", choose: "Pick at least one option", send: "Send request", close: "Close", edit: "change",
    sentTitle: "Request ready", sentText: "The chat opened in a new tab with the text filled in. If it didn't, use the button below.", reopen: "Open again",
    footer: "Reply within a day", message: "Hi! I'd like to discuss a project.", subject: "Request · SABAISHEV.ONLINE",
  },
  th: {
    hud: { console: "คอนโซลสื่อสาร", channel: "ช่อง 07", secure: "สายปลอดภัย", signal: "สัญญาณ", payload: "แพ็กเกจ" },
    questions: {
      biz: {
        title: "ธุรกิจของคุณคืออะไร?", hint: "เพื่อให้ผมเข้าใจบริบททันทีและแสดงประสบการณ์ที่เกี่ยวข้อง",
        options: [
          { id: "realestate", title: "อสังหาริมทรัพย์" }, { id: "food", title: "ร้านอาหารหรือฟู้ดเทค" },
          { id: "sport", title: "กีฬาและฟิตเนส" }, { id: "beauty", title: "บิวตี้" },
          { id: "clinic", title: "คลินิก การแพทย์" }, { id: "ecommerce", title: "ร้านค้า อีคอมเมิร์ซ" },
          { id: "edu", title: "การศึกษา EdTech" }, { id: "other", title: "อื่นๆ" },
        ],
      },
      need: {
        title: "ต้องการทำอะไร?", hint: "เลือกได้หลายข้อ — เป็นแนวทาง ไม่ใช่ข้อผูกมัด",
        options: [
          { id: "product", title: "โปรดักต์ใหม่หรือ MVP", desc: "มีไอเดีย — หาว่าจะสร้างอะไรและทำเวอร์ชันแรก" },
          { id: "site", title: "เว็บไซต์ที่ขายได้", desc: "แลนดิ้งหรือเว็บไซต์ที่ทุกหน้าจอพาไปสู่การติดต่อ" },
          { id: "app", title: "แอปหรือ Telegram Mini App", desc: "โปรดักต์บนมือถือสำหรับลูกค้าของคุณ" },
          { id: "ai", title: "ฟีเจอร์ AI หรือผู้ช่วย", desc: "ตรงที่ AI ช่วยประหยัดเวลาหรือเงินจริง" },
          { id: "workspace", title: "ระบบอัตโนมัติและ workspace", desc: "เอางานทำมือออกจากสเปรดชีตและแชต" },
          { id: "audit", title: "ตรวจสอบหรือปรึกษา", desc: "มุมมองใหม่ต่อโปรดักต์ กระบวนการ หรือ funnel" },
        ],
      },
      when: {
        title: "อยากเริ่มเมื่อไร?", hint: "เพื่อให้ผมวางแผนงานได้",
        options: [{ id: "asap", title: "เร็วที่สุด" }, { id: "month", title: "ภายในหนึ่งเดือน" }, { id: "quarter", title: "ใน 1–3 เดือนข้างหน้า" }, { id: "explore", title: "แค่ดูข้อมูลก่อน" }],
      },
      budget: {
        title: "ตั้งงบไว้ประมาณเท่าไร?", hint: "เป็นแนวทาง ไม่ใช่ข้อผูกมัด ราคาจริงจะแจ้งหลังคุยกันสั้นๆ",
        options: {
          RUB: [{ id: "b1", title: "ไม่เกิน 300k ₽" }, { id: "b2", title: "300k – 1M ₽" }, { id: "b3", title: "1–3M ₽" }, { id: "b4", title: "3M ₽ ขึ้นไป" }, { id: "b0", title: "ยังไม่แน่ใจ" }],
          THB: [{ id: "b1", title: "ไม่เกิน ฿100,000" }, { id: "b2", title: "฿100,000 – 350,000" }, { id: "b3", title: "฿350,000 – 1 ล้าน" }, { id: "b4", title: "฿1 ล้านขึ้นไป" }, { id: "b0", title: "ยังไม่แน่ใจ" }],
          USD: [{ id: "b1", title: "ไม่เกิน $3,000" }, { id: "b2", title: "$3,000 – 10,000" }, { id: "b3", title: "$10,000 – 30,000" }, { id: "b4", title: "$30,000 ขึ้นไป" }, { id: "b0", title: "ยังไม่แน่ใจ" }],
        },
      },
      send: {
        title: "ให้ตอบกลับทางไหน?", hint: "ตรวจสอบว่าผมเข้าใจถูก แชตจะเปิดพร้อมข้อความ เหลือแค่กดส่ง",
        channels: [{ id: "telegram", title: "Telegram", desc: "เร็วที่สุด: ตอบภายในหนึ่งวัน" }, { id: "email", title: "อีเมล", desc: "ถ้าสะดวกเขียนเป็นอีเมล" }, { id: "instagram", title: "Instagram", desc: "ส่ง DM" }],
      },
    },
    window: { title: "คุยเรื่องโปรเจกต์", hint: "เลือกไม่กี่ข้อ ผมก็เข้าใจงานแล้ว ตอบกลับภายในวัน", log: "คำขอ", unknown: "ยังไม่แน่ใจ", required: "เลือกธุรกิจและงาน", replyHint: "แชตจะเปิดพร้อมข้อความ" },
    summary: { context: "บริบท", biz: "ธุรกิจ", need: "งาน", when: "เริ่ม", budget: "งบ", channel: "ติดต่อทาง" },
    back: "ย้อนกลับ", next: "ถัดไป", choose: "เลือกอย่างน้อยหนึ่งข้อ", send: "ส่งคำขอ", close: "ปิด", edit: "แก้ไข",
    sentTitle: "คำขอพร้อมแล้ว", sentText: "แชตเปิดในแท็บใหม่พร้อมข้อความแล้ว ถ้าไม่เปิด กดปุ่มด้านล่าง", reopen: "เปิดอีกครั้ง",
    footer: "ตอบกลับภายในหนึ่งวัน", message: "สวัสดีครับ อยากคุยเรื่องโปรเจกต์", subject: "คำขอ · SABAISHEV.ONLINE",
  },
};
