import React from "react";
import { Link } from "react-router-dom";

const LifestyleBanner = ({
  title = "The Red Gold Edit — Luxury with Simplicity",
  buttonText = "Explore the Look",
  buttonLink = "/collections",
  imageUrl = "",
}) => {
  return (
    <section className="w-full relative bg-pureWhite">
      {/* Banner Image */}
      <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Lifestyle Banner"
          className="w-full h-full object-cover brightness-95"
        />

        {/* Gold + Neutral Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralLight/20 to-neutralDark/40"></div>

        {/* Central Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-neutralDark/80 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 drop-shadow-lg tracking-tight">
            {title}
          </h2>

          <Link
            to={buttonLink}
            className="
              bg-neutralDark/80
              text-white
              px-8
              py-3
              rounded-full
              text-lg
              font-medium
              border border-neutralDark/70
              transition-all duration-300
              hover:neutralDark/80 hover:shadow-xl
            "
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LifestyleBanner;
