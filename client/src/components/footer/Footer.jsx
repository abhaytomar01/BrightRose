import React from "react";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-pureWhite text-neutralDark pt-20 pb-16 border-t border-neutral-200/60">
      <div className="max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* INFORMATION */}
        <div>
          <h3 className="text-lg font-medium tracking-wide text-primaryRed mb-4">
            INFORMATION
          </h3>

          <ul className="space-y-2">
            <li>
              <a
                href="/ourheritage"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                About us
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/weavecollection"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Weave
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SERVICE */}
        <div>
          <h3 className="text-lg font-medium tracking-wide text-primaryRed mb-4">
            SERVICE
          </h3>

          <ul className="space-y-2">
            <li>
              <a
                href="/terms"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/customer-service"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Customer Service
              </a>
            </li>
            <li>
              <a
                href="/exchange-return"
                className="text-sm text-neutralDark/80 hover:text-primaryRed transition"
              >
                Exchange & Return
              </a>
            </li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h3 className="text-lg font-medium tracking-wide text-primaryRed mb-4">
            FOLLOW US
          </h3>

          <div className="flex items-center gap-5">
            <a
              href="https://www.facebook.com/share/16JsCKdwXn/"
              className="text-accentGold hover:text-primaryRed transition"
            >
              <Facebook size={24} />
            </a>

            <a
              href="https://www.instagram.com/brightrose_india/"
              className="text-accentGold hover:text-primaryRed transition"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>

        {/* PAYMENTS / COPYRIGHT */}
        <div>
          <h3 className="text-lg font-medium tracking-wide text-primaryRed mb-4">
            WE ACCEPT
          </h3>

          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              className="h-7"
            />

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="h-7"
            />

            <img
              src="/src/assets/images/razorpay-icon.svg"
              alt="Razorpay"
              className="h-7 w-auto"
            />
          </div>

          <p className="text-sm text-neutralDark/70 tracking-wide">
            © {new Date().getFullYear()} Bright Rose. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
