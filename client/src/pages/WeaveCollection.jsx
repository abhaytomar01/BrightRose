// src/pages/WeaveCollection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SeoData from "../SEO/SeoData.jsx";
import weavecover from "../assets/images/weavecover.jpg";
import Img1 from "../assets/images/3.jpg";
import Img2 from "../assets/images/4.jpg";
import Img3 from "../assets/images/5.jpg";
import Img4 from "../assets/images/6.jpg";
import Img5 from "../assets/images/7.jpg";
import Img6 from "../assets/images/8.jpg";
import Img7 from "../assets/images/9.jpg";
import Img8 from "../assets/images/10.jpg";
import Img9 from "../assets/images/11.jpg";
import Img10 from "../assets/images/12.jpg";

/* ------------------------------
   Subcategories with slugs
   (slugs must match product.weavingSlug values)
------------------------------ */
const subcategories = [
  {
    name: "Kanchipuram",
    slug: "kanchipuram",
    desc: "Woven in Tamil Nadu, Kanchipuram silk is known for its rich mulberry silk and contrasting borders. Traditionally crafted for ceremonial wear, each piece reflects centuries of South Indian weaving mastery and enduring grandeur.",
    image: Img1,
  },
  {
    name: "Katan",
    slug: "katan",
    desc: "The Queen of Banarasi Weaves. Among all the fabrics of Banaras, Katan silk reigns supreme. Known as the purest form of Banarasi weaving, Katan is smooth, lustrous, and incredibly strong — making it the perfect canvas for the city's most intricate brocades.",
    image: Img2,
  },
  {
    name: "Banarasi",
    slug: "banarasi",
    desc: "A symbol of Indian opulence, Banarasi textiles are woven in Varanasi using fine silk and rich zari. Known for their elaborate motifs and regal finish, they remain timeless heirlooms passed down through generations.",
    image: Img5,
  },
  {
    name: "Pochampalley",
    slug: "pochampalley",
    desc: "Hailing from Telangana, Pochampally Ikat is created through a meticulous resist-dyeing process where yarns are dyed before weaving. The precision of its geometric patterns reflects exceptional planning and skill.",
    image: Img7,
  },
  {
    name: "Pashmina",
    slug: "pashmina",
    desc: "Pashmina weaving dates back centuries and is deeply rooted in the culture of Kashmir. The wool, sourced from the Changthangi goat, is known for its unmatched softness and warmth. Historically, Pashmina shawls were worn by royalty and were considered a symbol of luxury.",
    image: Img6,
  },
  {
    name: "Plain",
    slug: "plain",
    desc: "The simplest structure in different textiles of India. Every weft thread crosses over one warp, then under the next, creating a clean and versatile cloth.",
    image: Img4,
  },
  {
    name: "Brocade",
    // use the exact slug you use in DB for brocade products
    slug: "banarasi",
    desc: "Gadwal textiles are distinguished by their unique structure — cotton bodies woven with pure silk borders and pallavs. Lightweight yet grand, they were traditionally designed for comfort in warm climates without compromising elegance.",
    image: Img8,
  },
];

const WeaveCollection = () => {
  return (
    <>
      <SeoData
        title="Weave Collection – Handwoven Heritage | Bright Rose"
        description="Discover handwoven masterpieces including Kanchipuram, Banarasi, and artisanal textiles curated for the modern woman."
        keywords={[
          "weave collection",
          "kanchipuram weave",
          "banarasi couture",
          "indian weaving heritage",
          "handloom revival",
        ]}
        image={weavecover}
        url="/weavecollection"
      />

      <div className="bg-pureWhite text-neutralDark min-h-screen">
        {/* HERO */}
        <section className="relative h-[60vh] sm:h-[68vh] flex items-center justify-center overflow-hidden">
          <img
            src={weavecover}
            alt="Weave Collection Hero"
            className="absolute inset-0 w-full h-full object-cover top-0 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-neutralDark/30 to-neutralDark/60" />

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center px-6"
          >
            <h1 className="text-neutralLight text-2xl sm:text-4xl md:text-6xl font-light tracking-tight drop-shadow-lg">
              The Weave Collection
            </h1>
            <p className="text-neutralLight text-sm sm:text-md md:text-xl max-w-xl mx-auto mt-3 font-light leading-relaxed drop-shadow">
              A curated celebration of handcrafted Indian textiles reimagined
              for the modern world.
            </p>
          </motion.div>
        </section>

        {/* GRID */}
        <section className="max-w-[1500px] mx-auto mt-10 px-6 md:px-12 lg:px-20 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
            {subcategories.map((sub, index) => (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                className="group"
              >
                {/* IMPORTANT: send slug via ?weave= */}
                <Link to={`/products?weave=${encodeURIComponent(sub.slug)}`}>
                  {/* Image Panel */}
                  <div
                    className="
                      relative overflow-hidden
                      rounded-[18px]
                      border border-neutral-300/70
                      bg-neutralLight
                      transition-all duration-500
                      group-hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.28)]
                      group-hover:-translate-y-1
                    "
                  >
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="
                        w-full h-[390px] md:h-[430px] object-cover
                        transition-all duration-[900ms]
                        group-hover:scale-[1.04]
                      "
                    />
                    <div
                      className="
                        absolute inset-x-0 bottom-0 h-[40%]
                        bg-gradient-to-t from-black/45 to-transparent
                        opacity-70
                      "
                    />
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <p
                      className="
                        uppercase tracking-[0.4em]
                        text-[10px] text-neutral-500
                      "
                    >
                      Heritage Weave
                    </p>

                    <h3
                      className="
                        mt-2 text-[19px] md:text-[22px]
                        font-light tracking-wide
                        text-neutral-800
                      "
                    >
                      {sub.name}
                    </h3>

                    <p
                      className="
                        mt-2 text-[12px] md:text-[13px]
                        text-neutral-600 leading-relaxed
                        max-w-sm
                      "
                    >
                      {sub.desc}
                    </p>

                    <div
                      className="
                        mt-4 w-[0%] h-[1px] bg-neutral-700
                        group-hover:w-[70%]
                        transition-all duration-500
                      "
                    />
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

export default WeaveCollection;
