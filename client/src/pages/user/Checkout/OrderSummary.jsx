// src/pages/user/Checkout/OrderSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";

const OrderSummary = ({ cartItems, address, paymentMethod }) => {
  const navigate = useNavigate();
  const { subtotal, grandTotal } = useCart();

  const handlePlaceOrder = () => {
    if (!address?.fullName || !address?.phone || !address?.street) {
      alert("Please fill your full shipping address.");
      return;
    }

    if (paymentMethod === "cod") {
      navigate("/order-success");
    } else {
      navigate("/order-fail");
    }
  };

  return (
    <div
      className="
        bg-white border border-[#e8e2d9] shadow-md rounded-2xl 
        p-6 sticky top-28 font-[Manrope]
      "
    >
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[#1a1a1a] tracking-wide mb-5">
        Order Summary
      </h2>

      {/* Items List */}
      <div className="space-y-3 pb-4 border-b border-[#e8e2d9] text-sm text-gray-700">
        {cartItems.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span className="w-9/12 leading-snug">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">
              ₹{(item.discountPrice * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="mt-5 space-y-3 text-gray-800 text-[15px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-[#eee] text-lg font-semibold">
          <span>Total</span>
          <span className="text-[#AD000F]">
            ₹{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handlePlaceOrder}
        className="
          w-full mt-7 py-3 rounded-xl tracking-wide
          bg-[#AD000F] text-white font-semibold 
          hover:bg-[#8C000C] transition-all duration-200
        "
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
