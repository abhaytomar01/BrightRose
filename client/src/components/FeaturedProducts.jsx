import React from "react";
import Slider from "react-slick";
import { ShoppingCart, Eye, ArrowLeft, ArrowRight } from "lucide-react";

// Custom Arrows
const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-2 sm:!left-6 z-20 bg-black/30 hover:bg-black/60 transition rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowLeft size={18} color="white" />
  </div>
);

const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-2 sm:!right-6 z-20 bg-black/30 hover:bg-black/60 transition rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowRight size={18} color="white" />
  </div>
);

const FeaturedProducts = ({
  title = "Bestsellers",
  subtitle = "Our most-loved products, handpicked for you",
  products = [],
  onAddToCart = () => {},
  onQuickView = () => {},
  isLoading = false,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1.2, centerMode: true } },
    ],
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-white overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#AD000F]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-600 mt-2 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="px-2 sm:px-3 py-3">
              <div
                className="group relative bg-white border border-neutral-200 rounded-2xl 
                overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 
                flex flex-col h-[500px] md:h-[520px] lg:h-[500px] xl:h-[480px]"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[3/4] bg-neutral-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-t-2xl transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-500">
                    <button
                      onClick={() => onQuickView(product)}
                      className="bg-white text-[#AD000F] p-3 rounded-full hover:bg-[#AD000F] hover:text-white transition-all"
                      aria-label="Quick View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-[#AD000F] text-white p-3 rounded-full hover:bg-[#8c000c] transition-all"
                      aria-label="Add to Cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5 text-center flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-2 h-[46px]">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 h-[40px] mb-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price Section (Discount + Actual) */}
                  <div className="flex justify-center items-baseline gap-2 mt-1">
                    <p className="text-lg sm:text-xl font-semibold text-[#AD000F]">
                      ₹{product.discountPrice ?? product.price}
                    </p>
                    {product.discountPrice && (
                      <>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100
                          )}
                          % off
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedProducts;
