import productModel from "../../models/productModel.js";
import cloudinary from "../../config/cloudinary.js";


const newProduct = async (req, res) => {
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
      images
    } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "name, price & stock are required"
      });
    }

    // Parse JSON strings
    if (typeof tags === "string") tags = JSON.parse(tags);
    if (!Array.isArray(tags)) tags = [];

    if (typeof images === "string") images = JSON.parse(images);
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    // Upload images
    const uploadedImages = [];
    for (const img of images) {
      const upload = await cloudinary.v2.uploader.upload(img, {
        folder: "brightrose/products"
      });
      uploadedImages.push({
        url: upload.secure_url,
        public_id: upload.public_id
      });
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
      price,
      stock,
      tags,
      images: uploadedImages
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      product
    });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export default newProduct;
