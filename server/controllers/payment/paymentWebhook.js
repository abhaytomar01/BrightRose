// server/controllers/payment/paymentWebhook.js
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import { orderEmails } from "../../services/orderEmailService.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

// Helper: update order + inventory, but only if not already paid
const finalizeOrderAndInventory = async (razorpayOrderId, paymentId) => {
  const order = await Order.findOne({
    "paymentInfo.orderId": razorpayOrderId,
  });

  if (!order) return null;

  // Idempotency: if already marked paid, do nothing
  if (order.paymentInfo?.status === "paid") {
    return order;
  }

  order.paymentInfo = {
    ...order.paymentInfo,
    paymentId: paymentId || order.paymentInfo?.paymentId,
    status: "paid",
  };
  order.orderStatus = "PAID";

  for (const item of order.products || []) {
    if (!item.productId) continue;

    const product = await Product.findById(item.productId);
    if (!product) continue;

    const qty = Number(item.quantity || 0);
    if (qty <= 0) continue;

    // Deduct total stock (backward compatibility)
    const newStock = (product.stock || 0) - qty;
    product.stock = newStock < 0 ? 0 : newStock;

    // Deduct per-size stock if available
    if (item.size && product.sizeStock && product.sizeStock.has(item.size)) {
      const currentSizeStock = product.sizeStock.get(item.size) || 0;
      const newSizeStock = currentSizeStock - qty;
      product.sizeStock.set(item.size, newSizeStock < 0 ? 0 : newSizeStock);
    }

    await product.save();
  }

  await order.save();
  return order;
};

export const paymentWebhook = async (req, res) => {
  try {
    if (!WEBHOOK_SECRET) {
      console.error("❌ RAZORPAY_WEBHOOK_SECRET not set");
      return res.status(500).json({ success: false });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      console.error("❌ Missing Razorpay webhook signature header");
      return res.status(400).json({ success: false, message: "Missing signature" });
    }

    const bodyString = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(bodyString)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid Razorpay webhook signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    let parsedBody;
    try {
      parsedBody = Buffer.isBuffer(req.body) ? JSON.parse(bodyString) : req.body;
    } catch (e) {
      console.error("❌ Failed to parse webhook JSON");
      return res.status(400).json({ success: false, message: "Invalid JSON" });
    }

    const event = parsedBody.event;
    const payload = parsedBody.payload || {};

    console.log("🔔 RZP WEBHOOK EVENT:", event);

    if (event === "payment.captured") {
      const paymentEntity = payload.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await finalizeOrderAndInventory(razorpayOrderId, paymentId);

        // Send confirmation email with invoice
        if (order && order.buyer?.email) {
          try {
            const { filepath, filename, relativePath } = await generateInvoicePDF(order);
            order.invoicePath = relativePath;
            await order.save();
            await orderEmails.paid(order, [{ path: filepath, filename }]);
          } catch (emailErr) {
            // Email failure must never break the webhook response
            console.error("⚠️  Webhook email/invoice error:", emailErr.message);
          }
        }
      }
    }

    // Other events (optional): order.paid, payment.failed, refund.processed, etc.

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Razorpay webhook error:", err);
    return res.status(500).json({ success: false });
  }
};
