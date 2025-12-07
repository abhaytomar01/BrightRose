import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

// Debug log
console.log("RAZORPAY KEYS:", key_id ? "OK" : "MISSING");

let razorpay = null;

// If keys missing → DO NOT CRASH
if (!key_id || !key_secret) {
  console.warn("⚠️ Razorpay not configured. Payment is disabled.");
} else {
  razorpay = new Razorpay({
    key_id,
    key_secret,
  });
}

export default razorpay;
