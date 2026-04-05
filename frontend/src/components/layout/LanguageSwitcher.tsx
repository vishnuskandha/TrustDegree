import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/magic/Button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  const languages = [
    { code: "en", label: "English", short: "EN" },
    { code: "ta", label: "தமிழ்", short: "TA" },
  ];

  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={switcherRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 min-h-[44px] px-3 rounded-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          {currentLang.label}
        </span>
        <span className="sm:hidden text-xs font-semibold tracking-wide">
          {currentLang.short}
        </span>
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50"
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full min-h-[44px] px-3 py-2.5 text-left text-sm rounded-xl hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                i18n.language === lang.code
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-700"
              }`}
              role="option"
              aria-selected={i18n.language === lang.code}
            >
              <span className="text-xs font-bold tracking-wide w-6">{lang.short}</span>
              <span>{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="ml-auto"><Check className="w-4 h-4" /></span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
