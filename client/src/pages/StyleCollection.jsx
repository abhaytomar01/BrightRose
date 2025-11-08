import React from "react";
import { motion } from "framer-motion";

const subcategories = [
  {
    name: "Coats / Blazers",
    desc: "Tailored elegance for every season — crafted with handwoven textiles.",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    link: "/",
  },
  {
    name: "Skirt & Pants",
    desc: "Contemporary silhouettes with traditional craftsmanship.",
    image:
      "https://images.pexels.com/photos/33323127/pexels-photo-33323127.jpeg",
    link: "/",
  },
  {
    name: "Saree",
    desc: "Classic drapes that blend Indian heritage with modern style.",
    image:
      "https://images.pexels.com/photos/2723623/pexels-photo-2723623.jpeg",
    link: "/",
  },
  {
    name: "Dresses",
    desc: "Fluid silhouettes and soft fabrics for effortless grace.",
    image:
      "https://images.pexels.com/photos/18977034/pexels-photo-18977034.jpeg",
    link: "/",
  },
  {
    name: "Corsets & Tops",
    desc: "A fusion of structure and comfort with artisanal detailing.",
    image:
      "https://images.pexels.com/photos/30773362/pexels-photo-30773362.jpeg",
    link: "/",
  },
];

const StyleCollection = () => {
  return (
    <div className="bg-[#F8F6F3] text-[#222] p-0">
      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602810318383-e7b3d15b3b1f?auto=format&fit=crop&w=1600&q=80"
          alt="Style Collection Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-serif tracking-wide mb-4 text-white">
            The Style Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto">
            Explore our curated range of styles — from tailored classics to
            contemporary drapes.
          </p>
        </motion.div>
      </section>

      {/* SUBCATEGORIES GRID */}
      <section className="px-6 md:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subcategories.map((sub, index) => (
          <motion.a
            key={sub.name}
            href={sub.link}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="h-[360px] md:h-[420px] overflow-hidden relative">
              <img
                src={sub.image}
                alt={sub.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide drop-shadow-md mb-2">
                  {sub.name}
                </h3>
                <p className="text-gray-100 text-sm md:text-base leading-snug max-w-xs">
                  {sub.desc}
                </p>
              </div>
            </div>
          </motion.a>
        ))}
      </section>
    </div>
  );
};

export default StyleCollection;
