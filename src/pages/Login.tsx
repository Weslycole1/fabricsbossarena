import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fabricImage from "../assets/Untitled-design-42-2.png";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [activeForm, setActiveForm] = useState<"signup" | "login">("signup");
  const navigate = useNavigate();
  const { isDark, toggleTheme, t } = useTheme();

  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary} text-sm sm:text-base`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${t.pageBg}`}>
      {/* Mobile premium banner */}
      <div className="lg:hidden relative h-48 w-full flex-shrink-0">
        <img
          src={fabricImage}
          alt="Premium fabrics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/90 via-[#2C1810]/60 to-[#2C1810]/40" />
        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
          <h2 className="text-[#C9974A] font-bold text-xl sm:text-2xl leading-tight">
            Where Elegance Meets Every Thread
          </h2>
        </div>
      </div>

      {/* Desktop left hero */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <img
          src={fabricImage}
          alt="Premium fabrics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/90 via-[#2C1810]/50 to-[#2C1810]/30" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 text-center">
          <h2 className="text-[#C9974A] font-bold text-3xl xl:text-4xl leading-tight max-w-md">
            Where Elegance Meets Every Thread
          </h2>
          <p className="mt-4 text-white/80 text-base max-w-sm">
            Discover premium fabrics crafted for comfort, style, and timeless
            quality.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div
        className={`flex-1 ${t.pageBg} flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative`}
      >
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-4 right-4 border border-[#C9974A] text-[#C9974A] rounded-full px-3 py-1.5 text-xs sm:text-sm hover:bg-[#C9974A] hover:text-white transition flex items-center gap-1"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="w-full max-w-md">
          <h1
            className={`font-bold text-xl sm:text-2xl text-center mb-8 ${t.headingDark}`}
          >
            🧵 FabricsBossArena
          </h1>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveForm("signup")}
              className={`flex-1 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition ${
                activeForm === "signup"
                  ? t.loginToggleActive
                  : t.loginToggleInactive
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setActiveForm("login")}
              className={`flex-1 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition ${
                activeForm === "login"
                  ? t.loginToggleActive
                  : t.loginToggleInactive
              }`}
            >
              Login
            </button>
          </div>

          {activeForm === "signup" ? (
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Surname"
                  required
                  className={inputClass}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                required
                className={inputClass}
              />
              <button
                type="submit"
                className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base"
              >
                Sign Up
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email Address"
                required
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                required
                className={inputClass}
              />
              <div
                className={`flex flex-wrap items-center justify-between gap-2 text-sm ${t.textSecondary}`}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#C9974A]" />
                  Remember Me
                </label>
                <a href="#" className="text-[#C9974A] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
