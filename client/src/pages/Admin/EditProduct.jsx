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

const WEAVE_OPTIONS = [
  { label: "-- Select Weave --", value: "" },
  { label: "Kanchipuram", value: "kanchipuram" },
  { label: "Banarasi Brocade", value: "banarasi" },
  { label: "Pashmina", value: "pashmina" },
  { label: "Handloom Plain", value: "plain" },
  { label: "Kantha", value: "kantha" },
  { label: "Pochampalley Ikkat", value: "pochampalley" },
  { label: "Narayanpet", value: "narayanpet" },
];

const STYLE_OPTIONS = [
  { label: "-- Select Style --", value: "" },
  { label: "Sarees", value: "sarees" },
  { label: "Dresses", value: "dresses" },
  { label: "Blazers", value: "blazers" },
  { label: "Skirt", value: "skirt" },
  { label: "Pants", value: "pants" },
  { label: "Corsets", value: "corsets" },
  { label: "Tops", value: "tops" },
  { label: "Jacket", value: "jacket" },
  { label: "Shirt", value: "shirt" },
];

const FIELD_CONFIG = [
  { key: "name",          label: "Product Name",     type: "text",     required: true },
  { key: "fabric",        label: "Fabric",            type: "text",     required: false },
  { key: "color",         label: "Color",             type: "text",     required: false },
  { key: "weavingArt",    label: "Weaving Art",       type: "text",     required: false },
  { key: "sku",           label: "SKU",               type: "text",     required: false },
  { key: "price",         label: "Price (₹)",         type: "number",   required: false },
  { key: "stock",         label: "Stock",             type: "number",   required: false },
  { key: "description",   label: "Description",       type: "textarea", required: false },
  { key: "specification", label: "Specification",     type: "textarea", required: false },
  { key: "care",          label: "Care Instructions", type: "textarea", required: false },
];

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
    care: "",
    specification: "",
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [sizes, setSizes] = useState([...ALL_SIZES]);
  const [maxQuantity, setMaxQuantity] = useState(10);
  const [weaveSlug, setWeaveSlug] = useState("");
  const [styleSlug, setStyleSlug] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );
        const p = res.data.product;

        setForm({
          name:          p.name          || "",
          fabric:        p.fabric        || "",
          color:         p.color         || "",
          weavingArt:    p.weavingArt    || "",
          description:   p.description   || "",
          specification: p.specification || "",
          care:          p.care          || "",
          sku:           p.sku           || "",
          price:         p.price         ?? "",
          stock:         p.stock         ?? "",
        });

        setTags(p.tags || []);
        setOldImages(p.images || []);
        setSizes(
          Array.isArray(p.sizes) && p.sizes.length ? p.sizes : [...ALL_SIZES]
        );
        setMaxQuantity(p.maxQuantity ?? 10);
        setWeaveSlug(p.weavingSlug || "");
        setStyleSlug(
          Array.isArray(p.tagSlugs) && p.tagSlugs.length ? p.tagSlugs[0] : ""
        );
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

      // Append each field explicitly — never rely on Object.keys order
      fd.append("name",          form.name);
      fd.append("fabric",        form.fabric);
      fd.append("color",         form.color);
      fd.append("weavingArt",    form.weavingArt);
      fd.append("description",   form.description);
      fd.append("sku",           form.sku);
      fd.append("price",         form.price);
      fd.append("stock",         form.stock);
      fd.append("care",          form.care);
      fd.append("specification", form.specification);

      fd.append("tags",          JSON.stringify(tags));
      fd.append("oldImages",     JSON.stringify(oldImages));
      fd.append("removedImages", JSON.stringify(removedImages));
      fd.append("sizes",         JSON.stringify(sizes));
      fd.append("maxQuantity",   String(maxQuantity));
      fd.append("weavingSlug",   weaveSlug || "");
      fd.append("tagSlugs",      JSON.stringify(styleSlug ? [styleSlug] : []));

      newFiles.forEach((file) => fd.append("images", file));

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        fd,
        { headers: { Authorization: `Bearer ${authAdmin.token}` } }
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

      <form
        className="p-4 bg-white rounded shadow flex flex-col gap-4"
        onSubmit={submitHandler}
      >
        {/* All fields with proper labels */}
        {FIELD_CONFIG.map(({ key, label, type, required }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="font-medium text-sm">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {type === "textarea" ? (
              <textarea
                name={key}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={form[key]}
                onChange={handleChange}
                rows={3}
                className="border p-2 rounded resize-y"
              />
            ) : (
              <input
                type={type}
                name={key}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={form[key]}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            )}
          </div>
        ))}

        {/* Weave + Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Weave</label>
            <select
              value={weaveSlug}
              onChange={(e) => setWeaveSlug(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {WEAVE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Style</label>
            <select
              value={styleSlug}
              onChange={(e) => setStyleSlug(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sizes */}
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

        {/* Max Quantity */}
        <div>
          <label className="block font-medium mb-2">Max Quantity per order</label>
          <input
            type="number"
            min={1}
            value={maxQuantity}
            onChange={(e) =>
              setMaxQuantity(Math.max(1, Number(e.target.value || 1)))
            }
            className="border p-2 rounded w-40"
          />
          <p className="text-sm text-neutral-500 mt-1">
            User cannot increase quantity beyond this number (also limited by stock).
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-2">Tags</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="border p-2 rounded flex-1"
              placeholder="Add tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Existing Images */}
        <div>
          <h3 className="font-bold mb-2">Existing Images</h3>
          <div className="flex gap-2 flex-wrap">
            {oldImages.map((img) => (
              <div key={img.filename} className="relative">
                <img
                  src={
                    img.url.startsWith("http")
                      ? img.url
                      : `${import.meta.env.VITE_SERVER_URL}${
                          img.url.startsWith("/") ? img.url : "/" + img.url
                        }`
                  }
                  className="w-20 h-20 object-cover border rounded"
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => removeOldImage(img.filename)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-bl text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images */}
        <div>
          <h3 className="font-bold mb-2">Add New Images</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImages}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {newPreviews.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} className="w-20 h-20 object-cover border rounded" alt="" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-bl text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white w-full p-2 rounded font-medium"
        >
          Update
        </button>

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