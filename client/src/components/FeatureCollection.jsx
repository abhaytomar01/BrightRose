import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import fallback from "../assets/images/fallback.jpg";

export default function LuxuryShowcasePremium() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/products`
        );

        if (res.data?.success) setProducts(res.data.products);
      } catch (error) {
        console.log("PRODUCT LOAD ERROR:", error);
      }
    };

    loadProducts();
  }, []);

  if (!products.length) return null;

  // Function to generate correct image path
  const getImageUrl = (img) => {
    if (!img) return fallback;

    // if image already full URL
    if (img.url?.startsWith("http")) return img.url;

    // else prefix server URL
    return `${import.meta.env.VITE_SERVER_URL}${
      img.url?.startsWith("/") ? img.url : "/" + img.url
    }`;
  };

  return (
    <section className="w-full py-8 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-lg md:text-3xl font-light tracking-widest text-neutral-900 uppercase">
            Featured Collections
          </h2>

          <p className="text-neutral-600 mt-3 text-base md:text-lg font-light tracking-wide">
            Handcrafted luxury pieces curated for you
          </p>
        </div>

        {/* GRID */}
        <div
          className="
            grid 
            grid-cols-2
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            md:gap-8
          "
        >
          {products.slice(0, 4).map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group block"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[240px] sm:h-[280px] md:h-[450px] bg-neutral-100 overflow-hidden rounded-md">
                <img
                  src={getImageUrl(item.images?.[0])}
                  alt={item.name}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-[1200ms]
                    group-hover:scale-105
                  "
                />
              </div>

              {/* TITLE */}
              <p
                className="
                  text-center mt-2 
                  text-xs md:text-base 
                  font-light tracking-wide text-neutral-900
                "
              >
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA BUTTON */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="
              inline-block bg-white text-neutralDark/80 
              px-10 py-3 
              text-sm tracking-wide border border-neutralDark/70
              hover:border-neutralDark/90 transition-all
            "
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
