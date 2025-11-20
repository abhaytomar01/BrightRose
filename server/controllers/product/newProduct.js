import productModel from "../../models/productModel.js";
import cloudinary from "cloudinary";

const newProduct = async (req, res) => {
  try {
    // IMAGES ------------------------------
    const imageFiles = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];

    const uploadedImages = [];
    for (let img of imageFiles) {
      const result = await cloudinary.v2.uploader.upload(img, {
        folder: "products",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    // BRAND LOGO --------------------------
    const logoResult = await cloudinary.v2.uploader.upload(req.body.logo, {
      folder: "brands",
    });

    const brandDetails = {
      name: req.body.brandName,
      logo: {
        url: logoResult.secure_url,
        public_id: logoResult.public_id,
      },
    };

    // SPECIFICATIONS -----------------------
    const specs = req.body.specifications.map((s) => JSON.parse(s));

    // FINAL PRODUCT ------------------------
    const product = await productModel.create({
      ...req.body,
      images: uploadedImages,
      brand: brandDetails,
      specifications: specs,
      seller: req.user._id,
    });

    res.status(201).json({ success: true, product });

  } catch (error) {
    console.log("NEW PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: "Error creating product" });
  }
};

export default newProduct;
