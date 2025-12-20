import React, { useState } from "react";
import { Facebook, Instagram, ChevronDown } from "lucide-react";

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center sm:text-left">
      {/* Desktop Title */}
      <h3 className="hidden sm:block text-[13px] uppercase tracking-[0.25em] text-neutral-600 mb-6 font-light">
        {title}
      </h3>

      {/* Mobile Accordion */}
      <button
        className="sm:hidden w-full flex justify-between items-center py-4 border-b border-neutral-200/60"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm tracking-wide text-neutral-700 font-light">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`sm:block transition-all duration-300 ${
          open
            ? "max-h-[500px] opacity-100 mt-4"
            : "max-h-0 opacity-0 sm:opacity-100 sm:max-h-none overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#fff] pt-8 pb-8">

      {/* =========================
          MAIN FOOTER GRID
      ========================== */}
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-6 lg:px-20
          grid grid-cols-1
          sm:grid-cols-2
          md:grid-cols-4
          gap-10
        "
      >

        {/* INFORMATION */}
        <FooterSection title="Information">
          <ul className="space-y-3 text-neutral-700 text-[14px] font-light">
            <li><a href="/ourheritage" className="hover:text-neutral-900 transition">About Us</a></li>
            <li><a href="/products" className="hover:text-neutral-900 transition">Shop</a></li>
            <li><a href="/weavecollection" className="hover:text-neutral-900 transition">Weave</a></li>
            <li><a href="/contact" className="hover:text-neutral-900 transition">Support</a></li>
          </ul>
        </FooterSection>

        {/* SERVICE */}
        <FooterSection title="Service">
          <ul className="space-y-3 text-neutral-700 text-[14px] font-light">
            <li><a href="/terms" className="hover:text-neutral-900 transition">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-neutral-900 transition">Privacy Policy</a></li>
            <li><a href="/customer-service" className="hover:text-neutral-900 transition">Customer Service</a></li>
            <li><a href="/exchange-return" className="hover:text-neutral-900 transition">Exchange & Return</a></li>
          </ul>
        </FooterSection>

        {/* FOLLOW US */}
        <FooterSection title="Follow Us">
          <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
            <a
              href="https://www.facebook.com/share/16JsCKdwXn/"
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/brightrose_india/"
              className="text-neutral-600 hover:text-neutral-900 transition"
            >
              <Instagram size={20} />
            </a>
          </div>
        </FooterSection>

        {/* PAYMENTS */}
        <FooterSection title="We Accept">
          <div className="flex items-center justify-center sm:justify-start gap-5 mt-6 mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6 opacity-80" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 opacity-80" />
            <img src="/src/assets/images/razorpay-icon.svg" className="h-6 opacity-80" />
          </div>

          <p className="text-[11px] text-neutral-500 tracking-wide">
            © {new Date().getFullYear()} Bright Rose. All rights reserved.
          </p>
        </FooterSection>

      </div>

      {/* =========================
          BRAND SIGNATURE
      ========================== */}
      <div className="max-w-[1500px] mx-auto mt-16 px-6 lg:px-20">
        <div className="border-t border-neutral-300/40 pt-8">
          <h1 className="text-center font-[PlayfairDisplay] text-[18px] tracking-[0.35em] text-neutral-800">
            BRIGHT ROSE
          </h1>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
