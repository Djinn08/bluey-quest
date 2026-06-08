"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/store", label: "Store", icon: "🛍️" },
  { href: "/food-history", label: "Food", icon: "🍽️" },
  { href: "/transactions", label: "History", icon: "⭐" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-sky-100 bg-white/95 px-0.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      aria-label="Main navigation"
    >
      <ul className="mx-auto flex max-w-lg justify-around">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex min-h-14 min-w-[3.5rem] flex-col items-center justify-center rounded-2xl px-1.5 text-[10px] font-semibold transition-colors sm:min-w-[4rem] sm:text-xs ${
                  active
                    ? "bg-sky-100 text-sky-800"
                    : "text-sky-600 hover:bg-sky-50"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {icon}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
