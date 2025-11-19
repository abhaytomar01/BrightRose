import React from "react";
import Slider from "react-slick";
import { Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonials = ({
  reviews = [
    {
      name: "Aanya Sharma",
      rating: 5,
      quote:
        "Absolutely love the craftsmanship and quality! My new blazer is stunning.",
    },
    {
      name: "Rohan Mehta",
      rating: 4,
      quote:
        "Premium quality, timely delivery, and excellent customer service.",
    },
    {
      name: "Priya Kapoor",
      rating: 5,
      quote:
        "The colors and fabrics are so vibrant. Truly a luxurious experience.",
    },
    {
      name: "Karan Singh",
      rating: 4,
      quote: "Beautifully handcrafted. I highly recommend this brand!",
    },
  ],
}) => {
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280, // Large screens
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024, // Tablets
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // Mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="w-full bg-white py-2 sm:py-20 overflow-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#AD000F] mb-3">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Hear from our happy clients and see why they love our brand.
        </p>

        {/* Desktop Grid (for large screens) */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-neutral-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4AF37]/60"
            >
              {/* Rating */}
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={`${
                      i < review.rating ? "text-[#D4AF37]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm md:text-base mb-4 italic leading-relaxed">
                "{review.quote}"
              </p>

              {/* Name */}
              <h4 className="text-[#AD000F] font-semibold text-lg">
                {review.name}
              </h4>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Slider */}
        <div className="block lg:hidden">
          <Slider {...sliderSettings}>
            {reviews.map((review, index) => (
              <div key={index} className="px-2 sm:px-3">
                <div className="bg-neutral-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#D4AF37]/60 mx-auto max-w-sm">
                  {/* Rating */}
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < review.rating ? "text-[#D4AF37]" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-sm sm:text-base mb-4 italic leading-relaxed">
                    "{review.quote}"
                  </p>

                  {/* Name */}
                  <h4 className="text-[#AD000F] font-semibold text-lg">
                    {review.name}
                  </h4>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
