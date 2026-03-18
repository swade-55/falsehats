import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, isCheckingOut, closeCart, removeItem, updateQuantity, checkout, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgb(221,221,221)]">
          <h2 className="text-sm tracking-[0.18em] uppercase font-semibold m-0">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="bg-transparent border-none p-0 hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-gray-500 uppercase tracking-[0.18em]">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="mt-6 bg-[rgb(28,28,28)] text-white px-8 py-3 text-xs tracking-[0.18em] uppercase border-none hover:bg-[rgb(50,50,50)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xs tracking-[0.18em] uppercase font-semibold m-0">
                      {item.product.name}
                    </h3>
                    <p className="text-sm mt-1">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="bg-transparent border border-[rgb(221,221,221)] w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="bg-transparent border border-[rgb(221,221,221)] w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="bg-transparent border-none p-0 ml-auto text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[rgb(221,221,221)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-[0.18em] uppercase font-semibold">Subtotal</span>
              <span className="text-sm font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Shipping & taxes calculated at checkout</p>
            <button
              onClick={checkout}
              disabled={isCheckingOut}
              className="w-full bg-[rgb(28,28,28)] text-white py-4 text-xs tracking-[0.18em] uppercase border-none hover:bg-[rgb(50,50,50)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Redirecting...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
