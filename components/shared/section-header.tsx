export function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
      {hint ? <p className="text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}
