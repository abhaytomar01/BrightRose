import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch Product
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
        } else setError("Product not found");
      } catch (err) {
        setError("Unable to fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const validateSelection = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;
    addToCart(
      {
        ...product,
        selectedSize,
        quantity,
        productId: product._id,
      },
      quantity
    );
    toast.success("Added to cart!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading product...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-2 underline">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-28 md:pt-44 bg-[#FCF7F1]">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* LEFT — Product Images */}
        <div>
          <div className="w-full h-[420px] md:h-[550px] bg-[#FCF7F1] rounded-lg overflow-hidden flex items-center justify-center">
            <img
  src={selectedImage || fallbackImage}
  alt="product"
  onError={(e) => (e.target.src = fallbackImage)}
  className="w-full h-full object-cover"
/>

          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images?.map((img, i) => (
              <img
  key={i}
  src={img.url || fallbackImage}
  onError={(e) => (e.target.src = fallbackImage)}
  onClick={() => setSelectedImage(img.url || fallbackImage)}
  className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
    selectedImage === img.url ? "border-black" : "border-gray-300"
  }`}
/>

            ))}
          </div>
        </div>

        {/* RIGHT — Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl tracking-wide text-gray-900">
            {product.name}
          </h1>

          

          {/* Price */}
          <div>
            <p className="text-2xl font-semibold">₹{product.discountPrice}</p>
            <p className="text-gray-400 line-through text-sm">
              ₹{product.price}
            </p>
          </div>

          {/* Size Selector */}
          <div>
            <p className="text-sm font-medium mb-2 tracking-wide">SIZE</p>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-sm rounded-md ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">QUANTITY</p>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantity("dec")}
                className="px-3 py-1"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantity("inc")}
                className="px-3 py-1"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-black text-white tracking-wide text-sm rounded-md"
          >
            ADD TO CART
          </button>

<p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {product.description}
          </p>
          {/* Meta Info */}
          <div className="pt-4 border-t text-sm text-gray-600 space-y-1">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Color:</strong> {product.color}</p>
            <p><strong>Brand:</strong> {product.brand?.name}</p>
          </div>
        </div>
      </div>

      {/* The Story Behind — Section */}
      <div className="mt-16 border-t pt-10 text-gray-700">
        <h2 className="text-xl mb-3 tracking-wide">THE STORY BEHIND</h2>
        <p className="leading-relaxed text-sm md:text-base">
          {product.story ||
            "Crafted with elegance, passion, and heritage. A timeless expression of artistry."}
        </p>
      </div>

      {/* Perfect Partner — You can map related products here */}
      <div className="mt-16">
        <h2 className="text-xl tracking-wide mb-6">THE PERFECT PARTNER</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* You can later fetch recommended products */}
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
          <div className="w-full h-40 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
