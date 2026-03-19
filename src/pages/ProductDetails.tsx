import { useParams } from "react-router-dom";
import "./productdetails.css";

// images
import fabric1 from "../assets/Silk.jpeg";
import fabric2 from "../assets/Ankara.jpeg";
import fabric3 from "../assets/velvet.jpeg";

const products = [
  {
    id: 1,
    name: "Royal Silk",
    price: 25000,
    img: fabric1,
    desc: "Luxurious silk fabric with soft elegance for premium outfits.",
  },
  {
    id: 2,
    name: "Velvet Charm",
    price: 30000,
    img: fabric3,
    desc: "Premium velvet with a timeless shine — perfect for luxury wears.",
  },
  {
    id: 3,
    name: "Ankara Gold",
    price: 12500,
    img: fabric2,
    desc: "Vibrant African print with bold golden accents — bright and beautiful.",
  },
];

const ProductDetails = () => {
  const { id } = useParams();

  const product = products.find(
    (p) => p.id === Number(id)
  );

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="product-details-page">
      <div className="details-card">
        <div className="details-image">
          <img src={product.img} alt={product.name} />
        </div>

        <div className="details-info">
          <h1>{product.name}</h1>

          <p className="details-price">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="details-desc">
            {product.desc}
          </p>

          <div className="details-actions">
            <button className="add-to-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default ProductDetails;
