import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);

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
    tags: "",
  });

  const [oldImages, setOldImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [newPreview, setNewPreview] = useState([]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleNewImages = async (e) => {
    const files = Array.from(e.target.files);

    for (let f of files) {
      const base64 = await toBase64(f);
      setNewImages((p) => [...p, base64]);
      setNewPreview((p) => [...p, base64]);
    }
  };

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
        tags: p.tags?.join(", "),
      });

      setOldImages(p.images);
    } catch (err) {
      toast.error("Unable to load product");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const removeOld = (pid) => {
    setOldImages((prev) => prev.filter((img) => img.public_id !== pid));
    setRemovedImages((prev) => [...prev, pid]);
  };

  const removeNew = (i) => {
    setNewImages((p) => p.filter((_, idx) => idx !== i));
    setNewPreview((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products/update/${productId}`,
        {
          ...form,
          tags: form.tags.split(",").map((t) => t.trim()),
          oldImages,
          removedImages,
          images: newImages,
        },
        {
          headers: {
            Authorization: `Bearer ${authAdmin?.token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated!");
        navigate("/admin/dashboard/all-products");
      }
    } catch (error) {
      toast.error("Update failed");
    }

    setLoading(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="pt-24 p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Edit Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-4 rounded-lg"
      >
        {Object.keys(form).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium capitalize">
              {key}
            </label>
            <input
              name={key}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
        ))}

        {/* OLD IMAGES */}
        <h3 className="font-medium mt-4">Current Images</h3>
        <div className="flex gap-2 overflow-x-auto">
          {oldImages.map((img) => (
            <div key={img.public_id} className="relative">
              <img
                src={img.url}
                className="w-20 h-20 border rounded object-contain"
              />
              <button
                onClick={() => removeOld(img.public_id)}
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <h3 className="font-medium">Add New Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleNewImages} />

        <div className="flex gap-2 mt-2">
          {newPreview.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                className="w-20 h-20 border rounded object-contain"
              />
              <button
                onClick={() => removeNew(i)}
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white px-1"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-black text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
