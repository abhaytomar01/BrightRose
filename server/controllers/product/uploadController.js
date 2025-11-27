import cloudinary from "../../config/cloudinary.js";


export const uploadImageController = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "brightrose/products",
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: "Image uploaded successfully",
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
