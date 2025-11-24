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
  const { auth } = useAuth();
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
  const [specsInput, setSpecsInput] = useState({ title: "", description: "" });

  // images: keep File objects for upload, base64 for preview
  const [imagesFiles, setImagesFiles] = useState([]); // Array<File>
  const [imagesPreview, setImagesPreview] = useState([]); // Array<string base64>

  // logo: same approach
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // submit state
  const [isSubmit, setIsSubmit] = useState(false);

  // Limits (tune as needed)
  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB per file (change to 500*1024 for 500KB)
  const MAX_IMAGES_COUNT = 10; // number of images allowed

  // ---------- helpers ----------
  const addHighlight = () => {
    const v = highlightInput.trim();
    if (!v) return;
    setHighlights((p) => [...p, v]);
    setHighlightInput("");
  };

  const deleteHighlight = (idx) => setHighlights((p) => p.filter((_, i) => i !== idx));

  const addSpecs = () => {
    if (!specsInput.title.trim() && !specsInput.description.trim()) return;
    setSpecs((p) => [...p, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const deleteSpec = (idx) => setSpecs((p) => p.filter((_, i) => i !== idx));

  // ---------- logo handler ----------
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be an image file");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning(`Logo exceeds ${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)} MB`);
      return;
    }

    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ---------- product images handler ----------
  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ensure total (existing + new) doesn't exceed limit
    if (imagesFiles.length + files.length > MAX_IMAGES_COUNT) {
      toast.warning(`You can upload max ${MAX_IMAGES_COUNT} images`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning("Only image files are allowed");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.warning(`One image exceeds ${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)} MB`);
        return;
      }

      // add File to files array for upload
      setImagesFiles((prev) => [...prev, file]);

      // create preview
      const reader = new FileReader();
      reader.onload = () => setImagesPreview((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImageAt = (index) => {
    setImagesFiles((p) => p.filter((_, i) => i !== index));
    setImagesPreview((p) => p.filter((_, i) => i !== index));
  };

  // ---------- submit ----------
  const newProductSubmitHandler = async (e) => {
    e.preventDefault();
    // basic validations
    if (!auth?.token) {
      toast.error("Not authenticated");
      return;
    }
    if (!name.trim()) { toast.warning("Product name required"); return; }
    if (!brand.trim()) { toast.warning("Brand required"); return; }
    if (!imagesFiles.length) { toast.warning("Add at least one product image"); return; }
    if (!logoFile) { toast.warning("Add brand logo"); return; }
    if (specs.length < 2) { toast.warning("Add at least 2 specifications"); return; }

    setIsSubmit(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice || "");
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("warranty", warranty || "");
      formData.append("brandName", brand);

      // append logo file (real File)
      formData.append("logo", logoFile);

      // append images — multiple entries named 'images'
      imagesFiles.forEach((f) => formData.append("images", f));

      // highlights & specs
      highlights.forEach((h) => formData.append("highlights", h));
      specs.forEach((s) => formData.append("specifications", JSON.stringify(s)));

      // call backend — let axios set content-type boundary automatically
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/new-product`,
        formData,
        {
          headers: { Authorization: `Bearer ${auth?.token}` }
          // large uploads may take longer — you can set timeout if needed
        }
      );

      if (res.status === 201 || res.data?.success) {
        toast.success("Product added successfully");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data?.message || "Unexpected response from server");
      }
    } catch (err) {
      console.error("Create product error:", err);
      const msg = err.response?.data?.message || err.message || "Server error";
      toast.error(msg);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <SeoData title="New Product | Admin" />
      <ScrollToTopOnRouteChange />
      {isSubmit ? (
        <div className="relative h-64 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={newProductSubmitHandler}
          encType="multipart/form-data"
          className="flex flex-col w-full sm:flex-row bg-white rounded-lg shadow p-4"
        >
          <div className="flex flex-col mx-auto py-2 gap-3 m-2 w-[90%]">
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Description"
              multiline
              rows={2}
              required
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex gap-2 justify-between">
              <TextField
                label="Price"
                type="number"
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                label="Discount Price"
                type="number"
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </div>

            <div className="flex justify-between gap-4">
              <TextField
                label="Category"
                select
                fullWidth
                variant="outlined"
                size="small"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((el, i) => (
                  <MenuItem value={el} key={i}>
                    {el}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Stock"
                type="number"
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              <TextField
                label="Warranty (months)"
                type="number"
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>

            {/* Highlights */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border rounded">
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  type="text"
                  placeholder="Highlight"
                  className="px-2 flex-1 outline-none border-none"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="py-2 px-6 bg-primaryBlue text-white rounded-r hover:shadow-lg"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded">
                    <span className="text-green-800 text-sm">{h}</span>
                    <button type="button" onClick={() => deleteHighlight(i)} className="text-red-600">
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand + Logo */}
            <h2 className="font-medium">Brand Details</h2>
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
              <TextField
                label="Brand"
                type="text"
                variant="outlined"
                size="small"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />

              <div className="w-24 h-24 flex items-center justify-center border rounded-lg relative overflow-hidden">
                {!logoPreview ? (
                  <ImageIcon />
                ) : (
                  <img draggable="false" src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain" />
                )}
              </div>

              <label className="rounded bg-primaryBlue text-center cursor-pointer text-white py-2 px-2.5">
                <input type="file" name="logo" accept="image/*" onChange={handleLogoChange} className="hidden" />
                Choose Logo
              </label>
            </div>

            {/* Specs */}
            <h2 className="font-medium">Specifications</h2>
            <div className="flex justify-between gap-2 items-center">
              <TextField value={specsInput.title} onChange={(e) => setSpecsInput({ ...specsInput, title: e.target.value })} name="title" label="Name" variant="outlined" size="small" />
              <TextField value={specsInput.description} onChange={(e) => setSpecsInput({ ...specsInput, description: e.target.value })} name="description" label="Description" variant="outlined" size="small" />
              <button type="button" onClick={addSpecs} className="py-2 px-6 bg-primaryBlue text-white rounded hover:shadow-lg">Add</button>
            </div>

            <div className="flex flex-col gap-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between gap-2 items-center text-sm rounded bg-blue-50 py-1 px-2">
                  <p className="text-gray-500 font-medium">{spec.title}</p>
                  <p>{spec.description}</p>
                  <button type="button" onClick={() => deleteSpec(i)} className="text-red-600">
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Product Images */}
            <h2 className="font-medium">Product Images <span className="ml-2 text-xs text-gray-500">(1 - {MAX_IMAGES_COUNT} images, max {Math.round(MAX_IMAGE_SIZE / 1024 / 1024)}MB each)</span></h2>

            <div className="flex gap-2 overflow-x-auto h-32 border rounded p-2">
              {imagesPreview.length === 0 && <div className="text-sm text-gray-400">No images selected</div>}
              {imagesPreview.map((image, i) => (
                <div key={i} className="relative w-40 h-full rounded overflow-hidden border">
                  <img src={image} alt={`preview-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImageAt(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-600">✕</button>
                </div>
              ))}
            </div>

            <label className="rounded font-medium bg-primaryBlue text-center cursor-pointer text-white py-2 px-3 shadow hover:shadow-lg my-2 inline-block">
              <input type="file" name="images" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
              Choose Files
            </label>

            <div className="flex justify-end">
              <button type="submit" className="bg-orange uppercase w-full p-3 text-black font-medium rounded shadow hover:shadow-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateProduct;
