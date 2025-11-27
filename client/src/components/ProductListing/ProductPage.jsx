//-----------------------------------------------------------
// PRODUCT DETAILS PAGE — LUXURY THEME APPLIED
//-----------------------------------------------------------

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

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const handleQuantity = (type) =>
    setQuantity((q) => (type === "inc" ? q + 1 : q > 1 ? q - 1 : q));

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Please select size");
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
        className={`w-full h-[150px] bg-white rounded-md overflow-hidden cursor-pointer border
        ${selectedIndex === idx ? "border-black" : "border-neutral-300"}`}
      >
        <img
          src={img}
          className="w-full h-full object-contain bg-neutral-50"
        />
      </div>
    ))}
  </div>

  {/* MAIN IMAGE AREA */}
  <div className="flex-1 relative">

    {/* DESKTOP MAIN IMAGE – CLEAN, NO CROP */}
    <div className="hidden md:flex items-center justify-center w-full h-[650px] bg-neutral-50 rounded-lg overflow-hidden relative cursor-zoom-in"
      onClick={() => openLightbox(selectedIndex)}
    >
      <img
        src={selectedImage}
        className="max-h-full max-w-full object-contain"
      />
    </div>

    {/* MOBILE SLIDER */}
    <div className="md:hidden w-full overflow-x-scroll snap-x snap-mandatory flex scroll-smooth no-scrollbar">
      {gallery.map((img, idx) => (
        <div
          key={idx}
          onClick={() => openLightbox(idx)}
          className="snap-start w-full shrink-0 flex justify-center bg-neutral-100"
        >
          <img
            src={img}
            className="max-h-[550px] w-auto object-contain"
          />
        </div>
      ))}
    </div>

    {/* MOBILE THUMBNAILS */}
    <div className="md:hidden flex gap-2 mt-3 overflow-x-auto pb-2">
      {gallery.map((img, idx) => (
        <div
          key={idx}
          onClick={() => {
            setSelectedIndex(idx);
            setSelectedImage(img);
          }}
          className={`h-20 w-14 rounded-md overflow-hidden border cursor-pointer
            ${selectedIndex === idx ? "border-black" : "border-gray-300"}`}
        >
          <img
            src={img}
            className="w-full h-full object-contain bg-neutral-50"
          />
        </div>
      ))}
    </div>

  </div>
</div>


        {/* RIGHT – DETAILS */}
        <div className="flex flex-col gap-4 px-2">

          <h1 className="text-md md:text-2xl font-light tracking-wide">
            {product.name}
          </h1>

          {/* Badges */}
<div className="flex items-center gap-4">
  <div className="border border-neutral-300 rounded-md shadow-sm">
    <img src={Handloom} className="h-20 w-auto object-contain" />
  </div>

  <div className="border border-neutral-300 rounded-md shadow-sm">
    <img src={Silkmark} className="h-20 w-auto object-contain" />
  </div>
</div>


          <p className="text-neutralDark/90 font-medium text-sm md:text-lg">
            ₹{product.price} <br/><span className="text-sm text-neutralDark/70">(Inclusive of All Taxes)</span>
          </p>
          <p className="text-neutralDark/80 text-md md:text-lg">ONE - OF - A - KIND</p>

       
          <p className="text-sm text-neutralDark/80">
            <b className=" text-neutralDark/90">Weaving Art </b>: {product.weavingArt}
          </p>


          {/* SIZES */}
          <div>
            <p className="text-sm text-neutralDark/80 mb-1"><b className=" text-neutralDark/80">Size </b></p>
            <div className="flex gap-2">
              {(product.sizes?.length ? product.sizes : ["XS","S", "M", "L", "XL", "XXL"]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "border-neutral-300"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm font-medium text-neutralDark/80"><b>Quantity</b></p>
            <div className="flex items-center border border-neutral-300 rounded-md">
              <button onClick={() => handleQuantity("dec")} className="px-3 py-1">
                –
              </button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => handleQuantity("inc")} className="px-3 py-1">
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
              {
  id: "delivery",
  title: "Delivery & Returns",
  content: (
    <div className="space-y-3 leading-relaxed text-sm text-neutral-700">

      <p>
        In order to minimise any discrepancies, almost all our products for direct sale on our website are free of
        conventional sizing. This mitigates the need for most return issues concerning inaccurate fit. However, if you
        are unsure of any aspect of the purchase, we encourage you to contact our client services team before placing
        any orders.
      </p>

      

      {/* READ MORE LINK */}
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
              className="flex-1 border border-neutral-400 py-3 rounded-md text-sm text-center hover:bg-neutral-100 transition"
            >
              ☎ Happy to help
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
              className="w-1/2 bg-white border border-neutral-400 py-3 text-sm text-center"
            >
              ☎ Help
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
