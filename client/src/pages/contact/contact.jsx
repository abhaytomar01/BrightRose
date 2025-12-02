import React, { useState } from "react";
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

    <section className="w-full bg-white text-neutral-800 pt-0">

      {/* ... your banner, info sections ... */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">

        {/* FORM */}
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg sm:text-2xl font-light mb-6">
            Send us a message
          </h2>

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

        {/* right section unchanged */}
      </div>

      {/* rest sections unchanged */}

    </section>
    </>
  );
};

export default Contact;
