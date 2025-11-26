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
      quote: "Absolutely love the craftsmanship and quality! My new blazer is stunning."
    },
    {
      name: "Rohan Mehta",
      rating: 4,
      quote: "Premium quality, timely delivery, and excellent customer service."
    },
    {
      name: "Priya Kapoor",
      rating: 5,
      quote: "The colors and fabrics are so elegant. Truly a luxurious experience."
    },
    {
      name: "Karan Singh",
      rating: 4,
      quote: "Beautifully handcrafted. I highly recommend this brand!"
    }
  ]
}) => {
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4200,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="w-full bg-pureWhite py-20 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 text-center">

        {/* HEADER */}
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-neutralDark/80">
          What Our Customers Say
        </h2>

        <p className="text-neutralDark text-sm sm:text-base md:text-lg mt-3 font-light max-w-xl mx-auto">
          Real experiences from people who love our craftsmanship.
        </p>

        {/* Gold Divider */}
        <div className="w-24 h-[2px] bg-accentGold mx-auto mt-8 mb-16"></div>

        {/* GRID — DESKTOP */}
        <div className="hidden lg:grid grid-cols-4 gap-10">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="
                bg-white p-8 rounded-xl 
                border border-mutedGray/60 
                shadow-sm hover:shadow-md
                transition-all duration-300
              "
            >
              {/* Rating (Stars in Gold/Red Luxe Tone) */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < review.rating ? "text-accentGold" : "text-mutedGray"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-neutralDark/80 text-sm md:text-base italic font-light leading-relaxed mb-4">
                “{review.quote}”
              </p>

              {/* Name */}
              <h4 className="text-neutralDark font-light text-base tracking-wide">
                — {review.name}
              </h4>
            </div>
          ))}
        </div>

        {/* SLIDER — MOBILE/TABLET */}
        <div className="block lg:hidden mt-6">
          <Slider {...sliderSettings}>
            {reviews.map((review, index) => (
              <div key={index} className="px-2 sm:px-3">
                <div
                  className="
                    bg-white p-8 rounded-xl max-w-sm mx-auto 
                    border border-mutedGray/60 
                    shadow-sm hover:shadow-md
                    transition-all duration-300
                  "
                >
                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < review.rating ? "text-accentGold" : "text-mutedGray"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-neutralDark/80 text-sm sm:text-base italic font-light leading-relaxed mb-4">
                    “{review.quote}”
                  </p>

                  {/* Name */}
                  <h4 className="text-neutralDark font-light text-base tracking-wide">
                    — {review.name}
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
