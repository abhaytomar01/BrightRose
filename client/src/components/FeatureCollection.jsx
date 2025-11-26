import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import fallback from "../assets/images/fallback.jpg";

const FeaturedCollections = ({
  title = "Featured Collections",
  subtitle = "Shop our finest handcrafted creations",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // Fetch Products
  // ---------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products`
        );

        if (res.data?.success) {
          setProducts(res.data.products || []);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------------------------------------
  // Loading Skeleton (Neutral, Muted Tones)
  // ---------------------------------------
  if (loading) {
    return (
      <section className="w-full py-20 bg-neutralLight animate-pulse">
        <div className="max-w-[1500px] mx-auto px-4 lg:px-12">
          <h2 className="text-3xl font-light text-center text-neutral-300 mb-10">
            Loading...
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-mutedGray rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  const featured = products.slice(0, 8);

  return (
    <section className="w-full py-20 bg-pureWhite">
      <div className="max-w-[1500px] mx-auto px-4 lg:px-12">

        {/* -------------------------------- */}
        {/* Title Section */}
        {/* -------------------------------- */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-neutralDark/80 tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-neutralDark mt-3 text-base md:text-lg font-light">
              {subtitle}
            </p>
          )}

          {/* Gold underline */}
          <div className="w-20 h-[2px] bg-accentGold mx-auto mt-6"></div>
        </div>

        {/* -------------------------------- */}
        {/* Product Grid */}
        {/* -------------------------------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
          {featured.map((item, index) => (
            <Link
              key={index}
              to={`/product/${item._id}`}
              className="
                group
                block 
                rounded-3xl 
                overflow-hidden 
                bg-white 
                shadow-sm 
                transition-all 
                duration-500
                hover:shadow-lg
                border border-transparent
                hover:border-accentGold/60
                aspect-[3/4]
              "
            >
              {/* Image */}
              <div className="w-full h-full overflow-hidden">
                <img
                  src={item.images?.[0]?.url || fallback}
                  alt={item.name}
                  loading="lazy"
                  className="
                    w-full 
                    h-full 
                    object-cover 
                    object-top
                    transition-transform 
                    duration-700 
                    ease-out
                    group-hover:scale-105
                  "
                  onError={(e) => (e.target.src = fallback)}
                />
              </div>

              {/* Text Block */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-light text-neutralDark tracking-wide line-clamp-1">
                  {item.name}
                </h3>

                <p className="mt-1 text-neutralDark/80 text-sm font-medium">
                  ₹{item.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* -------------------------------- */}
        {/* CTA Button */}
        {/* -------------------------------- */}
        <div className="text-center mt-14">
          <Link
            to="/products"
            className="
              inline-block 
              bg-neutralDark/80 
              text-white 
              px-8 
              py-3 
              rounded-full 
              text-sm 
              tracking-wide 
              transition-all 
              border border-accentGold
              hover:bg-neutralDark/90
            "
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
