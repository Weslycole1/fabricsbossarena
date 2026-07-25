import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useToast } from "../../hooks/useToast";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", end: true, icon: "📊" },
  { label: "Products", to: "/admin/products", end: false, icon: "🧵" },
  { label: "Add Product", to: "/admin/products/new", end: true, icon: "➕" },
];

const AdminLayout = () => {
  const { adminEmail, signOut } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    showToast("Signed out of admin dashboard.", "info");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#2C1810] text-[#F5F0E8] flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">🧵</span>
            <div>
              <p className="font-bold text-[#C9974A] leading-tight">
                FabricsBossArena
              </p>
              <p className="text-xs text-white/60 leading-tight">
                Admin Dashboard
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-[#C9974A] text-white"
                    : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition"
          >
            <span aria-hidden="true">🏬</span>
            View Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 transition text-left"
          >
            <span aria-hidden="true">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-[#E8E0D5] px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#2C1810] text-xl px-2"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B5B4E] hidden sm:inline">
              {adminEmail}
            </span>
            <span className="h-8 w-8 rounded-full bg-[#C9974A] text-white flex items-center justify-center text-sm font-bold">
              {adminEmail?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
