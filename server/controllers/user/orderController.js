import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { orderEmails } from "../../services/orderEmailService.js";   // <-- add this at top
import { createBluedartShipment } from "../../services/bluedartService.js";

/* ======================================================
    1️⃣ CREATE COD ORDER
====================================================== */

export const createCodOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount } = req.body;

    // 0️⃣ Pre-flight stock validation
    for (const item of cartItems) {
      const productId = item._id || item.productId;
      const product = await Product.findById(productId);
      if (!product) {
         return res.status(404).json({ success: false, message: `Product ${item.name} not found.` });
      }

      // Check per-size stock if size is provided
      if (item.size || item.selectedSize) {
        const size = item.selectedSize || item.size;
        const sizeStock = (product.sizeStock && product.sizeStock.get(size)) || 0;
        if (sizeStock < Number(item.quantity)) {
          return res.status(400).json({ 
            success: false, 
            message: `Insufficient stock for ${item.name} in size ${size}. Available: ${sizeStock}` 
          });
        }
      } else {
        // Fallback to total stock if no size is selected
        if ((product.stock || 0) < Number(item.quantity)) {
           return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}. Available: ${product.stock || 0}` });
        }
      }
    }

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

    // Deduct stock for COD
    for (const item of cartItems) {
      const productId = item._id || item.productId;
      const product = await Product.findById(productId);
      if (!product) continue;

      const qty = Number(item.quantity || 0);
      if (qty <= 0) continue;

      // Deduct total stock
      const newStock = (product.stock || 0) - qty;
      product.stock = newStock < 0 ? 0 : newStock;

      // Deduct per-size stock
      const size = item.selectedSize || item.size;
      if (size && product.sizeStock && product.sizeStock.has(size)) {
        const currentSizeStock = product.sizeStock.get(size) || 0;
        const newSizeStock = currentSizeStock - qty;
        product.sizeStock.set(size, newSizeStock < 0 ? 0 : newSizeStock);
      }

      await product.save();
    }

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
    const { status, message, location } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;

    // Push the history node manually so we can include message and location
    order.statusHistory.push({
      status: status,
      message: message || undefined,
      location: location || undefined,
      date: new Date(),
    });

    // ✅ When admin marks as SHIPPED, create Bluedart shipment if not already created
    if (status === "SHIPPED" && !order.shipment?.awb) {
      try {
        const shipment = await createBluedartShipment(order);
        order.shipment = shipment; // fills carrier, awb, labelUrl, trackingUrl, rawRequest, rawResponse
      } catch (e) {
        console.error("Bluedart shipment error:", e.message);
      }
    }

    await order.save();

    // Trigger emails based on new status
    switch (status) {
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

/* ======================================================
    6️⃣ ADMIN – ADD TRACKING UPDATE
====================================================== */

export const addTrackingUpdate = async (req, res) => {
  try {
    const { message, location, status } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Tracking message is required" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Default to the current order status if none provided
    const newStatus = status || order.orderStatus;

    // Push the tracking node
    order.statusHistory.push({
      status: newStatus,
      message,
      location: location || undefined,
      date: new Date(),
    });
    
    if (status && status !== order.orderStatus) {
       order.orderStatus = status;
    }

    await order.save();

    return res.json({
      success: true,
      message: "Tracking update added successfully",
      order,
    });
  } catch (err) {
    console.error("AddTrackingUpdate Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add tracking update",
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

/* ======================================================
    7️⃣ ADMIN – GENERATE MISSING INVOICE
====================================================== */
export const generateInvoiceForOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    
    const paths = await generateInvoicePDF(order);
    order.invoicePath = paths.relativePath;
    await order.save();
    
    return res.json({ success: true, message: "Invoice generated successfully", invoicePath: paths.relativePath });
  } catch (err) {
    console.error("Generate Invoice Error:", err);
    return res.status(500).json({ success: false, message: "Failed to generate invoice" });
  }
};

/* ======================================================
    8️⃣ USER – CANCEL ORDER
====================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (order.orderStatus !== "PLACED" && order.orderStatus !== "PAID") {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage." });
    }

    order.orderStatus = "CANCELLED";
    await order.save();
    await orderEmails.cancelled(order);

    return res.json({ success: true, message: "Order cancelled successfully." });
  } catch (err) {
    console.error("CancelOrder Error:", err);
    return res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};