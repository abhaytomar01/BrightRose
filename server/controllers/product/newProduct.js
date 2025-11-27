import productModel from "../../models/productModel.js";

const newProduct = async (req, res) => {
  try {
    const {
      name, fabric, color, weavingArt,
      uniqueness, sizeInfo, description,
      specification, care, sku, price,
      stock, tags
    } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "name, price & stock are required"
      });
    }

    let finalTags = [];
    try {
      finalTags = JSON.parse(tags || "[]");
    } catch {
      finalTags = [];
    }

    // FILES (multer)
    let imageFiles = [];
    if (req.files && req.files.images) {
      imageFiles = req.files.images.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      }));
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
      tags: finalTags,
      images: imageFiles,
    });

    return res.status(201).json({
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

export default newProduct;
