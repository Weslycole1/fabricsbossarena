import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface OrderSummaryModalProps {
  isOpen: boolean;
  orderRef: string;
  items: OrderItem[];
  totalAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

const OrderSummaryModal = ({
  isOpen,
  orderRef,
  items,
  totalAmount,
  onClose,
  onConfirm,
}: OrderSummaryModalProps) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnimateIn(false);
      return;
    }
    const frame = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-200 ${
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B5B4E] hover:text-[#2C1810] text-xl leading-none"
          aria-label="Close order summary"
        >
          ×
        </button>

        <h3 className="text-2xl font-bold text-[#2C1810]">Review Your Order</h3>
        <p className="text-sm text-[#6B5B4E] mt-1">Please confirm your items before checkout.</p>

        <div className="mt-4 bg-[#C9974A]/10 text-[#C9974A] rounded-xl p-3 text-center font-bold text-lg">
          {orderRef}
        </div>
        <p className="text-xs text-[#6B5B4E] mt-2 text-center">
          Screenshot or note your order reference: {orderRef}
        </p>

        <div className="mt-5 space-y-3 max-h-52 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-[#FAF7F2] rounded-xl p-2.5">
              <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2C1810] truncate">{item.name}</p>
                <p className="text-xs text-[#6B5B4E]">Qty: {item.qty}</p>
              </div>
              <p className="text-sm font-bold text-[#2C1810]">
                ₦{(item.price * item.qty).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-[#E8E0D5] pt-4">
          <div className="flex justify-between text-sm text-[#6B5B4E]">
            <span>Subtotal</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-[#6B5B4E] mt-2">Delivery fee to be confirmed by seller</p>
          <div className="flex justify-between items-end mt-3">
            <span className="text-sm text-[#6B5B4E]">Total</span>
            <span className="text-2xl font-bold text-[#C9974A]">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 bg-[#25D366] text-white rounded-xl w-full py-3 font-bold hover:bg-[#1ebe5c] transition"
        >
          Confirm & WhatsApp
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 border border-[#E8E0D5] text-[#2C1810] rounded-xl w-full py-3 font-semibold hover:bg-[#FAF7F2] transition"
        >
          Edit Cart
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
