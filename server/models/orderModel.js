const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

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

    subtotal: Number,
    shippingCharge: Number,
    tax: Number,
    totalAmount: Number,

    paymentInfo: {
      provider: String,
      orderId: String,
      paymentId: String,
      signature: String,
      status: {
        type: String,
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

// automatically push status history
OrderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({ status: this.orderStatus });
  }
  next();
});
