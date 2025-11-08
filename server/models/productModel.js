import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },

  // Optional highlights (not required in your DB)
  highlights: {
    type: [String],
    default: [],
  },

  // Optional specifications (array of objects)
  specifications: {
    type: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    default: [],
  },

  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter offer price"],
  },

  images: [
    {
      public_id: { type: String },
      url: { type: String, required: true },
    },
  ],

  brand: {
    name: { type: String },
    logo: {
      public_id: { type: String },
      url: { type: String },
    },
  },

  category: {
    type: String,
    required: [true, "Please enter product category"],
  },

  weave: {
    type: String,
    default: "",
  },

  color: {
    type: String,
    default: "Assorted",
  },

  size: {
    type: [String],
    default: [],
  },

  stock: {
    type: Number,
    default: 1,
  },

  warranty: {
    type: Number,
    default: 1,
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: String,
      rating: Number,
      comment: String,
    },
  ],

  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
