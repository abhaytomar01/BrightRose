import productModel from "../../models/productModel.js";

const newProduct = async (req, res) => {
  try {
    // PARSE sizes
    let sizes = [];
    try {
      sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
    } catch (err) {
      sizes = [];
    }

    // PARSE tags
    let tags = [];
    try {
      tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    } catch (err) {
      tags = [];
    }

    // CONVERT maxQuantity to number
    const maxQuantity = req.body.maxQuantity
      ? Number(req.body.maxQuantity)
      : 1;

    // Uploaded images
    const uploaded =
      req.files?.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      })) || [];

    const product = await productModel.create({
      ...req.body,
      sizes,
      tags,
      maxQuantity,
      images: uploaded,
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default newProduct;
