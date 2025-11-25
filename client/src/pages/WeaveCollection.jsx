import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ------------------------------
   Subcategories
------------------------------ */
const subcategories = [
  {
    name: "Kanjeevaram",
    desc: "Rich silks from Tamil Nadu, known for vibrant colours and a timeless zari tradition.",
    image:
      "https://images.pexels.com/photos/9819154/pexels-photo-9819154.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Kantha",
    desc: "Intricate hand embroidery from Bengal—heritage woven into every thread.",
    image:
      "https://images.unsplash.com/photo-1622441410472-0dfc6dbb07f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Shibori",
    desc: "Japanese dyeing tradition interpreted through Indian craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1623574606108-30e1b3b7b3e8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tanchoi",
    desc: "Smooth, lightweight weaving using satin threads for refined elegance.",
    image:
      "https://images.unsplash.com/photo-1588610377395-3c8f3c8a28e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Benarasi",
    desc: "Opulent silk weaving from Varanasi—classic, festive and deeply rooted in legacy.",
    image:
      "https://images.pexels.com/photos/7091946/pexels-photo-7091946.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Kadwa",
    desc: "Distinctive extra-weft weaving that creates raised, luxurious motifs.",
    image:
      "https://images.unsplash.com/photo-1580044449217-8d7349ac7390?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pochampally Ikat",
    desc: "A fusion of geometry and colour—woven by skilled Telangana artisans.",
    image:
      "https://images.unsplash.com/photo-1624009085228-fc0e8e2e25a3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gadwal",
    desc: "Cotton body and silk borders—lightweight, graceful and meticulously woven.",
    image:
      "https://images.unsplash.com/photo-1612391746673-6a54e4d40e10?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Uppada",
    desc: "Airy silk and jamdani weaving for a soft, luxurious drape.",
    image:
      "https://images.unsplash.com/photo-1612525676310-40f3e4a8b9c0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jamdani",
    desc: "Muslin artistry—fine, delicate motifs woven with heritage precision.",
    image:
      "https://images.unsplash.com/photo-1601315576607-d8b9c43bff3b?auto=format&fit=crop&w=800&q=80",
  },
];

/* ------------------------------
   Weave Collection Page (Luxury)
------------------------------ */
const WeaveCollection = () => {
  return (
    <div className="bg-pureWhite text-neutralDark min-h-screen">

      {/* ----------------------------------
          HERO — Luxury Editorial Banner
      ---------------------------------- */}
      <section className="relative h-[60vh] sm:h-[68vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1600&q=80"
          alt="Weave Collection Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralDark/30 to-neutralDark/60"></div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-primaryRed text-4xl sm:text-5xl md:text-6xl font-light tracking-tight drop-shadow-lg">
            The Weave Collection
          </h1>

          <p className="text-neutralLight text-base sm:text-lg md:text-xl max-w-xl mx-auto mt-3 font-light leading-relaxed drop-shadow">
            A curated celebration of handcrafted Indian textiles reimagined for the modern world.
          </p>
        </motion.div>
      </section>

      {/* ----------------------------------
          GRID — Luxury Card Layout
      ---------------------------------- */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">

          {subcategories.map((sub, index) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.6 }}
              className="group"
            >
              <Link to={`/products?weave=${encodeURIComponent(sub.name)}`} className="block">

                {/* Image */}
                <div className="overflow-hidden rounded-2xl border border-mutedGray/80 hover:border-accentGold/60 transition-all duration-300 bg-neutralLight">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-[350px] sm:h-[380px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Text */}
                <div className="mt-5 space-y-1">
                  <h3 className="text-xl font-light tracking-wide text-primaryRed">
                    {sub.name}
                  </h3>

                  <p className="text-sm text-neutralDark/80 leading-relaxed font-extralight max-w-xs">
                    {sub.desc}
                  </p>
                </div>

              </Link>
            </motion.div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default WeaveCollection;
