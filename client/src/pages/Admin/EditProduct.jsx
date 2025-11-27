// src/pages/Admin/EditProduct.jsx
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { categories } from "../../utils/constants";
import SeoData from "../../SEO/SeoData";
import ScrollToTopOnRouteChange from "../../utils/ScrollToTopOnRouteChange";

const EditProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [warranty, setWarranty] = useState("");
  const [brand, setBrand] = useState("");

  // Highlights
  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");

  // Specifications
  const [specs, setSpecs] = useState([]);
  const [specsInput, setSpecsInput] = useState({ title: "", description: "" });

  // Images
  const MAX_IMAGES = 10;
  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB

  const [oldImages, setOldImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);

  // Logo
  const [oldLogo, setOldLogo] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // =========== ADD ITEM HANDLERS ===========
  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const addSpec = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setSpecs([...specs, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const deleteHighlight = (i) => {
    setHighlights((prev) => prev.filter((_, idx) => idx !== i));
  };

  const deleteSpec = (i) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  };

  // =========== IMAGE UPLOAD HANDLING ===========
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning("Logo image exceeds 50 MB");
      return;
    }

    if (oldLogo?.public_id) setRemovedImages((prev) => [...prev, oldLogo.public_id]);
    setOldLogo(null);

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setLogo(file);
    };
    reader.readAsDataURL(file);
  };

  const handleProductImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (oldImages.length + newImages.length + files.length > MAX_IMAGES) {
      toast.warning(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.warning("One image exceeds 50 MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setNewImagesPreview((prev) => [...prev, reader.result]);
        setNewImages((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeOldImage = (id) => {
    setOldImages((prev) => prev.filter((img) => img.public_id !== id));
    setRemovedImages((prev) => [...prev, id]);
  };

  const removeNewImage = (i) => {
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
    setNewImagesPreview((prev) => prev.filter((_, idx) => idx !== i));
  };

  // =========== SUBMIT UPDATE ===========
  const newProductUpdateHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (specs.length < 2) {
      toast.warning("Add at least 2 specifications");
      setIsSubmit(false);
      return;
    }

    if (oldImages.length + newImages.length === 0) {
      toast.warning("Add at least 1 product image");
      setIsSubmit(false);
      return;
    }

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

      // logo
      if (logo) formData.append("logo", logo);
      formData.append("oldLogo", JSON.stringify(oldLogo || {}));

      // new uploaded images
      newImages.forEach((img) => formData.append("images", img));

      // old images
      formData.append("oldImages", JSON.stringify(oldImages));

      // removed images
      removedImages.forEach((id) => formData.append("removedImages", id));

      // highlights & specs
      highlights.forEach((h) => formData.append("highlights", h));
      specs.forEach((s) => formData.append("specifications", JSON.stringify(s)));

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authAdmin.token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Product updated successfully!");
        navigate("/admin/dashboard/all-products");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmit(false);
    }
  };

  // =========== LOAD PRODUCT DATA ===========
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        const p = res.data.product;

        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setDiscountPrice(p.discountPrice);
        setCategory(p.category);
        setStock(p.stock);
        setWarranty(p.warranty);
        setBrand(p.brand?.name);
        setHighlights(p.highlights || []);
        setSpecs(p.specifications || []);

        setOldLogo(p.brand?.logo ? { url: p.brand.logo.url, public_id: p.brand.logo.public_id } : null);

        setOldImages(
          p.images.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          }))
        );
      } catch (err) {
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, []);

  if (loading || isSubmit) return <Spinner />;

  return (
    <>
      <SeoData title="Edit Product" />
      <ScrollToTopOnRouteChange />

      <form
        id="mainForm"
        onSubmit={newProductUpdateHandler}
        encType="multipart/form-data"
        className="bg-white rounded-lg shadow p-4 flex flex-col gap-6 sm:flex-row"
      >
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col gap-4">
          <TextField size="small" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField size="small" multiline rows={2} label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="flex gap-3">
            <TextField size="small" label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <TextField size="small" label="Discount Price" type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <TextField select size="small" fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField size="small" type="number" label="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
            <TextField size="small" type="number" label="Warranty (Months)" value={warranty} onChange={(e) => setWarranty(e.target.value)} />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex gap-2">
              <input className="border p-2 flex-1" placeholder="Add highlight" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} />
              <button type="button" onClick={addHighlight} className="bg-primaryBlue px-4 text-neutralDark/80 rounded">
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <span>{h}</span>
                  <DeleteIcon className="text-red-600 cursor-pointer" onClick={() => deleteHighlight(i)} />
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex gap-2">
              <TextField size="small" label="Title" value={specsInput.title} onChange={(e) => setSpecsInput({ ...specsInput, title: e.target.value })} />
              <TextField size="small" label="Description" value={specsInput.description} onChange={(e) => setSpecsInput({ ...specsInput, description: e.target.value })} />
              <button type="button" onClick={addSpec} className="bg-primaryBlue px-4 text-neutralDark/80 rounded">
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {specs.map((s, i) => (
                <div key={i} className="flex justify-between bg-blue-50 p-2 rounded">
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm">{s.description}</p>
                  </div>
                  <DeleteIcon className="text-red-600 cursor-pointer" onClick={() => deleteSpec(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full sm:w-80 flex flex-col gap-4">
          <h3 className="font-medium">Brand Logo</h3>

          <div className="flex items-center gap-3">
            <div className="w-28 h-28 border flex items-center justify-center overflow-hidden">
              {oldLogo ? (
                <img src={oldLogo.url} alt="logo" className="w-full h-full object-contain" />
              ) : logoPreview ? (
                <img src={logoPreview} className="w-full h-full object-contain" />
              ) : (
                <ImageIcon />
              )}
            </div>

            <label className="bg-primaryBlue px-3 py-2 text-neutralDark/80 rounded cursor-pointer">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              Choose Logo
            </label>
          </div>

          <h3 className="font-medium">Product Images</h3>

          {/* OLD IMAGES */}
          <div className="flex gap-2 overflow-x-auto">
            {oldImages.map((img) => (
              <div key={img.public_id} className="w-20 h-20 border relative">
                <img src={img.url} className="w-full h-full object-contain opacity-90" />
                <button
                  type="button"
                  onClick={() => removeOldImage(img.public_id)}
                  className="absolute top-0 right-0 bg-red-600 text-neutralDark/80 px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* NEW IMAGES */}
          <div className="flex gap-2 overflow-x-auto mt-2">
            {newImagesPreview.map((img, i) => (
              <div key={i} className="w-20 h-20 border relative">
                <img src={img} className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-neutralDark/80 px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <label className="bg-primaryBlue px-3 py-2 text-neutralDark/80 rounded cursor-pointer mt-2">
            <input type="file" accept="image/*" multiple onChange={handleProductImages} className="hidden" />
            Add Images
          </label>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              form="mainForm"
              className="bg-orange w-full p-2 text-neutralDark/80 uppercase rounded"
            >
              Update
            </button>

            <Link
              to="/admin/dashboard/all-products"
              className="bg-red-600 w-full p-2 text-white uppercase rounded text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditProduct;
