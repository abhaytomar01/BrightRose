// src/pages/About/AboutAdvanced.jsx

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SeoData from "../../SEO/SeoData.jsx";
import ourstoryImage from "../../assets/images/ourstoryImage.jpg";
import creative1 from "../../assets/images/creative1.jpg";

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------
   TIMELINE DATA
----------------------------------- */
const TIMELINE_PHASES = [
  {
    phase: "2013",
    title: "The Beginning",
    content: [
      "It began with a deep admiration for craft.",
      "A focus on sculptural silhouettes and intentional design.",
    ],
  },
  {
    phase: "2016",
    title: "Recognition",
    content: [
      "The brand gained international attention.",
      "Pieces became symbolic, collectible, and iconic.",
    ],
  },
  {
    phase: "2020",
    title: "Today",
    content: [
      "A global lifestyle brand.",
      "Rooted in craft, driven by quiet luxury.",
    ],
  },
];

/* -----------------------------------
   BRAND TIMELINE
----------------------------------- */
function BrandTimeline() {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(itemsRef.current, { opacity: 0.25, y: 30 });
      gsap.set(progressRef.current, { height: "0%" });

      gsap.to(progressRef.current, {
        height: "100%",
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
          onEnter: () =>
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6 }),
          onLeaveBack: () =>
            gsap.to(el, { opacity: 0.25, y: 30, duration: 0.6 }),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-[#faf9f7] py-44 px-6">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300">
          <div ref={progressRef} className="absolute top-0 w-full bg-neutral-800" />
        </div>

        <div className="space-y-56">
          {TIMELINE_PHASES.map((item, i) => (
            <div
              key={i}
              ref={(el) => (itemsRef.current[i] = el)}
              className="grid grid-cols-1 md:grid-cols-2 gap-20 relative"
            >
              <div className="md:text-right pr-12">
                <h3 className="font-[PlayfairDisplay] text-4xl">
                  {item.phase}
                </h3>
                <p className="uppercase tracking-widest text-xs mt-4">
                  {item.title}
                </p>
              </div>

              <div className="pl-12 space-y-4 max-w-sm text-sm text-neutral-600">
                {item.content.map((c, idx) => (
                  <p key={idx}>{c}</p>
                ))}
              </div>

              <span className="absolute left-1/2 top-2 w-3 h-3 bg-neutral-800 rounded-full -translate-x-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------
   MAIN PAGE
----------------------------------- */
export default function AboutAdvanced() {
  /* ✅ Hooks */
  const [manifestoImage, setManifestoImage] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handleManifestoMove = (e) => {
    setCursor({
      x: e.clientX + 28,
      y: e.clientY - 40,
    });
  };

  return (
    <>
      <SeoData
        title="Our Heritage – Bright Rose"
        description="A story shaped by craft, restraint, and timeless design."
        url="/ourheritage"
      />

      {/* HERO MANIFESTO */}
      <section className="bg-[#faf9f7] py-[18vh] px-6">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="font-[manrope] font-thin text-[22px] sm:text-[26px] md:text-[36px] lg:text-[42px] xl:text-[44px] leading-[1.18] tracking-[0.04em] uppercase text-neutral-800">
            Bright Rose designs beautiful heirloom pieces that will live in your
            closet forever. The cornerstone of our DNA has been forged with the
            idea of creating objects d’art that make you look twice.
          </p>

          <p className="mt-10 text-[13px] tracking-[0.15em] text-neutral-500">
            — Founder, Bright Rose
          </p>
        </div>
      </section>

      <main className="bg-[#faf9f7] overflow-x-hidden">
        {/* FULL IMAGE */}
        <section className="w-full h-[70vh] md:h-[90vh]">
          <img src={creative1} className="w-full h-full object-cover" />
        </section>

        {/* ===============================
            OUR MANIFESTO (HOVER)
        ================================ */}

        <section className="relative bg-[#faf9f7] px-6 py-16 md:py-20 overflow-hidden">
          {/* Floating image */}
          {manifestoImage && (
            <div
              className="pointer-events-none fixed z-[80] hidden md:block transition-transform duration-150 ease-[cubic-bezier(.19,1,.22,1)]"
              style={{
                transform: `translate(${cursor.x}px, ${cursor.y}px)`,
              }}
            >
              <img
                src={manifestoImage}
                className="w-[260px] h-[360px] object-cover shadow-2xl"
                alt=""
              />
            </div>
          )}

          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-center font-[PlayfairDisplay] text-[22px] md:text-[52px] tracking-[0.08em] mb-10">
              OUR MANIFESTO
            </h2>

            <div className="divide-y divide-neutral-400/70">
              {[
                {
                  num: "I.",
                  text: "It began with a deep admiration for craft — not just how clothing looks, but how it is made. Growing up surrounded by stories of Indian textiles, handwork, and detail, we learned that fashion is memory stitched into fabric. Every silhouette carries a feeling, every thread carries intention. This phase is about curiosity, learning, and respect for artisanship. Before trends, before timelines — there was only passion. A desire to create something timeless, honest, and deeply personal.",                 img: creative1,
                },
                {
                  num: "II.",
                  text: "As the vision grew, so did our responsibility. We chose to slow down in a fast world — valuing precision over production, quality over quantity. Our designs evolved into a balance of modern expression and traditional techniques. Each piece became a dialogue between heritage and contemporary living. This phase reflects discipline, refinement, and purpose. A commitment to authenticity, without compromise.",
                  img: creative1,
                },
                {
                  num: "III.",
                  text: "Today, we stand as a brand that celebrates quiet luxury and powerful individuality. Every creation is thoughtfully designed, ethically crafted, and consciously delivered. We don’t chase moments — we create pieces that stay relevant beyond seasons. Our story lives in the hands that craft, and the people who wear us. This is not just fashion — it is identity, confidence, and timeless elegance. Rooted in India, created for the world.",
                  img: creative1,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[70px_1fr] md:grid-cols-[120px_1fr] items-center py-10 md:py-14"
                >
                  {/* Hover Target */}
                  <span
                    onMouseEnter={() => setManifestoImage(item.img)}
                    onMouseLeave={() => setManifestoImage(null)}
                    onMouseMove={handleManifestoMove}
                    className="font-[PlayfairDisplay] text-[28px] md:text-[34px] cursor-pointer"
                  >
                    {item.num}
                  </span>

                  <p className="uppercase tracking-[0.18em] text-[12px] md:text-[13px] leading-relaxed max-w-[420px]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDITORIAL */}
<section className="w-full bg-white">
  <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">

    {/* LEFT IMAGE */}
    <div className="w-full h-full">
      <img
        src={ourstoryImage}
        className="
          w-full 
          h-[70vh] lg:h-[92vh] 
          object-cover
        "
        loading="lazy"
      />
    </div>

    {/* RIGHT CONTENT */}
    <div className="flex flex-col justify-center px-6 lg:px-20 py-10 lg:py-0">

      {/* HEADING */}
      <h2
        className="
          font-[PlayfairDisplay] 
          tracking-[2px]
          text-2xl 
          md:text-5xl 
          lg:text-[58px] 
          leading-[1.05]
          uppercase
          text-[#1a1a1a]
        "
      >
        FROM MOTHER <br /> NATURE
      </h2>

      {/* PARAGRAPH */}
      <p className="mt-10 text-[15px] leading-relaxed text-neutral-700 max-w-[520px]">
       Bright Rose is born from the elegance of nature and the artistry of human hands. Each creation blossoms with the quiet strength of the earth, crafted meticulously to be both a statement of beauty and a symbol of refined craftsmanship. Our pieces are not merely accessories; they are living art — sculpted, hand-woven, and thoughtfully designed to leave a lasting impression.
      </p>

      <p className="mt-6 text-[15px] leading-relaxed text-neutral-700 max-w-[520px]">
        Guided by nature’s purity and inspired by the spirit of femininity, Bright Rose celebrates individuality. No two creations are ever identical, just as no two petals share the same story. Every curve, every weave, every natural imperfection adds to its charm, making each piece uniquely extraordinary.
</p>

      <p className="mt-6 text-[15px] leading-relaxed text-neutral-700 max-w-[520px]">
Bright Rose stands for timeless luxury, meaning, and emotional connection — crafted not to simply accompany you, but to define you. Like a rose emerging from nature’s heart, our creations speak of strength, elegance, and the beauty of authenticity.
      </p>
    </div>
  </div>
</section>


        {/* TIMELINE */}
        {/* <BrandTimeline /> */}

        {/* CTA */}
        <section className="py-40 text-center">
          <Link
            to="/weavecollection"
            className="inline-block border px-12 py-4 tracking-widest uppercase text-xs hover:bg-black hover:text-white transition"
          >
            Discover Collection
          </Link>
        </section>
      </main>
    </>
  );
}
