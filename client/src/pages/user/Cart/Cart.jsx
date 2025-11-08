/* src/pages/user/Cart/Cart.jsx */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";
import CartItem from "./CartItem";
import SaveForLater from "./SaveForLater";
import ScrollToTopOnRouteChange from "./../../../utils/ScrollToTopOnRouteChange";
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

  const publishKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY;
  const frontendURL = window.location.origin;

  const handlePayment = async () => {
    const stripe = await loadStripe(publishKey);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/create-checkout-session`,
        { products: cartItems, frontendURL, customerEmail: "" },
        { headers: { Authorization: "" } } // set auth if needed
      );
      const session = response.data.session;
      localStorage.setItem("sessionId", session.id);
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result?.error) console.error(result.error);
    } catch (err) {
      console.error("Stripe error:", err);
    }
  };

  return (
    <>
      <ScrollToTopOnRouteChange />
      <SeoData title="Shopping Cart | Bright Rose" />
      <main className="w-full pt-5">
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-11/12 mx-auto mt-24 sm:mt-32 md:mt-40">
          {/* Left column: items */}
          <div className="flex-1">
            <div className="flex flex-col shadow bg-white rounded-md">
              <div className="px-4 py-4 border-b flex items-center justify-between">
                <span className="font-medium text-lg">My Cart</span>
                <span className="text-sm text-gray-600">{totalItems} items</span>
              </div>

              {cartItems?.length === 0 ? (
                <div className="p-8 text-center text-gray-600">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <CartItem key={item.key} item={item} />
                ))
              )}
            </div>

            {/* Saved for later */}
            <div className="flex flex-col mt-6 shadow bg-white rounded-md p-2">
              <div className="px-4 py-4 border-b">
                <span className="font-medium text-lg">Saved For Later ({saveLaterItems?.length})</span>
              </div>
              <div className="p-4 space-y-3">
                {saveLaterItems?.length === 0 ? (
                  <div className="text-sm text-gray-500">No items saved.</div>
                ) : (
                  saveLaterItems.map((it) => (
                    <div key={it.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.image || "/placeholder.png"} className="w-16 h-16 object-cover rounded" alt={it.name} />
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm text-gray-500">₹{(it.discountPrice ?? it.price).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCartFromSaveLater(it.key)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right column: price card */}
          <div className="w-full sm:w-1/3">
            <div className="bg-white p-6 rounded-md shadow">
              <h3 className="text-lg font-semibold mb-4">Price Details</h3>

              <div className="flex justify-between text-gray-700 py-2">
                <span>Price ({totalItems} items)</span>
                <span>₹{Number(subtotal).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-700 py-2">
                <span>Delivery Charges</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between text-gray-700 py-2">
                <span>Tax</span>
                <span>₹{Number(tax).toLocaleString()}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹{Number(grandTotal).toLocaleString()}</span>
              </div>

              {cartItems.length > 0 && (
    <button
      onClick={() => navigate("/checkout")}
      className="`mt-4 w-full py-3 rounded text-white bg-green-500"
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
