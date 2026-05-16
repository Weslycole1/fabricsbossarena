import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";
import type { Product } from "../types/product";

interface ProductsProps {
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (product: Product) => void;
}

const Products = ({ wishlist, toggleWishlist, addToCart }: ProductsProps) => {
  const { t } = useTheme();

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg} px-4 sm:px-6 lg:px-8 py-8`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${t.textPrimary}`}>Our Fabrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
