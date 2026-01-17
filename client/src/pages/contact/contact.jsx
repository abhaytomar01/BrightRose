import React, { useState } from "react";
import axios from "axios";
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

    // honeypot
    if (form.honey !== "") return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/contact`,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "", honey: "" });
        setTimeout(() => setSent(false), 5000);
      } else {
        alert(res.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact error:", error?.response?.data || error.message);
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
          "bespoke couture enquiry",
        ]}
        image="/og-contact.jpg"
        url="/contact"
      />

      <section className="bg-[#ffffff] min-h-screen pt-28">
        {/* ... hero + info ribbon ... */}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 px-6 py-20">
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-10">
            <h2 className="text-[18px] md:text-[22px] font-light tracking-wide mb-2">
              Send Us A Message
            </h2>

            <p className="text-neutral-500 text-sm mb-6">
              Our team will get back within 24–48 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="honey"
                className="hidden"
                value={form.honey}
                onChange={handleChange}
              />

              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Full Name
                </label>
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
                <label className="text-sm font-medium text-neutral-700">
                  Email Address
                </label>
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
                <label className="text-sm font-medium text-neutral-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 bg-neutral-50 border border-neutral-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-neutralDark/80 text-white rounded-md text-sm sm:text-base"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              {sent && (
                <p className="text-green-600 text-center mt-3 text-sm">
                  Your message has been sent ✔
                </p>
              )}
            </form>
          </div>

          {/* ... right side content unchanged ... */}
        </div>

        {/* ... FAQ section unchanged ... */}
      </section>
    </>
  );
};

export default Contact;
