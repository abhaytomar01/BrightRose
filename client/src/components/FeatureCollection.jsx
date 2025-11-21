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
  // Fetch Products from Backend
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
  // Loading Skeleton
  // ---------------------------------------
  if (loading) {
    return (
      <section className="w-full py-20 bg-[#FAF7F3] animate-pulse">
        <div className="max-w-[1500px] mx-auto px-4 lg:px-12">
          <h2 className="text-3xl font-light text-center text-gray-300 mb-10">
            Loading...
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

  // If no products found
  if (!products.length) return null;

  // ---------------------------------------
  // Select First 4–8 Products as Featured
  // ---------------------------------------
  const featured = products.slice(0, 8);

  return (
    <section className="w-full py-20 bg-[#FAF7F3]">
      <div className="max-w-[1500px] mx-auto px-4 lg:px-12">

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-gray-600 mt-3 text-base md:text-lg font-light">
              {subtitle}
            </p>
          )}

          <div className="w-16 h-[1.5px] bg-gray-800/40 mx-auto mt-6"></div>
        </div>

        {/* Product Grid */}
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
    hover:shadow-md
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

  {/* Text */}
  <div className="p-5 text-center">
    <h3 className="text-lg font-light text-gray-900 tracking-wide line-clamp-1">
      {item.name}
    </h3>

    <p className="mt-1 text-gray-700 text-sm font-medium">
      ₹{item.price?.toLocaleString()}
    </p>
  </div>

  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-gray-800/40 transition-all"></div>
</Link>

          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm tracking-wide hover:bg-neutral-800 transition-all"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
