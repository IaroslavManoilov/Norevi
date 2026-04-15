"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { signOut } from "@/actions/auth";

export function MobileTopMenu({
  language,
  quickActionLabel,
  signOutLabel,
}: {
  language: "ru" | "en" | "ro";
  quickActionLabel: string;
  signOutLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? (
        <div className="mt-3 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <LanguageSwitcher language={language} compact />
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/finance/new">
              <Button className="h-10 w-full gap-2 text-sm" onClick={() => setOpen(false)}>
                <Plus size={14} />
                {quickActionLabel}
              </Button>
            </Link>
            <form action={signOut}>
              <Button
                variant="secondary"
                className="h-10 w-full text-sm"
                onClick={() => setOpen(false)}
              >
                {signOutLabel}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
