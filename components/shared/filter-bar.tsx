import Link from "next/link";

export function FilterBar({ items }: { items: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
