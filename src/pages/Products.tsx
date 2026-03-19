import ProductCard from "../components/ProductCard";

// images
import fabric1 from "../assets/Silk.jpeg";
import fabric2 from "../assets/Ankara.jpeg";
import fabric3 from "../assets/velvet.jpeg";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;
  desc: string;
};

const Products = () => {
  const products: Product[] = [
    {
      id: 1,
      name: "Royal Silk",
      price: 25000,
      category: "silk",
      img: fabric1,
      desc: "Luxurious silk fabric with soft elegance for premium outfits.",
    },
    {
      id: 2,
      name: "Velvet Charm",
      price: 30000,
      category: "velvet",
      img: fabric3,
      desc: "Premium velvet with a timeless shine — perfect for luxury wears.",
    },
    {
      id: 3,
      name: "Ankara Gold",
      price: 12500,
      category: "ankara",
      img: fabric2,
      desc: "Vibrant African print with bold golden accents — bright and beautiful.",
    },
  ];

  return (
    <div className="products-page">
      <h2>Our Fabrics</h2>

      <div className="product-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={()=> {}} />
        ))}
      </div>
    </div>
  );
};

export default Products;

