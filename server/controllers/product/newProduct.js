import productModel from "../../models/productModel.js";

const newProduct = async (req, res) => {
  try {
    const uploaded = req.files?.map((file) => ({
      url: `/uploads/products/${file.filename}`,
      filename: file.filename,
    })) || [];

    const product = await productModel.create({
      ...req.body,
      tags: JSON.parse(req.body.tags || "[]"),
      images: uploaded,
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default newProduct;
