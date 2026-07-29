import React from "react";
import { useNavigate } from "react-router-dom";

const CustomOrderWrapper = ({ image, video }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full relative h-[45vh] md:h-[50vh] group cursor-pointer"
      onClick={() => navigate("/custom-order")}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden rounded-none">

        {/* Image */}
        {image && (
          <img
            src={image}
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-all duration-[1.5s]"
            alt="Custom Order"
          />
        )}

        {/* Video */}
        {!image && video && (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500" />
      </div>

      {/* Text Section */}
      <div className="relative w-full h-full flex items-center justify-center">
        <h2
          className="
          text-white 
          text-center 
          px-6 
          max-w-4xl 
          text-2xl 
          md:text-4xl 
          lg:text-5xl 
          font-light
          tracking-wide
          leading-snug
        "
        >
          Let's turn your most treasured memories into the
          <span className="font-normal"> most iconic dress </span>
          in your wardrobe
        </h2>
      </div>
    </section>
  );
};

export default CustomOrderWrapper;
