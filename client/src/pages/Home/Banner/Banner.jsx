/* eslint-disable react/prop-types */
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import video1 from "../../../assets/banners/images/video1.mp4";
import desktopVideo from "../../../assets/images/banners/video2.mp4";
import mobileVideo from "../../../assets/images/banners/video1.mp4";
import { Link } from "react-router-dom";

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

  return (
    <section
  className="
    relative w-full overflow-hidden
    h-[calc(100vh+72px)]
    min-h-[calc(100svh+72px)]
    -mt-[72px]
  "
>
      <Slider
        {...settings}
        className="h-full [&_.slick-list]:h-full [&_.slick-track]:h-full"
      >
        <div className="relative w-full h-[calc(100vh+72px)] min-h-[calc(100svh+72px)]">
          {/* VIDEO */}
          {/* DESKTOP VIDEO */}
<video
  src={desktopVideo}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="hidden md:block absolute inset-0 w-full h-full object-cover"
/>

{/* MOBILE VIDEO */}
<video
  src={mobileVideo}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="block md:hidden absolute inset-0 w-full h-full object-cover"
/>


          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />

          {/* CTA */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[12vh] sm:pb-[14vh] text-center text-white z-10">
            <p className="text-[14px] sm:text-[16px] tracking-[0.18em] uppercase mb-5 font-light">
              Bright Rose Gift 
            </p>

            <div className="flex gap-4">
              <button className="px-6 sm:px-8 py-2.5 border border-white text-[12px] sm:text-[13px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
               <Link to="/weavecollection"> Shop the Weave</Link>
              </button>

              <button className="px-6 sm:px-8 py-2.5 border border-white text-[12px] sm:text-[13px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                <Link to="/stylecollection"> Shop the Style</Link>
              </button>
            </div>
          </div>
        </div>
      </Slider>
    </section>
  );
};

export default Banner;
