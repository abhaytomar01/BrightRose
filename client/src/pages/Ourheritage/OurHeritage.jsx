// src/pages/About/AboutAdvanced.jsx

import { useState, useEffect, useRef } from "react";
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
          <p className="font-[PlayfairDisplay] font-thin text-[22px] sm:text-[26px] md:text-[36px] lg:text-[42px] xl:text-[44px] leading-[1.18] tracking-[0.04em] uppercase text-neutral-800">
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

        <section className="relative bg-[#faf9f7] px-6 py-32 md:py-40 overflow-hidden">
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
            <h2 className="text-center font-[PlayfairDisplay] text-[42px] md:text-[52px] tracking-[0.08em] mb-20">
              OUR MANIFESTO
            </h2>

            <div className="divide-y divide-neutral-400/70">
              {[
                {
                  num: "I.",
                  text: "To curate a wardrobe full of magic, one that glows with each accessory.",
                  img: "/manifesto/manifesto-1.jpg",
                },
                {
                  num: "II.",
                  text: "To create a lifestyle that’s a visual feast, effortlessly.",
                  img: "/manifesto/manifesto-2.jpg",
                },
                {
                  num: "III.",
                  text: "To design for the moving eye, because everything is art.",
                  img: "/manifesto/manifesto-3.jpg",
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
        src={creative1}
        className="
          w-full 
          h-[100vh] lg:h-[92vh] 
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
          text-4xl 
          sm:text-5xl 
          lg:text-[68px]
          leading-[1.05]
          uppercase
          text-[#1a1a1a]
        "
      >
        FROM MOTHER <br /> NATURE
      </h2>

      {/* PARAGRAPH */}
      <p className="mt-10 text-[15px] leading-relaxed text-neutral-700 max-w-[520px]">
        We create items that are first, Objet d’Art and secondly, that have utility.
        Many of the bags we create stand on their own and have a very sculptural
        quality about them. Our design ethos is to make things stand out and turn
        heads. Pieces should be perfectly imperfect and need to be nuanced to be
        beautiful, like nature, no two things are ever the same.
      </p>

      <p className="mt-6 text-[15px] leading-relaxed text-neutral-700 max-w-[520px]">
        Cult Gaia is inspired by nature and women. This is where the brand’s name
        comes from. Great brands are cult–like, uniting like–minded people in their
        aesthetic ideals. Gaia is the goddess of Mother Earth and the daughter of 
        chaos, the most creative force there is.
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
