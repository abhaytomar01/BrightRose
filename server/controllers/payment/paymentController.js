// server/controllers/payment/paymentController.js
import crypto from "crypto";
import { razorpay } from "../../config/razorpay.js";
import Order from "../../models/orderModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

// ===============================
// 1) CREATE Razorpay ORDER
// ===============================
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "BRIGHTROSE_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("❌ createOrder error:", err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};


// ===============================
// 2) VERIFY PAYMENT & CREATE ORDER
// ===============================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems = [],
      address = {},
      shippingCharge = 0,
      total,
    } = req.body;

    if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: "Missing payment fields" });
    }

    // -----------------------------
    // Verify signature
    // -----------------------------
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // -----------------------------
    // PREVENT DUPLICATE ORDERS
    // -----------------------------
    const duplicate = await Order.findOne({
      "paymentInfo.paymentId": razorpay_payment_id,
    });

    if (duplicate) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: duplicate,
      });
    }

    // -----------------------------
    // USER / BUYER
    // -----------------------------
    const userId = req.user?._id || null;

    const buyer = {
      name: req.user?.name || address.name || "Guest",
      email: req.user?.email || address.email || "",
      phone: address.phone || "",
    };

    // -----------------------------
    // PRODUCT DETAILS
    // -----------------------------
    const products = cartItems.map((it) => ({
      productId: it._id || it.productId,
      name: it.name,
      image: it.image,
      price: Number(it.discountPrice ?? it.price),
      quantity: Number(it.quantity),
      size: it.selectedSize || "",
    }));

    const subtotal = products.reduce((s, p) => s + p.price * p.quantity, 0);
    const totalAmount = Number(total || subtotal + Number(shippingCharge));

    // -----------------------------
    // CREATE ORDER
    // -----------------------------
    const orderDoc = await Order.create({
      user: userId,
      buyer,
      products,
      shippingInfo: {
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || "India",
      },
      subtotal,
      tax: 0,
      shippingCharge,
      totalAmount,
      paymentInfo: {
        provider: "razorpay",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        status: "paid",
      },
      orderStatus: "Processing",
    });

    // -----------------------------
    // GENERATE INVOICE
    // -----------------------------
    try {
      const invoice = await generateInvoicePDF(orderDoc);
      orderDoc.invoicePath = `/uploads/invoices/${invoice.filename}`;
      await orderDoc.save();
    } catch (err) {
      console.error("Invoice error:", err);
    }

    // -----------------------------
    // SEND MAIL
    // -----------------------------
    try {
      if (buyer.email) {
        await sendMail({
          to: buyer.email,
          subject: `Order Confirmation – ${orderDoc._id}`,
          html: `
            <p>Hello ${buyer.name},</p>
            <p>Your payment was successful.</p>
            <p>Order Total: ₹${totalAmount}</p>
            <p>Your order is being processed.</p>
          `,
        });
      }
    } catch (err) {
      console.error("Email error:", err);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & order created",
      order: orderDoc,
    });
  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
