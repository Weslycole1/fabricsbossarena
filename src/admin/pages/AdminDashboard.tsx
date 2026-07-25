import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Layers, Package, PlusCircle, Sparkles, Store, ArrowUpRight } from "lucide-react";
import type { AdminProduct } from "../../types/product";
import { fetchDashboardStats } from "../api/adminProducts";
import Card from "../components/ui/Card";
import { Skeleton, SkeletonCircle, SkeletonText } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const CHART_COLORS = ["#C9974A", "#2C1810", "#E4C284", "#8A6A45", "#D9C4A5", "#6B5B4E"];

const StatCard = ({
  icon: Icon,
  label,
  value,
  loading,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: number | string;
  loading: boolean;
  hint?: string;
}) => (
  <Card hoverable className="p-5 sm:p-6 flex items-center gap-4">
    <span className="h-12 w-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
      <Icon size={22} strokeWidth={2} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-brand-muted uppercase tracking-wide">
        {label}
      </p>
      {loading ? (
        <Skeleton className="h-7 w-16 mt-1.5" />
      ) : (
        <p className="text-2xl font-display font-semibold text-brand-ink leading-tight">
          {value}
        </p>
      )}
      {hint && !loading && (
        <p className="text-xs text-brand-muted mt-0.5">{hint}</p>
      )}
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentProducts, setRecentProducts] = useState<AdminProduct[]>([]);
  const [allProducts, setAllProducts] = useState<AdminProduct[]>([]);

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
        setAllProducts(stats.allProducts);
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

  const featuredCount = allProducts.filter((p) => p.featured).length;

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    allProducts.forEach((p) => {
      const key = p.category || "Uncategorized";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [allProducts]);

  const stockChartData = useMemo(
    () =>
      allProducts
        .slice(0, 8)
        .slice()
        .reverse()
        .map((p) => ({
          name: p.name.length > 12 ? `${p.name.slice(0, 12)}…` : p.name,
          stock: p.stock,
        })),
    [allProducts]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-display font-semibold text-brand-ink">
            Dashboard
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            An overview of your store's catalog and performance.
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary" size="md">
            <PlusCircle size={17} />
            Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fadeIn">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Package} label="Total Products" value={totalProducts} loading={loading} />
        <StatCard icon={Layers} label="Total Categories" value={totalCategories} loading={loading} />
        <StatCard
          icon={Sparkles}
          label="Featured Products"
          value={featuredCount}
          loading={loading}
          hint={`of ${totalProducts} total`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold text-brand-ink text-lg">
                Stock Levels
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Inventory for your most recently added products
              </p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : stockChartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-brand-muted">
              No stock data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={224}>
              <BarChart data={stockChartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6B5B4E" }}
                  axisLine={{ stroke: "#E8E0D5" }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: "#6B5B4E" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#FAF7F2" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8E0D5",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="stock" fill="#C9974A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-brand-ink text-lg mb-1">
            Category Mix
          </h2>
          <p className="text-xs text-brand-muted mb-4">Recent product categories</p>

          {loading ? (
            <div className="flex items-center justify-center h-44">
              <SkeletonCircle className="h-32 w-32" />
            </div>
          ) : categoryBreakdown.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm text-brand-muted">
              No category data yet.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E8E0D5", fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-3 space-y-1.5">
                {categoryBreakdown.map((entry, index) => (
                  <li key={entry.name} className="flex items-center gap-2 text-xs text-brand-muted">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="capitalize truncate flex-1">{entry.name}</span>
                    <span className="font-medium text-brand-ink">{entry.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-border">
            <h2 className="font-display font-semibold text-brand-ink text-lg">
              Recent Products
            </h2>
            <Link
              to="/admin/products"
              className="text-sm text-brand-gold hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <ul className="divide-y divide-brand-border">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="flex items-center gap-4 py-3.5">
                  <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonText className="w-1/3" />
                    <SkeletonText className="w-1/4" />
                  </div>
                  <SkeletonText className="w-16" />
                </li>
              ))}
            </ul>
          ) : recentProducts.length === 0 ? (
            <EmptyState
              icon="🧵"
              title="No products yet"
              description="Add your first product to start building your catalog."
              action={
                <Link to="/admin/products/new">
                  <Button variant="primary" size="sm">
                    <PlusCircle size={15} />
                    Add Product
                  </Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-brand-border">
              {recentProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-4 py-3.5 group"
                >
                  <img
                    src={product.img_url || "/vite.svg"}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover bg-brand-bg border border-brand-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-ink truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-muted capitalize">
                      {product.category} • Stock: {product.stock}
                    </p>
                  </div>
                  {product.featured && <Badge variant="gold">Featured</Badge>}
                  <div className="text-right">
                    <p className="font-semibold text-brand-ink">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity hover:underline focus-visible:opacity-100"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-semibold text-brand-ink text-lg mb-4 pb-4 border-b border-brand-border">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2.5">
            <Link to="/admin/products/new">
              <Button variant="primary" size="md" fullWidth className="justify-start">
                <PlusCircle size={17} />
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Package size={17} />
                Manage Products
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Store size={17} />
                View Store
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
