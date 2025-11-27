import productModel from "../../models/productModel.js";
import cloudinary from "../../config/cloudinary.js";

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
      brandName
    } = req.body;

    // Parse JSON
    oldImages = JSON.parse(oldImages || "[]");
    removedImages = JSON.parse(removedImages || "[]");
    tags = JSON.parse(tags || "[]");

    // Delete removed files from Cloudinary
    for (const public_id of removedImages) {
      try {
        await cloudinary.uploader.destroy(public_id);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

    // Upload new images (req.files.images)
    const newUploads = [];
    if (req.files?.images && req.files.images.length > 0) {
      for (const img of req.files.images) {
        const upload = await cloudinary.uploader.upload(img.path, {
          folder: "brightrose/products",
        });

        newUploads.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
    }

    // Upload logo (if provided)
    let logo = product.brand?.logo || null;
    if (req.files?.logo && req.files.logo[0]) {
      const upload = await cloudinary.uploader.upload(req.files.logo[0].path, {
        folder: "brightrose/brand",
      });
      logo = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };
    }

    // Update product
    product.name = name;
    product.fabric = fabric;
    product.color = color;
    product.weavingArt = weavingArt;
    product.uniqueness = uniqueness;
    product.sizeInfo = sizeInfo;
    product.description = description;
    product.specification = specification;
    product.care = care;
    product.sku = sku;
    product.price = price;
    product.stock = stock;
    product.tags = tags;

    product.images = [...oldImages, ...newUploads];

    product.brand = { name: brandName, logo };

    const updated = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
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
