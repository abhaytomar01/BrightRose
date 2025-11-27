import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";

const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Parse JSON arrays
    let tags = [];
    try { tags = JSON.parse(req.body.tags || "[]"); } catch {}

    let oldImages = [];
    try { oldImages = JSON.parse(req.body.oldImages || "[]"); } catch {}

    let removedImages = [];
    try { removedImages = JSON.parse(req.body.removedImages || "[]"); } catch {}

    // Delete removed images from server
    removedImages.forEach((filename) => {
      const filePath = path.join(process.cwd(), "uploads/products", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // New uploads (multer)
    let newImages = [];
    if (req.files && req.files.images) {
      newImages = req.files.images.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      }));
    }

    // Final images
    product.images = [...oldImages, ...newImages];

    // Update fields
    Object.assign(product, {
      name: req.body.name,
      fabric: req.body.fabric,
      color: req.body.color,
      weavingArt: req.body.weavingArt,
      uniqueness: req.body.uniqueness,
      sizeInfo: req.body.sizeInfo,
      description: req.body.description,
      specification: req.body.specification,
      care: req.body.care,
      sku: req.body.sku,
      price: req.body.price,
      stock: req.body.stock,
      tags,
    });

    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export default updateProduct;
