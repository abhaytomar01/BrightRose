// server/controllers/product/updateProduct.js
import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /var/www/brightrose/server/uploads/products
const productsDir = path.join(__dirname, "..", "..", "uploads", "products");

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // -----------------------------
    // Parse images info from body
    // -----------------------------
    let oldImages = [];
    let removed = [];

    try {
      oldImages = JSON.parse(req.body.oldImages || "[]");
    } catch (e) {
      console.log("❌ Failed to parse oldImages:", e.message);
      oldImages = product.images || [];
    }

    try {
      removed = JSON.parse(req.body.removedImages || "[]");
    } catch (e) {
      console.log("❌ Failed to parse removedImages:", e.message);
      removed = [];
    }

    // -----------------------------
    // Delete removed images from disk
    // -----------------------------
    removed.forEach((filename) => {
      try {
        const filePath = path.join(productsDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("🗑 Deleted image:", filePath);
        }
      } catch (e) {
        console.log("⚠️ Failed to delete image:", filename, e.message);
      }
    });

    // -----------------------------
    // New uploads via multer
    // -----------------------------
    const newUploads =
      req.files?.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      })) || [];

    // Final images array
    product.images = [...oldImages, ...newUploads];

    // -----------------------------
    // Sizes
    // -----------------------------
    try {
      if (req.body.sizes) {
        const parsed = JSON.parse(req.body.sizes);
        if (Array.isArray(parsed)) {
          product.sizes = parsed;
        }
      }
    } catch (e) {
      console.log("Sizes parse failed — keeping old sizes");
    }

    // -----------------------------
    // Tags
    // -----------------------------
    try {
      if (req.body.tags) {
        const parsed = JSON.parse(req.body.tags);
        if (Array.isArray(parsed)) {
          product.tags = parsed;
        }
      }
    } catch (e) {
      console.log("Tags parse failed — keeping old tags");
    }

    // maxQuantity
    if (req.body.maxQuantity !== undefined) {
      product.maxQuantity = Number(req.body.maxQuantity) || product.maxQuantity;
    }

    // -----------------------------
    // Other simple fields
    // -----------------------------
    const allowedFields = [
      "name",
      "fabric",
      "color",
      "weavingArt",
      "uniqueness",
      "sizeInfo",
      "description",
      "specification",
      "care",
      "sku",
      "price",
      "stock",
      "brand",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();

    return res.json({ success: true, product: updated });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Product update failed" });
  }
};

export default updateProduct;
