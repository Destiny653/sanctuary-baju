import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { en, type Dict } from "./en";
import { fr } from "./fr";

export type Lang = "en" | "fr";
export const LANGS: Lang[] = ["en", "fr"];
export const dictionaries: Record<Lang, Dict> = { en, fr };

const KEY = "olm-lang";

type Ctx = { lang: Lang; setLang: (lang: Lang) => void; t: Dict };
const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: en });

/** Pick the localized column of a bilingual row (title_en / title_fr), falling back to English. */
export function pick<T extends Record<string, unknown>>(row: T, field: string, lang: Lang): string {
  const own = row[`${field}_${lang}`];
  if (typeof own === "string" && own.trim()) return own;
  const fallback = row[`${field}_en`] ?? row[`${field}_fr`];
  return typeof fallback === "string" ? fallback : "";
}

export function formatDate(iso: string, lang: Lang, withTime = false) {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored === "en" || stored === "fr") setLangState(stored);
    else if (navigator.language?.toLowerCase().startsWith("fr")) setLangState("fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(KEY, next);
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Flag dropdown for EN / FR. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const current = dictionaries[lang];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={"lang-switch " + className} ref={root}>
      <button
        type="button"
        className="lang-switch-btn"
        aria-label={t.nav.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flag" aria-hidden="true">
          {current.langFlag}
        </span>
        <span>{current.langShort}</span>
        <ChevronDown strokeWidth={1.8} className="h-3.5 w-3.5 opacity-70" />
      </button>
      {open && (
        <ul className="lang-switch-menu" role="listbox" aria-label={t.nav.language}>
          {LANGS.map((code) => {
            const dict = dictionaries[code];
            return (
              <li key={code} role="option" aria-selected={code === lang}>
                <button
                  type="button"
                  className={code === lang ? "is-on" : ""}
                  onClick={() => {
                    setLang(code);
                    setOpen(false);
                  }}
                >
                  <span className="flag" aria-hidden="true">
                    {dict.langFlag}
                  </span>
                  <span>{dict.langName}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
