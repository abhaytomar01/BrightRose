/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// import your images or videos
// import hermesbanner from "../../../assets/images/Banners/hermes-banner.webp";
import demovideo from "../../../assets/Kanchipuram/demovideo.mp4";

export const PreviousBtn = ({ className, onClick }) => (
  <div
    className={`${className} !left-3 sm:!left-5 z-20 bg-black/30 hover:bg-black/60 transition-all rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowBackIosIcon sx={{ fontSize: 20, color: "white" }} />
  </div>
);

export const NextBtn = ({ className, onClick }) => (
  <div
    className={`${className} !right-3 sm:!right-5 z-20 bg-black/30 hover:bg-black/60 transition-all rounded-full p-2 flex items-center justify-center`}
    onClick={onClick}
  >
    <ArrowForwardIosIcon sx={{ fontSize: 20, color: "white" }} />
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
    customPaging: () => (
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/70 hover:bg-white transition-all duration-300" />
    ),
  };

  const banners = [
    { type: "video", src: demovideo },
    // { type: "video", src: bannerVideo },
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black p-0 m-0">
      <Slider {...settings} className="h-full">
        {banners.map((el, i) => (
          <div key={i} className="relative w-full h-screen overflow-x-auto">
            {/* MEDIA */}
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

            {/* Optional Text Overlay */}
            {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
                Discover Timeless Luxury
              </h1>
              <button className="bg-[#AD000F] border border-[#D4AF37] px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#8C000C] transition-all duration-300 font-medium">
                Shop Now
              </button>
            </div> */}
          </div>
        ))}
      </Slider>

      {/* Subtle top/bottom border */}
      <div className="absolute inset-0 border-t border-b border-white/10 pointer-events-none"></div>
    </section>
  );
};

export default Banner;
