// server/controllers/payment/paymentController.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import razorpay from "../../config/razorpay.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

// 1️⃣ CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, cartItems, shippingAddress } = req.body;

    // Basic validation
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete shipping address",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay keys missing in env");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error",
      });
    }

    const totalAmount = Number(amount);
    const shippingCharge = Number(shippingAddress.shippingCharge || 0);
    const subtotal = totalAmount - shippingCharge;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // rupees → paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const products = (cartItems || []).map((i) => ({
      productId: i._id || i.productId,
      name: i.name,
      image: i.image,
      price: i.discountPrice || i.price,
      quantity: i.quantity,
      size: i.size,
    }));

    const order = await Order.create({
      user: req.user?._id || null,
      buyer: {
        name: req.user?.name,
        email: req.user?.email,
        phone: shippingAddress?.phoneNo,
      },
      products,
      shippingInfo: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: "India",
      },
      subtotal,
      shippingCharge,
      tax: 0,
      totalAmount,
      paymentInfo: {
        provider: "razorpay",
        orderId: razorpayOrder.id,
        status: "pending",
      },
      orderStatus: "PLACED",
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

// 2️⃣ VERIFY RAZORPAY PAYMENT
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ RAZORPAY_KEY_SECRET missing");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error",
      });
    }

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

    const order = await Order.findById(dbOrderId).populate("user");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentInfo?.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        orderId: order._id,
      });
    }

    order.paymentInfo = {
      provider: "razorpay",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "paid",
    };
    order.orderStatus = "PAID";

    for (const item of order.products) {
      if (!item.productId) continue;

      const product = await Product.findById(item.productId);
      if (!product) continue;

      const qty = Number(item.quantity || 0);
      if (qty <= 0) continue;

      const newStock = (product.stock || 0) - qty;
      product.stock = newStock < 0 ? 0 : newStock;

      await product.save();
    }

    await order.save();

    const invoicePath = await generateInvoicePDF(order);

    if (order.buyer?.email) {
      await sendMail({
        to: order.buyer.email,
        subject: "Order Confirmed – Bright Rose",
        html: `<p>Your order has been confirmed.</p>`,
        attachments: [{ path: invoicePath }],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
