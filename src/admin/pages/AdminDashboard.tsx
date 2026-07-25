import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AdminProduct } from "../../types/product";
import { fetchDashboardStats } from "../api/adminProducts";

const STAT_CARD_CLASS =
  "bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D5] flex items-center gap-4";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentProducts, setRecentProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const stats = await fetchDashboardStats();
        if (!mounted) return;
        setTotalProducts(stats.totalProducts);
        setTotalCategories(stats.totalCategories);
        setRecentProducts(stats.recentProducts);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2C1810]">Dashboard</h1>
        <p className="text-sm text-[#6B5B4E] mt-1">
          Overview of your store's catalog.
        </p>
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className={STAT_CARD_CLASS}>
          <span className="h-12 w-12 rounded-xl bg-[#C9974A]/10 flex items-center justify-center text-2xl">
            🧵
          </span>
          <div>
            <p className="text-xs text-[#6B5B4E] uppercase tracking-wide">
              Total Products
            </p>
            <p className="text-2xl font-bold text-[#2C1810]">
              {loading ? "…" : totalProducts}
            </p>
          </div>
        </div>

        <div className={STAT_CARD_CLASS}>
          <span className="h-12 w-12 rounded-xl bg-[#C9974A]/10 flex items-center justify-center text-2xl">
            🗂️
          </span>
          <div>
            <p className="text-xs text-[#6B5B4E] uppercase tracking-wide">
              Total Categories
            </p>
            <p className="text-2xl font-bold text-[#2C1810]">
              {loading ? "…" : totalCategories}
            </p>
          </div>
        </div>

        <div className={`${STAT_CARD_CLASS} sm:col-span-2 lg:col-span-1`}>
          <span className="h-12 w-12 rounded-xl bg-[#C9974A]/10 flex items-center justify-center text-2xl">
            ⭐
          </span>
          <div>
            <p className="text-xs text-[#6B5B4E] uppercase tracking-wide">
              Featured Products
            </p>
            <p className="text-2xl font-bold text-[#2C1810]">
              {loading ? "…" : recentProducts.filter((p) => p.featured).length}
              <span className="text-sm font-normal text-[#6B5B4E]">
                {" "}
                (of last {recentProducts.length})
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D5]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8E0D5]">
            <h2 className="text-lg font-bold text-[#2C1810]">
              Recent Products
            </h2>
            <Link
              to="/admin/products"
              className="text-sm text-[#C9974A] hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-[#6B5B4E] py-6 text-center">
              Loading…
            </p>
          ) : recentProducts.length === 0 ? (
            <p className="text-sm text-[#6B5B4E] py-6 text-center">
              No products yet. Add your first product to get started.
            </p>
          ) : (
            <ul className="divide-y divide-[#E8E0D5]">
              {recentProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 py-3"
                >
                  <img
                    src={product.img_url || "/vite.svg"}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8E0D5]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#2C1810] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#6B5B4E]">
                      {product.category} • Stock: {product.stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2C1810]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="text-xs text-[#C9974A] hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E0D5]">
          <h2 className="text-lg font-bold text-[#2C1810] mb-4 pb-2 border-b border-[#E8E0D5]">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2C1810] text-white text-sm font-medium hover:bg-[#3d2415] transition"
            >
              ➕ Add New Product
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E8E0D5] text-[#2C1810] text-sm font-medium hover:bg-[#FAF7F2] transition"
            >
              🧵 Manage Products
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E8E0D5] text-[#2C1810] text-sm font-medium hover:bg-[#FAF7F2] transition"
            >
              🏬 View Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
