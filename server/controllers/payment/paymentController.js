import crypto from "crypto";
import { razorpay } from "../../config/razorpay.js";
import Order from "../../models/orderModel.js"; // make sure this file exists and is exported
import { generateInvoice } from "../../utils/invoiceGenerator.js";
import { sendEmail } from "../../utils/sendEmail.js";
// -------------------------------
// 1️⃣ CREATE ORDER
// -------------------------------
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise (ensure integer)
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
  } catch (error) {
    console.log("CreateOrder Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// -------------------------------
// 2️⃣ VERIFY PAYMENT (frontend POSTs after checkout handler)
// -------------------------------


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      address,
      total,
    } = req.body;

    // Payment signature validated above…

    // 🔥 Create order after successful payment
    const order = await Order.create({
      user: req.user._id,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        size: item.selectedSize,
      })),
      address,
      totalAmount: total,
      paymentInfo: {
        status: "paid",
        paymentId: razorpay_payment_id,
      },
      orderStatus: "Processing",
    });

    // Generate invoice
    const { invoiceId, invoicePath } = await generateInvoice(order);

    order.invoiceId = invoiceId;
    order.invoiceUrl = invoicePath;
    await order.save();

    // Email customer
    await sendEmail(
      address.email,
      "Your Bright Rose Order Receipt",
      "Your payment was successful",
      `
        <h2>Payment Successful!</h2>
        <p>Your order <strong>${order._id}</strong> is complete.</p>
        <a href="${process.env.SERVER_URL}/${invoicePath}" target="_blank">
          Download Invoice
        </a>
      `,
      [
        { filename: `${invoiceId}.pdf`, path: invoicePath }
      ]
    );

    res.status(200).json({
      success: true,
      message: "Payment verified + Order created + Email sent",
      order,
    });

  } catch (error) {
    console.log("VerifyPayment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification error",
    });
  }
};


// -------------------------------
// 3️⃣ Optional: Razorpay Webhook handler (recommended for production)
// Register this route and configure the webhook secret in Razorpay dashboard.
// -------------------------------
export const paymentWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("Webhook secret not configured");
      return res.status(500).send("Webhook not configured");
    }

    const payload = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex");

    if (expected !== signature) {
      return res.status(400).send("Invalid webhook signature");
    }

    // Handle event types - example: payment.captured
    const event = req.body.event;
    const payloadData = req.body.payload || {};

    if (event === "payment.captured") {
      const payment = payloadData.payment?.entity;

      if (payment) {
        const razorpay_order_id = payment.order_id;
        const razorpay_payment_id = payment.id;

        // If order already exists, skip
        let order = await Order.findOne({
          "paymentInfo.razorpay_order_id": razorpay_order_id,
        });

        if (!order) {
          // You might want to fetch associated cart & address info from a temporary store.
          // As a fallback, create a minimal record.
          order = await Order.create({
            user: null,
            items: [],
            address: {},
            paymentInfo: {
              razorpay_order_id,
              razorpay_payment_id,
              status: "paid",
            },
            totalAmount: payment.amount / 100,
            orderStatus: "Processing",
          });
        } else {
          // Update status if needed
          order.paymentInfo = {
            ...order.paymentInfo,
            razorpay_payment_id,
            status: "paid",
          };
          await order.save();
        }
      }
    }

    // respond 200 to acknowledge webhook
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Webhook handling error");
  }
};
