import cloudinary from "../config/cloudinary.js";

export const uploadImageController = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send({ success: false, message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "brightrose/products",
      }
    );

    res.status(200).send({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).send({ success: false, message: "Upload failed" });
  }
};
