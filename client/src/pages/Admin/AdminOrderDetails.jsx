import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { authAdmin } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single order details
  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order/${id}`,
        {
          headers: { Authorization: `Bearer ${authAdmin.token}` },
        }
      );

      setOrder(res.data.order);
    } catch (error) {
      console.error("Order detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAdmin?.token) fetchOrder();
  }, [authAdmin?.token]);

  // Update order status
  const updateStatus = async (newStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${authAdmin.token}` },
        }
      );

      if (res.data.success) {
        fetchOrder();
      }
    } catch (err) {
      console.log("Status update failed:", err);
    }
  };

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10">Order not found.</p>;

  const { items, address, paymentInfo, orderStatus, createdAt, totalAmount, invoiceUrl } =
    order;

  return (
    <main className="px-4 sm:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Title */}
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
        <p className="text-sm text-gray-600">
          Ordered on: {new Date(createdAt).toLocaleString()}
        </p>

        {/* STATUS CONTROL */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Order Status</h2>

          <select
            className="px-4 py-2 border rounded focus:ring-[#AD000F] focus:outline-none"
            value={orderStatus}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Customer Details</h2>

          <p className="font-medium">{address?.name}</p>
          <p className="text-sm text-gray-600">{address?.email}</p>
          <p className="text-sm">{address?.phone}</p>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <p className="text-sm">
            {address?.address}, {address?.city}, {address?.state} -{" "}
            {address?.pincode}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-4">Items</h2>

          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i._id}
                className="flex gap-5 border rounded-lg p-3 bg-gray-50"
              >
                <img
                  src={i.image}
                  className="w-24 h-24 object-contain rounded"
                  draggable="false"
                />

                <div className="flex flex-col justify-between">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-gray-600">Size: {i.size}</p>
                  <p className="text-sm text-gray-600">Qty: {i.quantity}</p>
                  <p className="font-semibold text-gray-800 mt-2">
                    ₹{i.price * i.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT & AMOUNT */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Payment Summary</h2>

          <p className="text-sm">
            Payment Method:{" "}
            <span className="font-medium">
              {paymentInfo?.status === "paid"
                ? "Online (Paid)"
                : "Cash on Delivery"}
            </span>
          </p>

          <p className="text-sm mt-2">
            Payment ID:{" "}
            <span className="font-medium">
              {paymentInfo?.paymentId || "N/A"}
            </span>
          </p>

          <h3 className="text-xl font-semibold mt-4">
            Total Amount: ₹{totalAmount}
          </h3>
        </div>

        {/* INVOICE DOWNLOAD */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Invoice</h2>

          {invoiceUrl ? (
            <a
              className="text-[#AD000F] underline hover:text-black transition"
              href={`${import.meta.env.VITE_SERVER_URL}/${invoiceUrl}`}
              target="_blank"
            >
              Download Invoice PDF
            </a>
          ) : (
            <p className="text-sm text-gray-400">Invoice not generated.</p>
          )}
        </div>

      </div>
    </main>
  );
};

export default AdminOrderDetails;
