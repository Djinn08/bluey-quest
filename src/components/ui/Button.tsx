import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "completed" | "ghost";
  size?: "md" | "lg";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-[var(--primary)] text-white hover:brightness-95 active:brightness-90 shadow-lg shadow-[color-mix(in_srgb,var(--primary)_25%,transparent)]",
  secondary:
    "bg-[var(--primary-light)] text-[var(--text)] hover:brightness-95 active:brightness-90 shadow-lg shadow-[color-mix(in_srgb,var(--primary-light)_35%,transparent)]",
  accent:
    "bg-[var(--card-alt)] text-[var(--text)] hover:brightness-95 ring-2 ring-[var(--accent)]",
  completed:
    "bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-400/50 cursor-default",
  ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--card-alt)]",
};

const sizes = {
  md: "min-h-12 px-5 py-3 text-base",
  lg: "min-h-16 px-6 py-4 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed ${variant === "completed" ? "disabled:opacity-100" : "disabled:opacity-50"} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
