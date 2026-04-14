"use client";

import { Input } from "@/components/ui/input";

export function DateRangePicker({
  from,
  to,
  onChange,
}: {
  from?: string;
  to?: string;
  onChange: (value: { from: string; to: string }) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Input type="date" defaultValue={from} onChange={(e) => onChange({ from: e.target.value, to: to ?? "" })} />
      <Input type="date" defaultValue={to} onChange={(e) => onChange({ from: from ?? "", to: e.target.value })} />
    </div>
  );
}
