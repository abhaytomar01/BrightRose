import productModel from "../../models/productModel.js";

const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("GET SINGLE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default getSingleProduct;
