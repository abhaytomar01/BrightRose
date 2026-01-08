// server/models/orderModel.js
import mongoose from "mongoose";

// ===============================
// Order Item Schema
// ===============================
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  size: { type: String },
});

// ===============================
// Main Order Schema
// ===============================
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // allow guest checkout too
    },

    buyer: {
      name: String,
      email: String,
      phone: String,
    },

    // will map from cartItems
    products: [OrderItemSchema],

    shippingInfo: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },

    subtotal: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    // aligned with Razorpay fields
    paymentInfo: {
      provider: { type: String, default: "razorpay" },
      orderId: String,      // razorpay_order_id
      paymentId: String,    // razorpay_payment_id
      signature: String,    // razorpay_signature
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "PAID",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

    invoicePath: String,

    statusHistory: [
      {
        status: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ===============================
// Add Status to History Automatically
// ===============================
OrderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      date: new Date(),
    });
  }

  if (!this.statusHistory.length) {
    this.statusHistory.push({
      status: this.orderStatus,
      date: new Date(),
    });
  }

  next();
});

export default mongoose.model("Order", OrderSchema);
