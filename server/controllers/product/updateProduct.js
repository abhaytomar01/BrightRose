import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ----------------------------------------------------
    // REMOVE IMAGES
    // ----------------------------------------------------
    let removedImages = req.body.removedImages;

    if (typeof removedImages === "string") {
      removedImages = JSON.parse(removedImages);
    }

    if (Array.isArray(removedImages)) {
      for (let pid of removedImages) {
        await cloudinary.v2.uploader.destroy(pid);
      }
    }

    // ----------------------------------------------------
    // UPLOAD NEW IMAGES
    // ----------------------------------------------------
    let newUploadedImages = [];
    let newImages = req.body.images;

    if (typeof newImages === "string") {
      newImages = JSON.parse(newImages);
    }

    if (Array.isArray(newImages)) {
      for (let img of newImages) {
        const uploaded = await cloudinary.v2.uploader.upload(img, {
          folder: "brightrose/products",
        });

        newUploadedImages.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // ----------------------------------------------------
    // MERGE OLD IMAGES + NEW IMAGES
    // ----------------------------------------------------
    let oldImages = req.body.oldImages;

    if (typeof oldImages === "string") {
      oldImages = JSON.parse(oldImages);
    }

    const finalImages = [...(oldImages || []), ...newUploadedImages];

    // ----------------------------------------------------
    // UPDATE PRODUCT FIELDS (MATCHING SCHEMA)
    // ----------------------------------------------------
    const fields = [
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
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // TAGS
    let tags = req.body.tags;
    if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = tags.split(",").map((t) => t.trim());
      }
    }
    if (Array.isArray(tags)) {
      product.tags = tags;
    }

    // IMAGES
    product.images = finalImages;

    // ----------------------------------------------------
    // SAVE FINAL
    // ----------------------------------------------------
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export default updateProduct;
