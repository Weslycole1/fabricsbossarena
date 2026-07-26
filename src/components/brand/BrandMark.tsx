/**
 * BrandMark — the FabricsBossArena monogram icon.
 *
 * A rounded badge in deep brown, with a peeled fabric-swatch corner fold in
 * gold (evoking a folded textile sample), a serif "FBA" monogram in cream,
 * and a thin stitched hem arc beneath it. Pure inline SVG so it stays crisp
 * at any size (navbar, favicon, admin sidebar) with zero extra image requests.
 *
 * Kept visually identical to /public/favicon.svg so the in-app icon and the
 * browser tab icon match exactly.
 */
interface BrandMarkProps {
  size?: number;
  className?: string;
  title?: string;
}

const BrandMark = ({ size = 40, className = "", title = "FabricsBossArena" }: BrandMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    className={className}
  >
    <rect x="0" y="0" width="100" height="100" rx="24" fill="#2C1810" />

    {/* Folded fabric-swatch corner */}
    <polygon points="78,100 100,100 100,78" fill="#170D07" />
    <polygon points="82,100 100,100 100,82" fill="#C9974A" />
    <line x1="82" y1="100" x2="100" y2="82" stroke="#8A6A3A" strokeWidth="1.2" />

    {/* Stitched hem accent */}
    <path
      d="M18 74 Q 48 83 74 74"
      stroke="#C9974A"
      strokeWidth="2"
      strokeDasharray="2 5"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />

    {/* FBA monogram */}
    <text
      x="47"
      y="59"
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontSize="32"
      fontWeight="700"
      letterSpacing="1.5"
      fill="#F5EFE1"
    >
      FBA
    </text>
  </svg>
);

export default BrandMark;
