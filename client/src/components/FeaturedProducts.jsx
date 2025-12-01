import React from "react";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* CLEAN MINIMAL ARROWS (NO BLUR, NO TRANSPARENCY) */
const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-4 z-20 
      bg-white hover:bg-neutral-100 
      shadow-sm hover:shadow-md 
      transition-all rounded-full p-2 flex items-center justify-center 
      border border-neutral-300`}
    onClick={onClick}
  >
    <ArrowLeft size={18} className="text-neutral-700" />
  </div>
);

const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-4 z-20 
      bg-white hover:bg-neutral-100
      shadow-sm hover:shadow-md 
      transition-all rounded-full p-2 flex items-center justify-center 
      border border-neutral-300`}
    onClick={onClick}
  >
    <ArrowRight size={18} className="text-neutral-700" />
  </div>
);

const FeaturedProducts = ({
  title = "Featured Products",
  subtitle = "Explore exclusive artisanal creations crafted with heritage and soul.",
  products = [],
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3800,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1.5 } },
      { breakpoint: 480, settings: { slidesToShow: 1.1 } },
    ],
  };

  return (
    <section className="w-full py-10 bg-white relative">

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 relative">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-3xl font-light tracking-widest text-neutral-900 uppercase">
            {title}
          </h2>
          <p className="text-neutral-600 mt-3 text-base sm:text-lg font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="w-16 h-[2px] bg-[#c7a97d] mx-auto mt-5"></div>
        </div>

        {/* Product Slider */}
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="px-4 py-6">

              <div
                className="
                  group bg-white rounded-3xl overflow-hidden shadow-sm
                  hover:shadow-xl transition-all duration-700
                  border border-neutral-200/60 
                  flex flex-col
                "
              >

                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="
                      w-full h-full object-cover 
                      transition-transform duration-[1200ms]
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Product Text */}
                <div className="p-6 text-center flex flex-col flex-grow">

                  <h3 className="text-lg font-light text-neutral-900 tracking-wide line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-neutral-500 text-sm mt-2 font-light line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-4">
                    <p className="text-xl font-light text-neutral-800 tracking-wide">
                      ₹{product.price?.toLocaleString()}
                    </p>
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
