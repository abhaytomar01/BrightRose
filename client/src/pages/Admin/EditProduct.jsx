// src/pages/Admin/EditProduct.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import SeoData from "../../SEO/SeoData";

const MAX_IMAGES = 10;
const MAX_SIZE = 50 * 1024 * 1024;
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const EditProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fabric: "",
    color: "",
    weavingArt: "",
    description: "",
    sku: "",
    price: "",
    stock: "",
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Local server images
  const [oldImages, setOldImages] = useState([]); // {url, filename}
  const [removedImages, setRemovedImages] = useState([]);

  // new uploads
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // sizes and maxQuantity
  const [sizes, setSizes] = useState([...ALL_SIZES]);
  const [maxQuantity, setMaxQuantity] = useState(10);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        const p = res.data.product;

        setForm({
          name: p.name || "",
          fabric: p.fabric || "",
          color: p.color || "",
          weavingArt: p.weavingArt || "",
          description: p.description || "",
          specification: p.specification || "",
          care: p.care || "",
          sku: p.sku || "",
          price: p.price ?? "",
          stock: p.stock ?? "",
        });

        setTags(p.tags || []);
        setOldImages(p.images || []); // backend returns {url, filename}
        setSizes(Array.isArray(p.sizes) && p.sizes.length ? p.sizes : [...ALL_SIZES]);
        setMaxQuantity(p.maxQuantity ?? 10);
      } catch (err) {
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (index) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  const removeOldImage = (filename) => {
    setOldImages((prev) => prev.filter((img) => img.filename !== filename));
    setRemovedImages((prev) => [...prev, filename]);
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (oldImages.length + newFiles.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        toast.warning("Image exceeds 50MB limit");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setNewPreviews((p) => [...p, reader.result]);
      reader.readAsDataURL(file);

      setNewFiles((prev) => [...prev, file]);
    });
  };

  const removeNewImage = (i) => {
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const toggleSize = (s) => {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k] ?? ""));
      fd.append("tags", JSON.stringify(tags));
      fd.append("oldImages", JSON.stringify(oldImages));
      fd.append("removedImages", JSON.stringify(removedImages));
      fd.append("sizes", JSON.stringify(sizes));
      fd.append("maxQuantity", String(maxQuantity));

      newFiles.forEach((file) => fd.append("images", file));

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${authAdmin.token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating");
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) return <Spinner />;

  return (
    <>
      <SeoData title="Edit Product" />

      <form className="p-4 bg-white rounded shadow flex flex-col gap-4" onSubmit={submitHandler}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        ))}

        {/* sizes */}
        <div>
          <label className="block font-medium mb-2">Available Sizes</label>
          <div className="flex gap-2 flex-wrap">
            {ALL_SIZES.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1 rounded border text-sm transition ${
                    active
                      ? "bg-black text-white border-black"
                      : "border-neutral-300 bg-white text-neutral-700"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* maxQuantity */}
        <div>
          <label className="block font-medium mb-2">Max Quantity per order</label>
          <input
            type="number"
            min={1}
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(Math.max(1, Number(e.target.value || 1)))}
            className="border p-2 rounded w-40"
          />
          <p className="text-sm text-neutral-500 mt-1">
            User cannot increase quantity beyond this number (also limited by stock).
          </p>
        </div>

        {/* TAGS */}
        <div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border p-2"
            placeholder="Add tag"
          />
          <button type="button" onClick={addTag} className="ml-2 bg-blue-600 text-white px-3 rounded">
            Add
          </button>

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                {t} <button onClick={() => removeTag(i)}>x</button>
              </span>
            ))}
          </div>
        </div>

        {/* Old IMAGES */}
        <h3 className="font-bold mt-4">Existing Images</h3>
        <div className="flex gap-2 overflow-x-auto">
          {oldImages.map((img) => (
            <div key={img.filename} className="relative">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}${img.url}`}
                className="w-20 h-20 object-cover border"
              />
              <button
                type="button"
                onClick={() => removeOldImage(img.filename)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <h3 className="font-bold">Add New Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />

        <div className="flex gap-2 overflow-x-auto">
          {newPreviews.map((p, i) => (
            <div key={i} className="relative">
              <img src={p} className="w-20 h-20 object-cover border" />
              <button
                type="button"
                onClick={() => removeNewImage(i)}
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button className="bg-orange-500 text-white w-full p-2 rounded">Update</button>

        <Link
          to="/admin/dashboard/all-products"
          className="bg-red-500 text-white w-full p-2 rounded text-center"
        >
          Cancel
        </Link>
      </form>
    </>
  );
};

export default EditProduct;
