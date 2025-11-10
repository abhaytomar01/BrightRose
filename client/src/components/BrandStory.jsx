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
    <section className="w-full bg-[#f5efe6] py-16 px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-20">
        
        {/* TEXT SECTION */}
        <motion.div
          className="flex-1 order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#AD000F] mb-4 leading-tight">
            {title}
          </h2>

          {/* Gold Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent mb-6 rounded-full"></div>

          {/* Descriptions */}
          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-4"z>
            {description1}
          </p>

          {/* Conditionally render more content on mobile */}
          <div
            className={`text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed transition-all duration-500 overflow-hidden ${
              showMore ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
            }`}
          >
            <p className="mb-4">{description2}</p>
            <p className="mb-6">{description3}</p>
          </div>

          {/* Learn More (Different behavior for mobile vs desktop) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMore(!showMore)}
              className="lg:hidden inline-block bg-[#AD000F] text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-[#8c000c] hover:shadow-md transition-all duration-300 border border-[#D4AF37]"
            >
              {showMore ? "Show Less" : "Learn More"}
            </button>

            <Link
              to={learnMoreLink}
              className="hidden lg:inline-block bg-[#AD000F] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#8c000c] hover:shadow-lg transition-all duration-300 border border-[#D4AF37]"
            >
              Read More
            </Link>
          </div>
        </motion.div>

        {/* IMAGE / VIDEO SECTION */}
        <motion.div
          className="flex-1 order-1 lg:order-2 w-full rounded-3xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              loop
              muted
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-3xl"
            />
          ) : (
            <img
              src={imageUrl}
              alt="Brand Story"
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-3xl"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
