import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* ------ Data: replace images/text with your brand content ------ */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1800&q=80";
const TIMELINE = [
  {
    year: "2003",
    title: "Brand Founded",
    text: "We started with a passion to revive traditional handloom with modern silhouettes.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2007",
    title: "First International Showcase",
    text: "Our collections reached international showcases and were praised for craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2015",
    title: "Sustainable Line",
    text: "Introduced an eco-conscious collection with responsibly sourced fabrics.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80",
  },
  {
    year: "2023",
    title: "Global Expansion",
    text: "Our pieces are now carried in curated boutiques across multiple countries.",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80",
  },
];

/* ------ Animation variants ------ */
const itemVariant = (direction = "left") => ({
  hidden: { opacity: 0, x: direction === "left" ? -120 : 120, y: 0 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
});

/* ------ Hero with parallax ------ */
const HeroParallax = ({ title = "About Us", subtitle }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -80]);
  const scale = useTransform(scrollY, [0, 800], [1.0, 1.04]);

  return (
    <section
      aria-label="hero"
      className="relative w-full h-[52vh] sm:h-[60vh] md:h-[64vh] lg:h-[72vh] overflow-hidden"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        dangerouslySetInnerHTML={{
          __html: `<style>
              .hero-bg { background-image: url('${HERO_IMAGE}'); }
            </style>`,
        }}
      />
      <div className="hero-bg absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-10">
        <div className="w-full max-w-[95vw] sm:max-w-4xl text-left mx-auto px-0 sm:px-10">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-xl break-words">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 sm:mt-4 text-white/90 text-base sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F0DFA0] to-transparent opacity-90" />
      </div>
    </section>
  );
};

/* ------ Timeline Item: alternates sides on large screens ------ */
function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.article
      ref={ref}
      aria-label={`milestone-${index}`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariant(isEven ? "left" : "right")}
      className="relative flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 max-w-full"
    >
      {/* Image block (left/right) */}
      <div className={`w-full md:w-1/2 ${isEven ? "md:pl-12 md:order-2" : "md:pr-12 md:order-1"} order-2 md:order-none`}>
        <div className="overflow-hidden rounded-xl mb-4 md:mb-0">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
      {/* Text block */}
      <div className={`w-full md:w-1/2 ${isEven ? "md:pr-12 md:order-1 text-left" : "md:pl-12 md:order-2 text-left"} mt-2 md:mt-0`}>
        <span className="inline-block text-sm font-semibold text-[#D4AF37] mb-2">{item.year}</span>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{item.text}</p>
      </div>
      {/* Center dot (desktop only) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
        <div className="w-6 h-6 bg-[#D4AF37] rounded-full border-4 border-[#F8F6F3] shadow-sm" />
      </div>
    </motion.article>
  );
}

/* ------ Timeline container with central line and staggered spacing ------ */
const Timeline = ({ items = TIMELINE }) => {
  return (
    <section className="relative bg-[#F8F6F3] py-10 px-3 sm:py-20 sm:px-6 md:px-12 lg:px-20 overflow-x-hidden">
      <div className="max-w-full sm:max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#AD000F] mb-8 sm:mb-12">Our Story</h2>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#D4AF37]/90 to-transparent" />
          <div className="space-y-12 sm:space-y-16">
            {items.map((it, idx) => (
              <div key={idx} className="md:relative">
                <TimelineItem item={it} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------ Full About page combining hero + timeline + CTA + footer ------ */
export default function AboutAdvanced() {
  return (
    <main className="min-h-screen bg-white text-[#1f2937] overflow-x-hidden">
      <HeroParallax
        title="ABOUT THE BRIGHT ROSE"
        subtitle="Crafted with passion. Designed for modern elegance."
      />

      <section className="max-w-full sm:max-w-6xl mx-auto px-3 sm:px-6 md:px-12 lg:px-20 -mt-10 sm:-mt-16 relative z-10">
        {/* Optionally add intro text block here */}
      </section>

      <Timeline items={TIMELINE} />

      {/* CTA banner */}
      <section className="relative w-full mt-8 sm:mt-12">
        <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1606813902779-63e39ec0b8c5?auto=format&fit=crop&w=1600&q=80"
            alt="Editorial"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-3 sm:px-6">
              <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 break-words">
                Worn by the Brave
              </h3>
              <a
                href="/collections"
                className="inline-block bg-[#AD000F] text-white px-4 sm:px-6 py-2 rounded-full font-medium border border-[#D4AF37] hover:bg-[#8c000c] transition"
              >
                Explore Our Legacy
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* newsletter */}
      {/* <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-[95vw] sm:max-w-4xl mx-auto text-center px-3 sm:px-6">
          <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#AD000F] mb-2 sm:mb-3">
            Stay Updated
          </h4>
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
            Subscribe for new releases and limited editions.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-3 rounded-full border-2 border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] outline-none"
            />
            <button className="bg-[#AD000F] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#8c000c] transition">
              Subscribe
            </button>
          </form>
        </div>
      </section> */}
    </main>
  );
}
