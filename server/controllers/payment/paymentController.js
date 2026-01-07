// server/controllers/payment/paymentController.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import razorpay from "../../config/razorpay.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

// ==============================================================
// 1️⃣ CREATE RAZORPAY ORDER
// ==============================================================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, cartItems, shippingAddress } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Save order in DB (PENDING)
    const order = await Order.create({
      user: req.user._id,
      cartItems,
      shippingAddress,
      amount,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id,
    });
  } catch (err) {
    console.error("❌ Razorpay create order error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ==============================================================
// 2️⃣ VERIFY PAYMENT
// ==============================================================
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    // Validate signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      dbOrderId,
      {
        paymentStatus: "PAID",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    ).populate("user");

    // Generate invoice
    const invoicePath = await generateInvoicePDF(order);

    // Email confirmation
    await sendMail({
      to: order.user.email,
      subject: "Order Confirmed – Bright Rose",
      html: `<p>Your order has been confirmed.</p>`,
      attachments: [{ path: invoicePath }],
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
