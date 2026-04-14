"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ProfileForm({ fullName }: { fullName?: string | null }) {
  const [value, setValue] = useState(fullName ?? "");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useI18n();

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const res = await fetch("/api/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ full_name: value }),
        });
        if (!res.ok) {
          setError(t.errors.updateProfile);
          return;
        }
        router.refresh();
      }}
    >
      <label className="space-y-1">
        <span className="text-sm font-medium text-[var(--text-soft)]">{t.settings.name}</span>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={t.auth.name} />
      </label>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <Button type="submit" className="mt-2">
        {t.actions.save}
      </Button>
    </form>
  );
}
