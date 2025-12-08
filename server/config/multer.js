// server/config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root = /var/www/brightrose/server/uploads
const uploadsRoot = path.join(__dirname, "..", "uploads");
const productsDir = path.join(uploadsRoot, "products");

// Ensure directory exists
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log("✅ Created products upload dir:", productsDir);
} else {
  console.log("✅ Using products upload dir:", productsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productsDir); // ✅ ALWAYS /server/uploads/products
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 10,
  },
});
