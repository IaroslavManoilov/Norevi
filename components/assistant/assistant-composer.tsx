"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";

export function AssistantComposer({ onSend, loading }: { onSend: (text: string) => Promise<void>; loading: boolean }) {
  const [value, setValue] = useState("");
  const { t } = useI18n();

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        const message = value;
        setValue("");
        await onSend(message);
      }}
    >
      <Input
        id="assistant-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.assistant.placeholder}
      />
      <Button type="submit" disabled={loading} className="h-10 sm:min-w-[140px]">
        {t.assistant.send}
      </Button>
    </form>
  );
}
