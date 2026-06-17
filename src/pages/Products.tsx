import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";
import { supabase } from "../lib/supabase";
import { mapDbProduct } from "../utils/mapProduct";
import type { DbProduct } from "../types/product";

const TAG_FILTERS = ["exclusive", "luxury", "budget", "trending"];

interface ProductsProps {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  cartLength?: number;
}

const Products = ({
  wishlist,
  toggleWishlist,
  addToCart,
  cartLength = 0,
}: ProductsProps) => {
  const { t } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");
      const { data, error } = await supabase.from("products").select("*");

      if (!mounted) return;

      if (error) {
        setFetchError(error.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(((data ?? []) as DbProduct[]).map(mapDbProduct));
      setLoading(false);
    };

    void fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (category === "all") return true;
      if (TAG_FILTERS.includes(category)) return p.tag === category;
      return p.category === category;
    })
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      if (sort === "newest") return b.id - a.id;
      if (sort === "oldest") return a.id - b.id;
      return 0;
    });

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar cartLength={cartLength} wishlistLength={wishlist.length} />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <h2 className={`text-xl sm:text-3xl font-bold mb-6 ${t.headingDark}`}>
          Our Fabrics
        </h2>

        <FilterBar
          setSearch={setSearch}
          setCategory={setCategory}
          setSort={setSort}
        />

        {loading && <LoadingSpinner label="Loading fabrics..." />}

        {!loading && fetchError && (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm sm:text-base">
              Failed to load products: {fetchError}
            </p>
          </div>
        )}

        {!loading && !fetchError && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🧵</p>
            <p className={`${t.textSecondary} text-base sm:text-lg`}>
              No products available yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !fetchError && products.length > 0 && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className={`${t.textSecondary} text-base sm:text-lg mb-4`}>
              No fabrics found for your search 😔
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("");
              }}
              className="border border-[#C9974A] text-[#C9974A] rounded-full px-6 py-2 hover:bg-[#C9974A] hover:text-white transition text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !fetchError && filteredProducts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
