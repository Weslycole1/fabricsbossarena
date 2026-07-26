import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useInView } from "../hooks/useInView";
import type { Product, DbProduct } from "../types/product";
import { supabase } from "../lib/supabase";
import { mapDbProduct } from "../utils/mapProduct";
import { resolveImageUrl } from "../data/imageMap";
import fabricImage from "../assets/Untitled-design-42-2.png";

const TAG_FILTERS = ["exclusive", "luxury", "budget", "trending"];

interface HomeProps {
  cart: (Product & { qty: number })[];
  setCart: React.Dispatch<React.SetStateAction<(Product & { qty: number })[]>>;
  addToCart: (product: Product, quantity?: number) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

const Home = ({ cart, addToCart, wishlist, toggleWishlist }: HomeProps) => {
  const navigate = useNavigate();
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

      const mappedProducts: Product[] = ((data ?? []) as DbProduct[]).map(mapDbProduct);

      setProducts(mappedProducts);
      setLoading(false);
    };

    void fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

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

  const newArrivals = products.slice(0, 3);
  const { ref: bannerRef, isInView: bannerInView } = useInView<HTMLDivElement>();
  const { ref: gridRef, isInView: gridInView } = useInView<HTMLDivElement>(0.05);

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        cartLength={cart.length}
        wishlistLength={wishlist.length}
      />

      <section
        className="relative h-[55vh] md:h-[75vh] bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: `url(${fabricImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/85 via-[#2C1810]/65 to-[#2C1810]/90" />
        <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <p className="text-[#C9974A] tracking-[0.25em] uppercase text-xs sm:text-sm font-semibold">
            Premium Fabrics &amp; Fashion Supplies
          </p>
          <h1 className="text-white font-display text-4xl sm:text-5xl md:text-6xl font-semibold mt-5 leading-[1.1] max-w-3xl">
            Discover Fabrics That Tell Your Story
          </h1>
          <p className="text-white/75 mt-5 text-sm sm:text-base max-w-2xl leading-relaxed">
            Premium fabrics, wool, and tailoring supplies delivered to your door.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <button
              type="button"
              onClick={() =>
                document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-[#C9974A] text-white rounded-full px-8 py-3 font-bold shadow-[0_8px_24px_-8px_rgba(201,151,74,0.6)] hover:bg-[#b8863a] hover:shadow-[0_12px_32px_-8px_rgba(201,151,74,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Shop Now
            </button>
            <Link
              to="/about"
              className="border border-white/70 text-white rounded-full px-8 py-3 font-bold hover:bg-white hover:text-[#2C1810] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl mx-auto">
        <div
          ref={bannerRef}
          className={`rounded-2xl bg-gradient-to-r from-[#2C1810] to-[#C9974A] px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden shadow-[0_20px_45px_-15px_rgba(44,24,16,0.35)] transition-all duration-700 ${
            bannerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="text-center md:text-left">
            <p className="text-white/80 text-xs font-bold tracking-[0.2em] mb-2">
              FEATURED COLLECTION
            </p>
            <h2 className="text-white font-display text-2xl sm:text-3xl font-semibold mb-2.5 leading-snug">
              Discover Our Latest Fabrics
            </h2>
            <p className="text-white/70 text-sm mb-5 max-w-md leading-relaxed">
              Fresh drops every week — from Ankara to premium Silk
            </p>
            <Link
              to="/home"
              className="inline-block bg-white text-[#2C1810] font-bold rounded-full px-6 py-2.5 hover:bg-[#FAF7F2] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 text-sm"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex items-center pl-3">
            {newArrivals.map((p, i) => (
              <img
                key={p.id}
                src={resolveImageUrl(p.img_url)}
                alt={p.name}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white object-cover shadow-md ${i > 0 ? "-ml-3" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <FilterBar
        setSearch={setSearch}
        setCategory={setCategory}
        setSort={setSort}
      />

      {loading && (
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner label="Loading fabrics..." />
        </div>
      )}

      {!loading && !fetchError && products.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-5xl mb-4">🧵</p>
          <p className={`${t.textSecondary} text-base sm:text-lg`}>
            No products available yet. Check back soon!
          </p>
        </div>
      )}

      {!loading && !fetchError && products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-12 px-4">
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

      {!loading && fetchError && (
        <div className="text-center py-6 px-4">
          <p className="text-red-500 text-sm sm:text-base">
            Failed to load products: {fetchError}
          </p>
        </div>
      )}

      <section
        id="products-grid"
        ref={gridRef}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl mx-auto transition-opacity duration-700 ${
          gridInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
