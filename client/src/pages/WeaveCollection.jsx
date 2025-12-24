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
   Subcategories
------------------------------ */
const subcategories = [
  {
    name: "Kanjeevaram",
    desc: "Woven in Tamil Nadu, Kanjeevaram silk is known for its rich mulberry silk and contrasting borders. Traditionally crafted for ceremonial wear, each piece reflects centuries of South Indian aving mastery and enduring grandeur",
    image:Img1
  },
  {
    name: "Kantha",
    desc: "Originating in Bengal, Kantha is a hand-embroidered textile created using layers of fabric stitched together with simple running stitches. Each motif tells a personal story, turning everyday cloth into an intimate work of art.",
    image:Img2
  },
  {
    name: "Shibori",
    desc: "An ancient resist-dyeing technique, Shibori involves binding, folding, or twisting fabric before dyeing. The result is organic, unpredictable patterns no two pieces ever emerge the same.",
    image:Img3
  },
  {
    name: "Tanchoi",
    desc: "Tanchoi weaving traces its roots to Varanasi and is celebrated for its intricate silk patterns woven without extra floats on the reverse. The fabric feels smooth, dense, and luxurious, often adorned with subtle floral and paisley motifs.",
    image:Img4
  },
  {
    name: "Benarasi",
    desc: "A symbol of Indian opulence, Banarasi textiles are woven in Varanasi using fine silk and rich zari. Known for their elaborate motifs and regal finish, they remain timeless heirlooms passed down through generations.",
    image:Img5
  },
  {
    name: "Kadwa",
    desc: "A labour-intensive technique within Banarasi weaving, Kadwa involves weaving each motif separately rather than in continuous patterns. This results in sharper designs, a heavier fabric, and unparalleled craftsmanship.",
    image:Img6
  },
  {
    name: "Pochampally Ikat",
    desc: "Hailing from Telangana, Pochampally Ikat is created through a meticulous resist-dyeing process where yarns are dyed before weaving. The precision of its geometric patterns reflects exceptional planning and skill.",
    image:Img7
  },
  {
    name: "Gadwal",
    desc: "Gadwal textiles are distinguished by their unique structure — cotton bodies woven with pure silk borders and pallavs. Lightweight yet grand, they were traditionally designed for comfort in warm climates without compromising elegance.",
    image:Img8
  },
  {
    name: "Uppada",
    desc: "Woven in Andhra Pradesh, Uppada silk is celebrated for its gossamer-light texture and intricate jamdani-style motifs. Despite its delicate feel, the craftsmanship behind each piece is remarkably complex and time-intensive.",
    image:Img9
  },
  {
    name: "Jamdani",
    desc: "One of India’s most poetic weaving traditions, Jamdani involves hand-weaving motifs directly into the fabric. Each design appears to float on the surface, creating an ethereal textile that is both delicate and enduring.",
    image:Img10
  },
];

/* ------------------------------
   Weave Collection Page (Luxury)
------------------------------ */
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
    "handloom revival"
  ]}
  image={weavecover}
  url="/weavecollection"
/>

    <div className="bg-pureWhite text-neutralDark min-h-screen">

      {/* ----------------------------------
          HERO — Luxury Editorial Banner
      ---------------------------------- */}
      <section className="relative h-[60vh] sm:h-[68vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <img
          src={weavecover}
          alt="Weave Collection Hero"
          className="absolute inset-0 w-full h-full object-cover top-0 brightness-95"
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
          <h1 className="text-neutralLight text-2xl sm:text-4xl md:text-6xl font-light tracking-tight drop-shadow-lg">
            The Weave Collection
          </h1>

          <p className="text-neutralLight text-sm sm:text-md md:text-xl max-w-xl mx-auto mt-3 font-light leading-relaxed drop-shadow">
            A curated celebration of handcrafted Indian textiles reimagined for the modern world.
          </p>
        </motion.div>
      </section>

      {/* ----------------------------------
          GRID — Luxury Card Layout
      ---------------------------------- */}
      {/* ----------------------------------
    GRID — Editorial Luxury Layout
---------------------------------- */}
{/* ----------------------------------
    MINIMAL MUSEUM GRID
---------------------------------- */}
<section className="max-w-[1500px] mx-auto mt-10 px-6 md:px-12 lg:px-20 pb-24">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">

    {subcategories.map((sub, index) => (
      <motion.div
        key={sub.name}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.05 }}
        className="group"
      >
        <Link to={`/products?weave=${encodeURIComponent(sub.name)}`}>

          {/* Image Panel */}
          <div className="
            relative overflow-hidden
            rounded-[18px]
            border border-neutral-300/70
            bg-neutralLight
            transition-all duration-500
            group-hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.28)]
            group-hover:-translate-y-1
          ">
            <img
              src={sub.image}
              alt={sub.name}
              className="
                w-full h-[390px] md:h-[430px] object-cover
                transition-all duration-[900ms]
                group-hover:scale-[1.04]
              "
            />

            {/* gentle light fade */}
            <div className="
              absolute inset-x-0 bottom-0 h-[40%]
              bg-gradient-to-t from-black/45 to-transparent
              opacity-70
            " />
          </div>

          {/* Content */}
          <div className="mt-6">
            <p className="
              uppercase tracking-[0.4em]
              text-[10px] text-neutral-500
            ">
              Heritage Weave
            </p>

            <h3 className="
              mt-2 text-[19px] md:text-[22px]
              font-light tracking-wide
              text-neutral-800
            ">
              {sub.name}
            </h3>

            <p className="
              mt-2 text-[12px] md:text-[13px]
              text-neutral-600 leading-relaxed
              max-w-sm
            ">
              {sub.desc}
            </p>

            {/* underline reveal */}
            <div className="
              mt-4 w-[0%] h-[1px] bg-neutral-700
              group-hover:w-[70%]
              transition-all duration-500
            " />
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
