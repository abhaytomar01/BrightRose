import productModel from "../../models/productModel.js";

const findProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if productId is valid MongoDB ObjectId
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        errorType: "invalidId",
        message: "Invalid Product ID format",
      });
    }

    const response = await productModel.findById(productId);

    // If no product found
    if (!response) {
      return res.status(404).send({
        success: false,
        errorType: "productNotFound",
        message: "Product Not Found",
      });
    }

    // Success
    return res.status(200).send({
      success: true,
      message: "Product Fetched Successfully",
      product: response,
    });

  } catch (error) {
    console.log("Find Product Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Finding Product",
      error: error.message,
    });
  }
};

export default findProduct;
