import React from "react";
import { Leaf, MapPin, Star, Truck } from "lucide-react";

const WhyChooseUs = ({
  highlights = [
    { icon: <Leaf size={32} />, title: "Sustainable Materials", description: "Eco-friendly fabrics crafted with care." },
    { icon: <MapPin size={32} />, title: "Handcrafted in India", description: "Support local artisans and craftsmanship." },
    { icon: <Star size={32} />, title: "Premium Quality", description: "Luxury quality fabrics and finishes." },
    { icon: <Truck size={32} />, title: "Fast Delivery", description: "Quick and reliable shipping to your doorstep." },
  ],
}) => {
  return (
    <section className="w-full bg-[#FCF7F1] py-16 sm:py-20">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 text-center">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#AD000F] mb-3">
          Why Choose Us
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Discover the values that make our brand unique and trusted.
        </p>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-2 sm:px-4 md:px-6 py-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#D4AF37]/60"
            >
              {/* Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] bg-[#fff9ef] shadow-sm hover:scale-105 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-[250px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
