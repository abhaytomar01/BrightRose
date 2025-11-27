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

const CreateProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

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

  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    try {
      if (!form.name.trim()) {
        toast.error("Product name required");
        setIsSubmit(false);
        return;
      }

      const fd = new FormData();

      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      fd.append("tags", JSON.stringify(tags));

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
        <form className="bg-white p-4 rounded shadow flex flex-col gap-4" onSubmit={submitHandler}>
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
                <span key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">
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

            <input type="file" multiple accept="image/*" onChange={handleImages} />
          </div>

          <button className="bg-orange-500 text-white w-full p-2 rounded">Submit</button>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
