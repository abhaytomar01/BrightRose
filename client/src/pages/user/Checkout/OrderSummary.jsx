// src/pages/user/Checkout/OrderSummary.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/cart";

const OrderSummary = ({ cartItems, address, paymentMethod }) => {
  const navigate = useNavigate();
  const { subtotal, grandTotal } = useCart();

  const handlePlaceOrder = () => {
    if (!address?.fullName || !address?.phone || !address?.street) {
      alert("Please fill your shipping address before placing order.");
      return;
    }

    if (paymentMethod === "cod") {
      navigate("/order-success");
    } else {
      navigate("/order-fail");
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-md border p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm text-gray-600 border-b pb-4">
        {cartItems.map((item) => (
          <div key={item.key} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.discountPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
