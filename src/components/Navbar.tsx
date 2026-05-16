import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onLogout?: () => void;
  cartLength?: number;
  wishlistLength?: number;
}

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "Shop", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = ({ onLogout, cartLength = 0, wishlistLength = 0 }: NavbarProps) => {
  const { isDark, toggleTheme, t } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
    setMenuOpen(false);
  };

  const iconBtn =
    "relative flex items-center justify-center w-9 h-9 rounded-full border border-[#C9974A]/50 text-[#C9974A] hover:bg-[#C9974A] hover:text-white transition text-base";

  return (
    <nav
      className={`sticky top-0 z-50 w-full ${t.navbarBg} border-b ${t.navbarBorder}`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-lg sm:text-xl">🧵</span>
            <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              FabricsBossArena
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition ${
                  isActive(link.path)
                    ? "text-[#C9974A]"
                    : "text-white/80 hover:text-[#C9974A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/wishlist" className={iconBtn} title="Wishlist">
              ❤️
              {wishlistLength > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C9974A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistLength}
                </span>
              )}
            </Link>

            <Link to="/account" className={iconBtn} title="Account">
              👤
            </Link>

            <Link to="/cart" className={iconBtn} title="Cart">
              🛒
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C9974A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartLength}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="border border-[#C9974A] text-[#C9974A] rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition hidden sm:flex items-center gap-1"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={`${iconBtn} sm:hidden`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:block border border-[#C9974A] text-[#C9974A] rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition"
              >
                Logout
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="lg:hidden flex flex-col justify-center gap-1 w-9 h-9 rounded-full border border-[#C9974A]/50 text-[#C9974A] hover:bg-[#C9974A] hover:text-white transition items-center"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-4 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium transition py-1 ${
                  isActive(link.path)
                    ? "text-[#C9974A]"
                    : "text-white/80 hover:text-[#C9974A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition py-1 ${
                isActive("/account")
                  ? "text-[#C9974A]"
                  : "text-white/80 hover:text-[#C9974A]"
              }`}
            >
              My Account
            </Link>
            {onLogout && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-sm font-medium text-white/80 hover:text-[#C9974A] py-1 transition sm:hidden"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
