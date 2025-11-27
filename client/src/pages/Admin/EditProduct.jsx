// src/pages/Admin/EditProduct.jsx
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import ImageIcon from "@mui/icons-material/Image";
import { categories } from "../../utils/constants";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useAuth } from "../../context/auth";
import ScrollToTopOnRouteChange from "./../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../SEO/SeoData";

const EditProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  // product fields
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

  // images handling
  const [images, setImages] = useState([]); // new images (base64/File depending on upload UI)
  const [imagesPreview, setImagesPreview] = useState([]); // previews for new images
  const [oldImages, setOldImages] = useState([]); // existing images [{url, public_id}]
  const [removedImages, setRemovedImages] = useState([]); // public_ids to remove on update

  // logo
  const [logo, setLogo] = useState(null); // base64 or File
  const [logoPreview, setLogoPreview] = useState("");
  const [oldLogo, setOldLogo] = useState(null);

  const MAX_IMAGE_SIZE = 500 * 1024; // keep as earlier (500KB)
  const MAX_IMAGES = 4;

  // ---------- helpers ----------
  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setSpecs((p) => [...p, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const addHighlight = () => {
    if (!highlightInput?.trim()) return;
    setHighlights((p) => [...p, highlightInput]);
    setHighlightInput("");
  };

  const deleteHighlight = (i) => setHighlights((p) => p.filter((_, idx) => idx !== i));
  const deleteSpec = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  // logo change (File -> DataURL)
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning("Logo exceeds 500 KB");
      return;
    }

    // mark old logo for removal if present
    if (oldLogo?.public_id) setRemovedImages((p) => [...p, oldLogo.public_id]);
    setOldLogo(null);

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setLogo(file); // keep File for upload
    };
    reader.readAsDataURL(file);
  };

  // product images
  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (oldImages.length + images.length + files.length > MAX_IMAGES) {
      toast.warning(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.warning("One of the images exceeds 500 KB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImagesPreview((p) => [...p, reader.result]);
        setImages((p) => [...p, file]); // store File for upload
      };
      reader.readAsDataURL(file);
    });
  };

  const removeOldImage = (public_id) => {
    setOldImages((p) => p.filter((img) => img.public_id !== public_id));
    setRemovedImages((p) => [...p, public_id]);
  };

  const removeNewImage = (index) => {
    setImages((p) => p.filter((_, i) => i !== index));
    setImagesPreview((p) => p.filter((_, i) => i !== index));
  };

  // ---------- submit update ----------
  const newProductUpdateHandler = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const validationErrors = [];
    if (specs.length < 2) validationErrors.push("Please add at least 2 specifications");
    if (oldImages.length === 0 && images.length === 0) validationErrors.push("Please add at least 1 product image");

    if (validationErrors.length) {
      validationErrors.forEach((m) => toast.warning(m));
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

      if (logo) formData.append("logo", logo);
      formData.append("oldLogo", JSON.stringify(oldLogo || {}));

      images.forEach((file) => formData.append("images", file));
      highlights.forEach((h) => formData.append("highlights", h));
      specs.forEach((s) => formData.append("specifications", JSON.stringify(s)));
      formData.append("oldImages", JSON.stringify(oldImages));
      removedImages.forEach((id) => formData.append("removedImages", id));

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authAdmin.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Product Updated Successfully!");
        navigate("/admin/dashboard/all-products");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmit(false);
    }
  };

  // ---------- fetch product data ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        const p = res.data.product;
        setName(p.name || "");
        setDescription(p.description || "");
        setPrice(p.price || "");
        setDiscountPrice(p.discountPrice || "");
        setCategory(p.category || "");
        setStock(p.stock || "");
        setWarranty(p.warranty || "");
        setBrand(p.brand?.name || "");
        setHighlights(p.highlights || []);
        setSpecs(p.specifications || []);
        setOldLogo(p.brand?.logo ? { url: p.brand.logo.url, public_id: p.brand.logo.public_id } : null);
        setOldImages((prev) => {
          const arr = [];
          (p.images || []).forEach((img) => {
            arr.push({ url: img.url, public_id: img.public_id });
          });
          return arr;
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Unable to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading || isSubmit) return <Spinner />;

  return (
    <>
      <SeoData title="Edit Product" />
      <ScrollToTopOnRouteChange />

      <form onSubmit={newProductUpdateHandler} encType="multipart/form-data" className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4 gap-4">
        <div className="flex-1 flex flex-col gap-3">
          <TextField label="Name" variant="outlined" size="small" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Description" multiline rows={2} required variant="outlined" size="small" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="flex gap-2">
            <TextField label="Price" type="number" variant="outlined" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} />
            <TextField label="Discount Price" type="number" variant="outlined" size="small" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <TextField select label="Category" fullWidth variant="outlined" size="small" required value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Stock" type="number" variant="outlined" size="small" required value={stock} onChange={(e) => setStock(e.target.value)} />
            <TextField label="Warranty" type="number" variant="outlined" size="small" value={warranty} onChange={(e) => setWarranty(e.target.value)} />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex gap-2">
              <input className="border p-2 flex-1" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} placeholder="Highlight" />
              <button type="button" onClick={addHighlight} className="bg-primaryBlue text-neutralDark/80 px-4">Add</button>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <div>{h}</div>
                  <button onClick={() => deleteHighlight(i)} className="text-red-600"><DeleteIcon /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <div className="flex gap-2">
              <TextField value={specsInput.title} onChange={(e) => setSpecsInput({ ...specsInput, title: e.target.value })} name="title" label="Name" size="small" />
              <TextField value={specsInput.description} onChange={(e) => setSpecsInput({ ...specsInput, description: e.target.value })} name="description" label="Description" size="small" />
              <button type="button" onClick={addSpecs} className="bg-primaryBlue text-neutralDark/80 px-4">Add</button>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between gap-2 items-center rounded bg-blue-50 py-1 px-2">
                  <div className="flex-1">
                    <p className="font-medium">{spec.title}</p>
                    <p className="text-sm">{spec.description}</p>
                  </div>
                  <button onClick={() => deleteSpec(i)} className="text-red-600"><DeleteIcon /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          <h3 className="font-medium">Brand</h3>
          <TextField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} size="small" />

          <div className="flex items-center gap-3">
            <div className="w-24 h-24 border flex items-center justify-center overflow-hidden">
              {oldLogo ? <img src={oldLogo.url} alt="logo" className="w-full h-full object-contain" /> : logoPreview ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain" /> : <ImageIcon />}
            </div>
            <label className="bg-primaryBlue text-neutralDark/80 px-3 py-2 rounded cursor-pointer">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              Choose Logo
            </label>
          </div>

          <h3 className="font-medium">Images</h3>
          <div className="flex gap-2 overflow-x-auto">
            {imagesPreview.map((img, i) => (
              <div key={i} className="w-20 h-20 relative border">
                <img src={img} alt={`new-${i}`} className="w-full h-full object-contain" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 text-neutralDark/80 bg-red-600 px-1">X</button>
              </div>
            ))}
            {oldImages.map((img) => (
              <div key={img.public_id} className="w-20 h-20 relative border group">
                <img src={img.url} alt="old" className="w-full h-full object-contain group-hover:opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button type="button" onClick={() => removeOldImage(img.public_id)} className="bg-red-600 text-neutralDark/80 px-2 py-1 rounded">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <label className="bg-primaryBlue text-neutralDark/80 px-3 py-2 rounded cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
            Add Images
          </label>

          <div className="flex gap-2">
            <input form="mainForm" type="submit" className="bg-orange uppercase w-full p-2 text-neutralDark/80 rounded cursor-pointer" value="Update" />
            <Link to="/admin/dashboard/all-products" className="bg-red-600 uppercase w-full p-2 text-white rounded text-center">Cancel</Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditProduct;
