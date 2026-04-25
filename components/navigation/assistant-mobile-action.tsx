"use client";

import { MobileActionBar } from "@/components/navigation/mobile-action-bar";

export function AssistantMobileAction({ label }: { label: string }) {
  return (
    <MobileActionBar
      actions={[
        {
          label,
          icon: "chat",
          tone: "primary",
          onClick: () => {
            const input = document.getElementById("assistant-input") as HTMLInputElement | null;
            if (input) {
              input.focus();
              input.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          },
        },
      ]}
    />
  );
}
