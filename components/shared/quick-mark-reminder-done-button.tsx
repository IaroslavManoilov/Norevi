"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function QuickMarkReminderDoneButton({ reminderId }: { reminderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  return (
    <Button
      variant="secondary"
      className="h-9"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const res = await fetch(`/api/reminders/${reminderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done" }),
        });
        setLoading(false);
        if (!res.ok) {
          window.alert(t.common.markDoneFailed);
          return;
        }
        router.refresh();
      }}
    >
      {loading ? "..." : t.common.markDone}
    </Button>
  );
}
