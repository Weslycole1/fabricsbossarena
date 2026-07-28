import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { supabase } from "../lib/supabase";
import Logo from "../components/brand/Logo";

type LinkStatus = "checking" | "valid" | "invalid";

const ResetPassword = () => {
  const { isDark, toggleTheme, t } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [linkStatus, setLinkStatus] = useState<LinkStatus>("checking");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const inputClass = `${t.inputBg} border ${t.border} rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none ${t.textPrimary} text-sm sm:text-base`;

  useEffect(() => {
    let mounted = true;

    // Clicking the emailed recovery link causes supabase-js to automatically
    // parse the token from the URL and establish a temporary "recovery"
    // session. We just need to confirm that session exists before letting
    // the user set a new password.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY") {
        setLinkStatus("valid");
      }
    });

    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) {
        setLinkStatus("valid");
      } else {
        // Give the URL-detection a brief moment before concluding the link
        // is invalid/expired (it resolves asynchronously on page load).
        setTimeout(() => {
          if (mounted) {
            setLinkStatus((current) => (current === "checking" ? "invalid" : current));
          }
        }, 2500);
      }
    };

    void checkExistingSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    showToast("Password updated successfully! 🎉", "success");
  };

  const handleContinue = async () => {
    // Clear the temporary recovery session so the user logs in fresh with
    // their new password (also guarantees the old password can't linger
    // in an active session anywhere).
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`min-h-screen overflow-x-hidden flex items-center justify-center px-4 py-10 relative ${t.pageBg}`}>
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

        <div className={`${t.cardBg} rounded-2xl border ${t.border} shadow-sm p-6 sm:p-8`}>
          {linkStatus === "checking" && (
            <div className="text-center py-6">
              <div className="w-10 h-10 border-4 border-[#E8E0D5] border-t-[#C9974A] rounded-full animate-spin mx-auto mb-4" />
              <p className={`text-sm ${t.textSecondary}`}>Verifying your reset link…</p>
            </div>
          )}

          {linkStatus === "invalid" && (
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-2xl mx-auto mb-4">
                ⚠️
              </div>
              <h1 className={`font-display font-semibold text-lg ${t.headingDark} mb-2`}>
                Link expired or invalid
              </h1>
              <p className={`text-sm ${t.textSecondary} mb-6 leading-relaxed`}>
                This password reset link is no longer valid. Reset links expire after a
                short time — please request a new one.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {linkStatus === "valid" && !done && (
            <>
              <h1 className={`font-display font-semibold text-lg ${t.headingDark} mb-1.5 text-center`}>
                Set a new password
              </h1>
              <p className={`text-sm ${t.textSecondary} mb-6 text-center`}>
                Choose a new password for your account.
              </p>

              {error && (
                <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Update Password"}
                </button>
              </form>
            </>
          )}

          {linkStatus === "valid" && done && (
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-[#C9974A]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                ✅
              </div>
              <h1 className={`font-display font-semibold text-lg ${t.headingDark} mb-2`}>
                Password updated
              </h1>
              <p className={`text-sm ${t.textSecondary} mb-6 leading-relaxed`}>
                Your password has been changed. Please sign in again with your new password.
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base"
              >
                Continue to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
