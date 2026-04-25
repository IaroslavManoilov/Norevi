"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getTranslations, type Language } from "@/lib/i18n/translations";
import { STORAGE_KEYS, readStorageWithLegacy } from "@/lib/config/storage";

type AuthLanguageSwitcherProps = {
  basePath: "/auth/sign-in" | "/auth/sign-up" | "/";
  defaultLanguage: Language;
  setup?: string | null;
  className?: string;
  appearance?: "light" | "dark";
};

export function AuthLanguageSwitcher({
  basePath,
  defaultLanguage,
  setup,
  className,
  appearance = "light",
}: AuthLanguageSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("lang") as Language | null) ?? defaultLanguage;
  const t = getTranslations(current);

  useEffect(() => {
    if (searchParams.get("lang")) {
      return;
    }
    const stored = readStorageWithLegacy(STORAGE_KEYS.language, "norevi-language");
    if (stored === "ru" || stored === "ro" || stored === "en") {
      const next = new URLSearchParams();
      if (setup) {
        next.set("setup", setup);
      }
      next.set("lang", stored);
      router.replace(`${basePath}?${next.toString()}`);
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.language, defaultLanguage);
  }, [basePath, router, searchParams, setup, defaultLanguage]);

  const go = (code: Language) => {
    window.localStorage.setItem(STORAGE_KEYS.language, code);
    const next = new URLSearchParams();
    if (setup) {
      next.set("setup", setup);
    }
    next.set("lang", code);
    router.push(`${basePath}?${next.toString()}`);
  };

  const isDark = appearance === "dark";

  return (
    <div
      className={[
        "flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em]",
        isDark ? "text-[#a9cec8]" : "text-[var(--text-muted)]",
        className ?? "",
      ].join(" ")}
    >
      {(["ru", "ro", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => go(code)}
          aria-label={t.languages[code]}
          title={t.languages[code]}
          className={
            code === current
              ? "rounded-full bg-[var(--brand-700)] px-2.5 py-1 text-white shadow-[var(--shadow-soft)]"
              : isDark
                ? "rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[#c9e5df] transition hover:border-[var(--brand-300)] hover:bg-white/10"
                : "rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-soft)] transition hover:border-[var(--brand-200)] hover:text-[var(--text)]"
          }
        >
          {code}
        </button>
      ))}
    </div>
  );
}
