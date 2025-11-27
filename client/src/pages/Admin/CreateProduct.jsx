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
  const MAX_SIZE = 50 * 1024 * 1024;

  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesBase64, setImagesBase64] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (i) => {
    setTags(tags.filter((_, idx) => idx !== i));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (imagesBase64.length + files.length > MAX_IMAGES) {
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
        setImagesPreview((p) => [...p, reader.result]);
        setImagesBase64((p) => [...p, reader.result]); // BASE64
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setImagesPreview(imagesPreview.filter((_, idx) => idx !== i));
    setImagesBase64(imagesBase64.filter((_, idx) => idx !== i));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!form.name.trim()) {
      toast.error("Product name required");
      setIsSubmit(false);
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((field) => {
        formData.append(field, form[field]);
      });

      formData.append("tags", JSON.stringify(tags));
      formData.append("images", JSON.stringify(imagesBase64));

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        formData,
        { headers: { Authorization: `Bearer ${authAdmin.token}` } }
      );

      if (res.data.success) {
        toast.success("Product created successfully");
        navigate("/admin/dashboard/all-products");
      }
    } catch (err) {
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
        <form
          onSubmit={submitHandler}
          className="bg-white p-4 rounded shadow flex flex-col gap-4"
        >
          {/* --- Inputs --- */}
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
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                className="border p-2 flex-1"
              />
              <button type="button" onClick={addTag} className="bg-blue-500 text-white px-4 rounded">
                Add
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
                >
                  {t}
                  <button onClick={() => removeTag(i)}>x</button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block font-medium mb-2">Product Images (Base64)</label>

            <div className="flex gap-2 overflow-x-auto">
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

          <button className="bg-orange-500 text-white w-full p-2 rounded">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
