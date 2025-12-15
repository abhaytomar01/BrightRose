import React from "react";
import { Leaf, MapPin, Star, Truck } from "lucide-react";

const WhyChooseUs = ({
  highlights = [
    { icon: <Leaf size={28} />, title: "Craftsmanship", description: "Every piece is meticulously handcrafted, honoring techniques that take years to master and moments to perfect." },
    { icon: <MapPin size={28} />, title: "Intentionality", description: "From fabric selection to final finishing, every decision is made with purpose, not pressure." },
    { icon: <Star size={28} />, title: "Exclusivity", description: "Limited creations designed to feel personal — because true luxury is never mass-produced." },
    { icon: <Truck size={28} />, title: "Trust", description: "A promise of transparency, reliability, and consistency — from creation to delivery." },
  ],
}) => {
  return (
    <section className="w-full py-10 md:py-20 bg-gradient-to-b from-[#faf8f6] to-[#f7f4f0] select-none">
      
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 lg:px-20 text-center">

        {/* SECTION TITLE */}
        <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-light text-neutral-900 tracking-wide">
          Why Choose Us
        </h2>

        <p className="text-neutralDark/80 text-[14px] sm:text-[16px] md:text-[18px] font-light max-w-xl mx-auto mt-3 leading-relaxed">
          A reflection of our core values — craftsmanship, luxury, and authenticity.
        </p>

        {/* Minimal Gold Divider */}
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#bca47c] to-transparent mx-auto my-8"></div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mt-6">

          {highlights.map((item, index) => (
            <div
              key={index}
              className="
                bg-white/70 backdrop-blur-lg rounded-xl shadow-md hover:shadow-xl
                border border-neutral-200 hover:border-[#bca47c]/60
                px-4 py-8 flex flex-col items-center
                transition-all duration-500 animate-fadeUp
              "
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* LUXURY ICON CIRCLE */}
              <div
                className="
                  w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-neutral-100 to-neutral-200
                  border border-[#d8c7a0]/60 shadow-inner 
                  hover:shadow-[0_0_20px_4px_rgba(188,164,124,0.3)]
                  transition-all duration-500
                "
              >
                <div className="text-neutral-800">{item.icon}</div>
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-[15px] sm:text-[18px] md:text-[20px] font-light text-neutral-900 tracking-wide">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="mt-2 text-neutralDark/70 text-[12px] sm:text-[14px] md:text-[15px] leading-relaxed max-w-[240px] font-extralight">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Fade-Up Animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.9s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
