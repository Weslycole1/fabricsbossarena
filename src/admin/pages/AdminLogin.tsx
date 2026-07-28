import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAdminAuth } from "../context/AdminAuthContext";
import Button from "../components/ui/Button";
import BrandMark from "../../components/brand/BrandMark";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAdmin, loading } = useAdminAuth();

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ||
    "/admin";

  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, session, isAdmin, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      setSubmitting(false);
      setError(signInError?.message ?? "Unable to sign in.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.session.user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("This account does not have admin access.");
      return;
    }

    setSubmitting(false);
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 font-sans relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-ink/5 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white rounded-xl2 shadow-premium-lg border border-brand-border p-8 sm:p-9 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14">
            <BrandMark
              size={56}
              tone="light"
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(44,24,16,0.25)]"
            />
          </div>
          <h1 className="font-display font-semibold text-xl text-brand-ink">
            FabricsBossArena Admin
          </h1>
          <p className="text-sm text-brand-muted mt-1.5">
            Sign in to manage products and inventory.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 animate-fadeIn"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label htmlFor="admin-email" className="sr-only">
              Admin email
            </label>
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-xl pl-11 pr-4 py-3 w-full focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-[#1A1A1A] text-sm transition-shadow"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-brand-bg border border-brand-border rounded-xl pl-11 pr-11 py-3 w-full focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none text-[#1A1A1A] text-sm transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={submitting} fullWidth className="mt-1">
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-xs text-brand-muted text-center mt-6">
          Not an admin?{" "}
          <a href="/" className="text-brand-gold hover:underline">
            Return to the store
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
