import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MobileAccordion({
  title,
  subtitle,
  defaultOpen = false,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">{children}</div>
      <details
        className={cn(
          "group md:hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]",
          className
        )}
        open={defaultOpen}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
            {subtitle ? <p className="text-xs text-[var(--text-muted)]">{subtitle}</p> : null}
          </div>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-muted)] transition group-open:rotate-180 dark:bg-[var(--surface-dark-soft)]">
            <ChevronDown size={16} />
          </span>
        </summary>
        <div className="px-3 pb-3">{children}</div>
      </details>
    </>
  );
}
