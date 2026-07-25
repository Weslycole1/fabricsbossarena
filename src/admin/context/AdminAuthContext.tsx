import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

interface AdminAuthContextValue {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  adminEmail: string | null;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const evaluateSession = async (nextSession: Session | null) => {
      if (!nextSession) {
        if (!mounted) return;
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", nextSession.user.id)
        .single();

      if (!mounted) return;
      setSession(nextSession);
      setIsAdmin(!error && Boolean(profile?.is_admin));
      setLoading(false);
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      await evaluateSession(data.session);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setLoading(true);
      void evaluateSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const value = useMemo(
    () => ({
      session,
      isAdmin,
      loading,
      adminEmail: session?.user.email ?? null,
      signOut,
    }),
    [session, isAdmin, loading]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
