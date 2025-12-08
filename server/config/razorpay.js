import Razorpay from "razorpay";

let razorpay = null;

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.log("⚠️ Razorpay disabled — No API keys found.");
} else {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay enabled");
  } catch (err) {
    console.error("❌ Razorpay init error:", err);
    razorpay = null;
  }
}

export default razorpay;
