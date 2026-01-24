// server/controllers/payment/paymentController.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import razorpay from "../../config/razorpay.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

// 1️⃣ CREATE RAZORPAY ORDER
// server/controllers/payment/paymentController.js

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, cartItems, shippingAddress } = req.body;

    if (!amount || amount <= 0 || !cartItems?.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // 1️⃣ Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `br_${Date.now()}`,
    });

    // 2️⃣ Map cart items
    const products = cartItems.map((item) => ({
      productId: item._id || item.productId,
      name: item.name,
      image: item.image,
      price: Number(item.discountPrice ?? item.price),
      quantity: Number(item.quantity),
      size: item.selectedSize || item.size || null,
    }));

    // 3️⃣ Create order in DB (user OR guest)
    const order = await Order.create({
      user: req.user?._id || null,          // guest-safe

      buyer: {
        name: shippingAddress?.name || req.user?.name || "",
        email: shippingAddress?.email || req.user?.email || "",
        phone: shippingAddress?.phoneNo || "",
      },

      products,

      shippingInfo: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: "India",
      },

      subtotal: amount,
      shippingCharge: shippingAddress.shippingCharge || 0,
      totalAmount: amount,

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
      currency: razorpayOrder.currency,
      dbOrderId: order._id,
    });
  } catch (err) {
    console.error("❌ createRazorpayOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
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

    // Idempotent: already paid
    if (order.paymentInfo?.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        orderId: order._id,
      });
    }

    // Update payment + status
    order.paymentInfo = {
      provider: "razorpay",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "paid",
    };
    order.orderStatus = "PAID";
      
    try {
  const shipment = await createBluedartShipment(order);
  order.shipment = shipment;
  order.orderStatus = "SHIPPED"; // or keep PAID and let ops move it later
} catch (shipErr) {
  console.error("Bluedart shipment error:", shipErr);
  // keep order as PAID so you can retry shipment manually
}

    // Inventory
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

    // Generate invoice PDF
    const { filepath, filename } = await generateInvoicePDF(order);
    order.invoicePath = filepath;

    await order.save();

    // Common info for emails
    const orderSummaryHtml = `
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Name:</strong> ${order.buyer?.name || ""}</p>
      <p><strong>Email:</strong> ${order.buyer?.email || ""}</p>
      <p><strong>Phone:</strong> ${order.buyer?.phone || ""}</p>
      <p><strong>Shipping:</strong><br/>
        ${order.shippingInfo?.address || ""}<br/>
        ${order.shippingInfo?.city || ""}, ${order.shippingInfo?.state || ""} - ${
          order.shippingInfo?.pincode || ""
        }<br/>
        ${order.shippingInfo?.country || ""}
      </p>
      <hr/>
      <p><strong>Items:</strong></p>
      <ul>
        ${order.products
          .map(
            (p) =>
              `<li>${p.name} (${p.size || "—"}) × ${p.quantity} – ₹${
                p.price
              }</li>`
          )
          .join("")}
      </ul>
      <p><strong>Subtotal:</strong> ₹${order.subtotal.toLocaleString()}</p>
      <p><strong>Shipping:</strong> ₹${order.shippingCharge.toLocaleString()}</p>
      <p><strong>Tax (GST incl.):</strong> ₹${order.tax.toLocaleString()}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount.toLocaleString()}</p>
      <p><strong>Payment:</strong> Razorpay – ${razorpay_payment_id}</p>
    `;

    // 1) Customer email
    if (order.buyer?.email) {
      await sendMail({
        to: order.buyer.email,
        subject: "Your Bright Rose order is confirmed",
        html: `
          <p>Dear ${order.buyer?.name || "Customer"},</p>
          <p>Thank you for shopping with Bright Rose. Your order has been confirmed and is now being processed.</p>
          ${orderSummaryHtml}
          <p>We'll notify you again when your order is shipped.</p>
          <p>Warm regards,<br/>Bright Rose Team</p>
        `,
        attachments: [{ path: filepath, filename }],
      });
    }

    // 2) Internal ops email
    const opsEmail = process.env.ORDERS_EMAIL || process.env.EMAIL_FROM;
    if (opsEmail) {
      await sendMail({
        to: opsEmail,
        subject: `New order #${order._id} – Bright Rose`,
        html: `
          <p>New paid order received.</p>
          ${orderSummaryHtml}
          <p>Use the attached invoice for packing and finance.</p>
        `,
        attachments: [{ path: filepath, filename }],
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
