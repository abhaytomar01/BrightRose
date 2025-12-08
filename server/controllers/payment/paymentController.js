// server/controllers/payment/paymentController.js
import Order from "../../models/orderModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

// Razorpay is disabled — always null
import razorpay from "../../config/razorpay.js";

// ==============================================================
// 1) CREATE Razorpay ORDER  (DISABLED)
// ==============================================================
export const createOrder = async (req, res) => {
  try {
    // Razorpay disabled → prevent usage
    return res.status(503).json({
      success: false,
      message: "Payment gateway not configured",
    });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// ==============================================================
// 2) VERIFY PAYMENT (DISABLED)
// ==============================================================
export const verifyPayment = async (req, res) => {
  try {
    // Razorpay disabled → prevent usage
    return res.status(503).json({
      success: false,
      message: "Payment gateway not configured",
    });
  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
