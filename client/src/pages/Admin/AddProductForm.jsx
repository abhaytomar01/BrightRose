// client/src/pages/admin/AddProductForm.jsx
import React, { useState } from "react";

const slugify = (v) =>
  v.toLowerCase().replace(/\s*&\s*|\s*\/\s*/g, "-").replace(/\s+/g, "-");

function AddProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brandName: "",
    logo: "",
    images: "",
    specifications: "",
    weave: "",
    style: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const specsArray = form.specifications
      ? form.specifications.split(",").map((s) =>
          JSON.stringify({
            key: s.split(":")[0].trim(),
            value: s.split(":")[1]?.trim() || "",
          })
        )
      : [];

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      brandName: form.brandName,
      logo: form.logo,
      images: form.images.split(",").map((s) => s.trim()),
      specifications: specsArray,
      // filter fields
      weavingSlug: form.weave ? slugify(form.weave) : undefined,
      tagSlugs: form.style ? [slugify(form.style)] : [],
    };

    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/products`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    alert(data.success ? "Product added!" : `Error: ${data.message}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-2 border rounded p-4"
    >
      <input
        name="name"
        placeholder="Product Name"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="description"
        placeholder="Description"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="price"
        placeholder="Price (numbers only)"
        required
        type="number"
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="category"
        placeholder="Category"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="brandName"
        placeholder="Brand Name"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="logo"
        placeholder="Logo Image URL"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="images"
        placeholder="Image URLs (comma separated)"
        required
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="specifications"
        placeholder="Specifications (key:value, comma separated)"
        onChange={handleChange}
        className="border w-full p-1"
      />

      {/* New filter fields */}
      <input
        name="weave"
        placeholder="Weave (e.g. Kanchipuram, Banarasi)"
        onChange={handleChange}
        className="border w-full p-1"
      />
      <input
        name="style"
        placeholder="Style (e.g. Saree, Pants, Dresses)"
        onChange={handleChange}
        className="border w-full p-1"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-1 px-4 mt-2 rounded"
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProductForm;
