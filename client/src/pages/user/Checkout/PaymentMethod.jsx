// src/pages/user/Checkout/PaymentMethod.jsx
import React, { useState } from "react";

const PaymentMethod = ({ setPaymentMethod }) => {
  const [selected, setSelected] = useState("cod");

  const handleSelect = (method) => {
    setSelected(method);
    setPaymentMethod(method);
  };

  return (
    <div
      className="
        bg-white border border-[#e8e2d9] shadow-md 
        rounded-2xl p-6 font-[Manrope]
      "
    >
      <h2 className="text-xl font-semibold mb-5 text-[#1a1a1a] tracking-wide">
        Payment Method
      </h2>

      <div className="flex flex-col gap-4">
        {[
          { id: "cod", label: "Cash on Delivery" },
          { id: "upi", label: "UPI Payment" },
          { id: "card", label: "Credit / Debit Card" },
        ].map((option) => (
          <label
            key={option.id}
            className={`
              flex items-center gap-3 p-4 rounded-xl cursor-pointer 
              border transition-all duration-200 text-[15px]
              ${
                selected === option.id
                  ? "border-[#AD000F] bg-[#FFF4F4] shadow-sm"
                  : "border-[#e8e2d9] hover:bg-gray-50"
              }
            `}
          >
            <input
              type="radio"
              name="payment"
              checked={selected === option.id}
              onChange={() => handleSelect(option.id)}
              className="accent-[#AD000F] w-4 h-4"
            />
            <span className="font-medium text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
