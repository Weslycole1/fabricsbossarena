import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";

interface ProductDetailsProps {
  addToCart: (product: Product) => void;
}

const ProductDetails = ({ addToCart }: ProductDetailsProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTheme();

  const product = products.find((p) => p.id === Number(id));

  const message = product
    ? `Hello, I am interested in buying *${product.name}* priced at ₦${product.price.toLocaleString()}. Is it available?`
    : "";
  const whatsappURL = `https://wa.me/2348034401331?text=${encodeURIComponent(message)}`;

  const backButton = (
    <button
      type="button"
      onClick={() => navigate("/home")}
      className={`${t.backBtn} mx-4 sm:mx-6 mt-4`}
    >
      ← Back to Shop
    </button>
  );

  if (!product) {
    return (
      <div className={`min-h-screen ${t.pageBg}`}>
        <Navbar />
        {backButton}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className={t.textSecondary}>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${t.pageBg}`}>
      <Navbar />
      {backButton}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <img
          src={product.img}
          alt={product.name}
          className="rounded-2xl overflow-hidden shadow-md w-full h-72 sm:h-80 md:h-96 object-cover"
        />

        <div>
          <span className="bg-[#C9974A]/10 text-[#C9974A] text-xs font-bold px-3 py-1 rounded-full capitalize inline-block mb-3">
            {product.tag}
          </span>

          <h1
            className={`text-2xl sm:text-3xl font-bold mb-2 ${t.textPrimary}`}
          >
            {product.name}
          </h1>

          <p className="text-[#C9974A] text-xl sm:text-2xl font-bold mb-4">
            ₦{product.price.toLocaleString()}
          </p>

          <hr className={`border-t ${t.border} my-4`} />

          <p
            className={`${t.textSecondary} leading-relaxed mb-6 text-sm sm:text-base`}
          >
            {product.desc}
          </p>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="bg-[#C9974A] hover:bg-[#b8863a] text-white font-bold py-3 rounded-xl w-full transition mb-3 text-sm sm:text-base"
          >
            Add to Cart
          </button>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold py-3 rounded-xl w-full transition text-center text-sm sm:text-base"
          >
            WhatsApp Seller
          </a>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
