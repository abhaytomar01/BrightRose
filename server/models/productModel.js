import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },     // Example: /uploads/products/abc.jpg
  filename: { type: String, required: true } // Example: abc.jpg
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fabric: String,
    color: String,
    weavingArt: String,
    uniqueness: String,
    sizeInfo: String,
    description: String,
    specification: String,
    care: String,
    sku: String,
    price: Number,
    stock: Number,
    tags: { type: [String], default: [] },

    images: {
      type: [imageSchema],
      default: []
    },

    brand: {
      name: String,
      logo: imageSchema
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
