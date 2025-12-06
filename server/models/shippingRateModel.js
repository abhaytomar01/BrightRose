// server/models/shippingRateModel.js
import mongoose from "mongoose";

const shippingRateSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true }, // "India" or ISO code
  type: { type: String, enum: ["flat", "zone"], default: "flat" },
  amount: { type: Number, default: 0 },
  minAmountFree: { type: Number, default: 0 }, // optional threshold
  meta: { type: Object, default: {} },
}, { timestamps: true });

export default mongoose.model("ShippingRate", shippingRateSchema);
