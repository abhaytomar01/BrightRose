import React from "react";
import Slider from "react-slick";
import { ShoppingCart, Eye, ArrowLeft, ArrowRight } from "lucide-react";

// Custom Arrows (Luxury Red + Gold Accent)
const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-4 z-20 bg-neutralLight/60 hover:bg-neutralLight/80 backdrop-blur-md transition rounded-full p-2 flex items-center justify-center border border-accentGold/60`}
    onClick={onClick}
  >
    <ArrowLeft size={18} className="text-primaryRed" />
  </div>
);

const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-4 z-20 bg-neutralLight/60 hover:bg-neutralLight/80 backdrop-blur-md transition rounded-full p-2 flex items-center justify-center border border-accentGold/60`}
    onClick={onClick}
  >
    <ArrowRight size={18} className="text-neutralDark/80" />
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
    <section className="w-full py-20 bg-pureWhite overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-neutralDark/80">
            {title}
          </h2>

          {subtitle && (
            <p className="text-neutralDark mt-3 text-base sm:text-lg font-light max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Gold divider */}
          <div className="w-20 h-[2px] bg-accentGold mx-auto mt-6"></div>
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="px-3 py-5">
              <div
                className="
                  group relative bg-white border border-mutedGray/60
                  rounded-3xl overflow-hidden 
                  transition-all duration-500
                  hover:border-accentGold/60
                  hover:shadow-xl
                  flex flex-col h-[480px] md:h-[500px] lg:h-[480px]
                "
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[3/4] bg-neutralLight overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5 text-center flex flex-col justify-between flex-grow">

                  <div>
                    <h3 className="text-lg font-light text-neutralDark mb-1 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-neutralDark/70 line-clamp-2 mb-2 font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-normal text-neutralDark/80 tracking-wide">
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
