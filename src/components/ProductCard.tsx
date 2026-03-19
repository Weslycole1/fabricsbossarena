import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();

  const message = `Hello, I am interested in buying *${product.name}* priced at ₦${product.price.toLocaleString()}. Is it available?`;

  const whatsappURL = `https://wa.me/2348034401331?text=${encodeURIComponent(
    message,
  )}`;

  const handleAddToCart = () => {
    if (!addToCart) {
      console.log("addToCart not passed");
      return;
    }

    addToCart(product);
  };

  return (
    <div className="product-card">
      <img
        src={product.img}
        alt={product.name}
        onClick={() => navigate(`/products/${product.id}`)}
        style={{ cursor: "pointer" }}
      />

      <h3>{product.name}</h3>
      <p className="price">₦{product.price.toLocaleString()}</p>
      <p className="desc">{product.desc}</p>

      <div className="buttons">
        <button className="cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button
          className="buy-btn"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          Buy Now
        </button>

        <a
          className="whatsapp-btn"
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp Seller
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
