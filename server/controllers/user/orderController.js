import Order from "../../models/orderModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { orderEmails } from "../../services/orderEmailService.js";   // <-- add this at top


/* ======================================================
    1️⃣ CREATE COD ORDER
====================================================== */

export const createCodOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount } = req.body;

    const newOrder = await Order.create({
      user: req.user?._id || null,

      buyer: {
        name: address?.name,
        email: address?.email,
        phone: address?.phone,
      },

      products: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        size: item.selectedSize,
      })),

      shippingInfo: {
        address: address?.address,
        city: address?.city,
        state: address?.state,
        pincode: address?.pincode,
        country: "India",
      },

      subtotal: totalAmount,
      totalAmount,
      paymentInfo: { status: "cod", provider: "cod" },
      orderStatus: "PLACED",
    });

    await orderEmails.placed(newOrder);

    res.json({
      success: true,
      message: "COD Order Created",
      order: newOrder,
    });

  } catch (err) {
    console.log("COD Order Error:", err);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};




/* ======================================================
    2️⃣ GET ALL ORDERS OF LOGGED-IN USER
====================================================== */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.log("GetUserOrders Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};


/* ======================================================
    3️⃣ GET SINGLE ORDER BY ID (User Only)
====================================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent users from accessing others’ orders
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.json({ success: true, order });

  } catch (err) {
    console.log("GetOrderById Error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to fetch order details",
    });
  }
};


/* ======================================================
    4️⃣ ADMIN – GET ALL ORDERS
====================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.log("AdminGetAllOrders Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load orders",
    });
  }
};


/* ======================================================
    5️⃣ ADMIN – UPDATE ORDER STATUS
====================================================== */


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    switch (status) {
      case "PACKED":
        await orderEmails.packed(order);
        break;

      case "SHIPPED":
        await orderEmails.shipped(order);
        break;

      case "OUT_FOR_DELIVERY":
        await orderEmails.outForDelivery(order);
        break;

      case "DELIVERED":
        await orderEmails.delivered(order);
        break;

      case "CANCELLED":
        await orderEmails.cancelled(order);
        break;
    }

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (err) {
    console.error("UpdateStatus Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};


export const getOrderByIdAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // return full order to admin
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("GetOrderByIdAdmin Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};