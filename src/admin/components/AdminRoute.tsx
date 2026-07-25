import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { session, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-[#E8E0D5] border-t-[#C9974A] animate-spin" />
          <p className="text-sm text-[#6B5B4E]">Checking admin access…</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
