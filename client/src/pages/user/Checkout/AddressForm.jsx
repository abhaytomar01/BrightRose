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
    <div className="bg-white shadow-sm rounded-md border p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="border rounded-md p-3 w-full focus:ring focus:ring-green-200 outline-none"
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border rounded-md p-3 w-full focus:ring focus:ring-green-200 outline-none"
        />
        <input
          name="street"
          placeholder="Street Address"
          value={form.street}
          onChange={handleChange}
          className="border rounded-md p-3 sm:col-span-2 focus:ring focus:ring-green-200 outline-none"
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border rounded-md p-3 focus:ring focus:ring-green-200 outline-none"
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="border rounded-md p-3 focus:ring focus:ring-green-200 outline-none"
        />
        <input
          name="zip"
          placeholder="ZIP Code"
          value={form.zip}
          onChange={handleChange}
          className="border rounded-md p-3 focus:ring focus:ring-green-200 outline-none"
        />
      </div>
    </div>
  );
};

export default AddressForm;
