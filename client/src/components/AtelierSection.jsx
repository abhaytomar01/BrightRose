import React from "react";
import atelierhero from "../assets/images/banners/atelierhero.jpg";


const steps = [
  {
   
    title: "CHOOSE YOUR SILHOUETTE",
    text: "Choose from our original designs crafted for proportion and movement, with options to refine necklines, lengths, and sleeves.",
  },
  {
 
    title: "CHOOSE YOUR FABRIC",
    text: "Pick from ethically sourced pre loved textiles or bring your own; we’ll assess drape, weight, and propose linings and trims.",
  },
  {

    title: "SHARE MEASUREMENTS",
    text: "Book a quick fit or use our remote measuring guide; we account for ease and posture, not just numbers.",
  },
  {

    title: "PAY A TOKEN FEE",
    text: "Reserve your slot with a small deposit that covers sourcing and pattern prep, credited to your final invoice.",
  },
  {

    title: "CONSULTATION",
    text: "Stay in touch through clear notes, swatches, and fit feedback so every decision is documented and personal.",
  },
  {

    title: "TIMELINE",
    text: "Bespoke garments are crafted to order and delivered in 2 to 3 weeks with utmost detail and care.",
  },
];

const AtelierSection = () => {
  return (
    <section className="w-full text-black font-[Manrope]">

      {/* HERO */}
      <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
        <img
          src={atelierhero}
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
    Start Your Custom Order
  </a>
</div>

    </section>
  );
};

export default AtelierSection;
