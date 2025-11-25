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

  // Wait until reCAPTCHA loads
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
          HERO — Editorial Luxury
      -------------------------------------------------------- */}
      <div className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/10667753/pexels-photo-10667753.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
            Contact Us
          </h1>
          <p className="text-white/90 mt-4 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            We would love to hear from you — queries, orders, collaborations or appointments.
          </p>
        </motion.div>
      </div>

      {/* -------------------------------------------------------
          CONTACT INFO BAR — Minimal & Premium
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto py-14 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-semibold text-lg mb-2">Customer Support</p>
          <p className="text-gray-600">support@brightrose.in</p>
        </div>
        <div>
          <p className="font-semibold text-lg mb-2">Call Us</p>
          <p className="text-gray-600">+91 98765 43210</p>
        </div>
        <div>
          <p className="font-semibold text-lg mb-2">Business Hours</p>
          <p className="text-gray-600">Mon–Sat: 10 AM – 7 PM</p>
        </div>
      </div>

      {/* -------------------------------------------------------
          FORM + DETAILS GRID — Soft premium white
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-14">

        {/* FORM */}
        <div className="bg-white p-10 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-3xl font-light mb-6">Send us a message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="honey"
              className="hidden"
              value={form.honey}
              onChange={handleChange}
            />

            <div>
              <label className="text-sm font-medium text-neutral-700">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="
                  w-full px-4 py-2 mt-1
                  bg-neutral-50
                  border border-neutral-300
                  rounded-md
                  focus:outline-none focus:ring-2 focus:ring-primaryRed/30
                "
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
                className="
                  w-full px-4 py-2 mt-1
                  bg-neutral-50
                  border border-neutral-300
                  rounded-md
                  focus:outline-none focus:ring-2 focus:ring-primaryRed/30
                "
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
                className="
                  w-full px-4 py-2 mt-1
                  bg-neutral-50
                  border border-neutral-300
                  rounded-md
                  focus:ring-2 focus:ring-primaryRed/30
                "
              />
            </div>

            <button
              type="submit"
              disabled={!recaptchaReady || loading}
              className="
                w-full py-3 
                bg-primaryRed 
                text-white 
                rounded-md 
                tracking-wide
                hover:bg-[#8c0018]
                transition-all
              "
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {sent && (
              <p className="text-green-600 text-center mt-3">
                Your message has been sent ✔
              </p>
            )}
          </form>
        </div>

        {/* INFO BLOCKS */}
        <div className="space-y-10">

          <div>
            <h3 className="text-2xl font-light mb-3">Visit Our Studio</h3>
            <p className="text-gray-700 leading-relaxed">
              Bright Rose Studio<br />
              Jaipur, Rajasthan, India
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-light mb-3">Collaborations & Media</h3>
            <p className="text-gray-700">
              For influencers, stylists & magazines:<br />
              <span className="font-medium">media@brightrose.in</span>
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-light mb-3">Bespoke Orders</h3>
            <p className="text-gray-700">
              For couture, bridal or custom tailoring:<br />
              <span className="font-medium">couture@brightrose.in</span>
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------
          MAP SECTION — Clean Editorial
      -------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-2xl font-light mb-4">Find us on the map</h3>

        <div className="rounded-xl overflow-hidden border border-neutral-300">
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.2398329603967!2d75.7872701!3d26.862305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db63c70b7efa9%3A0x72d8c31ca68e25ad!2sJaipur!5e0!3m2!1sen!2sin!4v1700000000000"
            className="w-full h-[350px]"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* -------------------------------------------------------
          FAQ SECTION
      -------------------------------------------------------- */}
      <div className="bg-neutral-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8 text-gray-700">
            <div>
              <p className="font-medium">How long does shipping take?</p>
              <p className="text-sm mt-1">Typically 4–7 business days within India.</p>
            </div>

            <div>
              <p className="font-medium">Do you take custom orders?</p>
              <p className="text-sm mt-1">Yes — couture & bespoke orders are available.</p>
            </div>

            <div>
              <p className="font-medium">Do you ship internationally?</p>
              <p className="text-sm mt-1">International shipping available on request.</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Contact;
