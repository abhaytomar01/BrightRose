// server/controllers/payment/paymentWebhook.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (generatedSignature !== signature) {
      console.log("❌ Webhook verification failed");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body);

    // We only process payment.captured events
    if (event.event !== "payment.captured") {
      return res.status(200).send("Event ignored");
    }

    const payment = event.payload.payment.entity;
    const razorpay_payment_id = payment.id;
    const razorpay_order_id = payment.order_id;

    // Prevent duplicate order creation
    const existingOrder = await Order.findOne({
      "paymentInfo.paymentId": razorpay_payment_id,
    });

    if (existingOrder) {
      console.log("⚠️ Webhook duplicate ignored");
      return res.status(200).send("Duplicate");
    }

    // Webhook does not send cart or address — SAFE fallback
    const orderDoc = await Order.create({
      user: null, // frontend will link logged-in user
      buyer: {
        name: payment.email || "Guest",
        email: payment.email || "",
        phone: payment.contact || "",
      },
      products: [],
      shippingInfo: {},
      subtotal: payment.amount / 100,
      tax: 0,
      shippingCharge: 0,
      totalAmount: payment.amount / 100,
      paymentInfo: {
        provider: "razorpay",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: "paid",
      },
      orderStatus: "Payment Captured",
    });

    // Try generating invoice (optional)
    try {
      const invoice = await generateInvoicePDF(orderDoc);
      orderDoc.invoicePath = `/uploads/invoices/${invoice.filename}`;
      await orderDoc.save();
    } catch (err) {
      console.log("Invoice error:", err);
    }

    // Send basic email
    try {
      if (payment.email) {
        await sendMail({
          to: payment.email,
          subject: "Payment Received",
          html: `
            <h3>Payment Successful</h3>
            <p>Payment ID: ${razorpay_payment_id}</p>
            <p>Amount: ₹${payment.amount / 100}</p>
          `,
        });
      }
    } catch (emailErr) {
      console.log("Email send error:", emailErr);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Server error");
  }
};
