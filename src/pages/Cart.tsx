import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import OrderSummaryModal from "../components/OrderSummaryModal";
import { supabase } from "../lib/supabase";

interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlistLength?: number;
}

const Cart = ({ cart, setCart, wishlistLength = 0 }: CartProps) => {
  const { t } = useTheme();
  const { showToast } = useToast();
  const [showOrderModal, setShowOrderModal] = useState(false);

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart", "info");
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const orderRef = useMemo(
    () => `FBA-${Math.floor(100000 + Math.random() * 900000)}`,
    [showOrderModal]
  );

  const handleConfirmCheckout = async () => {
    const itemsLine = cart
      .map((item) => `• ${item.name} x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`)
      .join("\n");
    const cleanMessage = `Hello FabricsBossArena! 👋\n\n*New Order — Ref: ${orderRef}*\n\n*Items:*\n${itemsLine}\n\n*Total: ₦${totalAmount.toLocaleString()}*\n\nPlease confirm availability and delivery details. Thank you!`;
    const whatsappUrl = `https://wa.me/2348034401331?text=${encodeURIComponent(cleanMessage)}`;

    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await supabase.from("orders").insert({
        user_id: data.session.user.id,
        reference: orderRef,
        total: totalAmount,
        items: cart,
      });
    }

    showToast("Redirecting to WhatsApp... 💬", "success");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setShowOrderModal(false);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${t.pageBg}`}>
      <Navbar cartLength={cart.length} wishlistLength={wishlistLength} />

      <h2 className={`text-2xl sm:text-3xl font-bold px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 ${t.headingDark}`}>
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div
          className={`${t.cardBg} rounded-2xl p-12 shadow-sm border ${t.border} text-center max-w-md mx-auto mt-12 mx-4 sm:mx-auto`}
        >
          <p className="text-6xl mb-4">🛒</p>
          <h3 className={`text-2xl font-bold mb-2 ${t.headingDark}`}>
            Your cart is empty
          </h3>
          <p className={`${t.textSecondary} mb-6`}>
            Looks like you haven&apos;t added anything yet
          </p>
          <Link
            to="/home"
            className="inline-block bg-[#C9974A] text-white rounded-xl px-8 py-3 font-semibold hover:bg-[#b8863a] transition"
          >
            Browse Fabrics
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4 order-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`${t.cardBg} rounded-2xl p-4 flex gap-4 items-start shadow-sm border ${t.border}`}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 md:w-24 md:h-24 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-bold text-sm sm:text-base ${t.textPrimary}`}
                  >
                    {item.name}
                  </h4>
                  <p className={`${t.textSecondary} text-sm`}>
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => decreaseQty(item.id)}
                      className={t.qtyBtn}
                    >
                      -
                    </button>
                    <span className={`${t.textPrimary} font-medium text-sm`}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQty(item.id)}
                      className={t.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-6 mt-3">
                    <p
                      className={`font-bold text-sm sm:text-base ${t.textPrimary}`}
                    >
                      ₦{(item.price * item.qty).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-xs font-medium transition shrink-0 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-500 dark:hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`${t.cardBg} rounded-2xl p-5 sm:p-6 shadow-sm border ${t.border} lg:col-span-1 order-2 lg:order-0 lg:sticky lg:top-24 self-start w-full`}
          >
            <h3
              className={`font-bold text-base sm:text-lg mb-4 ${t.textPrimary}`}
            >
              Order Summary
            </h3>
            <p className={`${t.textSecondary} text-sm`}>
              Items: {cart.length}
            </p>

            <p className="text-xl sm:text-2xl font-bold text-[#C9974A] my-4">
              Grand Total: ₦{totalAmount.toLocaleString()}
            </p>

            <button
              type="button"
              onClick={() => setShowOrderModal(true)}
              className="block bg-[#25D366] hover:bg-[#1ebe5c] text-white font-bold py-3 rounded-xl w-full text-center transition text-sm sm:text-base"
            >
              Checkout on WhatsApp
            </button>
          </div>
        </div>
      )}

      <OrderSummaryModal
        isOpen={showOrderModal}
        orderRef={orderRef}
        items={cart}
        totalAmount={totalAmount}
        onClose={() => setShowOrderModal(false)}
        onConfirm={handleConfirmCheckout}
      />
    </div>
  );
};

export default Cart;
