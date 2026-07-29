import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const CARD_HEIGHT = "h-[330px] sm:h-[370px] md:h-[450px]";
const CARD_WIDTH_MOBILE = "w-[210px] sm:w-[260px] md:w-[335px]";

export default function ProductCarousel({
  apiEndpoint = "https://thebrightrose/api/v1/products",
  featureImg,
  featureText = "Dive deeper. Glow longer.\nBatiscafos",
  onFeatureClick = () => {},
  viewAllLabel = "VIEW ALL",
  onViewAllClick = () => {},
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const dragState = useRef({ x: null });

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    axios
      .get(apiEndpoint)
      .then((response) => {
        setProducts(response.data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // Scroll by card width
  const scrollX = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 260, // adjusted for mobile width
        behavior: "smooth",
      });
    }
  };

  // Touch/drag for mobile/tablet
  const onTouchStart = (e) => {
    dragState.current.x = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (dragState.current.x !== null) {
      const diff = e.changedTouches[0].clientX - dragState.current.x;
      if (Math.abs(diff) > 60) scrollX(diff > 0 ? -1 : 1);
      dragState.current.x = null;
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-white via-indigo-50 to-pink-50 rounded-2xl shadow-xl pb-7 px-2">
      {/* Heading */}
      <div className="flex items-center gap-5 mb-4 px-2 pt-5 sm:px-4 sm:pt-8">
        <h2 className="font-extrabold text-lg sm:text-2xl md:text-3xl text-gray-900 tracking-tight text-left w-full">
          NEW ARRIVALS
        </h2>
      </div>
      {/* Carousel Row */}
      <div className="max-w-full flex flex-row flex-nowrap gap-2 sm:gap-4 md:gap-8 px-1 sm:px-2 md:px-4">
        {/* Feature Card */}
        <div
          className={`flex-shrink-0 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white ${CARD_HEIGHT} ${CARD_WIDTH_MOBILE} mt-3 mb-2`}
        >
          <img
            src={featureImg || products[0]?.image}
            alt="Feature"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 pb-3 sm:pb-8 flex flex-col">
            <span className="text-white text-xs sm:text-base md:text-2xl font-extrabold leading-tight whitespace-pre-line drop-shadow-xl mb-3 sm:mb-6">
              {featureText}
            </span>
            <button
              className="mt-auto w-full py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-md sm:rounded-xl text-xs sm:text-lg uppercase transition shadow-lg"
              onClick={onFeatureClick}
            >
              {viewAllLabel}
            </button>
          </div>
        </div>
        {/* Carousel + "View All" */}
        <div className="relative flex-1 flex flex-col">
          <div className="relative">
            {/* Arrow buttons for desktop only */}
            <button
              className="hidden md:inline-block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-xl text-gray-900 text-2xl p-2 hover:bg-indigo-600 hover:text-white transition"
              onClick={() => scrollX(-1)}
              aria-label="Prev"
              type="button"
              style={{ left: "-32px" }}
            >
              &#8249;
            </button>
            <div
              ref={scrollRef}
              className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-4 md:gap-8 scrollbar-hide px-1 sm:px-2"
              style={{ scrollBehavior: "smooth" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {loading ? (
                <div className="flex items-center h-full text-gray-400 text-xl">
                  Loading...
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center h-full text-gray-400 text-xl">
                  No products found.
                </div>
              ) : (
                <>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`flex-shrink-0 bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 flex flex-col ${CARD_HEIGHT} ${CARD_WIDTH_MOBILE} overflow-hidden`}
                    >
                      <div className="relative h-[180px] sm:h-[230px] md:h-[325px] w-full flex items-center justify-center bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-contain w-full h-full"
                        />
                        <span className="absolute top-3 right-3 text-gray-400 text-lg md:text-xl cursor-pointer hover:text-pink-500 transition">
                          &#9825;
                        </span>
                      </div>
                      <div className="p-2 sm:p-4 pb-2 flex flex-col flex-1">
                        <div className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight mb-2">
                          {product.name}
                        </div>
                        <div className="mt-auto text-sm sm:text-lg font-bold text-indigo-600">
                          {product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* VIEW ALL card */}
                  <button
                    className={`flex-shrink-0 bg-indigo-600 flex flex-col items-center justify-center cursor-pointer shadow-lg rounded-xl sm:rounded-2xl ${CARD_HEIGHT} ${CARD_WIDTH_MOBILE} hover:bg-indigo-700 transition ml-1 sm:ml-2`}
                    onClick={onViewAllClick}
                    type="button"
                    tabIndex={0}
                  >
                    <span className="text-white font-extrabold text-lg sm:text-2xl">VIEW ALL</span>
                  </button>
                </>
              )}
            </div>
            <button
              className="hidden md:inline-block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-xl text-gray-900 text-2xl p-2 hover:bg-indigo-600 hover:text-white transition"
              onClick={() => scrollX(1)}
              aria-label="Next"
              type="button"
              style={{ right: "-32px" }}
            >
              &#8250;
            </button>
          </div>
        </div>  
      </div>
      <style>{`
        @media (max-width: 640px) {
          .scrollbar-hide::-webkit-scrollbar { display: none }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none }
        }
      `}</style>
    </section>
  );
}
