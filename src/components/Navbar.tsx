import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onLogout?: () => void;
  cartLength?: number;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const { isDark, toggleTheme, t } = useTheme();

  return (
    <nav
      className={`sticky top-0 z-50 w-full ${t.navbarBg} border-b ${t.navbarBorder}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="justify-self-start flex items-center gap-2">
          <span className="text-lg sm:text-xl">🧵</span>
          <span className="text-white font-bold text-base sm:text-lg md:text-xl">
            FabricsBossArena
          </span>
        </div>

        <p className="hidden md:block justify-self-center text-center text-[#C9974A] text-sm font-semibold italic px-4">
          Where Elegance Meets Every Thread
        </p>

        <div className="justify-self-end col-start-2 md:col-start-3 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="border border-[#C9974A] text-[#C9974A] rounded-full px-3 py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition flex items-center gap-1"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="border border-[#C9974A] text-[#C9974A] rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
