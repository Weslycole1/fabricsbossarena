import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fabricImage from "../assets/Untitled-design-42-2.png";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabase";
import Logo from "../components/brand/Logo";

const Login = () => {
  const [activeForm, setActiveForm] = useState<"signup" | "login" | "forgot">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Email verification (post-signup "check your inbox" state + resend)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [unconfirmedLoginEmail, setUnconfirmedLoginEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  // Forgot password
  const [resetEmail, setResetEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme, t } = useTheme();
  const { showToast } = useToast();
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/products";

  useEffect(() => {
    const navState = location.state as
      | { openForgotPassword?: boolean; email?: string }
      | null;

    if (navState?.openForgotPassword) {
      setActiveForm("forgot");
      if (navState.email) setResetEmail(navState.email);
      return;
    }

    if (location.pathname === "/signup") {
      setActiveForm("signup");
    } else if (location.pathname === "/login") {
      setActiveForm("login");
    }
  }, [location.pathname, location.state]);

  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary} text-sm sm:text-base`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setUnconfirmedLoginEmail("");
    setResendSent(false);
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoggingIn(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setUnconfirmedLoginEmail(loginEmail);
        setAuthError("Please verify your email before logging in.");
      } else {
        setAuthError(error.message);
      }
      return;
    }

    showToast("Welcome back! 🎉", "success");
    navigate(redirectTo, { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSigningUp(true);

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error || !data.user) {
      setIsSigningUp(false);
      setAuthError(error?.message ?? "Unable to create account.");
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
      setAuthError(profileError.message);
      return;
    }

    if (!data.session) {
      // Email confirmation is required before this account can log in.
      setPendingVerificationEmail(signupEmail);
      setFirstName("");
      setLastName("");
      setSignupEmail("");
      setSignupPassword("");
      return;
    }

    showToast("Account created successfully! 🎉", "success");
    navigate(redirectTo, { replace: true });
  };

  const handleResendVerification = async (email: string) => {
    if (!email) return;
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    setIsResending(false);
    if (error) {
      showToast(error.message, "error");
      return;
    }
    setResendSent(true);
    showToast("Verification email sent!", "success");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSendingReset(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsSendingReset(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setResetSent(true);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden flex flex-col lg:flex-row ${t.pageBg}`}>
      <div className="lg:hidden relative h-32 w-full flex-shrink-0">
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
          <div className="flex justify-center mb-8">
            <Logo
              iconSize={34}
              tone={isDark ? "dark" : "light"}
              iconWrapperClassName="w-9 h-9"
              wordmarkClassName={`${t.headingDark} text-xl sm:text-2xl`}
            />
          </div>

          {pendingVerificationEmail ? (
            /* Post-signup: email confirmation required before login */
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-[#C9974A]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                ✉️
              </div>
              <h2 className={`font-display font-semibold text-lg ${t.headingDark} mb-2`}>
                Verify your email
              </h2>
              <p className={`text-sm ${t.textSecondary} mb-6 leading-relaxed`}>
                We sent a verification link to{" "}
                <span className="font-semibold">{pendingVerificationEmail}</span>. Please
                confirm your email before logging in. The link may take a minute to arrive —
                check your spam folder if you don't see it.
              </p>

              {authError && (
                <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {authError}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleResendVerification(pendingVerificationEmail)}
                disabled={isResending}
                className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
              >
                {isResending
                  ? "Sending..."
                  : resendSent
                  ? "Email sent again ✓"
                  : "Resend verification email"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingVerificationEmail("");
                  setResendSent(false);
                  setActiveForm("login");
                }}
                className="mt-3 text-sm text-[#C9974A] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : activeForm === "forgot" ? (
            /* Forgot password */
            <div>
              <h2 className={`font-display font-semibold text-lg ${t.headingDark} mb-1.5 text-center`}>
                Reset your password
              </h2>
              {!resetSent ? (
                <>
                  <p className={`text-sm ${t.textSecondary} mb-6 text-center`}>
                    Enter the email on your account and we'll send you a link to reset your
                    password.
                  </p>

                  {authError && (
                    <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      {authError}
                    </p>
                  )}

                  <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="submit"
                      disabled={isSendingReset}
                      className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
                    >
                      {isSendingReset ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center">
                  <div className="h-14 w-14 rounded-full bg-[#C9974A]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                    ✉️
                  </div>
                  <p className={`text-sm ${t.textSecondary} mb-2 leading-relaxed`}>
                    If an account exists for <span className="font-semibold">{resetEmail}</span>,
                    a password reset link has been sent.
                  </p>
                  <p className={`text-xs ${t.textSecondary}`}>
                    Check your inbox (and spam folder) for the link to set a new password.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveForm("login");
                  setAuthError("");
                  setResetSent(false);
                  setResetEmail("");
                }}
                className="mt-4 w-full text-sm text-[#C9974A] hover:underline text-center"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm("signup");
                    setAuthError("");
                    setUnconfirmedLoginEmail("");
                    setResendSent(false);
                  }}
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
                  onClick={() => {
                    setActiveForm("login");
                    setAuthError("");
                    setUnconfirmedLoginEmail("");
                    setResendSent(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition ${
                    activeForm === "login"
                      ? t.loginToggleActive
                      : t.loginToggleInactive
                  }`}
                >
                  Login
                </button>
              </div>

              {authError && (
                <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <p>{authError}</p>
                  {unconfirmedLoginEmail && (
                    <button
                      type="button"
                      onClick={() => handleResendVerification(unconfirmedLoginEmail)}
                      disabled={isResending}
                      className="mt-1.5 font-semibold text-[#C9974A] hover:underline disabled:opacity-70"
                    >
                      {isResending
                        ? "Sending..."
                        : resendSent
                        ? "Verification email sent ✓"
                        : "Resend verification email"}
                    </button>
                  )}
                </div>
              )}

              {activeForm === "signup" ? (
                <form onSubmit={handleSignup} className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      placeholder="Surname"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
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
                  <p className={`text-xs ${t.textSecondary}`}>
                    We'll send a verification link to confirm your email address.
                  </p>
                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
                  >
                    {isSigningUp ? "Signing up..." : "Sign Up"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email Address"
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
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 text-sm ${t.textSecondary}`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[#C9974A]" />
                      Remember Me
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveForm("forgot");
                        setAuthError("");
                        setUnconfirmedLoginEmail("");
                        setResendSent(false);
                        setResetEmail(loginEmail);
                      }}
                      className="text-[#C9974A] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
                  >
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
