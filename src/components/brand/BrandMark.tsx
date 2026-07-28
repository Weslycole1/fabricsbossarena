/**
 * BrandMark — the FabricsBossArena brand icon.
 *
 * An abstract woven-thread monogram: two crossing ribbon strands (warp in
 * gold, weft adapting to the surface it sits on) interlaced at a central
 * knot, with softly frayed thread ends at each tip. It reads as textile/
 * weaving at a glance without spelling out letters or sitting in a boxed
 * badge — a deliberate departure from the previous generic rounded-square
 * "FBA" badge. Pure inline SVG (no image request), crisp at any size.
 *
 * `tone` controls the weft strand's color so the mark stays legible on both
 * dark surfaces (navbar, footer, admin sidebar — always dark brown regardless
 * of light/dark site theme) and light surfaces (login card in light theme):
 *   - "dark"  → weft renders cream, for placement on dark brown backgrounds
 *   - "light" → weft renders deep brown, for placement on light backgrounds
 */
interface BrandMarkProps {
  size?: number;
  tone?: "dark" | "light";
  className?: string;
  title?: string;
}

const BrandMark = ({
  size = 40,
  tone = "dark",
  className = "",
  title = "FabricsBossArena",
}: BrandMarkProps) => {
  const weft = tone === "dark" ? "#F5EFE1" : "#2C1810";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      {/* Warp thread (gold), bottom-left to top-right */}
      <path
        d="M16 84 C 34 66, 42 58, 50 50 C 58 42, 66 34, 84 16"
        stroke="#C9974A"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Weft thread, top-left to bottom-right — color adapts to surface tone */}
      <path
        d="M16 16 C 34 34, 42 42, 50 50 C 58 58, 66 66, 84 84"
        stroke={weft}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Frayed thread ends — four corners, three fine diverging fibers each */}
      {[
        { x: 16, y: 84, color: "#C9974A", a: [200, 230, 260] },
        { x: 84, y: 16, color: "#C9974A", a: [20, 50, 80] },
        { x: 16, y: 16, color: weft, a: [190, 220, 250] },
        { x: 84, y: 84, color: weft, a: [10, 40, 70] },
      ].map((tip, tipIndex) =>
        tip.a.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const len = 9;
          const x2 = tip.x + Math.cos(rad) * len;
          const y2 = tip.y + Math.sin(rad) * len;
          return (
            <line
              key={`${tipIndex}-${i}`}
              x1={tip.x}
              y1={tip.y}
              x2={x2}
              y2={y2}
              stroke={tip.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.75"
            />
          );
        })
      )}

      {/* Interlace knot where the threads cross */}
      <circle cx="50" cy="50" r="5.5" fill={weft} stroke="#C9974A" strokeWidth="2" />
    </svg>
  );
};

export default BrandMark;
