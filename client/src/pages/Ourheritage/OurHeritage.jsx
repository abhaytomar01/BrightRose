// src/pages/About/AboutAdvanced.jsx

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SeoData from "../../SEO/SeoData.jsx";
import creative2 from "../../assets/images/creative2.webp";
import ourstory from "../../assets/images/braboutcover.png";
import founderImage from "../../assets/images/BRfounder.jpeg";

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
// function BrandTimeline() {
//   const containerRef = useRef(null);
//   const progressRef = useRef(null);
//   const itemsRef = useRef([]);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.set(itemsRef.current, { opacity: 0.25, y: 30 });
//       gsap.set(progressRef.current, { height: "0%" });

//       gsap.to(progressRef.current, {
//         height: "100%",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top center",
//           end: "bottom center",
//           scrub: true,
//         },
//       });

//       itemsRef.current.forEach((el) => {
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top center+=80",
//           onEnter: () =>
//             gsap.to(el, { opacity: 1, y: 0, duration: 0.6 }),
//           onLeaveBack: () =>
//             gsap.to(el, { opacity: 0.25, y: 30, duration: 0.6 }),
//         });
//       });
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={containerRef} className="bg-[#faf9f7] py-44 px-6">
//       <div className="max-w-6xl mx-auto relative">
//         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300">
//           <div ref={progressRef} className="absolute top-0 w-full bg-neutral-800" />
//         </div>

//         <div className="space-y-56">
//           {TIMELINE_PHASES.map((item, i) => (
//             <div
//               key={i}
//               ref={(el) => (itemsRef.current[i] = el)}
//               className="grid grid-cols-1 md:grid-cols-2 gap-20 relative"
//             >
//               <div className="md:text-right pr-12">
//                 <h3 className="font-[manrope] text-4xl">
//                   {item.phase}
//                 </h3>
//                 <p className="uppercase tracking-widest text-xs mt-4">
//                   {item.title}
//                 </p>
//               </div>

//               <div className="pl-12 space-y-4 max-w-sm text-sm text-neutral-600">
//                 {item.content.map((c, idx) => (
//                   <p key={idx}>{c}</p>
//                 ))}
//               </div>

