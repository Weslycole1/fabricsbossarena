import type { ReactNode } from "react";

export type BadgeVariant =
  | "gold"
  | "success"
  | "danger"
  | "neutral"
  | "outline"
  | "info"
  | "warning";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  gold: "bg-brand-gold/12 text-brand-gold ring-1 ring-inset ring-brand-gold/25",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15",
  danger: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/15",
  neutral: "bg-brand-bg text-brand-muted ring-1 ring-inset ring-brand-border",
  outline: "bg-transparent text-brand-ink ring-1 ring-inset ring-brand-border",
  info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

const Badge = ({ children, variant = "neutral", icon, className = "" }: BadgeProps) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${VARIANT_CLASSES[variant]} ${className}`}
  >
    {icon}
    {children}
  </span>
);

export default Badge;
