"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ConfirmDeleteButton({ endpoint, redirectTo }: { endpoint: string; redirectTo: string }) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        const ok = window.confirm(t.common.deleteConfirm);
        if (!ok) return;
        const res = await fetch(endpoint, { method: "DELETE" });
        if (!res.ok) {
          window.alert(t.common.deleteFailed);
          return;
        }
        router.push(redirectTo);
        router.refresh();
      }}
    >
      {t.common.delete}
    </Button>
  );
}
