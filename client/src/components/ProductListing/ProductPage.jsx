import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart"; // ✅ correct import

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart(); // ✅ fixed

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  // ✅ Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );
        if (res.data?.success) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.images?.[0]?.url);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // ✅ Quantity Control
  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  // ✅ Validation before adding to cart
  const validateSelection = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return false;
    }
    if (quantity < 1) {
      toast.error("Please select at least 1 quantity.");
      return false;
    }
    return true;
  };

  // ✅ Add to Cart
  const handleAddToCart = () => {
  if (!validateSelection()) return;

  const item = {
    ...product,
    selectedSize,
    selectedColor,
    quantity,
    productId: product._id,
  };

  addToCart(item, quantity);
  toast.success("Product added to cart!");
};

  // ✅ Buy Now
  const handleBuyNow = () => {
    if (!validateSelection()) return;

    handleAddToCart();
    navigate("/cart");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-rose-600 rounded-full"></div>
        <span className="ml-3 text-lg text-gray-700">Loading product...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold text-rose-600 mb-2">Oops!</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-24 md:mt-36">
      <div className="grid md:grid-cols-2 gap-12">
        {/* 🖼️ Image Gallery */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex gap-3 justify-center">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                  selectedImage === img.url
                    ? "border-rose-600 scale-105"
                    : "border-transparent hover:opacity-80"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* 📦 Product Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {product.name}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {product.description ||
              "A beautifully crafted piece for timeless elegance."}
          </p>

          {/* 💰 Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-rose-600">
              ₹{product.discountPrice?.toLocaleString()}
            </span>
            <span className="text-gray-400 line-through text-lg">
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          {/* 📏 Size Selector */}
          <div>
            <h4 className="font-semibold mb-2">Select Size:</h4>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border ${
                    selectedSize === size
                      ? "bg-rose-600 text-white border-rose-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🔢 Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <h4 className="font-semibold">Quantity:</h4>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => handleQuantityChange("dec")}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("inc")}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* 🛒 CTA Buttons */}
          <div className="flex gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="px-8 py-3 bg-rose-600 text-white font-medium rounded-lg shadow hover:bg-rose-700 transition"
            >
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="px-8 py-3 border border-gray-800 text-gray-800 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              Buy Now
            </motion.button>
          </div>

          {/* 📘 Meta Info */}
          <div className="pt-4 border-t text-gray-700">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Color:</strong> {product.color || "Various shades"}</p>
            <p><strong>Brand:</strong> {product.brand?.name || "Bright Rose"}</p>
          </div>
        </motion.div>
      </div>

      {/* 📝 Highlights */}
      <motion.div
        className="mt-16 bg-gray-50 p-8 rounded-2xl shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Product Highlights
        </h3>
        {product.highlights?.length ? (
          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {product.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            Crafted with natural fabrics and traditional craftsmanship.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ProductDetails;