//               <span className="absolute left-1/2 top-2 w-3 h-3 bg-neutral-800 rounded-full -translate-x-1/2" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

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
      {/* <section className="bg-[#faf9f7] mt-10 md:mt-20 py-[10vh] md:py-[10vh] px-2 md:px-6 ">
        <div className="max-w-[1100px] mx-auto text-center">
          <p className="font-[manrope] font-thin text-[20px] sm:text-[26px] md:text-[36px] lg:text-[42px] xl:text-[44px] leading-[1.18] tracking-[0.04em] uppercase text-neutral-800">
          Bright Rose is an endeavor to bring back Indian Handloom so that we can clothe the world once again in a natural way through the beauty of INTRICATE WEAVES.
<br/>
Rose is known as the Queen of Flowers for its intricate petal structure, wide spectrum of colors, and diverse forms. Similarly, our garments reflect intricate weaves, vibrant and bold hues, and a variety of weaves, each with its own distinctive character, just like you.
         <br/>
         “Our knowledge of weaving is often deeply valued within families and seen as a time-honored tradition. Some skilled artisans become masters of the craft to the point where they can weave with their eyes closed”
– as quoted by Master weaver, Chand from Varanasi.
          </p>

          <p className="mt-10 text-[13px] tracking-[0.15em] text-neutral-500">
            — Founder, Bright Rose
          </p>
        </div>
      </section> */}

      <section className="relative bg-[#fff] pt-20 pb-4 px-6 md:px-10 lg:px-16 mt-4 md:mt-10 overflow-hidden">

        {/* Soft Background Accent */}
        <div className="absolute -right-10 top-20 w-[260px] h-[260px] md:w-[340px] md:h-[340px] rounded-full bg-[#CFAF9A]/10 blur-3xl"></div>

        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start relative z-[2]">

          {/* LEFT CONTENT */}
          <div className="max-w-[650px]">

            {/* Section Label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-[1px] bg-neutral-700"></span>
              <p className="tracking-[0.25em] text-[10px] md:text-[12px] uppercase text-neutral-700">
                Brand Philosophy
              </p>
            </div>

            {/* Elegant Heading */}
            <h2 className="font-[manrope] text-[18px] md:text-[26px]  leading-tight mb-6">
              About <span className="uppercase text-neutral-700">Bright Rose</span>
            </h2>

            {/* Body Text */}
            <p className="text-[12px] md:text-[16px] leading-relaxed text-neutral-700 mb-5 text-justify">
              <span className="font-semibold">Bright Rose</span> is an endeavor to bring back Indian Handloom
              so that we can clothe the world once again in a natural way through the beauty
              of <span className="tracking-wide">INTRICATE WEAVES</span>.
            </p>

            <p className="text-[12px] md:text-[16px] leading-relaxed text-neutral-700 mb-2 text-justify">
              Known as the Queen of Flowers, the rose inspires us with its layered petals,
              depth, vibrance, and emotion. Just like every rose is unique, each of our garments
              carries its own soul, bold hues, and distinct character — just like you.
            </p>

            {/* Pull Quote Block */}
            <div className="mt-6 border-l-[2.5px] border-neutral-700 pl-5">
              <p className="italic text-neutral-700 text-[12px] md:text-[15px] leading-relaxed text-justify">
                “Our knowledge of weaving is deeply valued within families and passed down
                as tradition. Many artisans master the craft so beautifully that they can
                weave with their eyes closed.”
              </p>
              <p className="not-italic mt-3 text-neutral-700 text-xs md:text-sm font-medium">
                — Master Weaver, Chand (Varanasi)
              </p>
            </div>
          </div>

          {/* RIGHT VISUAL STORY PANEL */}
          <div className="relative">
            <div className="relative group">

              {/* Gold Frame Accent */}
              <div className="absolute -inset-3 border border-[#d4af37]/40 rounded-sm"></div>

              <img
                src={ourstory}
                className="w-full md:w-[500px] lg:w-[540px] h-[480px] md:h-[580px] object-cover"
                alt="Bright Rose weaving"
                loading="lazy"
              />

              {/* Floating Tag */}
              <div className="absolute bottom-20 right-0 md:right-2 bg-white/80 backdrop-blur-sm px-4 py-2 text-[11px] tracking-widest uppercase">
                Handwoven in India
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="relative bg-[#faf9f7] py-16 md:py-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center relative z-[2]">

          {/* LEFT IMAGE PANEL */}
          <div className="order-2 md:order-1 relative">
            <div className="relative group flex justify-center md:justify-start">
              {/* Subtle accent frame */}
              <div className="absolute -inset-3 border border-neutral-300 rounded-sm"></div>

              <img
                src={founderImage}
                className="w-full md:w-[500px] lg:w-[540px] h-[480px] md:h-[650px] object-cover"
                alt="Founder of Bright Rose"
                loading="lazy"
              />

              {/* Floating Tag */}
              <div className="absolute bottom-6 left-0 md:-left-4 bg-white/90 backdrop-blur-sm px-5 py-3 shadow-sm">
                <p className="text-[11px] tracking-widest uppercase text-neutral-800 font-medium">
                  Natasha & Rajeev
                </p>
                <p className="text-[9px] tracking-widest uppercase text-neutral-500 mt-1">
                  Founder
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="order-1 md:order-2 max-w-[600px]">
            {/* Section Label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-[1px] bg-neutral-700"></span>
              <p className="tracking-[0.25em] text-[10px] md:text-[12px] uppercase text-neutral-700">
                Meet The Founder
              </p>
            </div>

            {/* Elegant Heading */}
            <h2 className="font-[manrope] text-[20px] md:text-[28px] leading-tight mb-8">
              A Quiet <span className="italic text-neutral-600">Conviction</span>
            </h2>

            {/* Body Text */}
            <div className="space-y-5 text-[12px] md:text-[15px] leading-relaxed text-neutral-700 text-justify">
              <p>
                She wasn't trying to start a brand. She was standing in front of her closet fifteen years into her marriage, surrounded by inherited sarees she had never worn when it hit her. Every Indian woman has them. Beautiful, intricate, blessed-upon-her, folded away. And no occasion that ever feels quite right.
              </p>
              <p>
                That moment of quiet frustration became the founding idea of <span className="font-medium text-neutral-900">Bright Rose</span>: take the fabric exactly as the weaver makes it—unchanged, uncompromised—and present it in silhouettes that belong to the life she actually lives.
              </p>
              <p>
                Natasha had spent thirteen years in marketing, always carrying a single quiet conviction at the back of her mind: <span className="italic text-neutral-900">“if I ever build something of my own, it will be in textiles.”</span> A documentary about fashion's waste during COVID made her certain she didn't want to build just another label. So she started travelling—Varanasi, Kanchipuram, Gujarat, Rajasthan—meeting weavers whose craft spans centuries but whose children are leaving because the demand has gone.
              </p>
              <p>
                Bright Rose exists to make that demand real again. Every piece is handwoven, one of a kind, carrying the slight and beautiful imprecision of a human hand. That, for Natasha, is what real luxury has always meant.
              </p>
            </div>
          </div>

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
                loading="lazy"
              />
            </div>
          )}

          <div className="max-w-[1200px] mx-auto">

            {/* CENTER HEADING (PERFECTLY ALIGNED) */}
            <h2 className="text-center uppercase font-[manrope] text-[22px] md:text-[32px] tracking-[0.08em] mb-2 md:mb-10">
              Why Craft Matters
            </h2>

            <div className="divide-y divide-neutral-300/70">
              {[
                {
                  num: "I.",
                  head: "ITS INHERENTLY CIRCULAR",
                  text: "Indian craftsmanship has been practicing zero-waste design long before it had a name. We repurposed fabric, dyed naturally, and created heirlooms, not mass produce landfill.",
                },
                {
                  num: "II. ITS HONOURS TIME, NOT SPEED",
                  text: "A single garment can take weeks or months to make. A weave can take years to perfect. This is slow fashion. A lived reality, not a marketing label.",
                },
                {
                  num: "III. ITS ROOTED IN LOCAL ECOSYSTEMS",
                  text: "From Kutch to Varanasi, Kashmir to Tamil Nadu, craft traditions are shaped by climate, soil, and community. We don't just make garments. We weave history.",
                },
                {
                  num: "IV. ITS EMPOWERS AT GRASSROOT",
                  text: "When you support Indian craft, you support rural economies, women-led artisan collectives, and intergenerational skill. Not corporations or exploitation.",
                },
                {
                  num: "V. ITS RESISTS SAMENESS",
                  text: "No two weaves are identical. Craft preserves individuality which is the very soul of sustainable style. Craft preserves individuality which is the very soul of sustainable style.",
                },
                {
                  num: "VI. ITS PREDATES AND OUTLIVES TRENDS",
                  text: "Fast fashion fades. Karegari survives. Indian craftsmanship is not old, it's timeless. It doesn't follow, it outlasts.",
                },
                {
                  num: "VII. IT'S CULTURALLY SIGNIFICANT",
                  text: "Our designs are not random. They are rich with symbolism mangoes for -fertility, lotuses for purity, parrots for love. Every motif is civilizational memory, not trend forecasting.",
                },
                {
                  num: "VIII. IT DOESN'T RELY ON MACHINES",
                  text: "It relies on memory, on muscle, on mastery. Artisans are the original slow fashion designers. Their skills are honed over decades, passed down generations. This is craft, not commodity.",
                },
                {
                  num: "IX. ITS BUILT TO LAST",
                  text: "Handwoven, hand-stitched, hand-dyed, every detail is made to endure. This is generational, not disposable. Local, low carbon, low waste.",
                },
                {
                  num: "X. IT'S FASHION THAT FEEL LIKE HOME",
                  text: "In a world obsessed with what's new, Indian craftsmanship reminds us what's true. Slow fashion here is not a buzzword, it's a birthright. Our inheritance",
                },
                {
                  num: "XI. INDIAN CRAFTSMANSHIP DOESN'T NEED VALIDATION",
                  text: "It needs visibility. Value. And voices that protect it.",
                },
                {
                  num: "XII. SUPPORT INDIAN ARTISANS",
                  text: "Wear your culture with pride. Made in India clothing is not a compromise, it's a reclaiming, a rebellion. It is soil-to-soul style.",
                },
                {
                  num: "XIII. WHEN YOU CHOOSE INDIAN CRAFT AND DESIGN",
                  text: "You don't just wear beauty, you invest in culture and preserve a dynasty. You wear knowledge, resistance, devotion, and home. You choose memory, meaning, mastery - over marketing. You fund futures, woven into fabric",
                },

              ].map((item, i) => (
                <div
                  key={i}
                  className="grid grid-rows-[70px_1fr] md:grid-cols-[720px_1fr] items-center py-10 md:py-14"
                >
                  {/* Hover Target */}
                  <span
                    onMouseEnter={() => setManifestoImage(item.img)}
                    onMouseLeave={() => setManifestoImage(null)}
                    onMouseMove={handleManifestoMove}
                    className="font-[manrope] text-[18px] md:text-[20px] cursor-pointer"
                  >
                    {item.num}  {item.head}
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
              loading="lazy"
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
