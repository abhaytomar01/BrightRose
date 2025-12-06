// server/models/orderModel.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  size: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    buyer: {
      name: String,
      email: String,
      phone: String,
    },
    products: [OrderItemSchema],
    shippingInfo: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    subtotal: { type: Number, default: 0 },       // product total (GST inclusive as per your setup)
    shippingCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },             // extracted GST part if needed
    totalAmount: { type: Number, default: 0 },     // subtotal + shipping
    paymentInfo: {
      provider: { type: String },
      paymentId: { type: String },
      orderId: { type: String },
      signature: { type: String },
      status: { type: String },
    },
    invoicePath: { type: String },
    orderStatus: { type: String, default: "Processing" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
