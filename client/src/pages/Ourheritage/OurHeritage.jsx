import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* -----------------------------------
   Minimal Luxury Config
----------------------------------- */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1800&q=80";

const TIMELINE = [
  {
    year: "2003",
    title: "Brand Founded",
    text: "We began with a passion to revive traditional handloom into modern silhouettes.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2007",
    title: "International Showcase",
    text: "Our artistry reached global exhibitions, celebrated for authenticity and craft.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2015",
    title: "Sustainable Line",
    text: "We introduced a conscious collection using responsibly sourced fabrics.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2023",
    title: "Global Expansion",
    text: "Our collections now appear in curated boutiques across continents.",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80",
  },
];

/* -----------------------------------
   Animation Variant
----------------------------------- */
const itemVariant = (direction = "left") => ({
  hidden: { opacity: 0, x: direction === "left" ? -100 : 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.35, 1] },
  },
});

/* -----------------------------------
   HERO SECTION (Hermès Style)
----------------------------------- */
const HeroParallax = ({ title, subtitle }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -60]);
  const scale = useTransform(scrollY, [0, 800], [1.0, 1.05]);

  return (
    <section className="relative w-full h-[70vh] overflow-hidden bg-black">
      {/* Parallax Image */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
        }}
      ></motion.div>

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-start px-6 md:px-20 lg:px-28">
        <div className="max-w-xl">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/90 text-base sm:text-lg lg:text-xl mt-4 font-light leading-relaxed max-w-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

/* -----------------------------------
   TIMELINE ITEM (Gucci Editorial)
----------------------------------- */
function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.article
      ref={ref}
      variants={itemVariant(isEven ? "left" : "right")}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
    >
      {/* Image */}
      <div className={`${isEven ? "md:order-2" : "md:order-1"}`}>
        <div className="overflow-hidden rounded-xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Text */}
      <div className={`${isEven ? "md:order-1" : "md:order-2"} font-light`}>
        <p className="text-gray-600 text-sm tracking-wider mb-1">{item.year}</p>
        <h3 className="text-2xl md:text-3xl text-gray-900 font-light mb-2">
          {item.title}
        </h3>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg font-extralight">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

