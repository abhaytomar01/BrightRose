import React, { useState } from "react";

function AddProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brandName: "",
    logo: "",
    images: "",
    specifications: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Split images by comma, create specifications JSON array
    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images.split(",").map(s => s.trim()),
      specifications: form.specifications.split(",").map(s =>
        JSON.stringify({ key: s.split(":")[0].trim(), value: s.split(":")[1].trim() })
      )
      // logo and brandName as is
    };
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.success ? "Product added!" : `Error: ${data.message}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2 border rounded p-4">
      <input name="name" placeholder="Product Name" required onChange={handleChange} className="border w-full p-1" />
      <input name="description" placeholder="Description" required onChange={handleChange} className="border w-full p-1" />
      <input name="price" placeholder="Price (numbers only)" required type="number" onChange={handleChange} className="border w-full p-1" />
      <input name="category" placeholder="Category" required onChange={handleChange} className="border w-full p-1" />
      <input name="brandName" placeholder="Brand Name" required onChange={handleChange} className="border w-full p-1" />
      <input name="logo" placeholder="Logo Image URL" required onChange={handleChange} className="border w-full p-1" />
      <input name="images" placeholder="Image URLs (comma separated)" required onChange={handleChange} className="border w-full p-1" />
      <input name="specifications" placeholder="Specifications (key:value, comma separated)" onChange={handleChange} className="border w-full p-1" />
      <button type="submit" className="bg-blue-600 text-white py-1 px-4 mt-2 rounded">Add Product</button>
    </form>
  );
}

export default AddProductForm;
