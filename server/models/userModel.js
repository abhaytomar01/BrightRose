import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  phone: String,

  addresses: [
    {
      label: String,
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      default: { type: Boolean, default: false },
    }
  ],

  // ⭐ Added Wishlist
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
});

export default mongoose.model('User', userSchema);
