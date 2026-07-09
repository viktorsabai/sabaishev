import { Mail, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { textGradient } from "@/lib/systemUi";

const NAV = [
  { id: "stack", ru: "Стек", en: "Stack", th: "สแต็ก" },
  { id: "products", ru: "Продукты", en: "Products", th: "ผลิตภัณฑ์" },
  { id: "process", ru: "Процесс", en: "Process", th: "กระบวนการ" },
  { id: "experience", ru: "Опыт", en: "Experience", th: "ประสบการณ์" },
  { id: "contact", ru: "Бриф", en: "Brief", th: "บรีฟ" },
];

export default function SiteFooter() {
  const { language } = useLanguage();
  const contact = content[language].contact;
  const footer = contact.footer;
  const lang = language as "ru" | "en" | "th";

  const socials = [
    { icon: MessageCircle, label: contact.labels.telegram, href: contact.links.telegram },
    { icon: Instagram, label: contact.labels.instagram, href: contact.links.instagram },
    { icon: Mail, label: contact.labels.email, href: contact.links.email },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <button
              type="button"
              onClick={() => scrollTo("hero")}
              className={`text-base font-bold tracking-tight ${textGradient}`}
            >
              VIKTOR.SYSTEM
            </button>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
              {footer.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-[13px] text-foreground-secondary transition-colors hover:text-foreground"
              >
                {item[lang]}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground-muted transition-all hover:border-foreground/20 hover:bg-foreground/[0.04] hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-foreground-muted/80">
            © 2026 VIKTOR.SYSTEM · {footer.rights}
          </p>
          <p className="text-[12px] text-foreground-muted/50">{footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
