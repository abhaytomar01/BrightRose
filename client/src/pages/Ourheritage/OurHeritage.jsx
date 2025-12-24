// src/pages/About/AboutAdvanced.jsx

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SeoData from "../../SEO/SeoData.jsx";
import ourstoryImage from "../../assets/images/ourstoryImage.jpg";
import creative2 from "../../assets/images/creative2.jpg";

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
      <section className="bg-[#faf9f7] mt-10 md:mt-20 py-[10vh] md:py-[10vh] px-2 md:px-6 ">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="font-[manrope] font-thin text-[20px] sm:text-[26px] md:text-[36px] lg:text-[42px] xl:text-[44px] leading-[1.18] tracking-[0.04em] uppercase text-neutral-800">
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
        {/* <section className="w-full h-[70vh] md:h-[90vh]">
          <img src={creative1} className="w-full h-full object-cover" />
        </section> */}

        {/* ===============================
            OUR MANIFESTO (HOVER)
        ================================ */}

        <section className="relative bg-[#faf9f7] px-6 py-16 md:py-20 overflow-hidden">
  {/* Floating image */}
  {manifestoImage && (
    <div
      className="pointer-events-none fixed z-[80] hidden md:block transition-transform duration-150 ease-[cubic-bezier(.19,1,.22,1)]"
      style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
    >
      <img
        src={manifestoImage}
        className="w-[260px] h-[360px] object-cover shadow-2xl"
        alt=""
      />
    </div>
  )}

  <div className="max-w-[1200px] mx-auto">

    {/* CENTER HEADING (PERFECTLY ALIGNED) */}
    <h2 className="text-center font-[manrope] text-[22px] md:text-[32px] tracking-[0.08em] mb-8 md:mb-12">
      OUR STORY
    </h2>

    <div className="divide-y divide-neutral-300/70">
      {[
        {
          num: "I.",
          text: "We begin with the belief that clothing is not just worn — it is felt. A quiet expression of who you are and where you come from.",
        },
        {
          num: "II.",
          text: "Rooted in India’s handloom legacy, Bright Rose exists to celebrate intricate weaves, time-honoured techniques, and the hands that bring them to life",
        },
        {
          num: "III.",
          text: "Each piece is thoughtfully handcrafted, allowing heritage textiles to find new meaning through modern, effortless silhouettes.",
        },
        {
          num: "IV.",
          text: "We design for the woman who moves through the world with intention — grounded in tradition, yet unapologetically contemporary.",
        },
        {
          num: "V.",
          text: "Our garments are not created for a moment, but for a lifetime — versatile enough to be worn across occasions and years.",
        },
        {
          num: "VI.",
          text: "We believe true luxury lies in restraint — in details that whisper rather than shout, where craftsmanship speaks louder than excess.",
        }
      ].map((item, i) => (
       <div
                  key={i}
                  className="grid grid-cols-[70px_1fr] md:grid-cols-[720px_1fr] items-center py-10 md:py-14"
                >
                  {/* Hover Target */}
                  <span
                    onMouseEnter={() => setManifestoImage(item.img)}
                    onMouseLeave={() => setManifestoImage(null)}
                    onMouseMove={handleManifestoMove}
                    className="font-[manrope] text-[28px] md:text-[34px] cursor-pointer"
                  >
                    {item.num}
                  </span>

                  <p className="uppercase tracking-[0.18em] text-[10px] md:text-[13px] leading-relaxed max-w-[420px]">
                    {item.text}
                  </p>
                </div>
      ))}
    </div>
  </div>
</section>




       {/* CTA SECTION */}
<section
  className="
    relative 
    w-full 
    py-28 md:py-40 
    bg-[#faf9f7]
    overflow-hidden
  "
>
  {/* Background Image (Optional) */}
  {creative2 && (
    <img
      src={creative2}
      alt="Bright Rose Collection"
      className="
        absolute inset-0 w-full h-full object-cover
        transition-all duration-500
      "
    />
  )}

  {/* Soft dark overlay for readability */}
  {creative2 && (
    <div className="absolute inset-0 bg-black/30 md:bg-black/25"></div>
  )}

  {/* Content */}
  <div className="relative max-w-[1200px] mx-auto text-center px-6">
    <h3 className="
      text-[18px] md:text-[24px] 
      tracking-[0.18em]
      uppercase
      text-neutral-800
      md:text-white
      font-light
      mb-6
      drop-shadow
    ">
      Discover The World Of Bright Rose
    </h3>

    <Link
      to="/weavecollection"
      className="
        inline-block 
        border border-neutral-900 md:border-white
        px-12 py-4
        tracking-[0.22em] 
        uppercase text-[11px]
        bg-white/90 md:bg-transparent
        text-neutral-900 md:text-white
        hover:bg-white hover:text-black
        transition duration-300
      "
    >
      Discover Collection
    </Link>
  </div>
</section>

      </main>
    </>
  );
}
