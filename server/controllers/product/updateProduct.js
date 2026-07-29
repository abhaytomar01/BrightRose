// server/controllers/product/updateProduct.js
import productModel from "../../models/productModel.js";

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    console.log("UPDATE BODY:", req.body.weavingSlug, req.body.tagSlugs);

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
    // Delete removed images (Cloudinary)
    // -----------------------------
    // TODO: Implement Cloudinary deletion for `removed` array if needed.
    // For now, we skip local fs.unlinkSync.

    // -----------------------------
    // New uploads via multer
    // -----------------------------
    const newUploads =
      req.files?.map((file) => ({
        url: file.path,
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
    // Size Stock
    // -----------------------------
    try {
      if (req.body.sizeStock) {
        const parsed = JSON.parse(req.body.sizeStock);
        if (typeof parsed === "object" && parsed !== null) {
          product.sizeStock = parsed;
        }
      }
    } catch (e) {
      console.log("Size Stock parse failed — keeping old sizeStock");
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
    // NEW: Weave / Style slugs
    // -----------------------------
    if (typeof req.body.weavingSlug === "string") {
      product.weavingSlug = req.body.weavingSlug.trim();
    }

    if (req.body.tagSlugs) {
      try {
        const parsed = JSON.parse(req.body.tagSlugs);
        if (Array.isArray(parsed)) {
          product.tagSlugs = parsed;
        }
      } catch (e) {
        console.log("tagSlugs parse failed — keeping old tagSlugs");
      }
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
      if (req.body[field] !== undefined && req.body[field] !== "") {
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
