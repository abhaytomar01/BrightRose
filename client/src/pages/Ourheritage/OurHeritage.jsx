// src/pages/About/AboutAdvanced.jsx

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SeoData from "../../SEO/SeoData.jsx";
import creative1 from "../../assets/images/creative1.jpg";

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------
   TIMELINE DATA
----------------------------------- */
const TIMELINE_PHASES = [
  {
    phase: "PHASE ONE",
    title: "The Beginning",
    content: [
      "It began with a deep admiration for craft — not just how clothing looks, but how it is made.",
      "Growing up surrounded by stories of Indian textiles, handwork, and detail, we learned that fashion is memory stitched into fabric.",
      "Every silhouette carries a feeling, every thread carries intention.",
      "Before trends, before timelines — there was only passion.",
    ],
  },
  {
    phase: "PHASE TWO",
    title: "The Evolution",
    content: [
      "As the vision grew, so did our responsibility.",
      "We chose to slow down in a fast world — valuing precision over production, quality over quantity.",
      "Our designs evolved into a balance of modern expression and traditional techniques.",
      "A commitment to authenticity, without compromise.",
    ],
  },
  {
    phase: "PHASE THREE",
    title: "The Brand Today",
    content: [
      "Today, we stand as a brand that celebrates quiet luxury and powerful individuality.",
      "Every creation is thoughtfully designed, ethically crafted, and consciously delivered.",
      "We don’t chase moments — we create pieces that stay relevant beyond seasons.",
      "Rooted in India, created for the world.",
    ],
  },
];

/* -----------------------------------
   BRAND TIMELINE (GSAP)
----------------------------------- */
function BrandTimeline() {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(itemsRef.current, { opacity: 0.25, y: 20 });
      gsap.set(progressRef.current, { height: "0%" });

      gsap.to(progressRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      itemsRef.current.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center+=80",
          end: "bottom center",
          onEnter: () =>
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }),
          onEnterBack: () =>
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6 }),
          onLeave: () =>
            gsap.to(el, { opacity: 0.25, y: 20, duration: 0.6 }),
          onLeaveBack: () =>
            gsap.to(el, { opacity: 0.25, y: 20, duration: 0.6 }),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-white py-36 px-6 sm:px-12 lg:px-24"
    >
      <div className="max-w-6xl mx-auto relative">

        {/* Vertical Axis */}
        <div className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 w-px bg-neutral-200">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 w-full bg-[#bca47c]"
          />
        </div>

        <div className="space-y-44">
          {TIMELINE_PHASES.map((item, index) => (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20"
            >
              {/* LEFT */}
              <div className="pl-12 md:pl-0 md:pr-24 md:text-right">
                <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 mb-3">
                  {item.phase}
                </p>

                <h3 className="text-[28px] sm:text-[34px] md:text-[42px] font-light text-neutral-900">
                  {item.title}
                </h3>
              </div>

              {/* NODE */}
              <div className="absolute top-2 left-4 md:left-1/2 md:-translate-x-1/2 z-10">
                <span className="relative block w-3.5 h-3.5 rounded-full bg-[#bca47c]">
                  <span className="absolute inset-0 rounded-full bg-[#bca47c]/40 blur-md" />
                </span>
              </div>

              {/* RIGHT */}
              <div className="pl-12 md:pl-24 max-w-md space-y-4 text-neutral-700 text-[14px] leading-relaxed font-light">
                {item.content.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* -----------------------------------
   FINAL CTA
----------------------------------- */
const FinalCTA = () => (
  <section className="relative w-full">
    <div className="w-full h-[55vh] relative overflow-hidden">
      <img src={creative1} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <h3 className="text-white font-extralight tracking-[0.3em] uppercase text-xl sm:text-3xl md:text-4xl mb-10">
            Crafted With Intention
          </h3>
          <Link
            to="/weavecollection"
            className="inline-block px-10 py-3 border border-white/60 text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            View Collection
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* -----------------------------------
   MAIN PAGE
----------------------------------- */
export default function AboutAdvanced() {
  return (
    <>
      <SeoData
        title="Our Heritage – The Story of Bright Rose"
        description="Bright Rose celebrates the soul of Indian weaving traditions."
        image="/og-heritage.jpg"
        url="/ourheritage"
      />

      <main className="bg-white text-neutral-900 overflow-x-hidden">

         
    <section className="bg-[#faf9f7] py-24 px-6 sm:px-12 lg:px-24">
  <div className="max-w-4xl mx-auto text-center">

    {/* Label */}
    <p className="text-[11px] tracking-[0.4em] uppercase text-neutral-500 mb-6">
      Our Story
    </p>

    {/* Heading */}
    <h2 className="text-[18px] sm:text-[20px] md:text-[28px] font-light text-neutral-900 leading-tight mb-8">
      Bright Rose
    </h2>

    {/* Subtitle */}
    <p className="text-neutral-600 tracking-[0.18em] uppercase text-[13px] mb-12">
      A Journey Woven in Tradition
    </p>

    {/* Body */}
    <div className="space-y-6 text-neutral-700 text-[15px] leading-relaxed font-light">
      <p>
        Bright Rose is an endeavor to bring back Indian handloom — not as nostalgia,
        but as living art. Every weave carries memory, emotion, and intention.
      </p>

      <p>
        Inspired by generations of artisans, we craft garments that feel personal,
        timeless, and quietly powerful — pieces made to be worn, remembered,
        and passed forward.
      </p>
    </div>

    {/* CTA */}
    <div className="mt-14">
      <Link
        to="/weavecollection"
        className="
          inline-block
          px-10 py-3
          border border-neutral-900
          text-[12px] tracking-[0.25em] uppercase
          hover:bg-neutral-900 hover:text-white
          transition-all duration-300
        "
      >
        Discover Our World
      </Link>
    </div>

  </div>
</section>


        <BrandTimeline />

        <FinalCTA />
      </main>
    </>
  );
}
