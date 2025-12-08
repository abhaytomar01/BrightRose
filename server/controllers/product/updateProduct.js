import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =========================================
    // 1️⃣ PARSE OLD IMAGES (from frontend)
    // =========================================
    let oldImages = [];
    try {
      oldImages = JSON.parse(req.body.oldImages || "[]").map((img) => ({
        filename: img.filename,
        url: img.url.startsWith("/")
          ? img.url
          : `/uploads/products/${img.filename}`, // FIXED always correct
      }));
    } catch (err) {
      console.log("❗ Failed parsing oldImages. Using empty array.");
      oldImages = [];
    }

    // =========================================
    // 2️⃣ REMOVE DELETED IMAGES
    // =========================================
    const removed = JSON.parse(req.body.removedImages || "[]");

    removed.forEach((filename) => {
      const filePath = path.join(
        process.cwd(),
        "server",
        "uploads",
        "products",
        filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // =========================================
    // 3️⃣ NEW UPLOADED IMAGES
    // =========================================
    const newUploads =
      req.files?.map((file) => ({
        filename: file.filename,
        url: `/uploads/products/${file.filename}`, // ⭐ ALWAYS CORRECT FORMAT
      })) || [];

    // =========================================
    // 4️⃣ FINAL IMAGES ARRAY
    // =========================================
    product.images = [...oldImages, ...newUploads];

    // =========================================
    // 5️⃣ PARSE ARRAYS (sizes, tags)
    // =========================================
    try {
      if (req.body.sizes) {
        product.sizes = JSON.parse(req.body.sizes);
      }
    } catch (err) {
      console.log("❗ Sizes parse failed — keeping old.");
    }

    try {
      if (req.body.tags) {
        product.tags = JSON.parse(req.body.tags);
      }
    } catch (err) {
      console.log("❗ Tags parse failed — keeping old.");
    }

    // =========================================
    // 6️⃣ maxQuantity
    // =========================================
    if (req.body.maxQuantity) {
      product.maxQuantity = Number(req.body.maxQuantity);
    }

    // =========================================
    // 7️⃣ Update simple fields
    // =========================================
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

    // =========================================
    // 8️⃣ SAVE PRODUCT
    // =========================================
    const updated = await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default updateProduct;
