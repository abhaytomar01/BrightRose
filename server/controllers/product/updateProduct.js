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

    // PARSE images info
    const oldImages = JSON.parse(req.body.oldImages || "[]");
    const removed = JSON.parse(req.body.removedImages || "[]");

    // REMOVE old deleted images from server
    removed.forEach((filename) => {
      const filePath = path.join(process.cwd(), "server", "uploads", "products", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // ADD new uploaded images
    const newUploads =
      req.files?.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      })) || [];

    // SET new images array
    product.images = [...oldImages, ...newUploads];

    // PARSE sizes
    try {
      product.sizes = req.body.sizes ? JSON.parse(req.body.sizes) : product.sizes;
    } catch (err) {
      console.log("Sizes parse failed — keeping old sizes");
    }

    // PARSE tags
    try {
      product.tags = req.body.tags ? JSON.parse(req.body.tags) : product.tags;
    } catch (err) {
      console.log("Tags parse failed — keeping old tags");
    }

    // PARSE maxQuantity
    if (req.body.maxQuantity) {
      product.maxQuantity = Number(req.body.maxQuantity);
    }

    // UPDATE all other simple fields
    // Assign only fields that are NOT arrays or special fields
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
  "brand"
];

allowedFields.forEach((field) => {
  if (req.body[field] !== undefined) {
    product[field] = req.body[field];
  }
});


    const updated = await product.save();

    res.json({ success: true, product: updated });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default updateProduct;
