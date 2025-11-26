/* src/pages/user/Cart/Cart.jsx */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import CartItem from "./CartItem";
import SaveForLater from "./SaveForLater";
import ScrollToTopOnRouteChange from "../../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../../SEO/SeoData";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const Cart = () => {
  const {
    cartItems = [],
    saveLaterItems = [],
    subtotal = 0,
    shipping = 0,
    tax = 0,
    grandTotal = 0,
    totalItems = 0,
    moveToCartFromSaveLater,
  } = useCart();

  const navigate = useNavigate();

  return (
    <>
      <ScrollToTopOnRouteChange />
      <SeoData title="Shopping Cart | Bright Rose" />

      <main className="w-full bg-[#F8F6F3] min-h-screen pt-28 md:pt-40 pb-20 px-4">

        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-7xl mx-auto">

          {/* LEFT: Items */}
          <div className="flex-1 space-y-8">

            {/* My Cart */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-[#e8e2d9] flex items-center justify-between">
                <h2 className="text-2xl text-[#4a3b32]">My Cart</h2>
                <span className="text-sm text-gray-500">{totalItems} items</span>
              </div>

              {cartItems?.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-lg">
                  Your cart is empty.
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.key} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Saved for Later */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl shadow-sm">
              <div className="px-6 py-5 border-b border-[#e8e2d9]">
                <h2 className="text-xl text-[#4a3b32]">
                  Saved for Later ({saveLaterItems.length})
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {saveLaterItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items saved.</p>
                ) : (
                  saveLaterItems.map((it) => (
                    <div key={it.key} className="flex justify-between items-center p-3 border rounded-lg bg-[#FCFAF7] border-[#e8e2d9]">
                      <div className="flex items-center gap-4">
                        <img
                          src={it.image || "/placeholder.png"}
                          alt={it.name}
                          className="w-20 h-20 rounded-xl border border-[#e6dccf] object-cover"
                        />
                        <div>
                          <div className="text-lg font-medium text-[#4a3b32]">{it.name}</div>
                          <div className="text-sm text-gray-600">
                            ₹{(it.discountPrice ?? it.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => moveToCartFromSaveLater(it.key)}
                        className="
                          px-4 py-2 rounded-lg 
                          text-white bg-neutralDark/80 
                          hover:bg-neutralDark/90
                          text-sm transition
                        "
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Price Details */}
          <div className="w-full sm:w-1/3">
            <div className="bg-white border border-[#e8e2d9] p-8 rounded-2xl shadow-sm sticky top-32">

              <h3 className="text-2xl text-[#4a3b32] mb-6">Price Details</h3>

              <div className="space-y-4 text-gray-700">

                <div className="flex justify-between text-sm">
                  <span>Price ({totalItems} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Delivery Charges</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>

                <hr className="my-3 border-[#e8e2d9]" />

                <div className="flex justify-between text-lg font-semibold text-[#4a3b32]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {cartItems.length > 0 && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="
                    mt-6 w-full py-3 rounded-lg 
                    text-white font-medium text-lg
                    bg-neutralDark/80 hover:bg-neutralDark/90
                    transition-all shadow-sm
                  "
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;
