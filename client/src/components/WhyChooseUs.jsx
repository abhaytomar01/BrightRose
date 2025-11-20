import React from "react";
import { Leaf, MapPin, Star, Truck } from "lucide-react";

const WhyChooseUs = ({
  highlights = [
    { icon: <Leaf size={28} />, title: "Sustainable Materials", description: "Eco-friendly fabrics crafted with care." },
    { icon: <MapPin size={28} />, title: "Handcrafted in India", description: "Support local artisans and craftsmanship." },
    { icon: <Star size={28} />, title: "Premium Quality", description: "Luxury-grade materials and craftsmanship." },
    { icon: <Truck size={28} />, title: "Fast Delivery", description: "Reliable, quick delivery right to your home." },
  ],
}) => {
  return (
    <section className="w-full bg-[#FAF7F3] py-20">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 text-center">

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900">
          Why Choose Us
        </h2>

        <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-3 font-light max-w-xl mx-auto">
          Simple values that reflect our commitment to quality and authenticity.
        </p>

        <div className="w-20 h-[1px] bg-gray-700/40 mx-auto mt-6 mb-16"></div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {highlights.map((item, index) => (
            <div
              key={index}
              className="
                flex flex-col items-center px-2 sm:px-4 py-6
                transition-all duration-300
              "
            >
              {/* Minimal Icon */}
              <div
                className="
                  w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center
                  border border-gray-400/40 hover:border-gray-700/60
                  rounded-full mb-5
                  transition-all duration-300
                "
              >
                <div className="text-gray-800">{item.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-light text-gray-900 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-[230px]">
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
