import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const oldImages = JSON.parse(req.body.oldImages || "[]");
    const removed = JSON.parse(req.body.removedImages || "[]");

    // REMOVE old images from server
    removed.forEach((filename) => {
      const filePath = path.join(process.cwd(), "server", "uploads", "products", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // ADD new images
    const newUploads = req.files?.map((file) => ({
      url: `/uploads/products/${file.filename}`,
      filename: file.filename,
    })) || [];

    product.images = [...oldImages, ...newUploads];

    product.tags = JSON.parse(req.body.tags || "[]");
    Object.assign(product, req.body);

    const updated = await product.save();

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default updateProduct;
