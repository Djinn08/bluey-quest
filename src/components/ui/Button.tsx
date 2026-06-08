import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "completed" | "ghost";
  size?: "md" | "lg";
  fullWidth?: boolean;
}

const variants = {
  primary:
    "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 shadow-lg shadow-sky-200",
  secondary:
    "bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-600 shadow-lg shadow-orange-200",
  accent:
    "bg-amber-100 text-amber-900 hover:bg-amber-200 active:bg-amber-300 ring-2 ring-amber-300",
  completed:
    "bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-400/50 cursor-default",
  ghost: "bg-transparent text-sky-800 hover:bg-sky-50",
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
