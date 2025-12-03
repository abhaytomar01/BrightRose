import React from "react";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-pureWhite text-neutralDark pt-10 pb-14 sm:pt-20 sm:pb-20 border-t border-neutral-200/60">

      <div className="max-w-[1700px] mx-auto px-5 sm:px-10 lg:px-20 
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-14">

        {/* INFORMATION */}
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium tracking-wide text-neutralDark/70 mb-3 sm:mb-4">
            INFORMATION
          </h3>

          <ul className="space-y-2">
            <li><a href="/ourheritage" className="luxury-link">About us</a></li>
            <li><a href="/products" className="luxury-link">Shop</a></li>
            <li><a href="/weavecollection" className="luxury-link">Weave</a></li>
            <li><a href="/contact" className="luxury-link">Support</a></li>
          </ul>
        </div>

        {/* SERVICE */}
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium tracking-wide text-neutralDark/70 mb-3 sm:mb-4">
            SERVICE
          </h3>

          <ul className="space-y-2">
            <li><a href="/terms" className="luxury-link">Terms & Conditions</a></li>
            <li><a href="/privacy" className="luxury-link">Privacy Policy</a></li>
            <li><a href="/customer-service" className="luxury-link">Customer Service</a></li>
            <li><a href="/exchange-return" className="luxury-link">Exchange & Return</a></li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium tracking-wide text-neutralDark/70 mb-3 sm:mb-4">
            FOLLOW US
          </h3>

          <div className="flex items-center justify-center sm:justify-start gap-6">
            <a
              href="https://www.facebook.com/share/16JsCKdwXn/"
              className="luxury-icon"
            >
              <Facebook size={22} className="sm:w-6 sm:h-6" />
            </a>

            <a
              href="https://www.instagram.com/brightrose_india/"
              className="luxury-icon"
            >
              <Instagram size={22} className="sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        {/* PAYMENT + COPYRIGHT */}
        <div className="text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-medium tracking-wide text-neutralDark/70 mb-3 sm:mb-4">
            WE ACCEPT
          </h3>

          <div className="flex items-center justify-center sm:justify-start gap-6 mb-5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-5 sm:h-7" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5 sm:h-7" />
            <img src="/src/assets/images/razorpay-icon.svg" className="h-5 sm:h-7 w-auto" />
          </div>

          <p className="text-xs sm:text-sm text-neutralDark/60 tracking-wide leading-relaxed">
            © {new Date().getFullYear()} Bright Rose. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom subtle divider + very small copyright */}
      <div className="mt-6 sm:mt-10 border-t border-neutral-200/70 pt-4">
        <p className="text-center text-[10px] sm:text-xs text-neutralDark/50 tracking-wide">
          Crafted with elegance — Bright Rose India
        </p>
      </div>

      {/* Custom CSS */}
      <style>{`
        .luxury-link {
          font-size: 13px;
          color: rgba(30, 30, 30, 0.8);
          transition: all 0.3s ease;
        }
        .luxury-link:hover {
          color: #000;
        }

        .luxury-icon {
          color: #c5a16e; /* gold shade */
          transition: all 0.3s ease;
        }
        .luxury-icon:hover {
          color: #111;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
