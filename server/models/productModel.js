// server/models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    category: { type: String, default: "" },

    // For filtering:
    weavingSlug: { type: String, index: true },      // e.g. "kanchipuram"
    tagSlugs: { type: [String], default: [], index: true }, // e.g. ["saree", "dresses"]

    brandName: { type: String, default: "" },
    logo: { type: String, default: "" },

    images: [
      {
        filename: String,
        url: String,
      },
    ],

    specifications: {
      type: [String], // storing as JSON strings as you already do
      default: [],
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
