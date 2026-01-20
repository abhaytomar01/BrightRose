// src/pages/Admin/AdminOrders.jsx
import { useEffect, useState, useMemo } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
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

const AdminOrders = () => {
  const { authAdmin } = useAuth();
  const token = authAdmin?.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log("Admin orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const updateStatus = async (orderId, status) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.order) {
        const updated = res.data.order;
        setOrders((prev) =>
          prev.map((o) => (o._id === updated._id ? updated : o))
        );
      } else {
        // fallback: full refetch
        fetchOrders();
      }
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  if (loading) return <Spinner />;

  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">All Orders</h1>

      {safeOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {safeOrders.map((o) => (
            <div
              key={o._id}
              className="bg-white border rounded-lg shadow-md p-5"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-lg">
                    {o.publicOrderId || o._id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {o.buyer?.name} · {o.buyer?.phone}
                  </p>
                </div>

                <div className="mt-1 md:mt-0">
                  <label className="text-sm font-medium">
                    Update Status:
                  </label>
                  <select
                    className="ml-2 px-3 py-2 border rounded text-sm"
                    value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Customer Details</p>
                <p className="text-sm mt-1">{o.buyer?.name}</p>
                <p className="text-sm">{o.buyer?.email}</p>
                <p className="text-sm">{o.buyer?.phone}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Address</p>
                <p className="text-sm mt-1">
                  {o.shippingInfo?.address}, {o.shippingInfo?.city},{" "}
                  {o.shippingInfo?.state} - {o.shippingInfo?.pincode}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-4">
                  {(o.products || []).map((i, idx) => (
                    <div
                      key={i._id || `${o._id}-${idx}`}
                      className="flex gap-4 border rounded p-3 bg-gray-50"
                    >
                      <img
                        src={i.image}
                        className="w-20 h-20 object-contain rounded"
                        draggable="false"
                      />
                      <div>
                        <p className="font-medium text-sm">{i.name}</p>
                        {i.size && (
                          <p className="text-xs">Size: {i.size}</p>
                        )}
                        <p className="text-xs">Qty: {i.quantity}</p>
                        <p className="font-semibold mt-1">
                          ₹{i.price * i.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Total */}
              <div className="flex justify-between items-center mt-5 py-3 border-t">
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium text-sm">
                    {o.paymentInfo?.status === "paid"
                      ? "Paid (Online)"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₹{o.totalAmount}
                  </p>
                </div>
              </div>

              {/* Shipment (Bluedart) */}
              {o.shipment?.awb && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-sm text-gray-600">Shipment</p>
                  <p className="text-sm">
                    Carrier:{" "}
                    <span className="font-medium">
                      {o.shipment.carrier || "Bluedart"}
                    </span>
                  </p>
                  <p className="text-sm">
                    AWB:{" "}
                    <span className="font-medium">
                      {o.shipment.awb}
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    {o.shipment.trackingUrl && (
                      <a
                        href={o.shipment.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        Track on Bluedart
                      </a>
                    )}
                    {o.shipment.labelUrl && (
                      <a
                        href={`${import.meta.env.VITE_SERVER_URL}/${o.shipment.labelUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#AD000F] underline"
                      >
                        Download Shipping Label
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Invoice Download */}
              <div className="mt-4">
                {o.invoicePath ? (
                  <a
                    href={`${import.meta.env.VITE_SERVER_URL}/${o.invoicePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#AD000F] underline hover:text-black transition text-sm"
                  >
                    Download Invoice (PDF)
                  </a>
                ) : (
                  <p className="text-xs text-gray-500">
                    Invoice will be generated after order confirmation.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
