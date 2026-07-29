// server/models/orderModel.js
import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    carrier: { type: String, default: "BLUEDART" },
    awb: String,
    labelUrl: String,
    serviceType: String,
    mode: String,
    pickupDate: Date,
    trackingUrl: String,
    rawRequest: Object,
    rawResponse: Object,
  },
  { _id: false }
);

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
    
    shipment: ShipmentSchema, 

    // numeric sequence for BR-YYYY-XXXX
    sequence: { type: Number, default: 0 },

    invoicePath: String,

    statusHistory: [
      {
        status: String,
        message: String,
        location: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ===============================
// Add Status to History Automatically
// ===============================
OrderSchema.pre("save", async function (next) {
  // set sequence only once when order is first created
  if (this.isNew) {
    const last = await this.constructor
      .findOne({ sequence: { $gt: 0 } })
      .sort({ sequence: -1 })
      .select("sequence");
    const lastSeq = last?.sequence || 999; // first order => 1000
    this.sequence = lastSeq + 1;
  }

  // The caller might push to statusHistory manually.
  // We only auto-push if orderStatus changed AND it wasn't pushed manually
  // or if there's no history at all.
  if (this.isModified("orderStatus")) {
    const latestStatus = this.statusHistory.length > 0 ? this.statusHistory[this.statusHistory.length - 1].status : null;
    if (latestStatus !== this.orderStatus) {
      this.statusHistory.push({
        status: this.orderStatus,
        date: new Date(),
      });
    }
  }

  if (!this.statusHistory.length) {
    this.statusHistory.push({
      status: this.orderStatus,
      date: new Date(),
    });
  }

  next();
});

// ===============================
// Virtual public BR order id
// ===============================
OrderSchema.virtual("publicOrderId").get(function () {
  const year = this.createdAt
    ? this.createdAt.getFullYear()
    : new Date().getFullYear();
  const seq = this.sequence || 0;
  if (!seq) return `BR-${year}-${this._id.toString().slice(-6)}`;
  return `BR-${year}-${seq}`;
});

OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

export default mongoose.model("Order", OrderSchema);
