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
    uniqueness: "",
    sizeInfo: "",
    description: "",
    specification: "",
    care: "",
    sku: "",
    price: "",
    stock: "",
    brandName: "",
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // existing images array of { url, filename }
  const [oldImages, setOldImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // new images files + previews
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // logo
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);

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
          brandName: p.brand?.name || "",
        });
        setTags(p.tags || []);
        setOldImages(p.images || []);
        setLogoPreview(p.brand?.logo?.url || "");
      } catch (err) {
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((s) => [...s, tagInput.trim()]);
    setTagInput("");
  };
  const removeTag = (i) => setTags((s) => s.filter((_, idx) => idx !== i));

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
        toast.warning("Image exceeds max size 50MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setNewPreviews((p) => [...p, reader.result]);
      reader.readAsDataURL(file);
      setNewFiles((p) => [...p, file]);
    });
  };

  const removeNewImage = (i) => {
    setNewPreviews((p) => p.filter((_, idx) => idx !== i));
    setNewFiles((p) => p.filter((_, idx) => idx !== i));
  };

  const handleLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_SIZE) {
      toast.warning("Logo exceeds max size 50MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(f);
    setLogoFile(f);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      fd.append("tags", JSON.stringify(tags));
      fd.append("oldImages", JSON.stringify(oldImages)); // array of {url, filename}
      fd.append("removedImages", JSON.stringify(removedImages)); // array of filenames

      newFiles.forEach((f) => fd.append("images", f));
      if (logoFile) fd.append("logo", logoFile);

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
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) return <Spinner />;

  return (
    <>
      <SeoData title="Edit Product" />
      <form onSubmit={submitHandler} className="bg-white p-4 rounded shadow flex flex-col gap-4">
        {Object.keys(form).map((key) => (
          <input key={key} name={key} placeholder={key} value={form[key]} onChange={handleChange} className="border p-2 rounded" />
        ))}

        <div>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="border p-2" />
          <button type="button" onClick={addTag} className="ml-2 bg-blue-500 text-white px-3 rounded">Add</button>
          <div className="flex flex-wrap gap-2 mt-2">{tags.map((t, i) => <div key={i} className="bg-gray-200 px-3 py-1 rounded">{t} <button onClick={() => removeTag(i)}>x</button></div>)}</div>
        </div>

        <h3>Existing Images</h3>
        <div className="flex gap-2 overflow-x-auto">
          {oldImages.map((img) => (
            <div key={img.filename} className="relative">
              <img src={img.url} className="w-20 h-20 object-cover border" />
              <button type="button" onClick={() => removeOldImage(img.filename)} className="absolute top-0 right-0 bg-red-600 text-white px-1">X</button>
            </div>
          ))}
        </div>

        <h3>Add New Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />
        <div className="flex gap-2 overflow-x-auto">
          {newPreviews.map((p, i) => (
            <div key={i} className="relative">
              <img src={p} className="w-20 h-20 object-cover border" />
              <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white px-1">X</button>
            </div>
          ))}
        </div>

        <div>
          <label>Brand Logo</label>
          {logoPreview && <img src={logoPreview} className="w-28 h-28 object-contain" />}
          <input type="file" accept="image/*" onChange={handleLogo} />
        </div>

        <button className="bg-orange-500 text-white w-full p-2 rounded">Update</button>

        <Link to="/admin/dashboard/all-products" className="bg-red-600 text-white w-full p-2 rounded text-center">Cancel</Link>
      </form>
    </>
  );
};

export default EditProduct;
