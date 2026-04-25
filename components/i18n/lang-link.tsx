"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Language } from "@/lib/i18n/translations";
import { STORAGE_KEYS, readStorageWithLegacy } from "@/lib/config/storage";

type LangLinkProps = React.ComponentProps<typeof Link> & {
  defaultLanguage: Language;
};

const isLang = (value: string | null): value is Language => value === "ru" || value === "ro" || value === "en";

export function LangLink({ defaultLanguage, href, ...props }: LangLinkProps) {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (isLang(urlLang)) {
      queueMicrotask(() => setLanguage(urlLang));
      window.localStorage.setItem(STORAGE_KEYS.language, urlLang);
      return;
    }
    const stored = readStorageWithLegacy(STORAGE_KEYS.language, "norevi-language");
    if (isLang(stored)) {
      queueMicrotask(() => setLanguage(stored));
    } else {
      window.localStorage.setItem(STORAGE_KEYS.language, defaultLanguage);
    }
  }, [defaultLanguage, searchParams]);

  const withLang = (target: typeof href) => {
    if (typeof target !== "string") {
      return target;
    }
    try {
      const url = new URL(target, window.location.origin);
      if (!url.searchParams.get("lang")) {
        url.searchParams.set("lang", language);
      }
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      if (target.includes("?")) {
        return `${target}&lang=${language}`;
      }
      return `${target}?lang=${language}`;
    }
  };

  return <Link href={withLang(href)} {...props} />;
}
