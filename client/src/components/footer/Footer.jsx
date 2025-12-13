import React, { useState } from "react";
import { Facebook, Instagram, ChevronDown } from "lucide-react";

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:text-left text-center">
      {/* Desktop Title */}
      <h3 className="hidden sm:block text-lg font-light tracking-wide text-neutral-700 mb-4">
        {title}
      </h3>

      {/* Mobile accordion */}
      <button
        className="sm:hidden w-full flex justify-between items-center py-3 border-b border-neutral-200"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-light text-neutral-700">{title}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Content */}
      <div
        className={`sm:block transition-all ${
          open ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0 sm:opacity-100 sm:max-h-none overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 pt-6 pb-6">

      {/* ============================
          TOP LARGE GRID SECTION
      ============================= */}
      <div className="max-w-[1500px] mx-auto px-5 lg:px-20 
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">

        {/* INFORMATION */}
        <FooterSection title="Information">
          <ul className="space-y-2 text-neutral-700 text-sm">
            <li><a href="/ourheritage" className="hover:underline">About Us</a></li>
            <li><a href="/products" className="hover:underline">Shop</a></li>
            <li><a href="/weavecollection" className="hover:underline">Weave</a></li>
            <li><a href="/contact" className="hover:underline">Support</a></li>
          </ul>
        </FooterSection>

        {/* SERVICE */}
        <FooterSection title="Service">
          <ul className="space-y-2 text-neutral-700 text-sm">
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/customer-service" className="hover:underline">Customer Service</a></li>
            <li><a href="/exchange-return" className="hover:underline">Exchange & Return</a></li>
          </ul>
        </FooterSection>

        {/* FOLLOW US */}
        <FooterSection title="Follow Us">
          <div className="flex items-center sm:justify-start justify-center gap-6 mt-2">
            <a href="https://www.facebook.com/share/16JsCKdwXn/" className="text-neutral-700 mt-4 hover:text-black transition">
              <Facebook size={22} />
            </a>
            <a href="https://www.instagram.com/brightrose_india/" className="text-neutral-700 mt-4 hover:text-black transition">
              <Instagram size={22} />
            </a>
          </div>
        </FooterSection>

        {/* PAYMENTS */}
        <FooterSection title="We Accept">
          <div className="flex items-center sm:justify-start justify-center gap-6 mb-5 mt-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
            <img src="/src/assets/images/razorpay-icon.svg" className="h-6 w-auto" />
          </div>
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Bright Rose. All rights reserved.
          </p>
        </FooterSection>

      </div>

      {/* ============================
          BOTTOM GLOBAL LINKS
      ============================= */}
      <div className="max-w-[1500px] mx-auto mt-16 border-t border-neutral-200 pt-6 px-5 lg:px-20">

        <div className="flex flex-wrap justify-center gap-6 text-neutral-700 text-sm mb-8">
          {/* <a className="hover:underline">Tiktok</a> */}
          <a className="hover:underline">Instagram</a>
          <a className="hover:underline">Facebook</a>
          {/* <a className="hover:underline">Pinterest</a> */}
          {/* <a className="hover:underline">Snapchat</a> */}
          {/* <a className="hover:underline">LinkedIn</a> */}
          {/* <a className="hover:underline">Podcasts</a> */}
        </div>

        {/* CENTER BRAND NAME */}
        <h1 className="text-center font-[PlayfairDisplay] text-xl tracking-widest text-neutral-900">
          BRIGHT ROSE
        </h1>

      </div>
    </footer>
  );
};

export default Footer;
