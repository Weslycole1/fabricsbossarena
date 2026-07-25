import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AdminProduct } from "../../types/product";
import { deleteProduct, fetchAllProducts } from "../api/adminProducts";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../../hooks/useToast";

const AdminProductsList = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, search]);

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(pendingDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
      showToast(`"${pendingDelete.name}" deleted.`, "success");
      setPendingDelete(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete product.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Products</h1>
          <p className="text-sm text-[#6B5B4E] mt-1">
            {loading ? "Loading…" : `${filteredProducts.length} product(s)`}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#2C1810] hover:bg-[#3d2415] text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition"
        >
          ➕ Add Product
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-white border border-[#E8E0D5] rounded-xl px-4 py-2.5 focus:border-[#C9974A] focus:ring-1 focus:ring-[#C9974A] outline-none text-sm text-[#1A1A1A]"
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7F2] text-left text-xs uppercase tracking-wide text-[#6B5B4E]">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 font-semibold">Availability</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6B5B4E]">
                    Loading products…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6B5B4E]">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.img_url || "/vite.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8E0D5] flex-shrink-0"
                        />
                        <span className="font-medium text-[#2C1810] line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B5B4E] capitalize">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#2C1810]">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[#6B5B4E]">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3">
                      {product.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#C9974A]/10 text-[#C9974A]">
                          ⭐ Featured
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B5B4E]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.is_available ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E8E0D5] text-[#2C1810] hover:bg-[#FAF7F2] transition"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(product)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
