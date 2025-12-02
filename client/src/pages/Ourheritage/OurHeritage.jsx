import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import aboutbrand from "../../assets/images/Banners/abouthebrand.jpg";

/* -----------------------------------
   TIMELINE DATA
----------------------------------- */
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
   ANIMATIONS
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
   HERO PARALLAX — Luxury Typography
----------------------------------- */
const HeroParallax = ({ title, subtitle }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -60]);
  const scale = useTransform(scrollY, [0, 800], [1.0, 1.05]);

  return (
    <section className="relative w-full h-[65vh] sm:h-[75vh] overflow-hidden bg-pureWhite">

      {/* IMAGE */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutbrand})`,
        }}
      ></motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50"></div>

      {/* TEXT */}
      <div className="absolute inset-0 flex items-center px-5 sm:px-10 lg:px-20">
        <div className="max-w-xl">
          <h1 className="
            text-white 
            text-2xl sm:text-4xl lg:text-5xl 
            font-light tracking-tight leading-tight 
            bg-black/30 px-3 py-2 rounded-md
          ">
            {title}
          </h1>

          {subtitle && (
            <p className="
              text-neutral-200 
              text-sm sm:text-base lg:text-lg 
              mt-4 leading-relaxed font-light 
              bg-black/30 px-3 py-2 rounded-md
            ">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

/* -----------------------------------
   TIMELINE ITEM — Luxury Scaling
----------------------------------- */
function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <>
    <SeoData
  title="Our Heritage – The Story of Bright Rose"
  description="Bright Rose celebrates the soul of Indian weaving traditions. Discover our philosophy, artisanal lineage, and dedication to handcrafted luxury."
  keywords={[
    "Bright Rose heritage",
    "Indian handloom tradition",
    "artisan craft story",
    "luxury weaving culture",
    "heritage couture india"
  ]}
  image="/og-heritage.jpg"
  url="/ourheritage"
/>

    <motion.article
      ref={ref}
      variants={itemVariant(isEven ? "left" : "right")}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
    >
      {/* IMAGE */}
      <div className={`${isEven ? "md:order-2" : "md:order-1"}`}>
        <div className="overflow-hidden rounded-xl border border-neutral-300/40 shadow-sm">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* TEXT */}
      <div className={`${isEven ? "md:order-1" : "md:order-2"}`}>
        <p className="text-accentGold text-xs sm:text-sm tracking-widest mb-2 uppercase">
          {item.year}
        </p>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-neutralDark mb-3 tracking-tight">
          {item.title}
        </h3>

        <p className="text-neutralDark text-sm sm:text-base md:text-lg font-extralight leading-relaxed">
          {item.text}
        </p>
      </div>
    </motion.article>
    </>
  );
}

/* -----------------------------------
   TIMELINE SECTION
----------------------------------- */
const Timeline = ({ items }) => (
  <section className="bg-pureWhite py-16 sm:py-20 lg:py-24 px-4 sm:px-10 lg:px-20">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-center text-2xl uppercase sm:text-3xl md:text-4xl font-light p-2 rounded-lg text-neutralDark mb-12 sm:mb-16 tracking-tight">
        Our Story 
      </h2>

      <div className="space-y-16 sm:space-y-20 lg:space-y-24">
        {items.map((it, idx) => (
          <TimelineItem key={idx} item={it} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

/* -----------------------------------
   FINAL CTA — Ultra Luxury Banner
----------------------------------- */
const FinalCTA = () => (
  <section className="relative w-full mt-2 sm:mt-2">
    <div className="w-full h-[50vh] sm:h-[60vh] relative overflow-hidden">
      <img
        src={aboutbrand}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <h3 className="text-white font-light tracking-tight drop-shadow-lg
            text-2xl sm:text-4xl md:text-5xl mb-6
          ">
            Worn by the Brave
          </h3>

          <a
            href="/collections"
            className="
              inline-block px-8 sm:px-10 py-2.5 
              border border-neutral-200/60 
              text-white text-xs sm:text-sm tracking-wide 
              hover:bg-white hover:text-black transition-all duration-300
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
   MAIN PAGE
----------------------------------- */
export default function AboutAdvanced() {
  return (
    <main className="bg-pureWhite text-neutralDark overflow-x-hidden">
      <HeroParallax
        title="ABOUT THE BRIGHT ROSE"
        subtitle="A revival of handcrafted Indian textiles — shaped into modern global silhouettes."
      />

      <Timeline items={TIMELINE} />

      <FinalCTA />
    </main>
  );
}
