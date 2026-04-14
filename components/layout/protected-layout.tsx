import { AppShell } from "@/components/layout/app-shell";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
