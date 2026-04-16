// server/models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    category: { type: String, default: "" },

    // For filtering:
    weavingSlug: { type: String, index: true },          // e.g. "kanchipuram"
    tagSlugs: { type: [String], default: [], index: true }, // e.g. ["saree", "dresses"]

    brandName: { type: String, default: "" },
    logo: { type: String, default: "" },

    images: [
      {
        filename: String,
        url: String,
      },
    ],

    // Missing fields that were being discarded:
    fabric: { type: String, default: "" },
    weavingArt: { type: String, default: "" },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    care: { type: String, default: "" },
    specification: { type: String, default: "" },
    maxQuantity: { type: Number, default: 10 },

    specifications: {
      type: [String], // storing as JSON strings as you already do
      default: [],
    },

    // ✅ IMPORTANT: match your DB structure
    sizes: { type: [String], default: [] },  // e.g. ["XS","S","M","L"]
    color: { type: String, default: "" },    // e.g. "Red & Gold"

    // If you don't actually use this, you can remove it later.
    size: { type: String, default: "" },     // legacy / optional
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);
export default productModel;
