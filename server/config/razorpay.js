// server/config/razorpay.js
import Razorpay from "razorpay";

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

// If keys missing → disable payments
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.log("⚠️ Razorpay NOT configured — payments disabled.");
  export default null;
}

console.log("RAZORPAY KEYS: OK");

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpay;
