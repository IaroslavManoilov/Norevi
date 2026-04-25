import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)] sm:rounded-[20px] sm:p-5 sm:shadow-[var(--shadow-card)]",
        className
      )}
    >
      {children}
    </section>
  );
}
