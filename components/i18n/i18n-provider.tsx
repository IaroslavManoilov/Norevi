"use client";

import { createContext, useContext } from "react";
import type { Language, Translations } from "@/lib/i18n/translations";
import { getTranslations } from "@/lib/i18n/translations";

const I18nContext = createContext<{ language: Language; t: Translations }>({
  language: "en",
  t: getTranslations("en"),
});

export function I18nProvider({
  language,
  children,
}: {
  language: Language;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ language, t: getTranslations(language) }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
