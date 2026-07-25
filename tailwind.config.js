/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          bg: "#FAF7F2",
          surface: "#FFFFFF",
          ink: "#2C1810",
          inkSoft: "#3d2415",
          muted: "#6B5B4E",
          border: "#E8E0D5",
          gold: "#C9974A",
          goldSoft: "#E4C284",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        premium: "0 1px 2px rgba(44,24,16,0.04), 0 8px 24px -8px rgba(44,24,16,0.10)",
        "premium-lg": "0 4px 6px rgba(44,24,16,0.04), 0 20px 40px -12px rgba(44,24,16,0.16)",
        "premium-hover": "0 8px 16px rgba(44,24,16,0.06), 0 24px 48px -12px rgba(44,24,16,0.20)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: 0, transform: "scale(0.96)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        scaleIn: "scaleIn 0.2s ease-out both",
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
