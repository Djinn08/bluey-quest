import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { APP_NAME } from "@/lib/characters";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  greeting?: string | null;
}

export function AppShell({ children, title = APP_NAME, greeting }: AppShellProps) {
  return (
    <div className="min-h-dvh">
      <header className="themed-header sticky top-0 z-30 px-4 py-4">
        <h1 className="text-theme text-center text-2xl font-extrabold tracking-tight">
          {title}
        </h1>
        {greeting && (
          <p className="text-theme-muted mt-0.5 text-center text-sm font-medium">
            Hi, {greeting}! 👋
          </p>
        )}
      </header>
      <main className="mx-auto max-w-lg px-4 pb-28 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
