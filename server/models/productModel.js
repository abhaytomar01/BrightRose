import mongoose from "mongoose";
import slugify from "slugify";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    fabric: String,
    color: String,
    weavingArt: String,          // Ex: "Kanchipuram", "Banarasi Silk"
    weavingSlug: String,         // auto generated → "kanchipuram"

    uniqueness: String,
    sizeInfo: String,
    description: String,
    specification: String,
    care: String,
    sku: String,

    price: Number,
    stock: Number,

    tags: { type: [String], default: [] },
    tagSlugs: { type: [String], default: [] }, // For style filter future

    sizes: {
      type: [String],
      default: ["XS", "S", "M", "L", "XL", "XXL"]
    },

    maxQuantity: { type: Number, default: 10 },

    images: { type: [imageSchema], default: [] },

    brand: {
      name: String,
      logo: imageSchema
    }
  },
  { timestamps: true }
);

/* =====================================================
    AUTO CREATE SLUGS BEFORE SAVE
===================================================== */
productSchema.pre("save", function (next) {
  // Weave slug
  if (this.weavingArt) {
    this.weavingSlug = slugify(this.weavingArt, { lower: true });
  }

  // Tag slugs (future Style Filter etc.)
  if (this.tags && this.tags.length > 0) {
    this.tagSlugs = this.tags.map(t =>
      slugify(t, { lower: true })
    );
  }

  next();
});

export default mongoose.model("Product", productSchema);
