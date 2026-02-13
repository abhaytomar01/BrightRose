import React, { useState } from "react";

const Newsletter = ({
  title = "Join Our Circle",
  subtitle = "Get early access to new arrivals & special offers.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  // Email validation helper
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // Example: POST request to your backend API endpoint
      const response = await fetch("https://your-backend-domain.com/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        throw new Error(data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="w-full bg-[#f5efe6] py-16 md:py-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#AD000F] mb-4">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-700 text-base md:text-lg mb-8">{subtitle}</p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-80 px-4 py-3 rounded-full border-2 border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 text-gray-700"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`px-6 py-3 rounded-full font-medium border border-[#D4AF37] transition-all duration-300
              ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#AD000F] text-white hover:bg-[#8c000c] hover:shadow-lg"
              }`}
          >
            {status === "loading" ? "Subscribing..." : buttonText}
          </button>
        </form>

        {/* Status Message */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >/
            {message}
          </p>
        )}

        {/* Decoration */}
        <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent mx-auto mt-8 rounded-full"></div>
      </div>
    </section>
  );
};

export default Newsletter;
