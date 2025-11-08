import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const subcategories = [
  {
    name: "Kanjeevaram",
    desc: "Rich silks from Tamil Nadu, known for their vibrant colors and gold zari.",
    image:
      "https://images.pexels.com/photos/9819154/pexels-photo-9819154.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Kantha",
    desc: "Delicate hand embroidery from Bengal, blending heritage and artistry.",
    image:
      "https://images.unsplash.com/photo-1622441410472-0dfc6dbb07f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Shibori",
    desc: "Japanese-inspired dyeing technique, adapted with Indian craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1623574606108-30e1b3b7b3e8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tanchoi",
    desc: "Intricate weaving with satin threads for smooth, lightweight luxury.",
    image:
      "https://images.unsplash.com/photo-1588610377395-3c8f3c8a28e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Benarasi",
    desc: "Iconic silk from Varanasi — opulent, festive, and timelessly elegant.",
    image:
      "https://images.pexels.com/photos/7091946/pexels-photo-7091946.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Kadwa",
    desc: "A traditional weaving technique using extra weft for raised motifs.",
    image:
      "https://images.unsplash.com/photo-1580044449217-8d7349ac7390?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pochampally Ikat",
    desc: "Geometric precision and colorful patterns from Telangana artisans.",
    image:
      "https://images.unsplash.com/photo-1624009085228-fc0e8e2e25a3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gadwal",
    desc: "Fine cotton body with silk borders, handwoven elegance from Andhra.",
    image:
      "https://images.unsplash.com/photo-1612391746673-6a54e4d40e10?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Uppada",
    desc: "Soft, lightweight silk with jamdani weaving for an airy, rich drape.",
    image:
      "https://images.unsplash.com/photo-1612525676310-40f3e4a8b9c0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jamdani",
    desc: "Delicate muslin weave with floral motifs, ethereal and heritage-rich.",
    image:
      "https://images.unsplash.com/photo-1601315576607-d8b9c43bff3b?auto=format&fit=crop&w=800&q=80",
  },
];

const WeaveCollection = () => {
  return (
    <div className="bg-[#F8F6F3] text-[#222] p-0">
      {/* HERO */}
      <section className="relative h-[65vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1600&q=80"
          alt="Weave Collection Hero"
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
            The Weave Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-xl mx-auto">
            Discover the artistry of Indian weaving — a celebration of timeless craftsmanship.
          </p>
        </motion.div>
      </section>

  <section className="px-6 md:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {subcategories.map((sub, index) => (
    <motion.div
      key={sub.name}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/products?weave=${encodeURIComponent(sub.name)}`}>
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
      </Link>
    </motion.div>
  ))}
</section>

    </div>
  );
};

export default WeaveCollection;
