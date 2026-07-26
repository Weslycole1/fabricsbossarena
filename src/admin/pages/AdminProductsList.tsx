import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { AdminProduct } from "../../types/product";
import { deleteProduct, fetchAllProducts } from "../api/adminProducts";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton, SkeletonText } from "../components/ui/Skeleton";

type SortKey = "name" | "price" | "stock";
type SortDirection = "asc" | "desc";
type AvailabilityFilter = "all" | "available" | "unavailable";
type FeaturedFilter = "all" | "featured" | "standard";

const SORT_LABELS: Record<SortKey, string> = {
  name: "Name",
  price: "Price",
  stock: "Stock",
};

const AdminProductsList = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && p.is_available) ||
        (availabilityFilter === "unavailable" && !p.is_available);
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && p.featured) ||
        (featuredFilter === "standard" && !p.featured);

      return matchesQuery && matchesCategory && matchesAvailability && matchesFeatured;
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortKey === "name") comparison = a.name.localeCompare(b.name);
      else if (sortKey === "price") comparison = a.price - b.price;
      else comparison = a.stock - b.stock;
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [products, search, categoryFilter, availabilityFilter, featuredFilter, sortKey, sortDirection]);

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "all" ||
    availabilityFilter !== "all" ||
    featuredFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setFeaturedFilter("all");
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown size={13} className="text-brand-muted/50" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={13} className="text-brand-gold" />
    ) : (
      <ArrowDown size={13} className="text-brand-gold" />
    );
  };

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(pendingDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      showToast(`"${pendingDelete.name}" deleted.`, "success");
      setPendingDelete(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete product.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-brand-ink">Products</h1>
          <p className="text-sm text-brand-muted mt-1">
            {loading ? "Loading…" : `${filteredProducts.length} of ${products.length} product(s)`}
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button variant="primary" size="md">
            <PlusCircle size={17} />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="p-4 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              type="text"
              placeholder="Search by name or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none transition-shadow"
              aria-label="Search products"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 lg:flex lg:gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none capitalize"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none"
              aria-label="Filter by availability"
            >
              <option value="all">All availability</option>
              <option value="available">In stock</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as FeaturedFilter)}
              className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 outline-none"
              aria-label="Filter by featured status"
            >
              <option value="all">All products</option>
              <option value="featured">Featured only</option>
              <option value="standard">Standard only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-muted hover:text-brand-ink px-2 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fadeIn">
          {error}
        </p>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-bg text-left text-xs uppercase tracking-wide text-brand-muted">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                {(["price", "stock"] as SortKey[]).map((key) => (
                  <th key={key} className="px-4 py-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      className="inline-flex items-center gap-1 hover:text-brand-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
                    >
                      {SORT_LABELS[key]}
                      <SortIcon column={key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Availability</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                        <SkeletonText className="w-32" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><SkeletonText className="w-20" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-14" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-10" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16" /></td>
                    <td className="px-4 py-3"><SkeletonText className="w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon="🔍"
                      title={products.length === 0 ? "No products yet" : "No matches found"}
                      description={
                        products.length === 0
                          ? "Add your first product to start building your catalog."
                          : "Try adjusting your search or filters."
                      }
                      action={
                        products.length === 0 ? (
                          <Link to="/admin/products/new">
                            <Button variant="primary" size="sm">
                              <PlusCircle size={15} />
                              Add Product
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={clearFilters}>
                            Clear filters
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-brand-bg/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.img_url || "/favicon.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-brand-bg border border-brand-border flex-shrink-0"
                        />
                        <span className="font-medium text-brand-ink line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted capitalize">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-ink whitespace-nowrap">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{product.stock}</td>
                    <td className="px-4 py-3">
                      {product.featured ? (
                        <Badge variant="gold">Featured</Badge>
                      ) : (
                        <span className="text-xs text-brand-muted/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.is_available ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="danger">Unavailable</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          aria-label={`Edit ${product.name}`}
                          className="p-2 rounded-lg border border-brand-border text-brand-ink hover:bg-brand-bg hover:border-brand-gold/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => setPendingDelete(product)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product"
        description={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminProductsList;
