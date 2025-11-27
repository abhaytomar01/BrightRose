import productModel from "../../models/productModel.js";
import fs from "fs-extra";
import path from "path";

/**
 * Expects multipart/form-data:
 * - fields: oldImages (JSON array of {url, filename}), removedImages (JSON array of filenames)
 * - files: images (new product images), logo (optional)
 *
 * Behavior:
 * - Deletes removedImages files from disk
 * - Saves new uploaded images and appends to existing oldImages
 * - Updates product fields and saves
 */

const PRODUCT_DIR = path.join(process.cwd(), "uploads", "products");
const BRANDS_DIR = path.join(process.cwd(), "uploads", "brands");

const deleteFileIfExists = async (filePath) => {
  try {
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
  } catch (err) {
    // log but don't break
    console.error("File delete error:", filePath, err.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // parse fields
    let {
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
      oldImages,
      removedImages,
    } = req.body;

    // parse JSON strings safely
    try { tags = tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : []; } catch { tags = []; }
    try { oldImages = oldImages ? (typeof oldImages === "string" ? JSON.parse(oldImages) : oldImages) : []; } catch { oldImages = []; }
    try { removedImages = removedImages ? (typeof removedImages === "string" ? JSON.parse(removedImages) : removedImages) : []; } catch { removedImages = []; }

    // Delete removed images from disk (removedImages should be array of filenames)
    if (Array.isArray(removedImages) && removedImages.length) {
      for (const filename of removedImages) {
        const p = path.join(PRODUCT_DIR, filename);
        await deleteFileIfExists(p);
      }
    }

    // new uploaded files
    const newFiles = (req.files && req.files["images"]) || [];
    const host = req.get("origin") || `${req.protocol}://${req.get("host")}`;

    const newUploads = newFiles.map((f) => ({
      url: `${host}/uploads/products/${f.filename}`,
      filename: f.filename,
    }));

    // Final images combine oldImages (those user kept) + newUploads
    const finalImages = Array.isArray(oldImages) ? [...oldImages, ...newUploads] : [...newUploads];

    // Handle logo update
    const logoFiles = (req.files && req.files["logo"]) || [];
    if (logoFiles.length) {
      // delete old logo file if exists
      const oldLogoFilename = product?.brand?.logo?.filename;
      if (oldLogoFilename) {
        await deleteFileIfExists(path.join(BRANDS_DIR, oldLogoFilename));
      }
      product.brand = {
        name: req.body.brandName || product.brand?.name || "",
        logo: {
          url: `${host}/uploads/brands/${logoFiles[0].filename}`,
          filename: logoFiles[0].filename,
        },
      };
    } else {
      // update brand name if provided
      if (req.body.brandName) {
        product.brand = {
          ...(product.brand || {}),
          name: req.body.brandName,
        };
      }
    }

    // Update fields
    product.images = finalImages;
    product.name = name ?? product.name;
    product.fabric = fabric ?? product.fabric;
    product.color = color ?? product.color;
    product.weavingArt = weavingArt ?? product.weavingArt;
    product.uniqueness = uniqueness ?? product.uniqueness;
    product.sizeInfo = sizeInfo ?? product.sizeInfo;
    product.description = description ?? product.description;
    product.specification = specification ?? product.specification;
    product.care = care ?? product.care;
    product.sku = sku ?? product.sku;
    product.price = price !== undefined ? Number(price) : product.price;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.tags = tags;

    const updated = await product.save();

    return res.json({ success: true, message: "Product updated successfully", product: updated });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export default updateProduct;
