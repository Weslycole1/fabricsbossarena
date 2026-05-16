import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";

interface WishlistProps {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  cartLength?: number;
}

const Wishlist = ({
  wishlist,
  toggleWishlist,
  addToCart,
  cartLength = 0,
}: WishlistProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar
        onLogout={handleLogout}
        wishlistLength={wishlist.length}
        cartLength={cartLength}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-6 ${t.headingDark}`}>
          My Wishlist
        </h1>

        {savedProducts.length === 0 ? (
          <div
            className={`${t.cardBg} rounded-2xl p-12 shadow-sm border ${t.border} text-center max-w-md mx-auto`}
          >
            <p className="text-6xl mb-4">❤️</p>
            <h3 className={`text-2xl font-bold mb-2 ${t.headingDark}`}>
              No saved items yet
            </h3>
            <p className={`${t.textSecondary} mb-6`}>
              Tap the heart on any fabric to save it here
            </p>
            <Link
              to="/home"
              className="inline-block bg-[#C9974A] hover:bg-[#b8863a] text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Explore Fabrics
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {savedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
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

export default Wishlist;
