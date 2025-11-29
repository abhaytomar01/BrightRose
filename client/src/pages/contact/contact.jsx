import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    honey: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  /* RECAPTCHA */
  useEffect(() => {
    const checkRecaptcha = setInterval(() => {
      if (window.grecaptcha && window.RECAPTCHA_SITE_KEY) {
        window.grecaptcha.ready(() => {
          setRecaptchaReady(true);
          clearInterval(checkRecaptcha);
        });
      }
    }, 300);
    return () => clearInterval(checkRecaptcha);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.honey !== "") return;

    setLoading(true);

    try {
      const token = await window.grecaptcha.execute(window.RECAPTCHA_SITE_KEY, {
        action: "submit",
      });

      const res = await axios.post(
        "https://thebrightrose.com/api/v1/contact",
        { name: form.name, email: form.email, message: form.message, token },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "", honey: "" });
        setTimeout(() => setSent(false), 5000);
      } else {
        alert(res.data.message || "Failed to send your message.");
      }
    } catch (error) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white text-neutral-800 pt-0">

      {/* -------------------------------------------------------
          HERO — EDITORIAL PREMIUM
      -------------------------------------------------------- */}
      <div className="relative h-[50vh] sm:h-[65vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/10667753/pexels-photo-10667753.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 sm:px-6"
        >
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Contact Us
          </h1>
          <p className="text-white mt-3 sm:mt-5 text-xs sm:text-md md:text-lg font-light max-w-xl mx-auto leading-relaxed">
            We would love to hear from you — queries, orders, collaborations or appointments.
          </p>
        </motion.div>
      </div>

      {/* -------------------------------------------------------
          CONTACT INFO BAR — MOBILE OPTIMIZED
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto py-10 sm:py-14 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-semibold text-base sm:text-md mb-1 sm:mb-2">Customer Support</p>
          <p className="text-gray-600 text-sm sm:text-base">brightrose.india@gmail.com</p>
        </div>
        <div>
          <p className="font-semibold text-base sm:text-md mb-1 sm:mb-2">Call Us</p>
          <p className="text-gray-600 text-sm sm:text-base">+91 9910929099</p>
        </div>
        <div>
          <p className="font-semibold text-base sm:text-md mb-1 sm:mb-2">Business Hours</p>
          <p className="text-gray-600 text-sm sm:text-base">Mon–Sat: 10 AM – 7 PM</p>
        </div>
      </div>

      {/* -------------------------------------------------------
          FORM + DETAILS GRID — MOBILE REFINED
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">

        {/* FORM */}
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg sm:text-2xl font-light mb-6">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="honey" className="hidden" value={form.honey} onChange={handleChange} />

            <div>
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md 
                text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primaryRed/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md 
                text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primaryRed/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700">Message</label>
              <textarea
                name="message"
                rows="5"
                required
                value={form.message}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md 
                text-sm sm:text-base focus:ring-2 focus:ring-neutralDark/80"
              />
            </div>

            <button
              type="submit"
              disabled={!recaptchaReady || loading}
              className="w-full py-3 bg-neutralDark/80 text-white rounded-md text-sm sm:text-base tracking-wide
              hover:bg-neutralDark/90 transition-all"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {sent && <p className="text-green-600 text-center mt-3 text-sm">Your message has been sent ✔</p>}
          </form>
        </div>

        {/* INFO BLOCKS */}
        <div className="space-y-8 sm:space-y-10">
          <div>
            <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3">Visit Our Studio</h3>
            <p className="text-gray-700 text-sm sm:text-xs leading-relaxed">
              Bright Rose Studio<br />Gurugram, Haryana, India
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3">Collaborations & Media</h3>
            <p className="text-gray-700 text-xs sm:text-base">
              For influencers, stylists & magazines:<br />
              <span className="font-medium">brightrose.india@gmail.com</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-light mb-2 sm:mb-3">Bespoke Orders</h3>
            <p className="text-gray-700 text-xs sm:text-base">
              For couture & custom tailoring:<br />
              <span className="font-medium">brightrose.india@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------
          MAP SECTION — LUXURY CLEAN
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <h3 className="text-lg sm:text-xl font-light mb-4">Find us on the map</h3>

        <div className="rounded-xl overflow-hidden border border-neutral-300">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            className="w-full h-[280px] sm:h-[350px]"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      
      {/* -------------------------------------------------------
      FAQ — LUXURY ACCORDION
-------------------------------------------------------- */}
<div className="bg-neutral-50 py-14 sm:py-20 px-4 sm:px-6">
  <div className="max-w-4xl mx-auto">

    <h2 className="text-2xl sm:text-3xl font-light text-center mb-10 tracking-wide">
      Frequently Asked Questions
    </h2>

    <div className="divide-y divide-neutral-300/60 border-y border-neutral-300/60">

      {/* ITEM 1 */}
      <details className="group">
        <summary className="flex justify-between items-center py-5 cursor-pointer select-none">
          <span className="text-sm sm:text-base font-medium text-neutral-800">
            How long does shipping take?
          </span>
          <span className="transition-transform group-open:rotate-180 text-neutral-500">
            ▼
          </span>
        </summary>

        <div className="pb-5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          Typically 4–7 business days within India.
        </div>
      </details>

      {/* ITEM 2 */}
      <details className="group">
        <summary className="flex justify-between items-center py-5 cursor-pointer select-none">
          <span className="text-sm sm:text-base font-medium text-neutral-800">
            Do you take custom orders?
          </span>
          <span className="transition-transform group-open:rotate-180 text-neutral-500">
            ▼
          </span>
        </summary>

        <div className="pb-5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          Yes — couture & bespoke orders are available.
        </div>
      </details>

      {/* ITEM 3 */}
      <details className="group">
        <summary className="flex justify-between items-center py-5 cursor-pointer select-none">
          <span className="text-sm sm:text-base font-medium text-neutral-800">
            Do you ship internationally?
          </span>
          <span className="transition-transform group-open:rotate-180 text-neutral-500">
            ▼
          </span>
        </summary>

        <div className="pb-5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          International shipping available on request.
        </div>
      </details>

    </div>
  </div>
</div>


    </section>
  );
};

export default Contact;
