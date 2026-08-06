"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "en" | "th";

const LanguageContext = createContext<{ lang: Lang; toggleLang: () => void } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  const toggleLang = () => setLang((prev) => (prev === "en" ? "th" : "en"));

  return <LanguageContext.Provider value={{ lang, toggleLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
