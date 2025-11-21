//-----------------------------------------------------------
// PRODUCT DETAILS PAGE (FINAL WITHOUT HEART ICON)
//-----------------------------------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import fallbackImage from "../../assets/images/fallback.jpg";
import Handloom from "../../assets/images/garment/handloom.png";
import Silkmark from "../../assets/images/garment/silkmark.png";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Mobile sticky bar
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // LIGHTBOX STATES
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // -----------------------------
  // Sticky bar logic
  // -----------------------------
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(!footerVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerVisible]);

  // Hide sticky bar when footer appears
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setFooterVisible(entry.isIntersecting));
      },
      { threshold: 0.1 }
    );

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  // -----------------------------
  // Fetch product
  // -----------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        if (res.data.success) {
          setProduct(res.data.product);

          const firstImg =
            res.data.product.images?.[0]?.url ||
            res.data.product.images?.[0] ||
            fallbackImage;

          setSelectedImage(firstImg);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  if (!product)
    return <div className="min-h-screen flex items-center justify-center">Not Found</div>;

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  // Force gallery to have 4+ images for lightbox testing
  let gallery = product.images?.map((img) => img.url || img) || [];

  if (gallery.length < 4) {
    gallery = [
      ...gallery,
      fallbackImage,
      fallbackImage,
      fallbackImage,
      fallbackImage,
    ].slice(0, 5);
  }

  const toggleAccordion = (id) => {
    setAccordionOpen(accordionOpen === id ? null : id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Please select size");

    addToCart(
      {
        ...product,
        selectedSize,
        productId: product._id,
      },
      quantity
    );

    toast.success("Added to cart");
  };

  // LIGHTBOX functions
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const nextImage = () =>
    setLightboxIndex((prev) => (prev + 1) % gallery.length);

  const prevImage = () =>
    setLightboxIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 md:pt-36 pb-36 bg-[#FCF7F1] text-gray-800">

      <div className="grid md:grid-cols-2 gap-10 mt-4 md:mt-8 items-start">

        {/* LEFT SIDE — GALLERY */}
        <div className="flex gap-5">
          
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-4 w-[110px]">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedImage(img);
                  setSelectedIndex(idx);
                  openLightbox(idx);
                }}
                className={`w-full h-28 rounded-md overflow-hidden cursor-pointer border ${
                  selectedIndex === idx ? "border-black" : "border-gray-300"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative">
            <img
              src={selectedImage}
              onError={(e) => (e.target.src = fallbackImage)}
              onClick={() => openLightbox(selectedIndex)}
              className="w-full h-[550px] object-cover rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* RIGHT SIDE — DETAILS */}
        <div className="flex flex-col gap-4 text-gray-800 mt-2">

          <h1 className="text-lg md:text-xl font-semibold tracking-wide leading-tight">
            {product.name}
          </h1>

          {/* Logos */}
          <div className="flex items-center gap-4 mt-1">
            <img src={Handloom} className="h-16 object-contain" />
            <img src={Silkmark} className="h-16 object-contain" />
          </div>

          {/* Price */}
          <div className="text-sm mt-1">
            <span className="text-gray-600">Price: </span>
            <span className="text-[#AD000F] font-medium text-base">
              ₹{product.price}
            </span>
          </div>

          {/* Color */}
          <div className="text-sm">{product.color || "-"}</div>

          {/* Fabric */}
          <div className="text-sm text-gray-600">{product.fabric}</div>

          {/* Weaving Art */}
          <div className="text-sm text-gray-600">
            Weaving Art - {product.weavingArt}
          </div>

          {/* Size */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Size</p>
            <div className="flex gap-3">
              {(product.sizes?.length ? product.sizes : ["S","M","L","XL"]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">QUANTITY</p>
            <div className="flex items-center border rounded-md">
              <button onClick={() => handleQuantity("dec")} className="px-3 py-1">-</button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => handleQuantity("inc")} className="px-3 py-1">+</button>
            </div>
          </div>

          {/* One of a kind */}
          <p className="text-lg text-gray-600 mt-2">One of a kind</p>

          {/* Accordions */}
          <div className="mt-2 flex flex-col gap-2">
            {[ 
              { id: "desc", title: "Product Description", content: product.description },
              { id: "spec", title: "Specification", content: product.specification },
              { id: "care", title: "Care", content: product.care },
              { id: "delivery", title: "Delivery & Returns", content: "Free delivery & 7-day returns." },
            ].map((item) => (
              <div key={item.id} className="border-b pb-2">
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex justify-between items-center py-3 text-sm font-medium"
                >
                  {item.title}
                  <span
                    className={`transition-transform ${
                      accordionOpen === item.id ? "rotate-180" : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    accordionOpen === item.id ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="text-sm text-gray-700 pb-3">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Add to Cart */}
          <div className="hidden md:flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 rounded-md text-sm"
            >
              Add to cart
            </button>
            <a
              href="https://wa.me/919910929099"
              target="_blank"
              className="flex-1 border border-gray-400 py-3 rounded-md text-sm flex items-center justify-center"
            >
              ☎ Happy to help
            </a>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-3xl">
            ✕
          </button>
          <button onClick={prevImage} className="absolute left-4 md:left-10 text-white text-4xl">
            ❮
          </button>

          <img src={gallery[lightboxIndex]} className="max-w-[90vw] max-h-[90vh] object-contain" />

          <button onClick={nextImage} className="absolute right-4 md:right-10 text-white text-4xl">
            ❯
          </button>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {showStickyBar && !footerVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="flex w-full shadow-xl">
            <button
              onClick={handleAddToCart}
              className="w-1/2 bg-black text-white py-3 text-sm"
            >
              Add to cart
            </button>
            <a
              href="https://wa.me/919910929099"
              target="_blank"
              className="w-1/2 bg-white border py-3 text-sm flex justify-center items-center"
            >
              ☎ Help
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
