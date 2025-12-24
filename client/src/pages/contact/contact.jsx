
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SeoData from "../../SEO/SeoData";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    honey: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.honey !== "") return;

    // ✔ GET TOKEN FROM RECAPTCHA v2 CHECKBOX
    const token = window.grecaptcha.getResponse();

    if (!token) {
      alert("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://thebrightrose.com/api/v1/contact",
        {
          name: form.name,
          email: form.email,
          message: form.message,
          token,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setSent(true);
        window.grecaptcha.reset(); // ✔ reset reCAPTCHA checkbox
        setForm({ name: "", email: "", message: "", honey: "" });
        setTimeout(() => setSent(false), 5000);
      } else {
        alert(res.data.message || "Failed to send message.");
      }
    } catch (error) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <SeoData
  title="Contact Us – Bright Rose"
  description="Reach out to Bright Rose for queries, bespoke orders, styling services, or support. We're happy to assist you."
  keywords={[
    "contact bright rose",
    "customer service",
    "luxury fashion support",
    "bespoke couture enquiry"
  ]}
  image="/og-contact.jpg"
  url="/contact"
/>
    <section className="bg-[#FAF9F6] min-h-screen pt-28">

  {/* ================= HERO ================= */}
  <div className="max-w-4xl mx-auto px-6 text-center">
    
    <p className="uppercase tracking-[0.28em] text-[9px] md:text-[11px] text-neutral-500">
      Bright Rose Atelier
    </p>

    <h1 className="text-[16px] md:text-[26px] leading-tight font-light mt-3">
      Connect With The House of Bright Rose
    </h1>

    <div className="mt-4 flex justify-center">
      <div className="h-[1px] w-40 bg-neutral-800/80" />
    </div>

    <p className="mt-4 text-neutral-600 text-[10px] md:text-[14px] max-w-2xl mx-auto leading-relaxed">
      Whether you are exploring bespoke couture, seeking styling guidance, 
      or simply wish to share a thought — we would love to hear from you.
    </p>
  </div>


  {/* ================= INFO RIBBON ================= */}
  <div className="max-w-6xl mx-auto mt-14 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

    {[
      ["Customer Support", "brightrose.india@gmail.com"],
      ["Call Us", "+91 9910929099"],
      ["Business Hours", "Mon – Sat • 10 AM – 7 PM"]
    ].map(([title, text], i) => (
      <div
        key={i}
        className="
          bg-white border border-neutral-200 rounded-2xl py-8
          text-center shadow-sm hover:shadow-md transition
        "
      >
        <p className="text-[14px] font-medium tracking-wide">{title}</p>
        <p className="text-neutral-600 mt-1 text-[13px]">{text}</p>
      </div>
    ))}

  </div>


  {/* ================= GRID ================= */}
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 px-6 py-20">

    {/* FORM CARD */}
    <div className="
      bg-white rounded-2xl border border-neutral-200 shadow-sm
      p-8 md:p-10
    ">
      <h2 className="text-[18px] md:text-[22px] font-light tracking-wide mb-2">
        Send Us A Message
      </h2>

      <p className="text-neutral-500 text-sm mb-6">
        Our team will get back within 24–48 hours
      </p>
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
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md"
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
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md"
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
                className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md"
              />
            </div>

            {/* ⭐ ADD reCAPTCHA CHECKBOX HERE ⭐ */}
            <div
              className="g-recaptcha"
              data-sitekey="6LcryB0sAAAAAKVIpPMxTxWlXSjn9iyGIhyj-GDK
"
            ></div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neutralDark/80 text-white rounded-md text-sm sm:text-base"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {sent && <p className="text-green-600 text-center mt-3 text-sm">Your message has been sent ✔</p>}
          </form>
     
    </div>


    {/* RIGHT SIDE LUXURY STACK */}
    <div className="space-y-10 pt-2">

      <div>
        <h3 className="text-lg md:text-xl font-light mb-2 tracking-wide">
          Visit Our Studio
        </h3>
        <p className="text-neutral-700 text-[12px] md:text-[14px] leading-relaxed">
          Bright Rose Studio<br />
          Gurugram, Haryana — India
        </p>
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-light mb-2 tracking-wide">
          Collaborations & Media
        </h3>
        <p className="text-neutral-700 text-[12px] md:text-[14px] leading-relaxed">
          For influencers, stylists & magazines<br />
          <span className="font-medium">brightrose.india@gmail.com</span>
        </p>
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-light mb-2 tracking-wide">
          Bespoke Orders
        </h3>
        <p className="text-neutral-700 text-[12px] md:text-[14px] leading-relaxed">
          Couture & handloom custom requests<br />
          <span className="font-medium">brightrose.india@gmail.com</span>
        </p>
      </div>

    </div>

  </div>


  {/* ================= FAQ ================= */}
  <div className="bg-white border-t border-neutral-200 py-20 px-6">
    <div className="max-w-4xl mx-auto">

      <h2 className="text-center text-[18px] md:text-[32px] font-light tracking-wide mb-10">
        Frequently Asked Questions
      </h2>

      <div className="divide-y border-y">
        {[
          ["How long does shipping take?", "Typically 4–7 business days within India."],
          ["Do you take custom orders?", "Yes, bespoke couture & custom design available."],
          ["Do you ship internationally?", "International orders available upon request."]
        ].map(([q, a], i) => (
          <details key={i} className="group">
            <summary className="flex justify-between py-5 cursor-pointer text-xs md:text-sm font-medium">
              {q}
              <span className="transition group-open:rotate-180 text-neutral-500">
                ▼
              </span>
            </summary>
            <p className="pb-5 text-xs md:text-sm text-neutral-700 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>

    </div>
  </div>

</section>

    </>
  );
};

export default Contact;
