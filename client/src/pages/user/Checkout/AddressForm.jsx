// src/pages/user/Checkout/AddressForm.jsx
import React, { useState } from "react";

const AddressForm = ({ setAddress }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setAddress(updated);
  };

  return (
    <div className="bg-white border border-[#e8e2d9] shadow-sm rounded-2xl p-8 font-[Manrope]">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6 tracking-wide">
        Shipping Address
      </h2>
      <div className="w-20 h-[3px] bg-gradient-to-r from-[#D4AF37] to-transparent mb-6 rounded-full"></div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="
            w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="
            w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />

        <input
          name="street"
          placeholder="Street Address"
          value={form.street}
          onChange={handleChange}
          className="
            sm:col-span-2 w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="
            w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="
            w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />

        <input
          name="zip"
          placeholder="ZIP Code"
          value={form.zip}
          onChange={handleChange}
          className="
            w-full px-4 py-3 rounded-lg border border-[#d8d2c8] bg-[#FDFDFC]
            focus:outline-none focus:ring-2 focus:ring-[#AD000F]/40
            text-[15px] tracking-wide placeholder-gray-400
          "
        />
      </div>
    </div>
  );
};

export default AddressForm;
