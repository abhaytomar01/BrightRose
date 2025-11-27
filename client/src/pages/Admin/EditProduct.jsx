// src/pages/Admin/EditProduct.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";
import SeoData from "../../SEO/SeoData";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";

const EditProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Product fields
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((p) => [...p, tagInput.trim()]);
    setTagInput("");
  };
  const removeTag = (i) => setTags((p) => p.filter((_, idx) => idx !== i));

  // IMAGES
  const MAX_IMAGES = 10;
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  const [oldImages, setOldImages] = useState([]); // [{url, public_id}]
  const [removedImages, setRemovedImages] = useState([]);

  const [newImagesBase64, setNewImagesBase64] = useState([]); // base64 strings
  const [newImagesPreview, setNewImagesPreview] = useState([]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const removeOldImage = (public_id) => {
    setOldImages((p) => p.filter((img) => img.public_id !== public_id));
    setRemovedImages((p) => [...p, public_id]);
  };

  const removeNewImage = (i) => {
    setNewImagesBase64((p) => p.filter((_, idx) => idx !== i));
    setNewImagesPreview((p) => p.filter((_, idx) => idx !== i));
  };

  const handleNewImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (oldImages.length + newImagesBase64.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed (existing + new)`);
      return;
    }

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        toast.warning("One image exceeds 50MB");
        continue;
      }
      try {
        const b64 = await fileToBase64(file);
        setNewImagesPreview((p) => [...p, b64]);
        setNewImagesBase64((p) => [...p, b64]);
      } catch (err) {
        console.error("File read error", err);
        toast.error("Failed to read an image file");
      }
    }
  };

  // LOAD PRODUCT
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`);
        const p = res.data.product;
        setForm({
          name: p.name || "",
          fabric: p.fabric || "",
          color: p.color || "",
          weavingArt: p.weavingArt || "",
          uniqueness: p.uniqueness || "",
          sizeInfo: p.sizeInfo || "",
          description: p.description || "",
          specification: p.specification || "",
          care: p.care || "",
          sku: p.sku || "",
          price: p.price || "",
          stock: p.stock || "",
        });
        setTags(p.tags || []);
        setOldImages(p.images || []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // SUBMIT UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build JSON payload (not FormData)
      const payload = {
        ...form,
        tags: tags,
        oldImages: oldImages, // array of {url, public_id}
        removedImages: removedImages, // array of public_id strings
        images: newImagesBase64, // base64 array (new uploads)
      };

      const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`, payload, {
        headers: {
          Authorization: `Bearer ${authAdmin?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data?.success) {
        toast.success("Product updated successfully");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) return <Spinner />;

  return (
    <>
      <SeoData title="Edit Product" />
      <ScrollToTopOnRouteChange />

      <form onSubmit={submitHandler} className="bg-white p-4 rounded shadow flex flex-col gap-6">
        {/* Fields */}
        <div className="grid grid-cols-1 gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
          <input name="fabric" value={form.fabric} onChange={handleChange} placeholder="Fabric" className="border p-2 rounded" />
          <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="border p-2 rounded" />
          <input name="weavingArt" value={form.weavingArt} onChange={handleChange} placeholder="Weaving Art" className="border p-2 rounded" />
          <input name="uniqueness" value={form.uniqueness} onChange={handleChange} placeholder="Uniqueness" className="border p-2 rounded" />
          <input name="sizeInfo" value={form.sizeInfo} onChange={handleChange} placeholder="Size Info" className="border p-2 rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3} className="border p-2 rounded" />
          <textarea name="specification" value={form.specification} onChange={handleChange} placeholder="Specification" rows={2} className="border p-2 rounded" />
          <textarea name="care" value={form.care} onChange={handleChange} placeholder="Care" rows={2} className="border p-2 rounded" />
          <div className="flex gap-2">
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="border p-2 rounded flex-1" />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="border p-2 rounded w-32" />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border p-2 rounded w-24" />
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="border p-2 flex-1 rounded" />
            <button type="button" onClick={addTag} className="bg-blue-600 text-white px-4 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((t, i) => (
              <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">
                <span>{t}</span>
                <button type="button" onClick={() => removeTag(i)} className="text-red-600">x</button>
              </div>
            ))}
          </div>
        </div>

        {/* Old Images */}
        <h3 className="font-medium">Existing Images</h3>
        <div className="flex gap-2 overflow-x-auto mb-2">
          {oldImages.map((img) => (
            <div key={img.public_id} className="relative">
              <img src={img.url} className="w-24 h-24 object-cover border rounded" alt="" />
              <button type="button" onClick={() => removeOldImage(img.public_id)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded">X</button>
            </div>
          ))}
        </div>

        {/* New Uploads */}
        <h3 className="font-medium">Add New Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />
        <div className="flex gap-2 overflow-x-auto mt-2">
          {newImagesPreview.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="w-24 h-24 object-cover border rounded" alt={`new-${i}`} />
              <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded">X</button>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-orange-500 text-white w-full p-2 rounded">Update</button>
        <Link to="/admin/dashboard/all-products" className="bg-red-600 text-white w-full p-2 rounded text-center">Cancel</Link>
      </form>
    </>
  );
};

export default EditProduct;
