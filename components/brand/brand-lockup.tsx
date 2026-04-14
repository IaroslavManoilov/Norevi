import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils/cn";
import { getTranslations } from "@/lib/i18n/translations";

interface BrandLockupProps {
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  dark?: boolean;
  compact?: boolean;
  tagline?: string;
}

export function BrandLockup({
  className,
  titleClassName,
  subtitleClassName,
  dark = false,
  compact = false,
  tagline = getTranslations("ru").tagline,
}: BrandLockupProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", compact && "gap-2.5", className)}>
      <BrandMark dark={dark} className={compact ? "h-12 w-12" : "h-[88px] w-[88px]"} />
      <div className="min-w-0">
        <p
          className={cn(
            "text-[58px] leading-none font-bold text-[var(--brand-800)]",
            compact && "text-[34px]",
            titleClassName
          )}
        >
          Norevi
        </p>
        <p
          className={cn(
            "mt-1 whitespace-nowrap text-[13px] uppercase tracking-[0.44em] text-[var(--text-soft)]",
            compact && "text-[8px] tracking-[0.22em]",
            subtitleClassName
          )}
        >
          {tagline}
        </p>
      </div>
    </div>
  );
}
