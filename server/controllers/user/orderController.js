import Order from "../../models/orderModel.js";
import { generateInvoice } from "../../utils/invoiceGenerator.js";
import { sendEmail } from "../../utils/sendEmail.js";

/* ======================================================
    1️⃣ CREATE COD ORDER
====================================================== */

export const createCodOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount } = req.body;

    const newOrder = await Order.create({
      user: req.user._id,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
        size: item.selectedSize,
      })),
      address,
      totalAmount,
      paymentInfo: { status: "cod" },
      orderStatus: "Processing",
    });

    // Generate PDF Invoice
    const { invoiceId, invoicePath } = await generateInvoice(newOrder);

    newOrder.invoiceId = invoiceId;
    newOrder.invoiceUrl = invoicePath;
    await newOrder.save();

    // Send Email to Customer
    await sendEmail(
      address.email,
      "Your Bright Rose Order Confirmation",
      "Your order is confirmed.",
      `
        <h2>Thank you for your purchase!</h2>
        <p>Your order <strong>${newOrder._id}</strong> is confirmed.</p>
        <p>Download your invoice below:</p>
        <a href="${process.env.SERVER_URL}/${invoicePath}" target="_blank">
          Download Invoice
        </a>
      `,
      [
        {
          filename: `${invoiceId}.pdf`,
          path: invoicePath,
        },
      ]
    );

    res.json({
      success: true,
      message: "COD Order Created + Invoice emailed",
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

    const validStatuses = [
      "Processing",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    return res.json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (err) {
    console.log("UpdateStatus Error:", err);
    res.status(500).json({
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