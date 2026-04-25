"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ConfirmDialog({
  title,
  onConfirm,
  confirmText,
}: {
  title: string;
  onConfirm: () => void;
  confirmText?: string;
}) {
  const { t } = useI18n();
  const label = confirmText ?? t.common.confirm;
  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (window.confirm(title)) onConfirm();
      }}
    >
      {label}
    </Button>
  );
}
