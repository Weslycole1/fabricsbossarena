import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

const Card = ({ children, hoverable = false, className = "", ...rest }: CardProps) => (
  <div
    className={`bg-white rounded-xl2 border border-brand-border shadow-premium transition-shadow duration-200 ${
      hoverable ? "hover:shadow-premium-hover" : ""
    } ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
