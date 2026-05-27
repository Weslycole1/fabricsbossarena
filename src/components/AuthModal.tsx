import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

const AuthModal = ({ isOpen, onClose, onSuccess, message }: AuthModalProps) => {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnimateIn(false);
      return;
    }
    const frame = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary} text-sm`;

  const closeModal = () => {
    setError("");
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoggingIn(false);
    if (authError) {
      setError(authError.message);
      return;
    }

    closeModal();
    onSuccess?.();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSigningUp(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });

    if (authError || !data.user) {
      setIsSigningUp(false);
      setError(authError?.message ?? "Unable to create account.");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: signupEmail,
      first_name: firstName,
      last_name: lastName,
    });

    setIsSigningUp(false);
    if (profileError) {
      setError(profileError.message);
      return;
    }

    closeModal();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-200 ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#6B5B4E] hover:text-[#2C1810] text-xl leading-none"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <p className="text-3xl">🧵</p>
          <h2 className="text-2xl font-bold text-[#2C1810] mt-2">FabricsBossArena</h2>
          <p className="text-[#6B5B4E] text-sm mt-2">
            {message ?? "Sign in to save your cart, wishlist and track your orders"}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "login" ? t.loginToggleActive : t.loginToggleInactive
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setError("");
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "signup" ? t.loginToggleActive : t.loginToggleInactive
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className={inputClass}
            />
            <a href="#" className="text-sm text-[#C9974A] hover:underline self-end">
              Forgot password?
            </a>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-[#C9974A] text-white rounded-xl w-full py-3 font-bold hover:bg-[#b8863a] transition disabled:opacity-70"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isSigningUp}
              className="bg-[#C9974A] text-white rounded-xl w-full py-3 font-bold hover:bg-[#b8863a] transition disabled:opacity-70"
            >
              {isSigningUp ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={closeModal}
          className="mt-4 w-full text-sm text-[#6B5B4E] hover:text-[#2C1810] underline"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
