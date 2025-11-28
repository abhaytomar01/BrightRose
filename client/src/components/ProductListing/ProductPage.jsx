// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import fallbackImage from "../../assets/images/fallback.jpg";
import Handloom from "../../assets/images/garment/handloom.png";
import Silkmark from "../../assets/images/garment/silkmark.png";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const [isZoom, setIsZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);


  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [quantity, setQuantity] = useState(1);
const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const ALL_SIZES = ["XS","S", "M", "L", "XL", "XXL"];
  //-----------------------------------------------------
  // Sticky Bar
  //-----------------------------------------------------
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(!footerVisible);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [footerVisible]);

  //-----------------------------------------------------
  // Footer Visibility
  //-----------------------------------------------------
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => setFooterVisible(e.isIntersecting)),
      { threshold: 0.1 }
    );

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  //-----------------------------------------------------
  // Fetch Product
  //-----------------------------------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products/${productId}`
        );

        if (res.data.success) {
          const p = res.data.product;
          setProduct(p);

          setSelectedImage(p.images?.[0]?.url || fallbackImage);
          fetchRelated(p);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  //-----------------------------------------------------
  // Fetch Related
  //-----------------------------------------------------
  const fetchRelated = async (current) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/products`
      );

      if (res.data?.success) {
        const all = res.data.products;

        let filtered = all.filter(
          (item) =>
            item._id !== current._id &&
            (item.category === current.category ||
              item.color === current.color)
        );

        if (filtered.length === 0) filtered = all.slice(0, 8);

        setRelated(filtered.slice(0, 8));
      }
    } catch (error) {
      console.log("Failed to load related", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading…
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Product Not Found
      </div>
    );

  //-----------------------------------------------------
  // Gallery Setup
  //-----------------------------------------------------
  let gallery = product.images?.map((img) => img.url || img) || [];
  if (gallery.length < 4)
    gallery = [...gallery, fallbackImage, fallbackImage, fallbackImage].slice(
      0,
      5
    );

  const toggleAccordion = (id) =>
    setAccordionOpen(accordionOpen === id ? null : id);

  // Compute allowed max quantity (respect stock and maxQuantity)
  const allowedMax = Math.min(
    product.stock ?? Infinity,
    product.maxQuantity ?? Infinity
  );

  const handleQuantity = (type) =>
    setQuantity((q) => {
      if (type === "inc") {
        if (q >= allowedMax) return q; // don't increase beyond allowed max
        return q + 1;
      } else {
        return q > 1 ? q - 1 : q;
      }
    });

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Please select size");
    // ensure selected size is available
    const availableSizes =
      Array.isArray(product.sizes) && product.sizes.length
        ? product.sizes
        : ALL_SIZES;

    if (!availableSizes.includes(selectedSize)) {
      return toast.error("Selected size is not available");
    }

    if (quantity > allowedMax) {
      return toast.error(`Only ${allowedMax} item(s) available`);
    }

    addToCart(
      { ...product, selectedSize, productId: product._id },
      quantity
    );
    toast.success("Added to cart");
  };

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setIsLightboxOpen(true);
  };
  //-----------------------------------------------------
  // RENDER
  //-----------------------------------------------------
  return (
    <div className="max-w-8xl mx-2 px-0 pt-28 md:pt-40 pb-36 bg-white text-[#1A1A1A]">

      {/* PRODUCT MAIN */}
      <div className="grid md:grid-cols-2 gap-6 mt-4">

{/* LEFT – GALLERY */}
<div className="flex gap-5">

  {/* DESKTOP THUMBNAILS */}
  <div className="hidden md:flex flex-col gap-3 w-[110px] overflow-auto max-h-[650px] pr-1">
    {gallery.map((img, idx) => (
      <div
        key={idx}
        onClick={() => {
          setSelectedImage(img);
          setSelectedIndex(idx);
        }}
        className={`w-full h-[140px] bg-white rounded-md overflow-hidden cursor-pointer border 
        ${selectedIndex === idx ? "border-black" : "border-neutral-300"}`}
      >
        <img src={img} className="w-full h-full object-contain bg-neutral-50" />
      </div>
    ))}
  </div>

  {/* MAIN IMAGE AREA */}
  <div className="flex-1 relative">

    {/* DESKTOP MAIN IMAGE + HOVER ZOOM */}
    {/* DESKTOP MAIN IMAGE – REAL IMAGE + HOVER ZOOM */}
<div
  className="hidden md:flex items-center justify-center w-full h-[650px] bg-neutral-50 rounded-lg relative overflow-hidden"
  onMouseEnter={() => setIsZoom(true)}
  onMouseLeave={() => setIsZoom(false)}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }}
  onClick={() => openLightbox(selectedIndex)}
>
  {/* BASE IMAGE (always visible, perfectly sized) */}
  <img
    src={selectedImage}
    className="max-h-full max-w-full object-contain transition-opacity duration-200"
  />

  {/* ZOOMED IMAGE (only visible on hover) */}
  {isZoom && (
    <img
      src={selectedImage}
      className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      style={{
        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
        transform: "scale(2.2)",
        opacity: 1,
        transition: "transform 0.2s ease-out",
      }}
    />
  )}
</div>


   {/* MOBILE IMAGE SLIDER (real swipe) */}
<div
  className="md:hidden relative w-full overflow-hidden"
  onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
  onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
  onTouchEnd={() => {
    if (touchStart - touchEnd > 50) {
      // swipe left → next
      setSelectedIndex((prev) =>
        prev === gallery.length - 1 ? prev : prev + 1
      );
    }
    if (touchStart - touchEnd < -50) {
      // swipe right → previous
      setSelectedIndex((prev) => (prev === 0 ? 0 : prev - 1));
    }
  }}
>
  {/* Slider wrapper */}
  <div
    className="flex transition-transform duration-500"
    style={{
      transform: `translateX(-${selectedIndex * 100}%)`,
    }}
  >
    {gallery.map((img, idx) => (
      <div
        key={idx}
        className="w-full flex-shrink-0 flex justify-center bg-neutral-50"
        onClick={() => openLightbox(idx)}
      >
        <img
          src={img}
          className="max-h-[550px] object-contain"
        />
      </div>
    ))}
  </div>

  {/* DOT INDICATORS */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    {gallery.map((_, idx) => (
      <div
        key={idx}
        className={`w-3 h-3 rounded-full ${
          selectedIndex === idx ? "bg-black" : "bg-gray-300"
        }`}
      ></div>
    ))}
  </div>
</div>

  </div>
</div>


        {/* RIGHT – DETAILS */}
        <div className="flex flex-col gap-6 px-2 pr-6">


         {/* PRODUCT TITLE */}
  <h1 className="text-xl md:text-3xl font-light tracking-wide leading-snug">
    {product.name}
  </h1>

  {/* SHORT SUBTITLE (optional you can remove if not needed) */}
  <p className="text-neutral-500 text-xs md:text-sm tracking-wide">
    {product.weavingArt}
  </p>

   {/* PRICE */}
  <div className="mt-1">
    <p className="text-[22px] md:text-[26px] font-light text-neutral-900">
      ₹{product.price}
    </p>
    <p className="text-[11px] text-neutral-500 mt-1 tracking-wide">
      (Inclusive of all taxes)
    </p>
  </div>
 

  {/* Label ONE OF A KIND */}
  <p className="text-[12px] text-neutral-600 tracking-[0.15em] uppercase">
    One - of - a - kind
  </p>

  {/* SIZE SECTION */}
  <div className="mt-2">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-neutral-700 tracking-wide">Sizes</p>

      <button
        onClick={() => setIsSizeChartOpen(true)}
        className="text-xs underline text-neutral-500 hover:text-black transition"
      >
        Size guide
      </button>
    </div>

    {/* SIZE BUTTONS DIOR STYLE */}
    <div className="flex gap-2 flex-wrap mt-2">
      {ALL_SIZES.map((s) => {
        const available =
          Array.isArray(product.sizes) && product.sizes.length
            ? product.sizes.includes(s)
            : true;

        if (!available) {
          return (
            <button
              key={s}
              type="button"
              className="px-4 py-2 rounded-md border text-xs opacity-30 line-through cursor-not-allowed border-neutral-200"
            >
              {s}
            </button>
          );
        }

        return (
          <button
            key={s}
            onClick={() => setSelectedSize(s)}
            className={`px-4 py-2 text-xs rounded-md border transition-all tracking-wide
              ${
                selectedSize === s
                  ? "bg-black text-white border-black"
                  : "border-neutral-300 hover:border-neutral-500"
              }
            `}
          >
            {s}
          </button>
        );
      })}
    </div>
  </div>

  {/* QUANTITY */}
  <div className="flex items-center gap-4 mt-4">
    <p className="text-xs md:text-sm font-medium text-neutral-700">Quantity</p>

    <div className="flex items-center border border-neutral-300 rounded-md">
      <button
        onClick={() => handleQuantity("dec")}
        className="px-3 py-1 text-sm"
      >
        –
      </button>
      <span className="px-4 text-sm">{quantity}</span>
      <button
        onClick={() => handleQuantity("inc")}
        className={`px-3 py-1 text-sm ${
          quantity >= allowedMax ? "opacity-40 cursor-not-allowed" : ""
        }`}
        disabled={quantity >= allowedMax}
      >
        +
      </button>
    </div>
  </div>


         {/* ACCORDIONS */}
<div className="mt-0">
  {[
    { id: "col", title: " Color", content: product.color },
    { id: "fab", title: " Fabric", content: product.fabric },
    { id: "desc", title: " Description", content: product.description },
    { id: "spec", title: "Specification", content: product.specification },
    { id: "care", title: "Care", content: product.care },

    // ✅ NEW BADGES ACCORDION
    {
      id: "badge",
      title: "Authenticity Certificates",
      content: (
        <div className="flex items-center gap-4 py-2">

          <div className="border border-neutral-300 rounded-md shadow-sm p-2">
            <img src={Handloom} className="h-14 object-contain" />
          </div>

          <div className="border border-neutral-300 rounded-md shadow-sm p-2">
            <img src={Silkmark} className="h-14 object-contain" />
          </div>

        </div>
      )
    },

    // DELIVERY ACCORDION
    {
      id: "delivery",
      title: "Delivery & Returns",
      content: (
        <div className="space-y-3 leading-relaxed text-sm text-neutral-700">
          <p>
            In order to minimise any discrepancies, almost all our products for direct
            sale on our website are free of conventional sizing. This mitigates the need
            for most return issues concerning inaccurate fit. However, if you are unsure 
            of any aspect of the purchase, please contact our client services before ordering.
          </p>

          <div className="pt-4">
            <Link
              to="/exchange-return"
              className="text-neutral underline font-medium hover:text-black transition"
            >
              Read full Return & Exchange policy →
            </Link>
          </div>
        </div>
      )
    }
  ].map((item) => (
    <div key={item.id} className="border-b border-neutral-300/70 pb-2">
      <button
        onClick={() => toggleAccordion(item.id)}
        className="w-full flex justify-between items-center py-3 text-sm font-medium tracking-wide"
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
          accordionOpen === item.id
            ? "max-h-80 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm text-neutralDark/70 pb-3">
          {item.content}
        </div>
      </div>
    </div>
  ))}
</div>


          {/* ADD TO CART */}
          <div className="hidden md:flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-3 rounded-md text-sm tracking-wide hover:bg-neutral-900 transition"
            >
              Add to cart
            </button>

            <a
              href="https://wa.me/919910929099"
              target="_blank"
              rel="noreferrer"
              className="flex-1 border border-neutral-400 py-3 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.04 2C6.51 2 2 6.51 2 12.04c0 1.93.54 3.81 1.56 5.45L2 22l4.66-1.53c1.59.87 3.38 1.33 5.38 1.33 5.53 0 10.04-4.51 10.04-10.04S17.57 2 12.04 2zm0 18.12c-1.68 0-3.31-.45-4.74-1.3l-.34-.2-2.76.9.92-2.69-.22-.35a8.08 8.08 0 01-1.25-4.44c0-4.49 3.66-8.14 8.14-8.14s8.14 3.66 8.14 8.14-3.66 8.14-8.14 8.14zm4.46-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.22-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.38.1-.5.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.18 3.58.58.24 1.04.38 1.4.48.58.18 1.1.16 1.52.1.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"></path>
              </svg>
              Happy to Help
            </a>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-12 px-2">
        <h2 className="text-lg md:text-2xl font-light tracking-wide mb-6">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((item) => (
            <Link
              to={`/product/${item._id}`}
              key={item._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={item.images?.[0]?.url || fallbackImage}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-4 text-center">
                <p className="text-neutralDark text-sm font-medium line-clamp-1">
                  {item.name}
                </p>

                <p className="text-neutralDark/70 text-sm mt-1 font-medium">
                  ₹{item.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <button
            onClick={() =>
              setLightboxIndex((i) => (i === 0 ? gallery.length - 1 : i - 1))
            }
            className="absolute left-6 text-white text-4xl"
          >
            ❮
          </button>

          <img
            src={gallery[lightboxIndex]}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          <button
            onClick={() =>
              setLightboxIndex((i) => (i + 1) % gallery.length)
            }
            className="absolute right-6 text-white text-4xl"
          >
            ❯
          </button>
        </div>
      )}

      {/* MOBILE STICKY BAR */}
      {showStickyBar && !footerVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="flex">
            <button
              onClick={handleAddToCart}
              className="w-1/2 bg-black text-white py-3 text-sm"
            >
              Add to cart
            </button>
            <a
              href="https://wa.me/919910929099"
              target="_blank"
              rel="noreferrer"
              className="w-1/2 bg-black text-white border border-neutral-400 py-3 text-sm flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M12.04 2C6.51 2 2 6.51 2 12.04c0 1.93.54 3.81 1.56 5.45L2 22l4.66-1.53c1.59.87 3.38 1.33 5.38 1.33 5.53 0 10.04-4.51 10.04-10.04S17.57 2 12.04 2zm0 18.12c-1.68 0-3.31-.45-4.74-1.3l-.34-.2-2.76.9.92-2.69-.22-.35a8.08 8.08 0 01-1.25-4.44c0-4.49 3.66-8.14 8.14-8.14s8.14 3.66 8.14 8.14-3.66 8.14-8.14 8.14zm4.46-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.22-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.38.1-.5.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.18 3.58.58.24 1.04.38 1.4.48.58.18 1.1.16 1.52.1.46-.06 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"></path>
              </svg>
              Happy to Help
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
