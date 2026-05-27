import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

interface NavbarProps {
  onLogout?: () => void;
  cartLength?: number;
  wishlistLength?: number;
}

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = ({ onLogout, cartLength = 0, wishlistLength = 0 }: NavbarProps) => {
  const { isDark, toggleTheme, t } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(data.session));
    };
    void setupAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    else navigate("/login");
    setMenuOpen(false);
  };

  const iconBtn =
    "relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#C9974A]/50 text-[#C9974A] hover:bg-[#C9974A] hover:text-white transition text-sm sm:text-base";

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${
      isActive(path)
        ? "text-[#C9974A]"
        : "text-white/80 hover:text-[#C9974A]"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full ${t.navbarBg} border-b ${t.navbarBorder}`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 shrink-0 min-w-0"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-base sm:text-xl">🧵</span>
            <span className="text-white font-bold text-base sm:text-xl truncate">
              FabricsBossArena
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.path} className={linkClass(link.path)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className={iconBtn} title="Wishlist">
                  ❤️
                  {wishlistLength > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-0.5 sm:px-1 bg-[#C9974A] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistLength}
                    </span>
                  )}
                </Link>

                <Link to="/account" className={iconBtn} title="Account">
                  👤
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="border border-[#C9974A] text-[#C9974A] rounded-full px-4 py-1.5 text-sm hover:bg-[#C9974A] hover:text-white transition"
              >
                Login
              </button>
            )}

            <Link to="/cart" className={iconBtn} title="Cart">
              🛒
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-0.5 sm:px-1 bg-[#C9974A] text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartLength}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="border border-[#C9974A] text-[#C9974A] rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition hidden sm:flex items-center gap-1"
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

            {onLogout && isAuthenticated && (
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
              className="md:hidden text-white text-2xl leading-none px-1 py-0.5 hover:text-[#C9974A] transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`${linkClass(link.path)} py-1`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setMenuOpen(false)}
              className={`${linkClass("/account")} py-1`}
            >
              My Account
            </Link>
            {onLogout && isAuthenticated && (
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

      <p className="text-[#C9974A] text-sm font-semibold italic text-center py-1.5 border-t border-white/10">
        Where Elegance Meets Every Thread
      </p>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </nav>
  );
};

export default Navbar;
