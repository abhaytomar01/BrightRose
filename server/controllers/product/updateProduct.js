import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

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
      oldImages,
      removedImages,
      images
    } = req.body;

    // Parse JSON strings
    if (typeof tags === "string") tags = JSON.parse(tags);
    if (!Array.isArray(tags)) tags = [];

    if (typeof oldImages === "string") oldImages = JSON.parse(oldImages);
    if (!Array.isArray(oldImages)) oldImages = [];

    if (typeof removedImages === "string") removedImages = JSON.parse(removedImages);
    if (!Array.isArray(removedImages)) removedImages = [];

    if (typeof images === "string") images = JSON.parse(images);
    if (!Array.isArray(images)) images = [];

    // Remove deleted images from cloudinary
    for (const id of removedImages) {
      await cloudinary.v2.uploader.destroy(id);
    }

    // Upload new images
    const newUploads = [];
    for (const img of images) {
      const upload = await cloudinary.v2.uploader.upload(img, {
        folder: "brightrose/products"
      });
      newUploads.push({
        url: upload.secure_url,
        public_id: upload.public_id
      });
    }

    // Final images array
    product.images = [...oldImages, ...newUploads];

    // Update fields
    product.name = name ?? product.name;
    product.fabric = fabric ?? product.fabric;
    product.color = color ?? product.color;
    product.weavingArt = weavingArt ?? product.weavingArt;
    product.uniqueness = uniqueness ?? product.uniqueness;
    product.sizeInfo = sizeInfo ?? product.sizeInfo;
    product.description = description ?? product.description;
    product.specification = specification ?? product.specification;
    product.care = care ?? product.care;
    product.sku = sku ?? product.sku;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    product.tags = tags;

    const updated = await product.save();

    return res.json({
      success: true,
      message: "Product updated",
      product: updated
    });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export default updateProduct;
