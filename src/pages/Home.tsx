import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";

const TAG_FILTERS = ["exclusive", "luxury", "budget", "trending"];

interface HomeProps {
  cart: (Product & { qty: number })[];
  setCart: React.Dispatch<React.SetStateAction<(Product & { qty: number })[]>>;
  addToCart: (product: Product) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

const Home = ({ cart, addToCart, wishlist, toggleWishlist }: HomeProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

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

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        cartLength={cart.length}
        wishlistLength={wishlist.length}
      />

      <FilterBar
        setSearch={setSearch}
        setCategory={setCategory}
        setSort={setSort}
        cartLength={cart.length}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <p className={`text-center py-12 px-4 ${t.textSecondary}`}>
          No fabrics match your search.
        </p>
      )}

      <Footer />
    </div>
  );
};

export default Home;
