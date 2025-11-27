import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // product fields
  const [form, setForm] = useState({
    name: "",
    fabric: "",
    color: "",
    weavingArt: "",
    uniqueness: "",
    sizeInfo: "",
    description: "",
    specification: "",
    care: "",
    sku: "",
    price: "",
    stock: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // convert file → base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // multiple image upload
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);

    for (let f of files) {
      const base64 = await toBase64(f);
      setImages((prev) => [...prev, base64]);
      setPreviewImages((prev) => [...prev, base64]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      toast.error("Name, price and stock are required");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least 1 image");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        { ...form, images },
        {
          headers: {
            Authorization: `Bearer ${authAdmin?.token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product added successfully!");
        navigate("/admin/dashboard/all-products");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }

    setLoading(false);
  };

  return (
    <div className="pt-24 p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-4 rounded-lg"
      >
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium capitalize">
              {key}
            </label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
        ))}

        {/* Images */}
        <div>
          <label className="font-medium">Product Images (Base64)</label>
          <input
            type="file"
            multiple
            onChange={handleImages}
            className="block mt-1"
            accept="image/*"
          />

          <div className="flex gap-2 overflow-x-auto mt-2">
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 rounded border object-contain"
              />
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
