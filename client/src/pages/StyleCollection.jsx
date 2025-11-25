import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ------------------------------
   Subcategories (same content)
------------------------------ */
const subcategories = [
  {
    name: "Coats / Blazers",
    desc: "Tailored elegance crafted with handwoven textiles.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    link: "/",
  },
  {
    name: "Skirt & Pants",
    desc: "Contemporary silhouettes with traditional craftsmanship.",
    image: "https://images.pexels.com/photos/33323127/pexels-photo-33323127.jpeg",
    link: "/",
  },
  {
    name: "Saree",
    desc: "Classic drapes blending heritage with modern minimalism.",
    image: "https://images.pexels.com/photos/2723623/pexels-photo-2723623.jpeg",
    link: "/",
  },
  {
    name: "Dresses",
    desc: "Fluid silhouettes designed for effortless grace.",
    image: "https://images.pexels.com/photos/18977034/pexels-photo-18977034.jpeg",
    link: "/",
  },
  {
    name: "Corsets & Tops",
    desc: "Structured yet comfortable pieces with artisanal detailing.",
    image: "https://images.pexels.com/photos/30773362/pexels-photo-30773362.jpeg",
    link: "/",
  },
];

/* ------------------------------
   Luxury UI Page
------------------------------ */
const StyleCollection = () => {
  return (
    <div className="bg-pureWhite text-neutralDark min-h-screen">

      {/* --------------------------------------
          HERO (Luxury Editorial Banner)
      -------------------------------------- */}
      <section className="relative h-[60vh] sm:h-[65vh] flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1602810318383-e7b3d15b3b1f?auto=format&fit=crop&w=1600&q=80"
          alt="Style Collection Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />

        {/* Soft Neutral-Gold Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralDark/30 to-neutralDark/60"></div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-primaryRed text-4xl sm:text-5xl md:text-6xl font-light tracking-tight drop-shadow-lg">
            The Style Collection
          </h1>

          <p className="text-neutralLight text-base sm:text-lg md:text-xl max-w-xl mx-auto mt-3 font-light leading-relaxed drop-shadow">
            A curation of classic tailoring and modern silhouettes.
          </p>
        </motion.div>
      </section>

      {/* --------------------------------------
          GRID (Luxury Card Layout)
      -------------------------------------- */}
      <section className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">

          {subcategories.map((sub, index) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.6 }}
            >
              <Link to={sub.link} className="block group">

                {/* Image Block */}
                <div className="overflow-hidden rounded-2xl bg-neutralLight border border-mutedGray/80 hover:border-accentGold/60 transition-all duration-300">
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

export default StyleCollection;
