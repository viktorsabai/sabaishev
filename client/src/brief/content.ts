import type { Language } from "@/lib/content";

// Console texts of the brief window. The questions and options themselves come from the site's
// existing brief (lib/content.ts → contact.form), so the answers and the message stay the same.
export type BriefCopy = {
  console: string; channel: string; secure: string; signal: string; payload: string; seq: string;
  steps: [string, string, string]; titles: [string, string, string]; hints: [string, string, string];
  step: string; of: string; back: string; next: string; send: string; close: string;
  context: string; optional: string; sentTitle: string; sentText: string; reopen: string; footer: string;
};

export const briefContent: Record<Language, BriefCopy> = {
  ru: {
    console: "Консоль связи", channel: "Канал", secure: "Линия защищена", signal: "Сигнал", payload: "Пакет", seq: "Последовательность",
    steps: ["Запрос", "Параметры", "Канал ответа"],
    titles: ["Что нужно сделать?", "Когда начинаем?", "Куда передать ответ?"],
    hints: ["Выберите всё, что похоже на вашу задачу. Сфера — по желанию.", "Срок обязателен, бюджет и локация — ориентир. Точную смету покажу после разговора.", "Проверьте, что я понял, и выберите, куда ответить."],
    step: "Шаг", of: "из", back: "Назад", next: "Дальше", send: "Передать сигнал", close: "Закрыть",
    context: "Контекст", optional: "по желанию", sentTitle: "Сигнал отправлен",
    sentText: "Откроется чат с готовым текстом заявки — останется нажать «Отправить».", reopen: "Открыть ещё раз",
    footer: "Ответ в Telegram в течение дня",
  },
  en: {
    console: "Comms console", channel: "Channel", secure: "Secure line", signal: "Signal", payload: "Payload", seq: "Sequence",
    steps: ["Request", "Parameters", "Reply channel"],
    titles: ["What needs to be done?", "When do we start?", "Where should I reply?"],
    hints: ["Pick everything that looks like your task. Industry is optional.", "Timing is required; budget and location are a guide. I'll give an exact estimate after a call.", "Check what I understood and choose where to reply."],
    step: "Step", of: "of", back: "Back", next: "Next", send: "Transmit", close: "Close",
    context: "Context", optional: "optional", sentTitle: "Signal sent",
    sentText: "A chat will open with your request filled in — just press Send.", reopen: "Open again",
    footer: "Reply in Telegram within a day",
  },
  th: {
    console: "คอนโซลสื่อสาร", channel: "ช่อง", secure: "สายปลอดภัย", signal: "สัญญาณ", payload: "แพ็กเกจ", seq: "ลำดับ",
    steps: ["คำขอ", "รายละเอียด", "ช่องทางตอบกลับ"],
    titles: ["ต้องการทำอะไร?", "เริ่มเมื่อไร?", "ให้ตอบกลับทางไหน?"],
    hints: ["เลือกทุกอย่างที่ตรงกับงานของคุณ ประเภทธุรกิจไม่บังคับ", "ต้องระบุเวลา ส่วนงบและสถานที่เป็นแนวทาง ราคาจริงจะแจ้งหลังคุยกัน", "ตรวจสอบสิ่งที่ผมเข้าใจ แล้วเลือกช่องทางตอบกลับ"],
    step: "ขั้นตอน", of: "จาก", back: "ย้อนกลับ", next: "ถัดไป", send: "ส่งสัญญาณ", close: "ปิด",
    context: "บริบท", optional: "ไม่บังคับ", sentTitle: "ส่งสัญญาณแล้ว",
    sentText: "แชตจะเปิดพร้อมข้อความคำขอ เหลือแค่กด «ส่ง»", reopen: "เปิดอีกครั้ง",
    footer: "ตอบกลับทาง Telegram ภายในหนึ่งวัน",
  },
};
