import { sendMail } from "../utils/mailer.js";

// ─────────────────────────────────────────────────────────────
// Shared: branded email wrapper
// ─────────────────────────────────────────────────────────────
const emailWrapper = (bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f1ee;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8e0d8;">

        <!-- HEADER -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 40px;text-align:center;">
            <p style="margin:0;color:#c9a96e;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Artisan Made in India</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;font-weight:400;letter-spacing:6px;text-transform:uppercase;">BRIGHT ROSE</h1>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:40px;">
            ${bodyContent}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f9f6f3;border-top:1px solid #e8e0d8;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Need Help?</p>
            <p style="margin:0;color:#555;font-size:12px;">
              <a href="mailto:hello@thebrightrose.com" style="color:#c9a96e;text-decoration:none;">hello@thebrightrose.com</a>
              &nbsp;·&nbsp;
              <a href="https://wa.me/919910929099" style="color:#c9a96e;text-decoration:none;">WhatsApp us</a>
            </p>
            <p style="margin:16px 0 0;color:#aaa;font-size:11px;">
              © ${new Date().getFullYear()} Bright Rose. All rights reserved.<br/>
              <a href="https://www.thebrightrose.com" style="color:#aaa;text-decoration:none;">www.thebrightrose.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─────────────────────────────────────────────────────────────
// Shared: order items table
// ─────────────────────────────────────────────────────────────
const buildItemsTable = (products = []) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid #e8e0d8;">
  ${products.map((p) => `
  <tr>
    <td style="padding:16px 0;border-bottom:1px solid #f0ece7;vertical-align:top;width:60px;">
      ${p.image
        ? `<img src="${p.image}" alt="${p.name}" width="56" height="56" style="width:56px;height:56px;object-fit:cover;border:1px solid #e8e0d8;display:block;"/>`
        : `<div style="width:56px;height:56px;background:#f4f1ee;border:1px solid #e8e0d8;"></div>`}
    </td>
    <td style="padding:16px 0 16px 16px;border-bottom:1px solid #f0ece7;vertical-align:top;">
      <p style="margin:0 0 4px;color:#1a1a1a;font-size:14px;font-weight:600;">${p.name || ""}</p>
      ${p.size ? `<p style="margin:0 0 4px;color:#888;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Size: ${p.size}</p>` : ""}
      <p style="margin:0;color:#888;font-size:12px;">Qty: ${p.quantity || 1}</p>
    </td>
    <td style="padding:16px 0;border-bottom:1px solid #f0ece7;vertical-align:top;text-align:right;white-space:nowrap;">
      <p style="margin:0;color:#1a1a1a;font-size:14px;font-weight:600;">₹${Number((p.price || 0) * (p.quantity || 1)).toLocaleString("en-IN")}</p>
    </td>
  </tr>`).join("")}
</table>`;

// ─────────────────────────────────────────────────────────────
// Shared: order totals block
// ─────────────────────────────────────────────────────────────
const buildTotals = (order) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <tr>
    <td style="padding:4px 0;color:#888;font-size:13px;">Subtotal</td>
    <td style="padding:4px 0;color:#555;font-size:13px;text-align:right;">₹${Number(order.subtotal || 0).toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:4px 0;color:#888;font-size:13px;">Shipping</td>
    <td style="padding:4px 0;color:#555;font-size:13px;text-align:right;">${(order.shippingCharge || 0) === 0 ? "Free" : "₹" + Number(order.shippingCharge).toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:12px 0 0;color:#1a1a1a;font-size:16px;font-weight:700;border-top:2px solid #1a1a1a;">Total</td>
    <td style="padding:12px 0 0;color:#1a1a1a;font-size:16px;font-weight:700;text-align:right;border-top:2px solid #1a1a1a;">₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
  </tr>
</table>`;

// ─────────────────────────────────────────────────────────────
// Shared: shipping address block
// ─────────────────────────────────────────────────────────────
const buildAddress = (order) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;background:#f9f6f3;border:1px solid #e8e0d8;">
  <tr>
    <td style="padding:20px;">
      <p style="margin:0 0 12px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Shipping Address</p>
      <p style="margin:0 0 4px;color:#1a1a1a;font-size:14px;font-weight:600;">${order.buyer?.name || ""}</p>
      ${order.buyer?.phone ? `<p style="margin:0 0 4px;color:#555;font-size:13px;">${order.buyer.phone}</p>` : ""}
      <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
        ${order.shippingInfo?.address || ""}<br/>
        ${order.shippingInfo?.city || ""}${order.shippingInfo?.state ? ", " + order.shippingInfo.state : ""} – ${order.shippingInfo?.pincode || ""}<br/>
        ${order.shippingInfo?.country || "India"}
      </p>
    </td>
  </tr>
</table>`;

// ─────────────────────────────────────────────────────────────
// Shared: send wrapper (silent fail)
// ─────────────────────────────────────────────────────────────
const sendEmailWrapper = async (email, subject, html, attach = []) => {
  if (!email) return;
  try {
    await sendMail({ to: email, subject, html, attachments: attach });
  } catch (err) {
    console.log("Email failed:", subject, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// Exported email functions
// ─────────────────────────────────────────────────────────────
export const orderEmails = {

  // ── ORDER CONFIRMED (Razorpay) ──────────────────────────────
  paid: async (order, attachments = []) => {
    const orderId = order.publicOrderId || order._id;
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Order Confirmed</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Thank you, ${order.buyer?.name?.split(" ")[0] || "Dear Customer"}.</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your payment has been received and your order is now being carefully prepared. We'll notify you the moment it's on its way.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#f9f6f3;border:1px solid #e8e0d8;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Order Reference</p>
            <p style="margin:0;color:#1a1a1a;font-size:18px;font-weight:700;letter-spacing:1px;">${orderId}</p>
          </td>
          <td style="padding:16px 20px;text-align:right;">
            <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Payment</p>
            <p style="margin:0;color:#2d7a2d;font-size:13px;font-weight:600;">✓ Confirmed</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 16px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your Items</p>
      ${buildItemsTable(order.products)}
      ${buildTotals(order)}
      ${buildAddress(order)}

      <p style="margin:0;color:#888;font-size:12px;line-height:1.7;text-align:center;">
        Each Bright Rose piece is handwoven by master artisans.<br/>
        Thank you for supporting handloom craft.
      </p>`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Order Confirmed — ${order.publicOrderId || order._id} | Bright Rose`,
      emailWrapper(body),
      attachments
    );
  },

  // ── ORDER PLACED (COD) ──────────────────────────────────────
  placed: async (order) => {
    const orderId = order.publicOrderId || order._id;
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Order Placed</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Thank you, ${order.buyer?.name?.split(" ")[0] || "Dear Customer"}.</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your order has been placed successfully. Since you've opted for Cash on Delivery, please have the exact amount ready at the time of delivery.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#f9f6f3;border:1px solid #e8e0d8;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Order Reference</p>
            <p style="margin:0;color:#1a1a1a;font-size:18px;font-weight:700;letter-spacing:1px;">${orderId}</p>
          </td>
          <td style="padding:16px 20px;text-align:right;">
            <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Payment</p>
            <p style="margin:0;color:#b8860b;font-size:13px;font-weight:600;">Cash on Delivery</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 16px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your Items</p>
      ${buildItemsTable(order.products)}
      ${buildTotals(order)}
      ${buildAddress(order)}

      <p style="margin:0;color:#888;font-size:12px;line-height:1.7;text-align:center;">
        Each Bright Rose piece is handwoven by master artisans.<br/>
        Thank you for supporting handloom craft.
      </p>`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Order Placed — ${order.publicOrderId || order._id} | Bright Rose`,
      emailWrapper(body)
    );
  },

  // ── ORDER PACKED ────────────────────────────────────────────
  packed: async (order) => {
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Getting Ready</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Your order is being packed.</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your Bright Rose order <strong>${order.publicOrderId || order._id}</strong> is currently being carefully packed and will be handed over to our shipping partner very soon.
      </p>
      ${buildAddress(order)}`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Your Order is Being Packed | Bright Rose`,
      emailWrapper(body)
    );
  },

  // ── ORDER SHIPPED ───────────────────────────────────────────
  shipped: async (order) => {
    const trackingUrl = order.shipment?.trackingUrl;
    const awb = order.shipment?.awb;
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">On Its Way</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Your order has been shipped! 🚚</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your Bright Rose order <strong>${order.publicOrderId || order._id}</strong> has been dispatched and is on its way to you.
      </p>

      ${awb ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#f9f6f3;border:1px solid #e8e0d8;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Tracking Number</p>
            <p style="margin:0 0 16px;color:#1a1a1a;font-size:18px;font-weight:700;letter-spacing:1px;">${awb}</p>
            ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 28px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Track Your Order →</a>` : ""}
          </td>
        </tr>
      </table>` : ""}

      ${buildAddress(order)}`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Your Order Has Been Shipped | Bright Rose`,
      emailWrapper(body)
    );
  },

  // ── OUT FOR DELIVERY ────────────────────────────────────────
  outForDelivery: async (order) => {
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Arriving Today</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Your order is out for delivery! 📦</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your Bright Rose order <strong>${order.publicOrderId || order._id}</strong> is out for delivery today. Please ensure someone is available to receive it.
      </p>
      ${buildAddress(order)}`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Your Order is Out for Delivery Today | Bright Rose`,
      emailWrapper(body)
    );
  },

  // ── DELIVERED ───────────────────────────────────────────────
  delivered: async (order) => {
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Delivered</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Your order has arrived. ✔️</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        We hope you love your Bright Rose piece as much as we loved creating it. Each piece is handwoven with care by our master artisans.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="text-align:center;padding:24px;background:#f9f6f3;border:1px solid #e8e0d8;">
            <p style="margin:0 0 16px;color:#555;font-size:14px;">Have questions or need assistance?</p>
            <a href="https://wa.me/919910929099" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 28px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Contact Us on WhatsApp</a>
          </td>
        </tr>
      </table>

      <p style="margin:0;color:#888;font-size:12px;line-height:1.7;text-align:center;">
        Thank you for choosing Bright Rose.<br/>Wear it with pride. 💛
      </p>`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Your Bright Rose Order Has Been Delivered | Bright Rose`,
      emailWrapper(body)
    );
  },

  // ── CANCELLED ───────────────────────────────────────────────
  cancelled: async (order) => {
    const body = `
      <p style="margin:0 0 8px;color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Order Update</p>
      <h2 style="margin:0 0 24px;color:#1a1a1a;font-size:22px;font-weight:400;">Your order has been cancelled.</h2>
      <p style="margin:0 0 32px;color:#555;font-size:14px;line-height:1.7;">
        Your Bright Rose order <strong>${order.publicOrderId || order._id}</strong> has been cancelled. If you paid online, your refund will be processed within 5–7 business days to your original payment method.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="text-align:center;padding:24px;background:#f9f6f3;border:1px solid #e8e0d8;">
            <p style="margin:0 0 16px;color:#555;font-size:14px;">Have questions about your refund or cancellation?</p>
            <a href="mailto:hello@thebrightrose.com" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 28px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Email Us</a>
          </td>
        </tr>
      </table>`;

    await sendEmailWrapper(
      order.buyer?.email,
      `Order Cancellation Confirmation | Bright Rose`,
      emailWrapper(body)
    );
  },
};
