// server/controllers/order/adminOrderController.js
import Order from "../../models/orderModel.js";

const STATUS_MAP = {
  PLACED: "Processing",
  PAID: "Processing",
  PACKED: "Processing",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const UI_TO_INTERNAL_STATUS = {
  Processing: "PAID",
  Shipped: "SHIPPED",
  "Out For Delivery": "OUT_FOR_DELIVERY",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
};

// GET /api/v1/orders/admin/orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ "paymentInfo.status": "paid" })
      .sort({ createdAt: -1 })
      .select("-__v");

    const formatted = orders.map((o) => ({
      _id: o._id,
      orderId: o.publicOrderId, // from virtual in model
      createdAt: o.createdAt,
      orderStatus: STATUS_MAP[o.orderStatus] || "Processing",
      totalAmount: o.totalAmount,
      paymentInfo: o.paymentInfo,
      invoiceUrl: o.invoicePath ? `uploads/invoices/${o._id}.pdf` : null,
      address: {
        name: o.buyer?.name || "",
        email: o.buyer?.email || "",
        phone: o.buyer?.phone || "",
        address: o.shippingInfo?.address || "",
        city: o.shippingInfo?.city || "",
        state: o.shippingInfo?.state || "",
        pincode: o.shippingInfo?.pincode || "",
      },
      items: (o.products || []).map((p) => ({
        _id: p.productId || p._id,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: p.quantity,
        size: p.size,
      })),
    }));

    return res.json({ success: true, orders: formatted });
  } catch (err) {
    console.error("ADMIN GET ORDERS ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load orders" });
  }
};

// GET /api/v1/orders/admin/order/:id
export const getSingleOrderAdmin = async (req, res) => {
  try {
    const o = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!o || o.paymentInfo?.status !== "paid") {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const order = {
      _id: o._id,
      orderId: o.publicOrderId,
      createdAt: o.createdAt,
      orderStatus: STATUS_MAP[o.orderStatus] || "Processing",
      totalAmount: o.totalAmount,
      paymentInfo: o.paymentInfo,
      invoiceUrl: o.invoicePath ? `uploads/invoices/${o._id}.pdf` : null,
      address: {
        name: o.buyer?.name || "",
        email: o.buyer?.email || "",
        phone: o.buyer?.phone || "",
        address: o.shippingInfo?.address || "",
        city: o.shippingInfo?.city || "",
        state: o.shippingInfo?.state || "",
        pincode: o.shippingInfo?.pincode || "",
      },
      items: (o.products || []).map((p) => ({
        _id: p.productId || p._id,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: p.quantity,
        size: p.size,
      })),
    };

    return res.json({ success: true, order });
  } catch (err) {
    console.error("ADMIN GET ORDER ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load order" });
  }
};

// PUT /api/v1/orders/admin/order-status/:id
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body; // UI status ("Processing", "Shipped", ...)

    if (!status || !UI_TO_INTERNAL_STATUS[status]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const internalStatus = UI_TO_INTERNAL_STATUS[status];
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.paymentInfo?.status !== "paid" && internalStatus !== "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cannot update status for unpaid order",
      });
    }

    order.orderStatus = internalStatus;
    await order.save();

    return res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    console.error("ADMIN UPDATE ORDER STATUS ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update order" });
  }
};
