// src/components/LifestyleBanner.jsx
import { useEffect, useState } from "react";
import slide1 from "../assets/images/slider1.webp";
import slide2 from "../assets/images/creative1.webp";
import slide3 from "../assets/images/slider3.webp";
import slide4 from "../assets/images/slider4.webp";
import slide5 from "../assets/images/about2.jpg";

const slides = [
  {
    id: 1,
    title: "ITS INHERENTLY CIRCULAR",
    subtitle: "Indian craftsmanship has been practicing zero-waste design long before it had a name. We repurposed fabric, dyed naturally, and created heirlooms, not mass produce landfill.",
    imageUrl: slide2,
  },
  {
    id: 2,
    title: "ITS HONOURS TIME, NOT SPEED",
    subtitle: "A single garment can take weeks or months to make. A weave can take years to perfect. This is slow fashion. A lived reality, not a marketing label.",
    imageUrl: slide1, 
  },
  {
    id: 3,
    title: "ITS ROOTED IN LOCAL ECOSYSTEMS",
    subtitle: "From Kutch to Varanasi, Kashmir to Tamil Nadu, craft traditions are shaped by climate, soil, and community. We don't just make garments. We weave history.",
    imageUrl: slide3,
  },
  {
    id: 4,
    title: "ITS EMPOWERS AT GRASSROOT",
    subtitle: "When you support Indian craft, you support rural economies, women-led artisan collectives, and intergenerational skill. Not corporations or exploitation.",
    imageUrl: slide4, 
  },
  {
    id: 5,
    title: "ITS RESISTS SAMENESS",
    subtitle: "No two weaves are identical. Craft preserves individuality which is the very soul of sustainable style. Craft preserves individuality which is the very soul of sustainable style.",
    imageUrl: slide1,
  },
  {
    id: 6,
    title: "ITS PREDATES AND OUTLIVES TRENDS",
    subtitle: "Fast fashion fades. Karegari survives. Indian craftsmanship is not old, it's timeless. It doesn't follow, it outlasts.",
    imageUrl: slide5,
  },
];  

const AUTOPLAY_DELAY = 6000;

export default function LifestyleBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % slides.length),
      AUTOPLAY_DELAY
    );
    return () => clearInterval(id);
  }, []);

  const next = () => setActive((p) => (p + 1) % slides.length);
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full bg-black text-white overflow-hidden">
      <div className="relative min-h-screen w-full flex items-center">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === active
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background */}
            <div className="w-full h-full relative">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />

              {/* Text content */}
              <div className="absolute inset-0 flex items-end md:items-center">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-14 md:pb-0">
                  <div className="max-w-xl md:max-w-2xl">
                    <p className="uppercase tracking-[0.25em] text-[11px] md:text-xs text-neutral-300 mb-4">
                      Bright Rose 
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light leading-tight md:leading-[1.1] text-neutral-200">
                      {slide.title}
                    </h2>
                    <p className="mt-4 md:mt-6 text-sm md:text-base text-neutral-200 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 backdrop-blur hover:bg-black/60 transition"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 backdrop-blur hover:bg-black/60 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActive(index)}
            className="group flex items-center gap-2"
          >
            <span
              className={`h-[3px] md:h-[4px] rounded-full transition-all duration-300 ${
                index === active
                  ? "w-10 md:w-14 bg-white"
                  : "w-4 md:w-6 bg-white/40 group-hover:bg-white/70"
              }`}
            />
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-white/60">
              {`0${index + 1}`}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
