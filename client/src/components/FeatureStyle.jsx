// src/components/LuxurySeasonalShowcase.jsx

import React from "react";
import { Link } from "react-router-dom";

import silkpocketdress from "../assets/images/silkpocketdress.jpg";
import ikkatcollection from "../assets/images/ikkatsilkcorset.jpg";
import trenchcoat from "../assets/images/silktrenchcoat.jpg";
import blazertrouser from "../assets/images/blazertrouser.jpg";

const collections = [
  {
    name: "Silk Blazer & Trouser",
    slug: "plain-weave",
    image: blazertrouser,
  },
  {
    name: "Silk Pocket Dress",
    slug: "ikkat-silk-set",
    image: silkpocketdress,
  },
  {
    name: "Silk Trench Coat",
    slug: "pashmina-saree",
    image: trenchcoat,
  },
  {
    name: "Banarasi Silk Corset",
    slug: "silk-corset",
    image: ikkatcollection,
  },
];

export default function LuxurySeasonalShowcase() {
  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-xl md:text-3xl tracking-[0.2em] font-light uppercase text-neutral-900">
            SHOP BY STYLE
          </h2>
          <p className="mt-4 text-neutral-500 text-sm md:text-base tracking-wide font-light">
            A selection of the finest handcrafted luxury pieces, personally curated for you.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {collections.map((item, index) => (
            <Link
              key={index}
              to={`/products?category=${item.slug}`}
              className="group relative block overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-[280px] sm:h-[380px] md:h-[480px]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="
                    w-full h-full object-cover
                    transition-transform duration-[1200ms]
                    group-hover:scale-105
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0 
                    bg-gradient-to-t 
                    from-black/60 via-black/10 to-transparent
                  "
                />

                {/* TEXT INSIDE IMAGE */}
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p
                    className="
                      text-white 
                      text-xs md:text-sm 
                      tracking-[0.25em] 
                      uppercase 
                      font-light
                    "
                  >
                    {item.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
