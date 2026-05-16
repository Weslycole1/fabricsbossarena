import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useTheme } from "../context/ThemeContext";

const Products = () => {
  const { t } = useTheme();

  return (
    <div className={`min-h-screen ${t.pageBg} px-4 sm:px-6 py-8`}>
      <h2 className={`text-2xl font-bold mb-6 ${t.textPrimary}`}>Our Fabrics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
