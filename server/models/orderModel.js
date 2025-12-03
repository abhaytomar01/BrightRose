import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  size: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    address: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentInfo: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      status: {
        type: String,
        enum: ["paid", "cod", "failed"],
        default: "paid",
      },
    },

    totalAmount: Number,

    orderStatus: {
      type: String,
      enum: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
