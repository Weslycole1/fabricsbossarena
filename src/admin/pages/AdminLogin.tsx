import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAdmin, loading } = useAdminAuth();

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/admin";

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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E8E0D5] p-8">
        <div className="text-center mb-8">
          <p className="text-2xl mb-2">🧵</p>
          <h1 className="font-bold text-xl text-[#2C1810]">
            FabricsBossArena Admin
          </h1>
          <p className="text-sm text-[#6B5B4E] mt-1">
            Sign in to manage products and inventory.
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none text-[#1A1A1A] text-sm sm:text-base"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl px-4 py-3 w-full focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none text-[#1A1A1A] text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-[#2C1810] hover:bg-[#3d2415] text-white font-bold rounded-xl py-3 w-full transition text-sm sm:text-base disabled:opacity-70"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-[#6B5B4E] text-center mt-6">
          Not an admin?{" "}
          <a href="/" className="text-[#C9974A] hover:underline">
            Return to the store
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
