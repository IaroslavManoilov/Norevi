import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        "rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] sm:rounded-[20px] sm:p-5",
        className
      )}
    >
      {children}
    </section>
  );
}
