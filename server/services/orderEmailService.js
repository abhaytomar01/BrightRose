import { sendMail } from "../utils/mailer.js";

const sendEmailWrapper = async (email, subject, html, attach = []) => {
  if (!email) return; // avoid crashes
  try {
    await sendMail({
      to: email,
      subject,
      html,
      attachments: attach,
    });
  } catch (err) {
    console.log("Email failed:", subject, err.message);
  }
};

export const orderEmails = {

  placed: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Your Order Has Been Placed",
      `
      <h2>Thank you for your order 🎉</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Status: <b>PLACED</b></p>
      `
    ),

  paid: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Payment Successful",
      `
      <h2>Payment Received Successfully</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Status: <b>PAID</b></p>
      `
    ),

  packed: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Your Order is Packed",
      `<p>Your order is packed and ready to ship.</p>`
    ),

  shipped: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Your Order is Shipped 🚚",
      `<p>Your order has been shipped.</p>`
    ),

  outForDelivery: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Your Order is Out for Delivery 📦",
      `<p>Your product will reach you soon.</p>`
    ),

  delivered: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Order Delivered ✔️",
      `<p>We hope you love it 💛</p>`
    ),

  cancelled: async (order) =>
    sendEmailWrapper(
      order.buyer?.email,
      "Order Cancelled ❌",
      `<p>Your order has been cancelled.</p>`
    ),
};
