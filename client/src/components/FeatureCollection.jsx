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
        console.log(error);
      }
    };
    loadProducts();
  }, []);

  if (!products.length) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light tracking-widest text-neutral-900 uppercase">
            Featured Collections
          </h2>

          <p className="text-neutral-600 mt-3 text-base md:text-lg font-light tracking-wide">
            Handcrafted luxury pieces curated for you
          </p>
        </div>

        {/* GRID - LUXURY LOOK */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-6
        ">
          {products.slice(0, 4).map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group relative block overflow-hidden rounded-none"
            >
              {/* IMAGE */}
              <div className="relative w-full h-[420px] md:h-[520px] bg-neutral-100 overflow-hidden">
                <img
                  src={item.images?.[0]?.url || fallback}
                  alt={item.name}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-[1200ms]
                    group-hover:scale-105
                  "
                />
              </div>

              {/* TEXT OVERLAY */}
              <div className="
                absolute bottom-4 left-1/2 -translate-x-1/2 
                text-white text-lg md:text-xl font-light tracking-wide
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]
                text-center 
                w-full
              ">
                {item.name.toUpperCase()}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA BUTTON */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="
              inline-block bg-neutral-900 text-white 
              px-10 py-3 rounded-full 
              text-sm tracking-wide border border-[#c7a97d]
              hover:bg-black transition-all
            "
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
