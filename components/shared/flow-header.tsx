import type { ReactNode } from "react";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils/cn";

type FlowHeaderProps = {
  icon: ReactNode;
  title: string;
  hint?: string;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  titleClassName?: string;
  hintClassName?: string;
};

export function FlowHeader({
  icon,
  title,
  hint,
  className,
  iconClassName,
  labelClassName,
  titleClassName,
  hintClassName,
}: FlowHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--mint-100)] text-[var(--brand-800)]",
          iconClassName
        )}
      >
        {icon}
      </span>
      <div>
        <p className={cn("text-sm font-semibold text-[var(--brand-700)]", labelClassName)}>{BRAND.flowName}</p>
        <h3 className={cn("text-xl font-bold", titleClassName)}>{title}</h3>
        {hint ? <p className={cn("text-sm text-[var(--text-muted)]", hintClassName)}>{hint}</p> : null}
      </div>
    </div>
  );
}
