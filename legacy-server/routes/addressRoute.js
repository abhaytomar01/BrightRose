import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../controllers/user/addressController.js";

const router = express.Router();

router.get("/", requireSignIn, getAddresses);
router.post("/", requireSignIn, addAddress);
router.put("/:addressId", requireSignIn, updateAddress);
router.delete("/:addressId", requireSignIn, deleteAddress);
router.put("/:addressId/default", requireSignIn, setDefaultAddress);

export default router;
