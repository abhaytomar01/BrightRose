import React from "react";
import Slider from "react-slick";
import { ShoppingCart, Eye, ArrowLeft, ArrowRight } from "lucide-react";

// Custom Arrows (Minimal Luxury)
const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-4 z-20 bg-black/10 hover:bg-black/20 backdrop-blur-md transition rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowLeft size={18} className="text-black" />
  </div>
);

const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-4 z-20 bg-black/10 hover:bg-black/20 backdrop-blur-md transition rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowRight size={18} className="text-black" />
  </div>
);

const FeaturedProducts = ({
  title = "Featured Products",
  subtitle = "Curated selections from our finest creations",
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
    <section className="w-full py-20 bg-[#FAF7F3] overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 mt-3 text-base sm:text-lg font-light max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="w-16 h-[1.5px] bg-gray-800/40 mx-auto mt-6"></div>
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="px-3 py-5">
              <div
                className="
                  group relative bg-white border border-neutral-200 
                  rounded-3xl overflow-hidden 
                  transition-all duration-500
                  hover:shadow-md
                  flex flex-col h-[480px] md:h-[500px] lg:h-[480px]
                "
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[3/4] bg-neutral-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                  />

                  {/* Minimal Overlay (more luxury) */}
                  {/* <div className="
                    absolute inset-0 bg-black/5 backdrop-blur-sm 
                    opacity-0 group-hover:opacity-100 
                    flex items-center justify-center gap-4 
                    transition-all duration-500
                  ">
                    <button
                      onClick={() => onQuickView(product)}
                      className="
                        bg-white text-black p-3 rounded-full
                        shadow-sm border border-gray-200
                        hover:bg-black hover:text-white
                        transition-all
                      "
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="
                        bg-black text-white p-3 rounded-full
                        hover:bg-neutral-800 transition-all
                      "
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div> */}
                </div>

                {/* Product Info */}
                <div className="p-5 text-center flex flex-col justify-between flex-grow">

                  <div>
                    <h3 className="text-lg font-light text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-2 font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Price Section (Luxury format – single price only) */}
                  <p className="text-xl font-normal text-gray-900 tracking-wide">
                    ₹{product.price?.toLocaleString()}
                  </p>

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
