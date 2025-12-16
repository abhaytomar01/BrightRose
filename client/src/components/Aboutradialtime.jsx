import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIMELINE = [
  {
    title: "The Beginning",
    text: "It began with a deep admiration for craft — not just how clothing looks, but how it is made. Growing up surrounded by stories of Indian textiles, handwork, and detail, we learned that fashion is memory stitched into fabric. Every silhouette carries a feeling, every thread carries intention. Before trends, before timelines — there was only passion. A desire to create something timeless, honest, and deeply personal.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "The Evolution",
    text: "As the vision grew, so did our responsibility. We chose to slow down in a fast world — valuing precision over production, quality over quantity. Our designs evolved into a balance of modern expression and traditional techniques. Each piece became a dialogue between heritage and contemporary living.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "The Brand Today",
    text: "Today, we stand as a brand that celebrates quiet luxury and powerful individuality. Every creation is thoughtfully designed, ethically crafted, and consciously delivered. We don’t chase moments — we create pieces that stay relevant beyond seasons.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80",
  },
];


export default function AboutRadialTimeline() {
  const [active, setActive] = useState(1);

  const next = () => setActive((p) => (p + 1) % TIMELINE.length);
  const prev = () =>
    setActive((p) => (p - 1 + TIMELINE.length) % TIMELINE.length);

  const item = TIMELINE[active];

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto relative rounded-[48px] border border-neutral-300/60 px-10 py-6 sm:p-16 overflow-hidden">

        {/* TOP LABEL */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase text-neutral-500">
          Timeline
        </div>

        {/* SVG ARC */}
        <div className="relative h-[360px] sm:h-[420px] flex items-center justify-center">
          <svg
            viewBox="0 0 800 400"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <path
              d="M100 400 A300 300 0 0 1 700 400"
              stroke="#D4D4D4"
              strokeWidth="1"
            />
            <path
              d="M140 400 A260 260 0 0 1 660 400"
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          </svg>

          {/* YEAR */}
          <div className="text-center z-10">
            <AnimatePresence mode="wait">
              <motion.h2
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight"
              >
                {item.year}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

        {/* CONTENT */}
        <div className="text-center max-w-xl mx-auto mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg sm:text-xl font-light mb-4">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-center gap-10 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            ←
          </button>

          <div className="text-neutral-400 tracking-widest text-sm">
            › › ›
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-neutral-400 flex items-center justify-center hover:bg-black hover:text-white transition"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