/* -----------------------------------
   TIMELINE SECTION (Hermès Style)
----------------------------------- */
const Timeline = ({ items }) => (
  <section className="bg-[#FAF7F3] py-20 px-4 md:px-20">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-light text-gray-900 tracking-tight mb-14">
        Our Story
      </h2>

      <div className="space-y-20">
        {items.map((it, idx) => (
          <TimelineItem key={idx} item={it} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

/* -----------------------------------
   FINAL CTA (Gucci Lookbook Banner)
----------------------------------- */
const FinalCTA = () => (
  <section className="relative w-full mt-16">
    <div className="w-full h-[60vh] relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1606813902779-63e39ec0b8c5?auto=format&fit=crop&w=1600&q=80"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-6">
            Worn by the Brave
          </h3>

          <a
            href="/collections"
            className="
              inline-block px-10 py-3 border border-white 
              text-white text-sm tracking-wide 
              hover:bg-white hover:text-black 
              transition-all duration-300
            "
          >
            Explore Collection
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* -----------------------------------
   MAIN EXPORT
----------------------------------- */
export default function AboutAdvanced() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      <HeroParallax
        title="ABOUT THE BRIGHT ROSE"
        subtitle="A revival of handcrafted Indian textiles — shaped into modern global silhouettes."
      />

      <Timeline items={TIMELINE} />

      <FinalCTA />
    </main>
  );
}



// import React from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useInView } from "react-intersection-observer";

// /* ------ Data: replace images/text with your brand content ------ */
// const HERO_IMAGE =
//   "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1800&q=80";
// const TIMELINE = [
//   {
//     year: "2003",
//     title: "Brand Founded",
//     text: "We started with a passion to revive traditional handloom with modern silhouettes.",
//     image:
//       "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     year: "2007",
//     title: "First International Showcase",
//     text: "Our collections reached international showcases and were praised for craftsmanship.",
//     image:
//       "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     year: "2015",
//     title: "Sustainable Line",
//     text: "Introduced an eco-conscious collection with responsibly sourced fabrics.",
//     image:
//       "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
//   },
//   {
//     year: "2023",
//     title: "Global Expansion",
//     text: "Our pieces are now carried in curated boutiques across multiple countries.",
//     image:
//       "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80",
//   },
// ];

// /* ------ Animation variants ------ */
// const itemVariant = (direction = "left") => ({
//   hidden: { opacity: 0, x: direction === "left" ? -120 : 120, y: 0 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
//   },
// });

// /* ------ Hero with parallax ------ */
// const HeroParallax = ({ title = "About Us", subtitle }) => {
//   const { scrollY } = useScroll();
//   const y = useTransform(scrollY, [0, 800], [0, -80]);
//   const scale = useTransform(scrollY, [0, 800], [1.0, 1.04]);

//   return (
//     <section
//       aria-label="hero"
//       className="relative w-full h-[52vh] sm:h-[60vh] md:h-[64vh] lg:h-[72vh] overflow-hidden"
//     >
//       <motion.div
//         style={{ y, scale }}
//         className="absolute inset-0 bg-cover bg-center will-change-transform"
//         dangerouslySetInnerHTML={{
//           __html: `<style>
//               .hero-bg { background-image: url('${HERO_IMAGE}'); }
//             </style>`,
//         }}
//       />
//       <div className="hero-bg absolute inset-0 bg-cover bg-center" />
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 pointer-events-none"></div>
//       <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10">
//         <div className="w-full max-w-[95vw] sm:max-w-4xl text-left mx-auto px-0 sm:px-10">
//           <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-xl break-words">
//             {title}
//           </h1>
//           {subtitle && (
//             <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg md:text-xl">
//               {subtitle}
//             </p>
//           )}
//         </div>
//       </div>
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//         <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F0DFA0] to-transparent opacity-90" />
//       </div>
//     </section>
//   );
// };

// /* ------ Timeline ------ */
// function TimelineItem({ item, index }) {
//   const isEven = index % 2 === 0;
//   const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

//   return (
//     <motion.article
//       ref={ref}
//       aria-label={`milestone-${index}`}
//       initial="hidden"
//       animate={inView ? "visible" : "hidden"}
//       variants={itemVariant(isEven ? "left" : "right")}
//       className="relative flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 max-w-full"
//     >
//       <div className={`w-full md:w-1/2 ${isEven ? "md:pl-12 md:order-2" : "md:pr-12 md:order-1"} order-2 md:order-none`}>
//         <div className="overflow-hidden rounded-xl mb-4 md:mb-0">
//           <img src={item.image} alt={item.title} className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md" />
//         </div>
//       </div>
//       <div className={`w-full md:w-1/2 ${isEven ? "md:pr-12 md:order-1" : "md:pl-12 md:order-2"} text-left`}>
//         <span className="inline-block text-sm font-semibold text-[#D4AF37] mb-2">{item.year}</span>
//         <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
//         <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{item.text}</p>
//       </div>
//       <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
//         <div className="w-6 h-6 bg-[#D4AF37] rounded-full border-4 border-[#F8F6F3] shadow-sm" />
//       </div>
//     </motion.article>
//   );
// }

// const Timeline = ({ items = TIMELINE }) => (
//   <section className="relative bg-[#F8F6F3] py-10 px-3 sm:py-20 sm:px-6 md:px-12 lg:px-20 overflow-x-hidden">
//     <div className="max-w-full sm:max-w-6xl mx-auto">
//       <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#AD000F] mb-8 sm:mb-12">Our Story</h2>
//       <div className="relative">
//         <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#D4AF37]/90 to-transparent" />
//         <div className="space-y-12 sm:space-y-16">
//           {items.map((it, idx) => (
//             <div key={idx} className="md:relative">
//               <TimelineItem item={it} index={idx} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </section>
// );

// /* ------ Additional About Layout Sections ------ */
// const AboutLayout = () => (
//   <section className="bg-[#F8F6F3] py-20 px-6 md:px-16 lg:px-24">
//     {/* <div className="max-w-6xl mx-auto space-y-20">
//       <div className="flex flex-col lg:flex-row gap-10 items-center">
//         <div className="flex-1">
//           <h2 className="text-3xl md:text-5xl font-bold text-[#AD000F] mb-4">About Brand</h2>
//           <p className="text-gray-700 text-lg mb-3 leading-relaxed">
//             <strong>Bright Rose</strong> is an endeavor to bring back Indian Handloom — blending heritage with modern silhouettes to clothe the world again through intricate weaves.
//           </p>
//           <p className="text-gray-700 text-lg mb-3 leading-relaxed">
//             Known as the Queen of Flowers, our logo symbolizes elegance, resilience, and craftsmanship that reflect the soul of Indian artisans.
//           </p>
//           <p className="text-[#3b6e58] italic text-lg">
//             “Our knowledge of weaving is deeply valued, often passed down generations as an honored legacy.” — Chand, Weaver from Varanasi
//           </p>
//         </div>
//         <img
//           src="https://images.pexels.com/photos/7598024/pexels-photo-7598024.jpeg"
//           alt="Brand Logo"
//           className="rounded-xl shadow-lg w-80 sm:w-96"
//         />
//       </div>

//       <div className="grid md:grid-cols-2 gap-10 items-center">
//         <div>
//           <h2 className="text-3xl md:text-4xl font-bold text-[#AD000F] mb-4">The Problem</h2>
//           <p className="text-gray-700 text-lg leading-relaxed">
//             Many saree lovers found it hard to drape for events — so we envisioned a world where traditional fabrics could be worn as easy silhouettes.
//           </p>
//         </div>
//         <img src="https://via.placeholder.com/600x400.png?text=Problem" alt="Problem" className="rounded-xl shadow-md" />
//       </div>

//       <div className="grid md:grid-cols-2 gap-10 items-center">
//         <img src="https://via.placeholder.com/600x400.png?text=Solution" alt="Solution" className="rounded-xl shadow-md" />
//         <div>
//           <h2 className="text-3xl md:text-4xl font-bold text-[#AD000F] mb-4">Our Solution</h2>
//           <p className="text-gray-700 text-lg leading-relaxed">
//             Modern silhouettes crafted in traditional fabrics like Kanjeevaram, Banarasi, and Ikat bring timeless luxury for today’s global women.
//           </p>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-10 items-center">
//         <img src="https://via.placeholder.com/500x500.png?text=Product" alt="Product" className="rounded-xl shadow-lg" />
//         <div>
//           <h2 className="text-3xl md:text-5xl font-bold text-[#AD000F] mb-4">Our Product</h2>
//           <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
//             <li>Handwoven & handmade only</li>
//             <li>Each piece is unique and timeless</li>
//             <li>Contemporary silhouettes with Indian heritage</li>
//             <li>Sustainable and versatile for global wear</li>
//           </ul>
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-10 items-center">
//         <img src="https://via.placeholder.com/600x400.png?text=People" alt="People" className="rounded-xl shadow-lg" />
//         <div>
//           <h2 className="text-3xl md:text-5xl font-bold text-[#AD000F] mb-4">The People</h2>
//           <p className="text-gray-700 text-lg">
//             Educated, rooted, and globally inspired — our consumers value craftsmanship, emotion, and legacy over logos. Age 25+, they represent modern India with heritage at heart.
//           </p>
//         </div>
//       </div>
//     </div> */}
//   </section>
// );

// export default function AboutAdvanced() {
//   return (
//     <main className="min-h-screen bg-white text-[#1f2937] overflow-x-hidden">
//       <HeroParallax
//         title="ABOUT THE BRIGHT ROSE"
//         subtitle="Bright Rose is an endeavor to bring back Indian Handloom — blending heritage with modern silhouettes to clothe the world again through intricate weaves."
//       />

//       <Timeline items={TIMELINE} />

//       {/* Added Creative Layout Sections */}
//       <AboutLayout />

//       <section className="relative w-full mt-8 sm:mt-12">
//         <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 relative overflow-hidden">
//           <img
//             src="https://images.unsplash.com/photo-1606813902779-63e39ec0b8c5?auto=format&fit=crop&w=1600&q=80"
//             alt="Editorial"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center px-3 sm:px-6">
//               <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 break-words">
//                 Worn by the Brave
//               </h3>
//               <a
//                 href="/collections"
//                 className="inline-block bg-[#AD000F] text-white px-4 sm:px-6 py-2 rounded-full font-medium border border-[#D4AF37] hover:bg-[#8c000c] transition"
//               >
//                 Explore Our Legacy
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
