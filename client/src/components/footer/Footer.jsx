import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#FCF7F1] text-gray-800 py-16">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#AD000F] mb-4">INFORMATION</h3>
          <ul className="space-y-2">
            <li>
              <a href="/ourheritage" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">About us</a>
            </li>
            <li>
              <a href="/products" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Shop</a>
            </li>
            <li>
              <a href="/weavecollection" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Weave</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Contact</a>
            </li>
          </ul>
        </div>
         {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#AD000F] mb-4">SERVICE</h3>
          <ul className="space-y-2">
            <li>
              <a href="/terms" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Terms & Conditions</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Privacy Policy</a>
            </li>
            <li>
              <a href="/customer-service" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Customer Service</a>
            </li>
            <li>
              <a href="/exchange-return" className="hover:text-[#AD000F] transition-colors duration-300 text-sm">Exchange & Return</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div>
          <h3 className="text-lg font-semibold text-[#AD000F] mb-4">Join Our Circle</h3>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-full border-2 border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 text-gray-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#AD000F] text-white rounded-full hover:bg-[#8c000c] transition-all duration-300 border border-[#D4AF37]"
            >
              Subscribe
            </button>
          </form>
        </div> */}

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-[#AD000F] mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/share/16JsCKdwXn/" className="text-[#D4AF37] hover:text-[#AD000F] transition-colors duration-300 text-sm"><Facebook size={24} /></a>
            <a href="https://www.instagram.com/brightrose_india/" className=" text-sm text-[#D4AF37] hover:text-[#AD000F] transition-colors duration-300"><Instagram size={24} /></a>
            {/* <a href="#" className="text-[#D4AF37] hover:text-[#AD000F] transition-colors duration-300"><Twitter size={24} /></a> */}
            {/* <a href="#" className="text-[#D4AF37] hover:text-[#AD000F] transition-colors duration-300"><Youtube size={24} /></a> */}
          </div>
        </div>

        {/* Payment & Info */}
        <div>
          <h3 className="text-lg font-semibold text-[#AD000F] mb-4">We Accept</h3>
          <div className="flex gap-4 mb-6">
            {/* Replace with payment icons or images */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8"/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8"/>
            <img src="/src/assets/images/razorpay-icon.svg" alt="Razorpay" className="h-8 w-auto"/>
          </div>
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Bright Rose. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
