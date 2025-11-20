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
      <section className="w-full py-20 bg-[#FAF7F3] animate-pulse">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-light text-center text-gray-300 mb-10">
            Loading collections...
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 bg-[#FAF7F3]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Title Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 mt-3 text-base md:text-lg font-light">
              {subtitle}
            </p>
          )}

          {/* Thin Divider */}
          <div className="w-16 h-[1.5px] bg-gray-800/40 mx-auto mt-6"></div>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link || "#"}
              className="
                group
                block 
                rounded-3xl 
                overflow-hidden 
                bg-white 
                shadow-sm 
                transition-all 
                duration-500 
                hover:shadow-md"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    w-full 
                    h-56 sm:h-64 md:h-72 
                    object-cover 
                    transition-transform 
                    duration-700 
                    ease-out
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Text */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-light text-gray-900 tracking-wide">
                  {category.name}
                </h3>

                {category.productCount && (
                  <p className="mt-1 text-gray-500 text-sm">
                    {category.productCount} Products
                  </p>
                )}
              </div>

              {/* Minimal Hover Border */}
              <div className="
                absolute 
                inset-0 
                rounded-3xl 
                border 
                border-transparent 
                group-hover:border-gray-800/40 
                transition-all
              "></div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        {categories.length > 0 && (
          <div className="text-center mt-14">
            <Link
              to="/products"
              className="
                inline-block 
                bg-black 
                text-white 
                px-8 py-3 
                rounded-full 
                text-sm 
                tracking-wide 
                hover:bg-neutral-800 
                transition-all"
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
