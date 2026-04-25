import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed bg-[var(--surface-soft)] text-center">
      <p className="text-base font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-soft)]">{description}</p>
    </Card>
  );
}
