import type { Language } from "@/lib/content";

// Interface texts of the phone layout. Page content itself comes from the same modules as the
// desktop scenes (scene/v2, process, cases, experience), so both stay in sync.
export type MobileCopy = {
  menu: string; close: string; brief: string; years: string; projects: string; free: string;
  howTitle: string; howLead: string; pain: string; solution: string; youGet: string; discussStage: string;
  more: { cases: string; process: string; experience: string };
  pickBiz: string; changeBiz: string; layerWord: string; weeks: string; open: string; dossierFor: string;
};

export const mobileContent: Record<Language, MobileCopy> = {
  ru: {
    menu: "Меню", close: "Закрыть", brief: "Заявка за 60 секунд", years: "лет", projects: "проекта онлайн", free: "свободен",
    howTitle: "Как я веду продукт", howLead: "Восемь палуб корабля — восемь этапов. Нажмите на этап, чтобы увидеть, что вы получите.",
    pain: "Знакомо?", solution: "Что делаю я", youGet: "Вы получите", discussStage: "Обсудить этот этап",
    more: { cases: "Кейсы: 4 проекта вживую", process: "Ваш путь от боли до запуска", experience: "Опыт в больших продуктах" },
    pickBiz: "Выберите, чтобы увидеть свой путь", changeBiz: "Бизнес", layerWord: "Слой", weeks: "Недели", open: "Открыть проект", dossierFor: "Мой опыт для:",
  },
  en: {
    menu: "Menu", close: "Close", brief: "Request in 60 seconds", years: "years", projects: "live projects", free: "available",
    howTitle: "How I run a product", howLead: "Eight decks of the ship, eight stages. Tap a stage to see what you get.",
    pain: "Sound familiar?", solution: "What I do", youGet: "You get", discussStage: "Discuss this stage",
    more: { cases: "Cases: 4 live projects", process: "Your path from pain to launch", experience: "Experience in big products" },
    pickBiz: "Pick one to see your path", changeBiz: "Business", layerWord: "Layer", weeks: "Weeks", open: "Open project", dossierFor: "My experience for:",
  },
  th: {
    menu: "เมนู", close: "ปิด", brief: "ส่งคำขอใน 60 วินาที", years: "ปี", projects: "โปรเจกต์ออนไลน์", free: "ว่างรับงาน",
    howTitle: "ผมพาโปรดักต์ไปอย่างไร", howLead: "แปดชั้นของยาน แปดขั้นตอน แตะขั้นตอนเพื่อดูสิ่งที่คุณจะได้",
    pain: "คุ้นๆ ไหม?", solution: "สิ่งที่ผมทำ", youGet: "สิ่งที่คุณได้", discussStage: "คุยเรื่องขั้นตอนนี้",
    more: { cases: "ผลงาน: 4 โปรเจกต์จริง", process: "เส้นทางจากปัญหาถึงการเปิดตัว", experience: "ประสบการณ์ในโปรดักต์ใหญ่" },
    pickBiz: "เลือกเพื่อดูเส้นทางของคุณ", changeBiz: "ธุรกิจ", layerWord: "ชั้น", weeks: "สัปดาห์", open: "เปิดโปรเจกต์", dossierFor: "ประสบการณ์ของผมสำหรับ:",
  },
};
