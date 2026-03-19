import "./cart.css";
import Navbar from "../components/Navbar";

const Cart = ({ cart, setCart }) => {
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const whatsappMessage = encodeURIComponent(
    cart
      .map(
        (item) =>
          `${item.name} × ${item.qty} = ₦${(
            item.price * item.qty
          ).toLocaleString()}`
      )
      .join("\n") + `\n\nTotal = ₦${totalAmount.toLocaleString()}`
  );

  return (
    <div className="cart-page">
      <Navbar />
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.img} alt={item.name} />

                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p className="price">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <div className="item-footer">
                    <p className="item-total">
                      ₦{(item.price * item.qty).toLocaleString()}
                    </p>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Items: {cart.length}</p>

            <h3 className="grand-total">
              Grand Total: ₦{totalAmount.toLocaleString()}
            </h3>

          
            <a
              className="checkout-btn"
              href={`https://wa.me/2348034401331?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Checkout on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;