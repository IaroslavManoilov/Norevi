import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const toneMap = {
    neutral: "bg-[var(--mint-100)] text-[var(--brand-900)]",
    success: "bg-[color-mix(in_srgb,var(--success)_20%,white)] text-[var(--success)]",
    warning: "bg-[color-mix(in_srgb,var(--warning)_20%,white)] text-[var(--warning)]",
    danger: "bg-[color-mix(in_srgb,var(--danger)_20%,white)] text-[var(--danger)]",
  };

  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", toneMap[tone])}>{children}</span>;
}
