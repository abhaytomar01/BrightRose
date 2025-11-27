import productModel from "../../models/productModel.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("GET ALL PRODUCTS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default getAllProducts;
