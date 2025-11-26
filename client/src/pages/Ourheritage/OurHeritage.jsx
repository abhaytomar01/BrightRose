import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* -----------------------------------
   Luxury THEMING — Brand Palette
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
   HERO SECTION — Luxury Parallax
----------------------------------- */
const HeroParallax = ({ title, subtitle }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -60]);
  const scale = useTransform(scrollY, [0, 800], [1.0, 1.05]);

  return (
    <section className="relative w-full h-[70vh] overflow-hidden bg-pureWhite">
      {/* Parallax Image */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
        }}
      ></motion.div>

      {/* Luxury Neutral Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralLight/30 to-neutralDark/50"></div>

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-start px-6 md:px-20 lg:px-28">
        <div className="max-w-xl">
          <h1 className="text-neutralDark/80 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-neutralLight text-base sm:text-lg lg:text-xl mt-4 font-light leading-relaxed max-w-lg drop-shadow-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

/* -----------------------------------
   TIMELINE ITEM — Luxury Brand Style
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
        <div className="overflow-hidden rounded-xl border border-accentGold/30">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Text */}
      <div className={`${isEven ? "md:order-1" : "md:order-2"} font-light`}>
        <p className="text-accentGold text-sm tracking-wider mb-1">
          {item.year}
        </p>
        <h3 className="text-2xl md:text-3xl text-neutralDark/80 font-light mb-2">
          {item.title}
        </h3>
        <p className="text-neutralDark leading-relaxed text-base md:text-lg font-extralight">
          {item.text}
        </p>
      </div>
    </motion.article>
  );
}

/* -----------------------------------
   TIMELINE SECTION
----------------------------------- */
const Timeline = ({ items }) => (
  <section className="bg-pureWhite py-20 px-4 md:px-20">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-light text-neutralDark/80 tracking-tight mb-14">
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
   FINAL CTA — Gucci Style Banner
----------------------------------- */
const FinalCTA = () => (
  <section className="relative w-full mt-16">
    <div className="w-full h-[60vh] relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1606813902779-63e39ec0b8c5?auto=format&fit=crop&w=1600&q=80"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutralDark/40 to-neutralDark/60"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-6 drop-shadow-lg">
            Worn by the Brave
          </h3>

          <a
            href="/collections"
            className="
              inline-block px-10 py-3 
              border border-neutralDark/70 
              text-white text-sm tracking-wide 
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
