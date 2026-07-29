import path from "path";
import fs from "fs";

export const uploadImageController = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Build URL
    const fileUrl = `${process.env.CLIENT_URL}/uploads/products/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      message: "Image uploaded successfully",
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Local upload failed",
      error: error.message,
    });
  }
};
