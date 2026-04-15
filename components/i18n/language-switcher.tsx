"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { updateLanguage } from "@/actions/settings";
import { getTranslations } from "@/lib/i18n/translations";

const LANGUAGES = ["ru", "ro", "en"] as const;

export function LanguageSwitcher({ language }: { language: "ru" | "en" | "ro" }) {
  const router = useRouter();
  const { show } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1">
      {LANGUAGES.map((code) => (
        <Button
          key={code}
          type="button"
          variant={code === language ? "primary" : "secondary"}
          className="h-9 rounded-full px-3 text-xs font-semibold"
          disabled={isPending}
          onClick={() => {
            if (code === language || isPending) {
              return;
            }
            const formData = new FormData();
            formData.set("language", code);
            startTransition(async () => {
              const result = await updateLanguage(formData);
              if (result?.ok) {
                show(getTranslations(code).common.languageUpdated);
                router.refresh();
              } else {
                show(getTranslations(language).common.error);
              }
            });
          }}
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
