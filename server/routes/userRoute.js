import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import getWishlist from "../controllers/user/getWishlist.js";
import updateWishlist from "../controllers/user/toggleWishlist.js";
import createSession from "../controllers/user/createSession.js";
import handleSuccess from "../controllers/user/handleSuccess.js";
import getOrders from "../controllers/user/getOrders.js";
import getOrderDetail from "../controllers/user/getOrderDetail.js";
import getAdminOrders from "../controllers/user/getAdminOrders.js"; 
import updateOrder from "../controllers/user/updateOrder.js";
import getAllUserOrder from "../controllers/user/getAllUserOrder.js";
import { 
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/user/addressController.js";

//router object
const router = express.Router();

//routing
//get Wishlist Items id
router.get("/wishlist", requireSignIn, getWishlist);

//update wishlist Items
router.post("/update-wishlist", requireSignIn, updateWishlist);

// get wishlist products
router.get("/wishlist-products", requireSignIn, getWishlist);


router.get("/addresses", requireSignIn, getAddresses);
router.post("/address", requireSignIn, addAddress);
router.put("/address/:addressId", requireSignIn, updateAddress);
router.delete("/address/:addressId", requireSignIn, deleteAddress);
router.put("/address/:addressId/default", requireSignIn, setDefaultAddress);

// checkout session - stripe payment
router.post("/create-checkout-session", createSession);
router.post("/payment-success", requireSignIn, handleSuccess);

// get user orders
router.get("/orders", requireSignIn, getOrders);
router.get("/order-detail", requireSignIn, getOrderDetail);

//get admin orders
router.get("/admin-orders", isAdmin, getAdminOrders);
router.get("/admin-order-detail", isAdmin, getOrderDetail);

//update order status
router.patch("/update/order-status", isAdmin, updateOrder);

//get all order and delete if possible
router.get("/get-all-order", requireSignIn, getAllUserOrder);
export default router;
