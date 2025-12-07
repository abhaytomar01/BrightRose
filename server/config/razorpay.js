// server/config/razorpay.js
import Razorpay from "razorpay";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

// No keys? Disable Razorpay safely
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.log("⚠️ Razorpay NOT configured (missing keys). Payments disabled.");
  export default null;
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpay;
