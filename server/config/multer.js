import multer from "multer";
import path from "path";
import fs from "fs";

// Correct upload folder path
const uploadPath = path.join(process.cwd(), "server", "uploads", "products");

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // 🔥 Save to server/uploads/products
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
