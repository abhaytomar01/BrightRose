/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import hermesbanner from "../../../assets/images/Banners/hermes-banner.webp";

// Custom Arrow Buttons - Neutral + Gold Accent
export const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-3 sm:!left-5 z-20 bg-neutral-200/70 hover:bg-neutral-300 transition-all rounded-full p-2 flex items-center justify-center border border-accentGold/60`}
    onClick={onClick}
  >
    <ArrowBackIosIcon sx={{ fontSize: 20, color: "#B30024" }} /> 
  </div>
);

export const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-3 sm:!right-5 z-20 bg-neutral-200/70 hover:bg-neutral-300 transition-all rounded-full p-2 flex items-center justify-center border border-accentGold/60`}
    onClick={onClick}
  >
    <ArrowForwardIosIcon sx={{ fontSize: 20, color: "#B30024" }} />
  </div>
);

const Banner = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    infinite: true,
    speed: 1000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    appendDots: (dots) => (
      <div className="absolute bottom-3 sm:bottom-6 w-full flex justify-center">
        <ul className="flex gap-2">{dots}</ul>
      </div>
    ),

    // PAGINATION DOTS: muted gray + gold active
    customPaging: () => (
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-mutedGray hover:bg-accentGold transition-all duration-300" />
    ),
  };

  const banners = [{ type: "image", src: hermesbanner }];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white p-0 m-0">
      <Slider {...settings} className="h-full">
        {banners.map((el, i) => (
          <div key={i} className="relative w-full h-screen overflow-hidden">

            {el.type === "video" ? (
              <video
                src={el.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                draggable="false"
                src={el.src}
                alt={`banner-${i}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* LIGHT LUXURY OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutralLight/70 via-white/40 to-white/10"></div>
          </div>
        ))}
      </Slider>

      {/* GOLD TOP/BOTTOM BORDER */}
      <div className="absolute inset-0 border-t border-b border-accentGold/40 pointer-events-none"></div>
    </section>
  );
};

export default Banner;
