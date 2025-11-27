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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Tags
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };
  const removeTag = (i) => {
    setTags(tags.filter((_, idx) => idx !== i));
  };

  // IMAGES
  const MAX_IMAGES = 10;
  const MAX_SIZE = 50 * 1024 * 1024;

  const [oldImages, setOldImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [newImagesBase64, setNewImagesBase64] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);

  const removeOldImage = (public_id) => {
    setOldImages(oldImages.filter((img) => img.public_id !== public_id));
    setRemovedImages([...removedImages, public_id]);
  };

  const removeNewImage = (i) => {
    setNewImagesBase64(newImagesBase64.filter((_, idx) => idx !== i));
    setNewImagesPreview(newImagesPreview.filter((_, idx) => idx !== i));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (oldImages.length + newImagesBase64.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        toast.warning("Image exceeds 50MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setNewImagesPreview((p) => [...p, reader.result]);
        setNewImagesBase64((p) => [...p, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // LOAD PRODUCT
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        const p = res.data.product;

        setForm({
          name: p.name,
          fabric: p.fabric,
          color: p.color,
          weavingArt: p.weavingArt,
          uniqueness: p.uniqueness,
          sizeInfo: p.sizeInfo,
          description: p.description,
          specification: p.specification,
          care: p.care,
          sku: p.sku,
          price: p.price,
          stock: p.stock,
        });

        setTags(p.tags || []);
        setOldImages(p.images || []);
      } catch (err) {
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, []);

  // SUBMIT UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((field) =>
        formData.append(field, form[field])
      );

      formData.append("tags", JSON.stringify(tags));
      formData.append("oldImages", JSON.stringify(oldImages));
      formData.append("removedImages", JSON.stringify(removedImages));
      formData.append("images", JSON.stringify(newImagesBase64));

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        formData,
        { headers: { Authorization: `Bearer ${authAdmin.token}` } }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin/dashboard/all-products");
      }
    } catch (err) {
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
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            className="border p-2 rounded"
          />
        ))}

        {/* Tags */}
        <div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              className="border p-2 flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-500 text-white px-4"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((t, i) => (
              <span key={i} className="bg-gray-200 p-2 rounded flex gap-2">
                {t} <button onClick={() => removeTag(i)}>x</button>
              </span>
            ))}
          </div>
        </div>

        {/* Old Images */}
        <h3 className="font-medium">Existing Images</h3>
        <div className="flex gap-2 overflow-x-auto">
          {oldImages.map((img) => (
            <div key={img.public_id} className="relative">
              <img src={img.url} className="w-20 h-20 object-cover border" />
              <button
                onClick={() => removeOldImage(img.public_id)}
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* New Uploads */}
        <h3 className="font-medium">Add New Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />

        <div className="flex gap-2 overflow-x-auto">
          {newImagesPreview.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="w-20 h-20 object-cover border" />
              <button
                onClick={() => removeNewImage(i)}
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button className="bg-orange-500 text-white w-full p-2 rounded">
          Update
        </button>

        <Link
          to="/admin/dashboard/all-products"
          className="bg-red-600 text-center text-white w-full p-2 rounded"
        >
          Cancel
        </Link>
      </form>
    </>
  );
};

export default EditProduct;
