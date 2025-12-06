/* src/pages/user/Cart/Cart.jsx */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import CartItem from "./CartItem";
import SaveForLater from "./SaveForLater";
import ScrollToTopOnRouteChange from "../../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../../SEO/SeoData";

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

      <main className="w-full bg-[#FAF9F7] min-h-screen pt-28 md:pt-40 pb-20 px-4 font-[Manrope]">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-10">

          {/* LEFT SECTION */}
          <div className="flex-1 space-y-10">

            {/* CART BOX */}
            <div className="
              bg-white/90 backdrop-blur-sm border border-[#E7E2DC] 
              rounded-3xl shadow-[0_3px_15px_rgba(0,0,0,0.06)]
              transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
            ">
              <div className="px-8 py-6 border-b border-[#E7E2DC] flex items-center justify-between">
                <h2 className="text-[26px] font-light tracking-wide text-[#1A1A1A]">
                  My Cart
                </h2>
                <span className="text-sm text-neutral-500 tracking-wide">
                  {totalItems} items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 text-lg">
                  Your cart is empty.
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {cartItems.map((item) => (
                    <CartItem key={item.key} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* SAVE FOR LATER BOX */}
            <div className="
              bg-white/90 backdrop-blur-sm border border-[#E7E2DC] 
              rounded-3xl shadow-[0_3px_15px_rgba(0,0,0,0.06)]
              transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
            ">
              <div className="px-8 py-6 border-b border-[#E7E2DC]">
                <h2 className="text-[20px] tracking-wide text-[#1A1A1A] font-light">
                  Saved for Later ({saveLaterItems.length})
                </h2>
              </div>

              <div className="p-8 space-y-6">
                {saveLaterItems.length === 0 ? (
                  <p className="text-neutral-500 text-sm">No items saved.</p>
                ) : (
                  saveLaterItems.map((it) => (
                    <div
                      key={it.key}
                      className="
                      flex justify-between items-center p-4 
                      border border-[#E7E2DC] rounded-2xl bg-[#FBFAF9]
                      hover:shadow-[0_3px_10px_rgba(0,0,0,0.05)] transition-all
                    "
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={it.image || "/placeholder.png"}
                          alt={it.name}
                          className="w-20 h-20 rounded-xl border border-[#E6DFD4] object-cover"
                        />
                        <div>
                          <div className="text-lg tracking-wide text-[#1A1A1A] font-light">
                            {it.name}
                          </div>
                          <div className="text-sm text-neutral-600">
                            ₹{(it.discountPrice ?? it.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => moveToCartFromSaveLater(it.key)}
                        className="
                        px-5 py-2 rounded-lg text-white
                        bg-black/90 hover:bg-black 
                        text-sm tracking-wide transition
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

          {/* RIGHT PRICE DETAILS */}
          <div className="w-full sm:w-1/3">
            <div className="
              sticky top-36 bg-white/90 backdrop-blur-sm p-10 
              border border-[#E7E2DC] rounded-3xl
              shadow-[0_3px_15px_rgba(0,0,0,0.06)]
              hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition
            ">
              <h3 className="text-[24px] font-light text-[#1A1A1A] tracking-wide mb-8">
                Price Details
              </h3>

              <div className="space-y-4 text-neutral-700">

                <div className="flex justify-between text-sm">
                  <span className="tracking-wide">Price ({totalItems} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="tracking-wide">Delivery Charges</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="tracking-wide">Tax</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>

                <div className="my-4 border-t border-[#E7E2DC]"></div>

                <div className="flex justify-between text-lg font-semibold text-[#1A1A1A] tracking-wide">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* PLACE ORDER */}
              {cartItems.length > 0 && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="
                    mt-8 w-full py-4 rounded-xl 
                    text-white text-lg font-medium tracking-wide
                    bg-black/90 hover:bg-black 
                    shadow-sm transition-all
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
