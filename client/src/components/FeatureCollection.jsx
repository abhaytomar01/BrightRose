import React from "react";
import { Link } from "react-router-dom";

const FeaturedCollections = ({
  title = "Featured Collections",
  subtitle = "Shop by category and discover our best selections",
  categories = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <section className="w-full py-16 bg-neutral-50 animate-pulse">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-300 mb-10">
            Loading collections...
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-56 bg-gray-200 rounded-2xl shadow-inner"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-neutral-50">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#AD000F]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-600 mt-3 text-base md:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid Layout */}
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-4 sm:gap-6
          "
        >
          {categories.map((category, index) => (
            <Link
              to={category.link || "#"}
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 bg-white block"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-40 transition-opacity duration-500"></div>

              {/* Category Text */}
              {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-2">
                <h3 className="text-white text-base sm:text-lg font-semibold tracking-wide bg-[#AD000F]/80 px-3 py-1.5 rounded-full group-hover:bg-[#AD000F] transition-all duration-300 inline-block">
                  {category.name}
                </h3>
                {category.productCount && (
                  <p className="text-white/90 text-xs sm:text-sm mt-1">
                    {category.productCount} Products
                  </p>
                )}
              </div> */}

              {/* Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37] rounded-2xl transition-all duration-300"></div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        {categories.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-[#AD000F] text-white px-8 py-3 rounded-full text-lg font-medium tracking-wide hover:bg-[#8c000c] hover:shadow-lg transition-all duration-300 border border-[#D4AF37]"
            >
              View All Collections
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
