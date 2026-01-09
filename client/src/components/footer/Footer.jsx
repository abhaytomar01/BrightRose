import React, { useState } from "react";
import { Facebook, Instagram, ChevronDown } from "lucide-react";

const FooterSection = ({ title, children }) => {
  return (
    <div className="text-center sm:text-left">
      {/* Title (same on mobile & desktop) */}
      <h3 className="text-[12px] uppercase tracking-[0.3em] text-neutral-300 mb-4 sm:mb-6 font-light">
        {title}
      </h3>

      {/* Content always visible, just spaced differently on mobile */}
      <div className="sm:block space-y-3">
        {children}
      </div>
    </div>
    
  );
};


const Footer = () => {
  return (
    <footer className="w-full bg-[#060607] pt-12 pb-10 text-neutral-200">
      {/* Glow top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40" />

      {/* MAIN FOOTER GRID */}
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-6 lg:px-20
          pt-10
          grid grid-cols-1
          sm:grid-cols-2
          md:grid-cols-4
          gap-10
        "
      >
        {/* INFORMATION */}
        <FooterSection title="Information">
          <ul className="space-y-3 text-[13px] font-light">
            <li>
              <a
                href="/ourheritage"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/weavecollection"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Weave
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Support
              </a>
            </li>
          </ul>
        </FooterSection>

        {/* SERVICE */}
        <FooterSection title="Service">
          <ul className="space-y-3 text-[13px] font-light">
            <li>
              <a
                href="/terms"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/customer-service"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Customer Service
              </a>
            </li>
            <li>
              <a
                href="/exchange-return"
                className="text-neutral-300 hover:text-white transition-colors duration-200"
              >
                Exchange &amp; Return
              </a>
            </li>
          </ul>
        </FooterSection>

        {/* FOLLOW US */}
        <FooterSection title="Follow Us">
          <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
            <a
              href="https://www.facebook.com/share/16JsCKdwXn/"
              className="text-neutral-300 hover:text-white transition-colors duration-200"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/brightrose_india/"
              className="text-neutral-300 hover:text-white transition-colors duration-200"
            >
              <Instagram size={20} />
            </a>
          </div>
        </FooterSection>

        {/* PAYMENTS */}
        <FooterSection title="We Accept">
          <div className="flex items-center justify-center sm:justify-start gap-5 mt-6 mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              className="h-6 opacity-80 invert"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              className="h-6 opacity-80 invert"
            />
            <img
              src="/src/assets/images/razorpay-icon.svg"
              className="h-6 opacity-80 invert"
            />
          </div>

          <p className="text-[11px] text-neutral-400 tracking-[0.18em] uppercase">
            © {new Date().getFullYear()} Bright Rose. All rights reserved.
          </p>
        </FooterSection>
      </div>

      {/* BRAND SIGNATURE */}
      <div className="max-w-[1500px] mx-auto mt-12 px-6 lg:px-20">
        <div className="border-t border-white/10 pt-6">
          <h1 className="text-center font-[PlayfairDisplay] text-[16px] md:text-[18px] tracking-[0.4em] text-neutral-100">
            BRIGHT ROSE
          </h1>
          <p className="mt-3 text-center text-[11px] text-neutral-400 tracking-[0.22em] uppercase">
            Crafted with intention in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
