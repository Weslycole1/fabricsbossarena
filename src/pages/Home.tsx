import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";

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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
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
  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        cartLength={cart.length}
        wishlistLength={wishlist.length}
      />

      {/* New Arrivals Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-[#2C1810] to-[#C9974A] px-6 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="text-center md:text-left">
            <p className="text-[#C9974A] text-xs font-bold tracking-widest mb-2">
              NEW ARRIVALS
            </p>
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">
              Discover Our Latest Fabrics
            </h2>
            <p className="text-white/70 text-sm mb-4 max-w-md">
              Fresh drops every week — from Ankara to premium Silk
            </p>
            <Link
              to="/home"
              className="inline-block bg-white text-[#2C1810] font-bold rounded-full px-6 py-2.5 hover:bg-[#FAF7F2] transition text-sm"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex items-center pl-3">
            {newArrivals.map((p, i) => (
              <img
                key={p.id}
                src={p.img}
                alt={p.name}
                className={`w-12 h-12 rounded-full border-2 border-white object-cover ${i > 0 ? "-ml-3" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      <FilterBar
        setSearch={setSearch}
        setCategory={setCategory}
        setSort={setSort}
        cartLength={cart.length}
      />

      {!loading && filteredProducts.length === 0 && (
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
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
