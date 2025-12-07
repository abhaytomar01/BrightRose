import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

console.log("RAZORPAY KEYS:", key_id ? "OK" : "MISSING");

let razorpay = null;

if (!key_id || !key_secret) {
  console.warn("⚠️ Razorpay not configured. Payment disabled.");
} else {
  razorpay = new Razorpay({
    key_id,
    key_secret,
  });
}

export default razorpay;
