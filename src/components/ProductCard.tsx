import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product, quantity?: number) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
}

const ProductCard = ({
  product,
  addToCart,
  wishlist,
  toggleWishlist,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { showToast } = useToast();
  const isWishlisted = wishlist.includes(product.id);

  const message = `Hello, I am interested in buying *${product.name}* priced at ₦${product.price.toLocaleString()}. Is it available?`;
  const whatsappURL = `https://wa.me/2348034401331?text=${encodeURIComponent(message)}`;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      toggleWishlist(product.id);
      showToast("Removed from wishlist", "info");
    } else {
      toggleWishlist(product.id);
      showToast("Saved to wishlist ❤️", "success");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast("Added to cart! 🛒", "success");
  };

  return (
    <div
      className={`${t.cardBg} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col border ${t.border} h-full group`}
    >
      <div
        className="relative overflow-hidden h-52 cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.img}
          alt={product.name}
          className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center hover:scale-110 transition cursor-pointer shadow-sm text-base z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        <span className="absolute top-3 right-3 bg-[#C9974A] text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
          {product.tag}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className={`text-lg font-bold line-clamp-1 ${t.textPrimary}`}>
          {product.name}
        </h3>
        <p className="text-[#C9974A] font-bold text-base">
          ₦{product.price.toLocaleString()}
        </p>
        <p className={`text-sm line-clamp-2 ${t.textSecondary}`}>
          {product.desc}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-semibold py-2.5 rounded-xl transition w-full text-sm sm:text-base"
          >
            Add to Cart
          </button>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold py-2.5 rounded-xl transition w-full text-center text-sm sm:text-base"
          >
            WhatsApp Seller
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
