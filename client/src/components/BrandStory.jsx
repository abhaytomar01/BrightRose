import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BrandStory = ({
  title = "Our Story",
  description1 = "Crafted with passion. Designed for modern elegance. We celebrate Indian handloom artistry with modern silhouettes, bringing timeless elegance to your wardrobe.",
  description2 = "Each collection embodies our commitment to sustainability and craftsmanship, ensuring that every piece tells a story of tradition and innovation.",
  description3 = "We take pride in empowering local artisans while blending timeless techniques with contemporary aesthetics.",
  imageUrl = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
  learnMoreLink = "/about",
  videoUrl = "",
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-[#FAF7F3] py-20 px-4 sm:px-6 md:px-12 xl:px-24">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center gap-14">

        {/* TEXT SECTION */}
        <motion.div
          className="flex-1 order-2 lg:order-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Minimal Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            {title}
          </h2>

          {/* Thin Divider */}
          <div className="w-16 h-[1.5px] bg-gray-800/40 mb-10"></div>

          {/* First paragraph */}
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            {description1}
          </p>

          {/* Expandable Extra Text (mobile only) */}
          <div
            className={`text-gray-700 text-base sm:text-lg leading-relaxed transition-all duration-500 overflow-hidden ${
              showMore
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
            }`}
          >
            <p className="mb-4">{description2}</p>
            <p className="mb-6">{description3}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-5 mt-6">

            {/* Mobile Learn More Toggle */}
            <button
              onClick={() => setShowMore(!showMore)}
              className="lg:hidden bg-black text-white px-6 py-2.5 rounded-full text-sm tracking-wide hover:bg-neutral-800 transition-all"
            >
              {showMore ? "Show Less" : "Learn More"}
            </button>

            {/* Desktop “Read More” */}
            <Link
              to={learnMoreLink}
              className="hidden lg:inline-block bg-black text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-neutral-800 transition-all"
            >
              Read More
            </Link>

          </div>
        </motion.div>

        {/* IMAGE / VIDEO SECTION */}
        <motion.div
          className="flex-1 order-1 lg:order-2 w-full rounded-3xl overflow-hidden shadow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              loop
              muted
              className="w-full h-[260px] sm:h-[360px] md:h-[450px] lg:h-[520px] object-cover rounded-3xl"
            />
          ) : (
            <img
              src={imageUrl}
              alt="Brand Story"
              className="w-full h-[260px] sm:h-[360px] md:h-[450px] lg:h-[520px] object-cover rounded-3xl"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
