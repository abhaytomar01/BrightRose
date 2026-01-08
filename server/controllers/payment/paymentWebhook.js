// server/controllers/payment/webhookController.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendMail } from "../../utils/mailer.js";

export const paymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body) // raw buffer
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("❌ Invalid Razorpay Webhook Signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body);

    if (event.event !== "payment.captured") {
      return res.status(200).send("Ignored");
    }

    const payment = event.payload.payment.entity;
    const razorpay_payment_id = payment.id;
    const razorpay_order_id = payment.order_id;

    // match by paymentInfo.orderId
    const order = await Order.findOne({
      "paymentInfo.orderId": razorpay_order_id,
    });

    if (!order) {
      console.log("❌ No order found for webhook");
      return res.status(404).send("Order not found");
    }

    if (order.paymentInfo?.status === "paid") {
      return res.status(200).send("Already processed");
    }

    order.paymentInfo.paymentId = razorpay_payment_id;
    order.paymentInfo.status = "paid";
    order.orderStatus = "PAID";

    await order.save();

    try {
      const invoice = await generateInvoicePDF(order);
      order.invoicePath = `/uploads/invoices/${invoice.filename}`;
      await order.save();
    } catch (err) {
      console.log("Invoice failed", err);
    }

    if (order.buyer?.email) {
      await sendMail({
        to: order.buyer.email,
        subject: "Your Bright Rose Order is Confirmed",
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your payment has been received.</p>
          <p>Order ID: <strong>${order._id}</strong></p>
          <p>Amount: ₹${order.totalAmount}</p>
        `,
      });
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.log("Webhook Error", err);
    return res.status(500).send("Server error");
  }
};
