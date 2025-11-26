// src/pages/Admin/CreateProduct.jsx

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { categories } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";
import ScrollToTopOnRouteChange from "./../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../SEO/SeoData";

const CreateProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();

  // form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [warranty, setWarranty] = useState("");
  const [brand, setBrand] = useState("");

  // highlights & specs
  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [specs, setSpecs] = useState([]);
  const [specInput, setSpecInput] = useState({ title: "", description: "" });

  // images
  const [imagesFiles, setImagesFiles] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // brand logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // loader
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 MB
  const MAX_IMAGES = 4;

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const addSpec = () => {
    if (!specInput.title || !specInput.description) return;
    setSpecs([...specs, specInput]);
    setSpecInput({ title: "", description: "" });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProductImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (imagesFiles.length + files.length > MAX_IMAGES) {
      return toast.warning(`Max ${MAX_IMAGES} images allowed`);
    }

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE)
        return toast.error("Max 3 MB per image allowed");

      setImagesFiles((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = () =>
        setImagesPreview((prev) => [...prev, reader.result]);

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesFiles((p) => p.filter((_, i) => i !== index));
    setImagesPreview((p) => p.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !stock || !brand) {
      return toast.error("Please fill all required fields");
    }
    if (specs.length < 2)
      return toast.error("Add at least 2 specifications");

    if (!logoFile) return toast.error("Brand logo required");
    if (!imagesFiles.length)
      return toast.error("Add at least 1 product image");

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("discountPrice", discountPrice || "");
      form.append("category", category);
      form.append("stock", stock);
      form.append("warranty", warranty || "");
      form.append("brandName", brand);

      form.append("logo", logoFile);

      imagesFiles.forEach((img) => form.append("images", img));

      highlights.forEach((h) => form.append("highlights", h));
      specs.forEach((s) =>
        form.append("specifications", JSON.stringify(s))
      );

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        form,
        {
          headers: {
            Authorization: `Bearer ${authAdmin.token}`,
          },
        }
      );

      toast.success("Product added successfully!");
      navigate("/admin/dashboard/all-products");
    } catch (err) {
      console.error(err);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeoData title="New Product" />
      <ScrollToTopOnRouteChange />

      {loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          className="p-4 bg-white rounded shadow flex flex-col gap-4"
        >
          <h1 className="text-lg font-semibold">Add New Product</h1>

          <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} size="small" />

          <TextField
            label="Description"
            required
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
          />

          <div className="flex gap-3">
            <TextField
              label="Price"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              size="small"
            />

            <TextField
              label="Discount Price"
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              size="small"
            />
          </div>

          <TextField
            label="Category"
            select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <div className="flex gap-3">
            <TextField
              label="Stock"
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              size="small"
            />
            <TextField
              label="Warranty (Months)"
              type="number"
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              size="small"
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex gap-2">
              <input
                className="border p-2 flex-1"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Highlight"
              />
              <button type="button" onClick={addHighlight} className="bg-blue-600 text-white px-4">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {highlights.map((h, i) => (
                <div key={i} className="bg-green-50 p-2 rounded flex gap-2">
                  {h}
                  <button onClick={() => setHighlights(highlights.filter((_, x) => x !== i))}>
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <div className="flex gap-2">
              <TextField
                label="Spec Title"
                value={specInput.title}
                onChange={(e) => setSpecInput({ ...specInput, title: e.target.value })}
                size="small"
              />
              <TextField
                label="Spec Description"
                value={specInput.description}
                onChange={(e) => setSpecInput({ ...specInput, description: e.target.value })}
                size="small"
              />
              <button type="button" onClick={addSpec} className="bg-blue-600 text-white px-4">
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-3 bg-blue-50 p-2 rounded">
                  <span>{s.title}</span>
                  <span>-</span>
                  <span>{s.description}</span>
                  <button onClick={() => setSpecs(specs.filter((_, x) => x !== i))}>
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <TextField
              label="Brand"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              size="small"
              className="mb-3"
            />

            <div className="flex gap-3 items-center">
              <div className="w-24 h-24 bg-gray-100 border flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <label className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded">
                <input type="file" className="hidden" accept="image/*" onChange={handleLogo} />
                Choose Logo
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex gap-3 overflow-x-auto">
              {imagesPreview.map((img, i) => (
                <div key={i} className="relative w-28 h-28 border">
                  <img src={img} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white px-2"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mt-2">
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleProductImages} />
              Choose Product Images
            </label>
          </div>

          <button className="bg-orange uppercase p-3 text-white rounded shadow hover:shadow-lg">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
