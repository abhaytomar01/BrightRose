// src/pages/Admin/CreateProduct.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";
import SeoData from "../../SEO/SeoData";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";

const CreateProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  // PRODUCT FIELDS
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
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // IMAGES (BASE64)
  const MAX_IMAGES = 10;
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  const [imagesPreview, setImagesPreview] = useState([]); // base64 strings for preview
  const [imagesBase64, setImagesBase64] = useState([]); // base64 strings to send

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((p) => [...p, tagInput.trim()]);
    setTagInput("");
  };
  const removeTag = (i) => setTags((p) => p.filter((_, idx) => idx !== i));

  // convert file -> base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (imagesBase64.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        toast.warning("One image exceeds 50MB");
        continue;
      }
      try {
        const b64 = await fileToBase64(file);
        setImagesPreview((p) => [...p, b64]);
        setImagesBase64((p) => [...p, b64]);
      } catch (err) {
        console.error("File read error", err);
        toast.error("Failed to read an image file");
      }
    }
  };

  const removeImage = (i) => {
    setImagesPreview((p) => p.filter((_, idx) => idx !== i));
    setImagesBase64((p) => p.filter((_, idx) => idx !== i));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      // basic validation
      if (!form.name?.trim()) {
        toast.error("Product name required");
        setIsSubmit(false);
        return;
      }
      if (!form.price) {
        toast.error("Price required");
        setIsSubmit(false);
        return;
      }
      if (!form.stock) {
        toast.error("Stock required");
        setIsSubmit(false);
        return;
      }
      if (imagesBase64.length === 0) {
        toast.error("Add at least one image");
        setIsSubmit(false);
        return;
      }

      // Build JSON payload
      const payload = {
        ...form,
        price: form.price,
        stock: form.stock,
        tags: tags,
        images: imagesBase64,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authAdmin?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        toast.success("Product created successfully");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data?.message || "Failed to create product");
      }
    } catch (err) {
      console.error("Create error:", err);
      toast.error(err.response?.data?.message || "Error creating product");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <SeoData title="Create Product" />
      <ScrollToTopOnRouteChange />

      {isSubmit ? (
        <Spinner />
      ) : (
        <form onSubmit={submitHandler} className="bg-white p-4 rounded shadow flex flex-col gap-4">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-3">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
            <input name="fabric" placeholder="Fabric" value={form.fabric} onChange={handleChange} className="border p-2 rounded" />
            <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-2 rounded" />
            <input name="weavingArt" placeholder="Weaving Art" value={form.weavingArt} onChange={handleChange} className="border p-2 rounded" />
            <input name="uniqueness" placeholder="Uniqueness" value={form.uniqueness} onChange={handleChange} className="border p-2 rounded" />
            <input name="sizeInfo" placeholder="Size Info" value={form.sizeInfo} onChange={handleChange} className="border p-2 rounded" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" rows={3} />
            <textarea name="specification" placeholder="Specification" value={form.specification} onChange={handleChange} className="border p-2 rounded" rows={2} />
            <textarea name="care" placeholder="Care Instructions" value={form.care} onChange={handleChange} className="border p-2 rounded" rows={2} />
            <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} className="border p-2 rounded" />
            <div className="flex gap-2">
              <input name="price" placeholder="Price" value={form.price} onChange={handleChange} type="number" className="border p-2 rounded flex-1" />
              <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} type="number" className="border p-2 rounded w-28" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="border p-2 flex-1 rounded" />
              <button type="button" onClick={addTag} className="bg-blue-600 text-white px-4 rounded">Add</button>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {tags.map((t, i) => (
                <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">
                  <span>{t}</span>
                  <button type="button" onClick={() => removeTag(i)} className="text-red-600">x</button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 font-medium">Product Images (max {MAX_IMAGES})</label>
            <div className="flex gap-2 overflow-x-auto mb-2">
              {imagesPreview.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-24 h-24 object-cover border rounded" alt={`preview-${i}`} />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded">X</button>
                </div>
              ))}
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImages} />
          </div>

          <button type="submit" className="bg-orange-500 text-white p-2 rounded w-full">Submit</button>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
