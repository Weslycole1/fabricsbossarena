import BrandMark from "./BrandMark";

interface LogoProps {
  /** Pixel size of the icon badge. */
  iconSize?: number;
  /** Tailwind size classes for the icon wrapper, e.g. "w-8 h-8 sm:w-9 sm:h-9" for responsive scaling. */
  iconWrapperClassName?: string;
  /** Tailwind classes for the wordmark text (color + responsive size), e.g. "text-white text-base sm:text-xl". */
  wordmarkClassName?: string;
  /** Optional subtitle shown under the wordmark (e.g. "Admin Dashboard"). */
  subtitle?: string;
  subtitleClassName?: string;
  /** Hide the wordmark entirely, showing only the icon badge (compact/mobile use). */
  iconOnly?: boolean;
  /** Tailwind classes controlling when the wordmark is hidden vs shown, e.g. "hidden sm:flex". */
  wordmarkWrapperClassName?: string;
  className?: string;
}

/**
 * Horizontal FabricsBossArena logo lockup: BrandMark icon + serif wordmark.
 * Used across the navbar, footer, login pages, and admin sidebar so the
 * brand reads consistently everywhere. Wordmark color/size is left to the
 * caller since it sits on different backgrounds and contexts.
 */
const Logo = ({
  iconSize = 36,
  iconWrapperClassName = "",
  wordmarkClassName = "text-white text-lg",
  subtitle,
  subtitleClassName = "text-white/60",
  iconOnly = false,
  wordmarkWrapperClassName = "flex flex-col leading-tight min-w-0",
  className = "",
}: LogoProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <span className={iconWrapperClassName}>
      <BrandMark size={iconSize} className="flex-shrink-0 w-full h-full" />
    </span>
    {!iconOnly && (
      <span className={wordmarkWrapperClassName}>
        <span className={`font-display font-semibold tracking-wide truncate ${wordmarkClassName}`}>
          FabricsBossArena
        </span>
        {subtitle && (
          <span className={`text-[11px] uppercase tracking-[0.15em] ${subtitleClassName}`}>
            {subtitle}
          </span>
        )}
      </span>
    )}
  </span>
);

export default Logo;
