// src/pages/user/Checkout/PaymentMethod.jsx
import React, { useState } from "react";

const PaymentMethod = ({ setPaymentMethod }) => {
  const [selected, setSelected] = useState("cod");

  const handleSelect = (method) => {
    setSelected(method);
    setPaymentMethod(method);
  };

  return (
    <div className="bg-white shadow-sm rounded-md border p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Payment Method
      </h2>

      <div className="flex flex-col gap-3">
        {[
          { id: "cod", label: "Cash on Delivery" },
          { id: "upi", label: "UPI Payment" },
          { id: "card", label: "Credit / Debit Card" },
        ].map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer transition ${
              selected === option.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={selected === option.id}
              onChange={() => handleSelect(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
