// src/pages/WeaveCollection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SeoData from "../SEO/SeoData.jsx";
import weavecover from "../assets/images/weavecovernew.jpg";
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
import pashmina from "../assets/images/pashmina.jpg";
import narayanpetImg from "../assets/images/narayanpet.jpg";

/* ------------------------------
   Subcategories with slugs
   (slugs must match product.weavingSlug values)
------------------------------ */
const subcategories = [
  {
    heritage: "Tamil Nadu Heritage Weave",
    name: "Kanchipuram",
    slug: "kanchipuram",
    desc: "Woven in Tamil Nadu, Kanchipuram silk is known for its rich mulberry silk and contrasting borders. Traditionally crafted for ceremonial wear, each piece reflects centuries of South Indian weaving mastery and enduring grandeur.",
    image: Img1,
  },
  {
    heritage: "Bengal Heritage Weave",
    name: "Kantha",
    slug: "katan",
    desc: "Every piece of Kantha is one-of-a-kind because there were and still are no strict rules to follow. However, there are certain symbols and motifs that are widely recognized, where each design has a personal charm, shaped by the artist’s unique perspective, style and colour palette.",
    image: Img2,
  },
  {
    heritage: "Uttar Pradesh Heritage Weave",
    name: "Banarasi Brocade",
    slug: "banarasi",
    desc: "The Banarasi brocade saw its golden age during Emperor Akhbar’s Mughal rule. The infusion of the Persian designs with Indian motifs, formed the iconic ornate patterns such as the floral vines, creepers, and the timeless paisley design. With this blend of cultures, the Banarasi weaving became a priceless element of the Indian textile history.",
    image: Img5,
  },
  {
    heritage: "Telangana Heritage Weave",
    name: "Pochampalley Ikkat",
    slug: "pochampalley",
    desc: "Hailing from Telangana, Pochampally Ikat is created through a meticulous resist-dyeing process where yarns are dyed before weaving. The precision of its geometric patterns reflects exceptional planning and skill.",
    image: Img7,
  },
  {
    heritage: "Kashmir Heritage Weave",
    name: "Pashmina",
    slug: "pashmina",
    desc: "Exquisitely handcrafted, pashmina weave is a wild of imagination for Kashmir’s master embroiderers. The elaborate patterns on the body of Pashmina shawls are inspired by the blossoming beauty of Kashmir valley, its colorful flowers, birds, animals, and medieval art and architecture. Mughal motifs such as floral vines and paintings of rare and exquisite plants and birds are found in plenty on the Kashmiri Pashmina weave.",
    image: pashmina,
  },
  {
    heritage: "Bihar & Jharkhand Heritage Weave",
    name: "Handloom Plain",
    slug: "plain",
    desc: "Handloom weaving is a traditional method where sarees are woven manually using a hand-operated loom. This age-old technique involves the weaver interlacing the warp and weft threads to create intricate patterns and designs. The handloom weaving process is labour-intensive, requiring immense skill and patience.",
    image: Img4,
  },
  {
    heritage: "Andhra Pradesh Heritage Weave",
    name: "Narayanpet",
    // use the exact slug you use in DB for brocade products
    slug: "narayanpet",
    desc: "The pioneers of Narayanpet silk were weavers in the time of Chatrapati Shivaji in 1630 AD who settled in a village of the same name in Andhra Pradesh. It is said that once when Chattrapati Shivaji was traveling across the Narayanpet region, he set up camp at Narayanpet. After camping for a few days, he continued his travels, but he left behind a few weavers.  ",
    image: narayanpetImg,
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
        <section className="relative h-[60vh] sm:h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            src={weavecover}
            alt="Weave Collection Hero"
            className="absolute inset-0 w-full h-full object-cover top-0 brightness-85"
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
                      loading="lazy"
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
                      {sub.heritage}
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
