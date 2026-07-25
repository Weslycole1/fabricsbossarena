import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon = "🧵", title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fadeIn">
    <div className="h-16 w-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-3xl mb-4">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-brand-ink mb-1">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-brand-muted max-w-sm mb-5">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
