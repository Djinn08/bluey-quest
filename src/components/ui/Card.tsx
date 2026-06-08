import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white/90 p-5 shadow-md shadow-sky-100/80 ring-1 ring-sky-100 ${className}`}
    >
      {children}
    </div>
  );
}
