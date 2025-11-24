import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";

const newProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      warranty,
      brandName,
      logo,
      images,
      highlights,
      specifications,
    } = req.body;

    // ----------------------------------------
    // 🔍 BASIC VALIDATION
    // ----------------------------------------
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Required product fields missing",
      });
    }

    if (!logo) {
      return res.status(400).json({
        success: false,
        message: "Brand logo is required",
      });
    }

    // ----------------------------------------
    // 🔧 NORMALIZE IMAGES FIELD
    // ----------------------------------------
    // If images arrives as string (common with FormData)
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch {
        images = [images];
      }
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image required",
      });
    }

    // ----------------------------------------
    // 🔧 NORMALIZE HIGHLIGHTS
    // ----------------------------------------
    if (typeof highlights === "string") {
      try {
        highlights = JSON.parse(highlights);
      } catch {
        highlights = [highlights];
      }
    }
    if (!Array.isArray(highlights)) highlights = [];

    // ----------------------------------------
    // 🔧 NORMALIZE SPECIFICATIONS
    // ----------------------------------------
    if (typeof specifications === "string") {
      try {
        specifications = JSON.parse(specifications);
      } catch {
        specifications = [specifications];
      }
    }
    if (!Array.isArray(specifications)) specifications = [];

    // ----------------------------------------
    // 📤 UPLOAD LOGO (BASE64)
    // ----------------------------------------
    const logoUpload = await cloudinary.v2.uploader.upload(logo, {
      folder: "brands",
    });

    // ----------------------------------------
    // 📤 UPLOAD ALL PRODUCT IMAGES
    // ----------------------------------------
    const uploadedImages = [];
    for (const img of images) {
      const upload = await cloudinary.v2.uploader.upload(img, {
        folder: "products",
      });

      uploadedImages.push({
        url: upload.secure_url,
        public_id: upload.public_id,
      });
    }

    // ----------------------------------------
    // 🛒 CREATE PRODUCT ENTRY
    // ----------------------------------------
    const product = await productModel.create({
      name,
      description,
      price,
      discountPrice,
      category,
      stock,
      warranty,
      brand: {
        name: brandName,
        logo: {
          url: logoUpload.secure_url,
          public_id: logoUpload.public_id,
        },
      },
      images: uploadedImages,
      highlights,
      specifications,
      seller: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("❌ NEW PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export default newProduct;
