import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "th", label: "ไทย" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative p-2.5 rounded-full bg-surface/50 backdrop-blur-sm border border-border hover:border-accent/50 transition-all duration-300 group"
          aria-label="Switch language"
        >
          {/* Background glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Icon container with rotation animation */}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10"
          >
            <Globe className="w-5 h-5 text-foreground-secondary group-hover:text-accent transition-colors duration-300" />
          </motion.div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-foreground-secondary whitespace-nowrap pointer-events-none"
          >
            {currentLang?.label}
          </motion.div>
        </motion.button>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuContent
              align="end"
              className="w-40 bg-surface/95 backdrop-blur-md border border-border rounded-lg shadow-lg"
            >
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as "ru" | "en" | "th");
                    setOpen(false);
                  }}
                  className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 transition-all duration-200 ${
                    language === lang.code
                      ? "bg-accent/20 text-accent"
                      : "text-foreground-secondary hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <span className="font-medium">{lang.label}</span>
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-accent"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
