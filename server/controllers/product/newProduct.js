import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";

// -----------------------------
// CREATE NEW PRODUCT
// -----------------------------
const newProduct = async (req, res) => {
  try {
    // 1️⃣ Upload product images using req.files
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploaded = await cloudinary.v2.uploader.upload(file.path, {
          folder: "products",
        });

        uploadedImages.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // 2️⃣ Parse specifications (if sent as JSON strings)
    let specs = [];
    if (req.body.specifications) {
      specs = JSON.parse(req.body.specifications);
    }

    // 3️⃣ Create product in DB
    const product = await productModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      color: req.body.color,
      fabric: req.body.fabric,
      weavingArt: req.body.weavingArt,
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
      images: uploadedImages,
      seller: req.user._id,
      specifications: specs,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("❌ NEW PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};

export default newProduct;
