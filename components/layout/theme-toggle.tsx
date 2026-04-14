"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";
  const { t } = useI18n();

  return (
    <Button variant="ghost" onClick={() => setTheme(next)} type="button" className="h-11 px-4 text-sm">
      {t.actions.theme}
    </Button>
  );
}
