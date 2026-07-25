import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-ink text-white hover:bg-brand-inkSoft active:scale-[0.98] shadow-premium",
  secondary:
    "bg-white text-brand-ink border border-brand-border hover:bg-brand-bg hover:border-brand-gold/40 active:scale-[0.98]",
  ghost:
    "bg-transparent text-brand-ink hover:bg-brand-bg active:scale-[0.98]",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 active:scale-[0.98]",
  link: "bg-transparent text-brand-gold hover:underline p-0 h-auto",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-sm rounded-xl gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-150 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          ${VARIANT_CLASSES[variant]} ${variant !== "link" ? SIZE_CLASSES[size] : ""} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...rest}
      >
        {loading && (
          <span
            className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
