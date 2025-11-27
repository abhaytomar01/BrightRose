import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js"; // <-- new

import newProduct from "../controllers/product/newProduct.js";
import updateProduct from "../controllers/product/updateProduct.js";
// ... other imports

const router = express.Router();

/* Create new product (multipart) */
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "logo", maxCount: 1 },
  ]),
  newProduct
);

/* Update product (multipart) */
router.patch(
  "/update/:id",
  requireSignIn,
  isAdmin,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "logo", maxCount: 1 },
  ]),
  updateProduct
);
