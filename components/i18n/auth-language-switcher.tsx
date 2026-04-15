"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTranslations, type Language } from "@/lib/i18n/translations";

type AuthLanguageSwitcherProps = {
  basePath: "/auth/sign-in" | "/auth/sign-up" | "/";
  defaultLanguage: Language;
  setup?: string | null;
};

export function AuthLanguageSwitcher({ basePath, defaultLanguage, setup }: AuthLanguageSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("lang") as Language | null) ?? defaultLanguage;
  const t = getTranslations(current);

  useEffect(() => {
    if (searchParams.get("lang")) {
      return;
    }
    const stored = window.localStorage.getItem("norevi-language");
    if (stored === "ru" || stored === "ro" || stored === "en") {
      const next = new URLSearchParams();
      if (setup) {
        next.set("setup", setup);
      }
      next.set("lang", stored);
      router.replace(`${basePath}?${next.toString()}`);
    }
  }, [basePath, router, searchParams, setup]);

  const go = (code: Language) => {
    window.localStorage.setItem("norevi-language", code);
    const next = new URLSearchParams();
    if (setup) {
      next.set("setup", setup);
    }
    next.set("lang", code);
    router.push(`${basePath}?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
      {(["ru", "ro", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => go(code)}
          className={
            code === current
              ? "rounded-full bg-[var(--brand-700)] px-3 py-1 text-white"
              : "rounded-full border border-[var(--border)] px-3 py-1 text-[var(--text-soft)] transition hover:border-[var(--brand-200)] hover:text-[var(--text)]"
          }
        >
          {t.languages[code]}
        </button>
      ))}
    </div>
  );
}
