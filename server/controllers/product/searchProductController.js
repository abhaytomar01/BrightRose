// controllers/product/searchProductController.js
import productModel from "../../models/productModel.js";

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || keyword.trim() === "") {
      return res.status(200).json([]); // Return empty list if no keyword
    }

    // Use regex search (case-insensitive)
    const products = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
      ],
    }).select("name images price slug");

    return res.status(200).json(products);
  } catch (error) {
    console.error("Search Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error while searching for products",
      error: error.message,
    });
  }
};

export default searchProductController;