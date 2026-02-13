// src/components/LuxurySeasonalShowcase.jsx

import React from "react";

import silkpocketdress from "../assets/images/silkpocketdress.webp";
import ikkatcollection from "../assets/images/ikkatsilkcorset.webp";
import trenchcoat from "../assets/images/silktrenchcoat.webp";
import blazertrouser from "../assets/images/blazertrouser.webp";

const collections = [
  {
    name: "Silk Blazer & Trouser",
    slug: "https://www.thebrightrose.com/product/692d33e2c95fc6c18d3609b7",
    image: blazertrouser,
  },
  {
    name: "Silk Pocket Dress",
    slug: "https://www.thebrightrose.com/product/693ab8517c485b6dbb85687b",
    image: silkpocketdress,
  },
  {
    name: "Silk Trench Coat",
    slug: "https://www.thebrightrose.com/product/692d334fc95fc6c18d3609ad",
    image: trenchcoat,
  },
  {
    name: "Banarasi Silk Corset",
    slug: "https://www.thebrightrose.com/product/693abb3a7c485b6dbb8569b5",
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
            FEATURED COLLECTIONS
          </h2>
          <p className="mt-4 text-neutral-500 text-sm md:text-base tracking-wide font-light">
            A selection of the finest handcrafted luxury pieces, personally curated for you.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {collections.map((item, index) => (
            <a
              key={index}
              href={item.slug}
              target="_self"   // use "_blank" if you want new tab
              className="group relative block overflow-hidden cursor-pointer"
            >
              <div className="relative h-[280px] sm:h-[380px] md:h-[480px]">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-white text-xs md:text-sm tracking-[0.25em] uppercase font-light">
                    {item.name}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
