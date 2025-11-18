import React, { useState, useEffect } from "react";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", honey: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Wait until reCAPTCHA is fully loaded on page
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.honey !== "") {
      console.warn("Spam honeypot triggered!");
      return;
    }

    setLoading(true);

    try {
      // Get reCAPTCHA token
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
      console.error("Contact error:", error);
      alert("reCAPTCHA failed or network issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white text-[#222] p-0">
      {/* Banner */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/10667753/pexels-photo-10667753.jpeg"
          alt="Contact Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Have questions? We’re here to help you with our handcrafted collections.
          </p>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-[#fefaf9] p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="honey"
              value={form.honey}
              onChange={handleChange}
              className="hidden"
              tabIndex="-1"
              autoComplete="off"
            />

            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#AD000F]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#AD000F]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#AD000F] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !recaptchaReady}
              className={`w-full text-white py-3 rounded-lg font-medium transition-colors ${
                loading || !recaptchaReady
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#AD000F] hover:bg-[#8c000c]"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {sent && (
              <p className="text-green-600 mt-4 text-center">
                ✅ Your message has been sent!
              </p>
            )}
          </form>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-8 text-gray-800">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Address</h3>
            <p>Bright Rose Studio<br />Jaipur, Rajasthan, India</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Email</h3>
            <p>support@brightrose.in</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Business Hours</h3>
            <p>Mon – Sat: 10 AM – 7 PM<br />Sunday: Closed</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
