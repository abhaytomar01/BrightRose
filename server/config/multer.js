// config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs-extra";

// ensure upload folders exist
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const PRODUCTS_DIR = path.join(UPLOAD_ROOT, "products");
const BRANDS_DIR = path.join(UPLOAD_ROOT, "brands");

fs.ensureDirSync(PRODUCTS_DIR);
fs.ensureDirSync(BRANDS_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use folder depending on fieldname
    if (file.fieldname === "logo") cb(null, BRANDS_DIR);
    else cb(null, PRODUCTS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per file

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 20,
  },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = (file.mimetype || "").toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});
