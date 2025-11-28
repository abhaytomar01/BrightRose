import productModel from "../../models/productModel.js";

const newProduct = async (req, res) => {
  try {
    // ---------------------------
    // PARSE SIZES
    // ---------------------------
    let sizes = [];
    try {
      sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
    } catch (err) {
      sizes = [];
    }

    // ---------------------------
    // PARSE TAGS
    // ---------------------------
    let tags = [];
    try {
      tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    } catch (err) {
      tags = [];
    }

    // ---------------------------
    // MAX QUANTITY
    // ---------------------------
    const maxQuantity = req.body.maxQuantity
      ? Number(req.body.maxQuantity)
      : 1;

    // ---------------------------
    // IMAGES
    // ---------------------------
    const uploaded =
      req.files?.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        filename: file.filename,
      })) || [];

    // ---------------------------
    // SAFE FIELDS (whitelist)
    // ---------------------------
    const allowedFields = [
      "name",
      "fabric",
      "color",
      "weavingArt",
      "uniqueness",
      "sizeInfo",
      "description",
      "specification",
      "care",
      "sku",
      "price",
      "stock",
      "brand",
      "category"
    ];

    let data = {};

    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) {
        data[f] = req.body[f];
      }
    });

    // assign safe parsed fields
    data.sizes = sizes;
    data.tags = tags;
    data.maxQuantity = maxQuantity;
    data.images = uploaded;

    // ---------------------------
    // CREATE PRODUCT
    // ---------------------------
    const product = await productModel.create(data);

    res.json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default newProduct;
