import React from "react";
import BRDESKTOP from "../assets/images/BRDESKTOP.png";


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
    <section className="w-full text-black font-[Manrope]">

      {/* HERO */}
      <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
        <img
          src={BRDESKTOP}
          alt="Atelier Hero"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-semibold text-center px-4">
            Atelier Experience
          </h1>
        </div>
      </div>

      {/* STEPS GRID */}
      <div className="max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center px-10 md:px-10">
            
     
            {/* TITLE */}
            <h3 className="text-[15px] font-semibold tracking-wide uppercase mb-3">
              {s.title}
            </h3>

            {/* TEXT */}
            <p className="text-gray-700 leading-relaxed text-[15px] max-w-xs">
              {s.text}
            </p>
          </div>
        ))}
      </div>

     {/* CTA */}
<div className="text-center py-12 bg-gray-50">
  <a
    href="https://wa.me/919910929099?text=Hi%20I%20want%20to%20create%20a%20custom%20dress%20with%20Bright%20Rose"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-black text-white px-10 py-3 rounded-full text-lg font-medium hover:bg-gray-900 transition"
  >
    Begin Your Bespoke Journey
  </a>
</div>

    </section>
  );
};

export default AtelierSection;
