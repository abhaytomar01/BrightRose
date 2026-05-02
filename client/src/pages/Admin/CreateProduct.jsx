// src/pages/Admin/CreateProduct.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
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
  { label: "Kantha", value: "katan" },
  { label: "Pochampalley Ikkat", value: "pochampalley" },
  { label: "Narayanpet", value: "narayanpet" },
  { label: "Banarasi Katan", value: "banarasi-katan" },
  { label: "Rangkaat", value: "rangkaat" },
  { label: "Patan Patola", value: "patan-patola" },
  { label: "Kosa Silk", value: "kosa-silk" },
  { label: "Gollabhama", value: "gollabhama" },
  { label: "Bawan Booti", value: "bawan-booti" },
  { label: "Tanchoi", value: "tanchoi" },
  { label: "Weave of silk & ghicha", value: "silk-ghicha" },
  { label: "Weave of Mulberry", value: "mulberry" },
  { label: "Pochampally Ikat & Patan Patola", value: "pochampally-patan-patola" },
  { label: "Plain weave of silk", value: "plain-silk" },
  { label: "Plain weave of tissue & silk", value: "plain-tissue-silk" },
  { label: "Plain weave of Mulberry", value: "plain-mulberry" },
];

const STYLE_OPTIONS = [
  { label: "-- Select Style --", value: "" },
  { label: "Pre-Draped Saree", value: "pre-draped-saree" },
  { label: "Dresses", value: "dresses" },
  { label: "Blazers", value: "blazers" },
  { label: "Skirt", value: "skirt" },
  { label: "Pants", value: "pants" },
  { label: "Corsets", value: "corsets" },
  { label: "Tops", value: "tops" },
  { label: "Jacket", value: "jacket" },
  { label: "Shirt", value: "shirt" },
  { label: "Shirt & Skirt Set", value: "shirt-skirt-set" },
  { label: "Blazer & Trousers Set", value: "blazer-trousers-set" },
  { label: "Jacket & Trousers Set", value: "jacket-trousers-set" },
  { label: "Skirt & Corset Set", value: "skirt-corset-set" },
  { label: "Blazer & Skirt set", value: "blazer-skirt-set" },
  { label: "Kaftaan", value: "kaftaan" },
  { label: "Trousers", value: "trousers" },
  { label: "Palazzo", value: "palazzo" },
  { label: "Coat", value: "coat" },
  { label: "Shirt and Trousers set", value: "shirt-trousers-set" },
  { label: "Top & Skirt Set", value: "top-skirt-set" },
  { label: "Corset & Palazzo Set", value: "corset-palazzo-set" },
  { label: "Blazer, Top & Skirt Set", value: "blazer-top-skirt-set" },
  { label: "Jacket & Skirt Set", value: "jacket-skirt-set" },
  { label: "Corset Skirt & Jacket Set", value: "corset-skirt-jacket-set" },
  { label: "Blazer & Pant Set", value: "blazer-pant-set" },
  { label: "Kaftaan Set", value: "kaftaan-set" },
];


const CreateProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fabric: "",
    color: "",
    weavingArt: "",
    description: "",
    sku: "",
    price: "",
    stock: "1",
    care: "",
    specification: "",
  });

  const [sizes, setSizes] = useState([...ALL_SIZES]);
  const [maxQuantity, setMaxQuantity] = useState(10);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);

  // NEW: filter slug state
  const [weaveSlug, setWeaveSlug] = useState([]);
  const [styleSlug, setStyleSlug] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((p) => [...p, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (i) =>
    setTags((p) => p.filter((_, idx) => idx !== i));

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (imagesFiles.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        toast.warning("Image exceeds 50MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () =>
        setImagesPreview((prev) => [...prev, reader.result]);

      reader.readAsDataURL(file);
      setImagesFiles((prev) => [...prev, file]);
    });
  };

  const removeImage = (i) => {
    setImagesPreview((p) => p.filter((_, idx) => idx !== i));
    setImagesFiles((p) => p.filter((_, idx) => idx !== i));
  };

  const toggleSize = (s) => {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      if (!form.name.trim()) {
        toast.error("Product name required");
        setIsSubmit(false);
        return;
      }

      if (!sizes.length) {
        toast.error("Please select at least one size");
        setIsSubmit(false);
        return;
      }

      const fd = new FormData();

      Object.keys(form).forEach((k) => fd.append(k, form[k] ?? ""));
      fd.append("tags", JSON.stringify(tags));
      fd.append("sizes", JSON.stringify(sizes));
      fd.append("maxQuantity", String(maxQuantity));

      // send slugs used by filters
      fd.append("weavingSlug", JSON.stringify(weaveSlug));
      fd.append("tagSlugs", JSON.stringify(styleSlug ? [styleSlug] : []));

      imagesFiles.forEach((file) => fd.append("images", file));

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        fd,
        { headers: { Authorization: `Bearer ${authAdmin.token}` } }
      );

      if (res.data.success) {
        toast.success("Product created successfully");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data.message || "Create failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating product");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <SeoData title="Create Product" />

      {isSubmit ? (
        <Spinner />
      ) : (
        <form
          className="bg-white p-4 rounded shadow flex flex-col gap-4"
          onSubmit={submitHandler}
        >
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

          {/* Weave + Style slugs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Weaves</label>
              <select
                multiple
                value={weaveSlug}
                onChange={(e) => {
                  const vals = Array.from(e.target.selectedOptions, o => o.value).filter(v => v !== "");
                  setWeaveSlug(vals);
                }}
                className="border p-2 rounded w-full h-40"
              >
                {WEAVE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple weaves.</p>
            </div>

            <div>
              <label className="block font-medium mb-1">Style (slug)</label>
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
                    className={`px-3 py-1 rounded border text-sm transition ${active
                      ? "bg-black text-white border-black"
                      : "border-neutral-300 bg-white text-neutral-700"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Toggle sizes that are available for this product.
            </p>
          </div>

          {/* maxQuantity */}
          <div>
            <label className="block font-medium mb-2">
              Max Quantity per order
            </label>
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
              User cannot increase quantity beyond this number (also limited by
              stock).
            </p>
          </div>

          {/* Tags */}
          <div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              className="border p-2"
            />
            <button
              type="button"
              onClick={addTag}
              className="ml-2 bg-blue-500 text-white px-3 rounded"
            >
              Add
            </button>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                >
                  {t} <button onClick={() => removeTag(i)}>x</button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium mb-2">Product Images</label>

            <div className="flex gap-2 overflow-x-auto mb-2">
              {imagesPreview.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-20 h-20 object-cover border" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white px-1"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />
          </div>

          <button className="bg-orange-500 text-white w-full p-2 rounded">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
