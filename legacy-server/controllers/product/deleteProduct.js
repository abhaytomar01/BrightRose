import productModel from "../../models/productModel.js";
import fs from "fs";
import path from "path";

const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // Delete images from server
    product.images.forEach((img) => {
      const filePath = path.join(process.cwd(), "server", "uploads", "products", img.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default deleteProduct;
