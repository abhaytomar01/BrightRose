// src/pages/Admin/AdminOrderDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";

const STATUS_OPTIONS = [
  "PLACED",
  "PAID",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { authAdmin } = useAuth();
  const token = authAdmin?.token;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(res.data.order || null);
    } catch (error) {
      console.error("Order detail error:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  const updateStatus = async (newStatus) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success && res.data.order) {
        setOrder(res.data.order);
      } else {
        fetchOrder();
      }
    } catch (err) {
      console.log("Status update failed:", err);
    }
  };

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10">Order not found.</p>;

  const safeProducts = useMemo(
    () => (Array.isArray(order.products) ? order.products : []),
    [order.products]
  );

  const {
    buyer,
    shippingInfo,
    paymentInfo,
    orderStatus,
    createdAt,
    totalAmount,
    invoicePath,
    shipment,
    publicOrderId,
  } = order;

  return (
    <main className="px-4 sm:px-10 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <p className="text-sm text-gray-500">
          Order ID: {publicOrderId || order._id}
        </p>
        <p className="text-sm text-gray-600">
          Ordered on: {new Date(createdAt).toLocaleString()}
        </p>

        {/* STATUS CONTROL */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Order Status</h2>

          <select
            className="px-4 py-2 border rounded focus:ring-[#AD000F] focus:outline-none text-sm"
            value={orderStatus}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Customer Details</h2>

          <p className="font-medium">{buyer?.name}</p>
          <p className="text-sm text-gray-600">{buyer?.email}</p>
          <p className="text-sm">{buyer?.phone}</p>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <p className="text-sm">
            {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.state} - {shippingInfo?.pincode}
          </p>
        </div>

        {/* ITEMS */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-4">Items</h2>

          <div className="space-y-4">
            {safeProducts.map((i, idx) => (
              <div
                key={i._id || `${order._id}-${idx}`}
                className="flex gap-5 border rounded-lg p-3 bg-gray-50"
              >
                <img
                  src={i.image}
                  className="w-24 h-24 object-contain rounded"
                  draggable="false"
                />

                <div className="flex flex-col justify-between">
                  <p className="font-medium">{i.name}</p>
                  {i.size && (
                    <p className="text-sm text-gray-600">
                      Size: {i.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Qty: {i.quantity}
                  </p>
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

        {/* SHIPMENT (BLUEDART) */}
        {shipment?.awb && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="font-semibold mb-3">Shipment</h2>
            <p className="text-sm">
              Carrier:{" "}
              <span className="font-medium">
                {shipment.carrier || "Bluedart"}
              </span>
            </p>
            <p className="text-sm">
              AWB: <span className="font-medium">{shipment.awb}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              {shipment.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Track on Bluedart
                </a>
              )}
              {shipment.labelUrl && (
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/${shipment.labelUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#AD000F] underline"
                >
                  Download Shipping Label
                </a>
              )}
            </div>
          </div>
        )}

        {/* INVOICE DOWNLOAD */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="font-semibold mb-3">Invoice</h2>

          {invoicePath ? (
            <a
              className="text-[#AD000F] underline hover:text-black transition"
              href={`${import.meta.env.VITE_SERVER_URL}/${invoicePath}`}
              target="_blank"
              rel="noreferrer"
            >
              Download Invoice PDF
            </a>
          ) : (
            <p className="text-sm text-gray-400">
              Invoice not generated.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;
