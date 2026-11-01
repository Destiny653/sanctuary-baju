import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={"lang-switch " + className} role="group" aria-label={t.nav.language}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={code === lang ? "is-on" : ""}
          aria-pressed={code === lang}
          onClick={() => setLang(code)}
        >
          {dictionaries[code].langShort}
        </button>
      ))}
    </div>
  );
}
