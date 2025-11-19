import React from "react";
import { Link } from "react-router-dom"; // optional if using routing

const LifestyleBanner = ({
  title = "The Red Gold Edit — Luxury with Simplicity",
  buttonText = "Explore the Look",
  buttonLink = "/collections",
  imageUrl = "",
}) => {
  return (
    <section className="w-full relative bg-[#FCF7F1]">
      {/* Background Image */}
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Lifestyle Banner"
          className="w-full h-full object-cover brightness-90"
        />
        {/* Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/40"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            {title}
          </h2>
          <Link
            to={buttonLink}
            className="bg-[#AD000F] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8c000c] hover:shadow-lg transition-all duration-300 border border-[#D4AF37]"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LifestyleBanner;
