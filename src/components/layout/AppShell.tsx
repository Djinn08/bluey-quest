import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  greeting?: string | null;
}

export function AppShell({ children, title = "Bluey Quest", greeting }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-100 via-sky-50 to-orange-50">
      <header className="sticky top-0 z-30 border-b border-sky-100/80 bg-sky-50/90 px-4 py-4 backdrop-blur">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-sky-900">
          {title}
        </h1>
        {greeting && (
          <p className="mt-0.5 text-center text-sm font-medium text-sky-700">
            Hi, {greeting}! 👋
          </p>
        )}
      </header>
      <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
