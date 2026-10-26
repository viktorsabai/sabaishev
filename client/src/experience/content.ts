import type { Language } from "@/lib/content";

// Experience page (CHANGES-2 "Опыт v2": archive of dossiers). Russian is from the handoff
// (build_exp.py); roles and years come from the site's existing experience data in
// lib/content.ts (companies 0–2), not from the handoff's "…" placeholders.
// EN/TH are translations to review with the author.

export type ExperienceCopy = {
  eyebrow: string; tag: string; title: string; accent: string; lead: string; forBiz: string;
  label: string; constName: string; hint: string;
  dossiers: { name: string; domain: string }[];
  // What each dossier's experience gives a business: [dossier][business] (businesses as on /process)
  transfer: string[][];
  yours: { name: string; line: string; cta: string };
};

export const experienceContent: Record<Language, ExperienceCopy> = {
  ru: {
    eyebrow: "Опыт / 04", tag: "Big Tech", title: "Большие продукты.", accent: "Ваш масштаб.",
    lead: "Я работал над продуктами, которыми пользуются миллионы. Тот же подход — для вашего бизнеса.",
    forBiz: "Мой опыт для:", label: "Архив опыта: досье проектов", constName: "опыт", hint: "наведи или тапни",
    dossiers: [{ name: "Яндекс Маркет", domain: "маркетплейс" }, { name: "Сбер", domain: "финтех и экосистема" }, { name: "Самокат", domain: "быстрая доставка" }],
    transfer: [
      ["поиск объекта за три касания", "меню как каталог, повторный заказ", "понятный выбор занятий и тренеров", "витрина мастеров с отзывами", "подбор врача с фильтрами и отзывами"],
      ["безопасные платежи и сделки", "оплата и лояльность без трения", "абонементы и рассрочка без сбоев", "предоплата и безопасные платежи", "безопасность данных и AI-помощник"],
      ["быстрый отклик: лид не остывает", "заказ за минуту, кухня в пике", "быстрая запись и напоминания", "запись «на сейчас» без ожидания", "мгновенная запись, минимум ожидания"],
    ],
    yours: { name: "Ваш продукт", line: "следующее досье — ваше", cta: "обсудить задачу" },
  },
  en: {
    eyebrow: "Experience / 04", tag: "Big Tech", title: "Big products.", accent: "Your scale.",
    lead: "I've worked on products used by millions. The same approach, for your business.",
    forBiz: "My experience for:", label: "Experience archive: project dossiers", constName: "experience", hint: "hover or tap",
    dossiers: [{ name: "Yandex Market", domain: "marketplace" }, { name: "Sber", domain: "fintech and ecosystem" }, { name: "Samokat", domain: "fast delivery" }],
    transfer: [
      ["finding a property in three taps", "menu as a catalogue, quick reorder", "clear choice of classes and coaches", "specialist showcase with reviews", "finding a doctor with filters and reviews"],
      ["safe payments and deals", "frictionless payment and loyalty", "memberships and instalments that just work", "prepayment and safe payments", "data security and an AI assistant"],
      ["fast response: leads don't go cold", "one-minute order, kitchen at peak", "quick booking and reminders", "book \"right now\" with no wait", "instant booking, minimal waiting"],
    ],
    yours: { name: "Your product", line: "the next dossier is yours", cta: "discuss your task" },
  },
  th: {
    eyebrow: "ประสบการณ์ / 04", tag: "Big Tech", title: "โปรดักต์ระดับใหญ่", accent: "ในสเกลของคุณ",
    lead: "ผมเคยทำโปรดักต์ที่มีผู้ใช้หลายล้านคน แนวทางเดียวกันนี้ สำหรับธุรกิจของคุณ",
    forBiz: "ประสบการณ์ของผมสำหรับ:", label: "คลังประสบการณ์: แฟ้มโปรเจกต์", constName: "experience", hint: "ชี้หรือแตะ",
    dossiers: [{ name: "Yandex Market", domain: "มาร์เก็ตเพลส" }, { name: "Sber", domain: "ฟินเทคและอีโคซิสเต็ม" }, { name: "Samokat", domain: "เดลิเวอรีด่วน" }],
    transfer: [
      ["ค้นหาทรัพย์ในสามแตะ", "เมนูแบบแคตตาล็อก สั่งซ้ำง่าย", "เลือกคลาสและเทรนเนอร์ได้ชัดเจน", "หน้ารวมช่างพร้อมรีวิว", "ค้นหาแพทย์ด้วยตัวกรองและรีวิว"],
      ["การชำระเงินและดีลที่ปลอดภัย", "ชำระเงินและสะสมแต้มไม่สะดุด", "สมาชิกและผ่อนชำระไม่มีปัญหา", "มัดจำและการชำระเงินที่ปลอดภัย", "ความปลอดภัยข้อมูลและผู้ช่วย AI"],
      ["ตอบเร็ว ลีดไม่หลุด", "สั่งในหนึ่งนาที ครัวรับไหวช่วงพีก", "จองเร็วและแจ้งเตือน", "จอง \"ตอนนี้เลย\" ไม่ต้องรอ", "จองทันที รอให้น้อยที่สุด"],
    ],
    yours: { name: "โปรดักต์ของคุณ", line: "แฟ้มถัดไปคือของคุณ", cta: "คุยเรื่องโจทย์" },
  },
};
