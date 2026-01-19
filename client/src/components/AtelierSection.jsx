import React from "react";
import BRDESKTOP from "../assets/images/BRDESKTOP.webp";

const steps = [
  {
    title: "SELECT YOUR SILHOUETTE",
    text: "Begin with our signature designs, thoughtfully created for balance, comfort, and flow. Personalise details like necklines, sleeve styles, and lengths to suit your vision.",
  },
  {
    title: "SELECT YOUR FABRIC",
    text: "Choose from our ethically sourced pre-loved textiles or bring your own. We carefully evaluate drape, weight, and texture, and recommend the right linings and finishes.",
  },
  {
    title: "SHARE YOUR MEASUREMENTS",
    text: "Schedule a quick fitting or use our guided remote measurement process. We consider ease, posture, and movement not just measurements.",
  },
  {
    title: "CONFIRM WITH A TOKEN AMOUNT",
    text: "Secure your appointment with a small deposit that covers fabric sourcing and pattern preparation. This amount is adjusted in your final bill.",
  },
  {
    title: "PERSONAL CONSULTATION",
    text: "From swatches to fittings, every detail is shared and discussed with you. Clear communication ensures each decision feels informed and intentional.",
  },
  {
    title: "DELIVERY TIMELINE",
    text: "Each bespoke piece is made to order and delivered within 2–3 weeks, crafted with precision, patience, and care.",
  },
];

const AtelierSection = () => {
  return (
    <section className="w-full text-black font-[Manrope] bg-[#F8F6F3]">
      {/* HERO */}
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
  <img
    src={BRDESKTOP}
    alt="Atelier Hero"
    className="w-full h-full object-cover scale-[1.05]"
  />

  {/* soft vignette on entire image */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />

  {/* bottom-aligned text band */}
  <div className="absolute inset-x-0 bottom-0">
    <div className="max-w-5xl mx-auto px-6 py-8 md:py-10">
      <p className="text-[11px] md:text-xs tracking-[0.28em] text-white/75 uppercase">
        Bright Rose Atelier
      </p>
      <h1 className="mt-2 text-white text-3xl md:text-5xl font-semibold tracking-[0.18em]">
        Atelier Experience
      </h1>
      <p className="mt-3 bg-gray-50 px-2 rounded-xl text-xs md:text-base text-white/85 max-w-xl leading-relaxed">
        A considered, step–by–step journey from first sketch to finished heirloom.
      </p>
    </div>
  </div>
</div>


      {/* CONTENT WRAP */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Intro label */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="text-xs tracking-[0.28em] text-gray-500 mb-2 uppercase">
              THE BESPOKE PROCESS
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-[#2b211c]">
              Six considered steps to your bespoke piece
            </h2>
          </div>
          <p className="text-sm md:text-[15px] text-gray-700 max-w-md">
            Every stage is designed to feel calm, intentional, and collaborative
            — with room for your story in every stitch.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative">
          {/* central line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l border-[#e1d6c9]" />

          <div className="space-y-10 md:space-y-12">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-stretch"
                >
                  {/* left column */}
                  <div
                    className={`md:w-1/2 ${
                      isLeft ? "md:pr-10" : "md:pl-10 md:order-2"
                    }`}
                  >
                    <div
                      className={`
                        bg-white/80 backdrop-blur-sm border border-[#ece2d6] 
                        rounded-2xl px-6 py-6 md:px-7 md:py-7
                        shadow-[0_18px_45px_rgba(0,0,0,0.05)]
                      `}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full border border-[#c9a58a] flex items-center justify-center text-[11px] tracking-[0.18em] text-[#7d5b45] uppercase bg-[#f7efe6]">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <h3 className="text-[13px] md:text-[14px] font-semibold tracking-[0.22em] text-[#3b2a22] uppercase">
                          {s.title}
                        </h3>
                      </div>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-gray-700">
                        {s.text}
                      </p>
                    </div>
                  </div>

                  {/* marker column */}
                  <div className="hidden md:flex md:w-0 md:flex-col md:items-center md:justify-start">
                    <div className="relative h-full flex flex-col items-center">
                      {/* circle */}
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#c9a58a] bg-[#f8f1e7] shadow-[0_0_0_4px_rgba(201,165,138,0.15)]" />
                    </div>
                  </div>

                  {/* spacer column to keep layout balanced */}
                  <div
                    className={`hidden md:block md:w-1/2 ${
                      isLeft ? "md:pl-10" : "md:pr-10 md:order-1"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[#e4d7c9] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center gap-4">
          <p className="text-xs tracking-[0.28em] text-gray-500 uppercase">
            READY WHEN YOU ARE
          </p>
          <a
            href="https://wa.me/919910929099?text=Hi%20I%20want%20to%20create%20a%20custom%20dress%20with%20Bright%20Rose"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-black text-white px-10 py-3 rounded-full text-sm md:text-[15px] font-medium tracking-[0.18em] uppercase hover:bg-gray-900 transition"
          >
            Begin Your Bespoke Journey
          </a>
        </div>
      </div>
    </section>
  );
};

export default AtelierSection;
