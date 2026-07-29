// server/controllers/order/adminOrderController.js
import Order from "../../models/orderModel.js";

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ "paymentInfo.status": "paid" })
      .sort({ createdAt: -1 })
      .select("-__v");

    const formatted = orders.map((o) => ({
      _id: o._id,
      orderId: o.publicOrderId,
      createdAt: o.createdAt,
      orderStatus:
        o.orderStatus === "PAID"
          ? "Processing"
          : o.orderStatus === "SHIPPED"
          ? "Shipped"
          : o.orderStatus === "OUT_FOR_DELIVERY"
          ? "Out For Delivery"
          : o.orderStatus === "DELIVERED"
          ? "Delivered"
          : o.orderStatus === "CANCELLED"
          ? "Cancelled"
          : "Processing",
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
      shipment: o.shipment || null,
    }));

    return res.json({ success: true, orders: formatted });
  } catch (err) {
    console.error("AdminGetAllOrders Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load orders" });
  }
};
