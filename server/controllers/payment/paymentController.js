import Razorpay from "razorpay";
import asyncHandler from "express-async-handler";
import OrderModel from "../models/orderModel.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body; // amount comes from frontend subtotal

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // Convert to paise (Razorpay uses INR * 100)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    res.json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log("Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment session creation failed",
    });
  }
});
