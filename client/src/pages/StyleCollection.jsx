import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SeoData from "../SEO/SeoData.jsx";
import stylecover from "../assets/images/stylecover.webp";
import corsetndtops from "../assets/images/corsetndtops1.jpg";
import dresses from "../assets/images/dresses.webp";
import skirtnpants from "../assets/images/skirtndtrouser.jpg";
import sarees from "../assets/images/saree.jpg";
import jacketnblazers from "../assets/images/jacket&blazer.jpg";
import blazers from "../assets/images/blazers1.jpg";
// import pants from "../assets/images/pants.jpg";
import ikkatsilkcorset from "../assets/images/ikkatsilkcorset1.jpg";

/* ------------------------------
   Subcategories (Luxury Styles)
------------------------------ */
const subcategories = [
  {
    name: "Jackets",
    slug: "jacket", // must match backend tagSlugs
    desc: "Tailored elegance crafted with handwoven textiles.",
    image: jacketnblazers,
  },
  {
    name: "Blazers & Coats",
    slug: "blazers", // must match backend tagSlugs
    desc: "Sharp, elongated tailoring for statement layering from day to evening.",
    image: blazers,
  },
  {
    name: "Skirt",
    slug: "skirt",
    desc: "Contemporary silhouettes with traditional craftsmanship.",
    image: skirtnpants,
  },
  
  {
    name: "Saree",
    slug: "saree",
    desc: "Classic drapes blending heritage with modern minimalism.",
    image: sarees,
  },
  {
    name: "Dresses",
    slug: "dresses",
    desc: "Fluid silhouettes designed for effortless grace.",
    image: dresses,
  },
  {
    name: "Corsets",
    slug: "corsets",
    desc: "Structured yet comfortable pieces with artisanal detailing.",
    image: ikkatsilkcorset,
  },
  {
    name: "Tops",
    slug: "tops",
    desc: "Versatile separates designed to pair seamlessly with your elevated wardrobe.",
    image: corsetndtops,
  },
];

const StyleCollection = () => {
  return (
    <>
      <SeoData
        title="Style Collection – Designer Silhouettes & Couture | Bright Rose"
        description="Explore statement jacket dresses, capes, structured silhouettes, and luxurious handloom fashion crafted by master artisans."
        keywords={[
          "style collection",
          "designer capes",
          "jacket dresses",
          "luxury handloom fashion",
          "contemporary weaves",
        ]}
        image="/og-style.jpg"
        url="/stylecollection"
      />

      <div className="bg-pureWhite text-neutralDark min-h-screen">
        {/* HERO */}
        <section className="relative h-[65vh] sm:h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            src={stylecover}
            alt="Style Collection Hero"
            className="absolute inset-0 w-full h-full object-cover brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralDark/30 to-neutralDark/60"></div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center px-6"
          >
            <h1 className="text-neutralLight text-4xl sm:text-5xl md:text-6xl font-light tracking-tight drop-shadow-lg">
              The Style Collection
            </h1>
            <p className="text-neutralLight text-base sm:text-lg md:text-xl max-w-xl mx-auto mt-3 font-light leading-relaxed drop-shadow">
              A curation of classic tailoring and modern silhouettes.
            </p>
          </motion.div>
        </section>

        {/* GRID */}
        <section className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {subcategories.map((sub, index) => (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.6 }}
              >
                <Link
                  to={`/products?style=${encodeURIComponent(sub.slug)}`}
                  className="block group"
                >
                  <div className="overflow-hidden rounded-2xl bg-neutralLight border border-mutedGray/80 hover:border-accentGold/60 transition-all duration-300">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      loading="lazy"
                      className="w-full h-[520px] sm:h-[380px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5 space-y-1">
                    <h3 className="text-xl font-light tracking-wide text-neutralDark/80">
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
    </>
  );
};

export default StyleCollection;
