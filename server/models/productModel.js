import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  fabric: { type: String, trim: true },
  color: { type: String, trim: true },
  weavingArt: { type: String, trim: true },
  uniqueness: { type: String, trim: true },
  sizeInfo: { type: String, trim: true },
  description: { type: String, trim: true },
  specification: { type: String, trim: true },
  care: { type: String, trim: true },
  images: { type: [String], default: [] }, 
  sku: { type: String, unique: false, sparse: true },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  tags: { type: [String], default: [] }
}, { timestamps: true });


export default mongoose.model("Product", productSchema);
