import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";
import fs from "fs-extra";

/* ----------------------------------------------------
   Helper: Upload file from disk to cloudinary
------------------------------------------------------ */
const uploadToCloudinary = async (filePath, folder = "products") => {
  const res = await cloudinary.v2.uploader.upload(filePath, {
    folder,
    use_filename: true,
  });
  return { url: res.secure_url, public_id: res.public_id };
};

/* ----------------------------------------------------
   CREATE PRODUCT  (POST /new-product)
------------------------------------------------------ */
export const newProduct = async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    if (!name || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required.",
      });
    }

    // Parse tags (JSON or CSV)
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) parsedTags = [];
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }

    // Upload product images
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.path, "products");
        images.push(uploaded);
        await fs.remove(file.path);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "At least 1 product image is required.",
      });
    }

    // Create product
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
      images,
      price: Number(price),
      stock: Number(stock),
      tags: parsedTags,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
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

/* ----------------------------------------------------
   UPDATE PRODUCT (PATCH /update/:productId)
------------------------------------------------------ */
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

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

    // Parse arrays
    const parsedOldImages = oldImages ? JSON.parse(oldImages) : [];
    const parsedRemovedImages = removedImages ? JSON.parse(removedImages) : [];

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) parsedTags = [];
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }

    // Delete removed images from cloudinary
    for (const pid of parsedRemovedImages) {
      try {
        await cloudinary.v2.uploader.destroy(pid);
      } catch (err) {
        console.warn("Failed to delete image:", pid);
      }
    }

    // Upload new images
    const newImages = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await uploadToCloudinary(file.path, "products");
        newImages.push(uploaded);
        await fs.remove(file.path);
      }
    }

    // Final images
    const finalImages = [...parsedOldImages, ...newImages];

    const updated = await productModel.findByIdAndUpdate(
      productId,
      {
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
        images: finalImages,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: err.message,
    });
  }
};
