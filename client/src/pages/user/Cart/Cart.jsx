/* src/pages/user/Cart/Cart.jsx */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import { toast } from "react-toastify";
import SeoData from "../../../SEO/SeoData";

const Cart = () => {
  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    grandTotal = 0,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  /* Disable Body Scroll When Cart Open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  /* Close on ESC key */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && navigate(-1);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  const handleIncrease = (item) => {
    updateQuantity(item.key, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      toast.info(`${item.name} removed`);
      removeFromCart(item.key);
    } else {
      updateQuantity(item.key, item.quantity - 1);
    }
  };

  return (
    <>
      <SeoData title="Cart" />

      {/* ---------- OVERLAY ---------- */}
      <div
        onClick={() => navigate(-1)}
        className="
          fixed inset-0 bg-black/55 backdrop-blur-[1px]
          z-[9998]
        "
      />

      {/* ---------- SLIDE CART ---------- */}
      <div
        className="
          fixed top-0 right-0 h-full w-[420px] max-w-[95vw]
          bg-white shadow-2xl z-[9999]
          animate-slideLeft flex flex-col font-[Manrope]
        "
      >
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-xl font-semibold tracking-wide">
            Cart <span className="text-sm font-light">({cartItems.length})</span>
          </h2>

          <button
            onClick={() => navigate(-1)}
            aria-label="Close Cart"
            className="text-gray-600 hover:text-black text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* ---------- ITEMS ---------- */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-7">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.key} className="flex justify-between gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-md border"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.size && (
                    <p className="text-sm text-gray-500">{item.size}</p>
                  )}

                  <p className="mt-1 font-semibold">
                    ₹{(item.discountPrice || item.price).toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleDecrease(item)}
                      className="w-7 h-7 border flex items-center justify-center"
                    >
                      −
                    </button>

                    <span className="text-sm">{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-7 h-7 border flex items-center justify-center"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-gray-500 hover:text-red-600 ml-4"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---------- FOOTER ---------- */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t bg-white">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <span>Tax (Included)</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold border-t pt-3 mt-3">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="
                w-full mt-5 py-4 rounded-md
                bg-[#4a0b0b] hover:bg-black
                text-white font-semibold tracking-wide
              "
            >
              Check out
            </button>
          </div>
        )}
      </div>

      {/* ---------- ANIMATION ---------- */}
      <style>
        {`
          @keyframes slideLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slideLeft {
            animation: slideLeft .32s ease-out forwards;
          }
        `}
      </style>
    </>
  );
};

export default Cart;
