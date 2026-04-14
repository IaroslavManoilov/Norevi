"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] dark:hover:bg-[var(--brand-600)]",
  secondary:
    "bg-[var(--surface-soft)] text-[var(--text)] hover:bg-[var(--mint-200)] dark:bg-[var(--surface-dark-soft)] dark:text-[var(--text-dark)] dark:hover:bg-[var(--surface-dark)]",
  ghost:
    "bg-transparent text-[var(--text)] hover:bg-[var(--surface-soft)] dark:text-[var(--text-dark)] dark:hover:bg-[var(--surface-dark-soft)]",
  destructive:
    "bg-[var(--danger)] text-white hover:opacity-90 dark:hover:bg-[var(--danger)]",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-[16px] px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-400)] disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
