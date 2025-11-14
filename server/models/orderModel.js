import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  discountPrice: Number,
  qty: Number,
  image: String,
  selectedColor: String,
  selectedSize: String,
});
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  shippingAddress: {
    name: String, phone: String, address: String, city: String, state: String, pincode: String
  },
  paymentMethod: { type: String, enum: ['razorpay','cod','stripe'], default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  amount: Number, tax: Number, shipping: Number, discount: Number, grandTotal: Number,
  status: { type: String, enum: ['created','processing','shipped','delivered','cancelled'], default: 'created' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Order', orderSchema);
