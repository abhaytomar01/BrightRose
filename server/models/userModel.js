import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Production ID for CRUD
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }, // Renamed from addressLine
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true }); // Embed schema with own ID [web:15][web:20]

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  phone: String,
  addresses: [addressSchema], // Embedded 1-to-few [web:20]
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// Ensure only one default address
userSchema.pre('save', function(next) {
  if (this.addresses && this.addresses.some(a => a.isDefault)) {
    this.addresses = this.addresses.map(a => ({ ...a, isDefault: false }));
    const defaultAddr = this.addresses.find(a => a.isDefault);
    if (defaultAddr) defaultAddr.isDefault = true;
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model("User", userSchema);
