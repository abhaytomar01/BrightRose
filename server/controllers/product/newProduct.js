import productModel from "../../models/productModel.js";
import fs from "fs-extra";
import path from "path";

/**
 * Expects multipart/form-data with:
 * - fields for product (name, price, etc.)
 * - files: images (multiple), logo (single)
 *
 * Images are saved to /uploads/products and logo to /uploads/brands
 * Product.images will be [{ url, filename }]
 */

const newProduct = async (req, res) => {
  try {
    // req.body contains text fields
    const {
      name,
      fabric,
      color,
      weavingArt,
      uniqueness,
      sizeInfo,
      description,
      specification,
      care,
      sku,
      price,
      stock,
      tags,
    } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ success: false, message: "name, price & stock are required" });
    }

    // parse tags if sent as string
    let parsedTags = [];
    try {
      if (tags) parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      if (!Array.isArray(parsedTags)) parsedTags = [];
    } catch {
      parsedTags = [];
    }

    // files are in req.files (multer)
    // images: req.files['images'] (array)
    // logo: req.files['logo'] (array with 1)
    const imagesFiles = (req.files && req.files["images"]) || [];
    const logoFiles = (req.files && req.files["logo"]) || [];

    if (!imagesFiles.length) {
      return res.status(400).json({ success: false, message: "At least one product image is required" });
    }

    // Build uploaded images array (public URLs)
    const host = req.get("origin") || `${req.protocol}://${req.get("host")}`; // prefer origin
    const uploadedImages = imagesFiles.map((f) => ({
      url: `${host}/uploads/products/${f.filename}`,
      filename: f.filename,
    }));

    let brandObj = null;
    if (logoFiles.length) {
      const lf = logoFiles[0];
      brandObj = {
        name: req.body.brandName || "",
        logo: {
          url: `${host}/uploads/brands/${lf.filename}`,
          filename: lf.filename,
        },
      };
    }

    const product = await productModel.create({
      name,
      fabric,
      color,
      weavingArt,
      uniqueness,
      sizeInfo,
      description,
      specification,
      care,
      sku,
      price: Number(price),
      stock: Number(stock),
      tags: parsedTags,
      images: uploadedImages,
      brand: brandObj,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export default newProduct;
