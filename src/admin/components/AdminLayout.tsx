import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  ReceiptText,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useToast } from "../../hooks/useToast";
import Logo from "../../components/brand/Logo";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin", end: true, icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", end: false, icon: Shirt },
  { label: "Add Product", to: "/admin/products/new", end: true, icon: PlusCircle },
  { label: "Orders", to: "/admin/orders", end: false, icon: ReceiptText },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/orders": "Orders",
};

const AdminLayout = () => {
  const { adminEmail, signOut } = useAdminAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const handleLogout = async () => {
    await signOut();
    showToast("Signed out of admin dashboard.", "info");
    navigate("/admin/login", { replace: true });
  };

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/admin/products/edit")
      ? "Edit Product"
      : location.pathname.startsWith("/admin/orders/")
      ? "Order Details"
      : "");

  return (
    <div className="min-h-screen bg-brand-bg flex font-sans">
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand-ink text-brand-bg flex flex-col transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-7 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group min-w-0">
            <Logo
              iconSize={38}
              iconWrapperClassName="w-9 h-9 flex-shrink-0 transition-transform duration-150 group-hover:scale-105"
              wordmarkClassName="text-brand-goldSoft text-base"
              subtitle="Admin Dashboard"
              subtitleClassName="text-white/45"
            />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                    isActive
                      ? "bg-brand-gold text-brand-ink shadow-premium"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <Store size={18} />
            View Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/75 hover:bg-red-500/15 hover:text-red-200 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-brand-border px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-brand-ink p-1.5 rounded-lg hover:bg-brand-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            {pageTitle && (
              <h2 className="font-display font-semibold text-brand-ink text-lg truncate hidden sm:block">
                {pageTitle}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-muted hidden sm:inline truncate max-w-[180px]">
              {adminEmail}
            </span>
            <span className="h-9 w-9 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold shadow-premium">
              {adminEmail?.[0]?.toUpperCase() ?? "A"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div key={location.pathname} className="animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
