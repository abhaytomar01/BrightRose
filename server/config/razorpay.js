// server/config/razorpay.js
// --------------------------------------
// Razorpay Disabled (Safe Fallback)
// --------------------------------------

import Razorpay from "razorpay";

let razorpay = null;

// If env keys are missing → disable Razorpay safely
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log("⚠️ Razorpay disabled — No API keys found.");
} else {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay enabled.");
}

export default razorpay;
