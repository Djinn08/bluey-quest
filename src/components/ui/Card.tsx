import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`themed-card rounded-3xl p-5 ${className}`}>
      {children}
    </div>
  );
}
