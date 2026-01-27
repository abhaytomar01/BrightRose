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
        { headers: { Authorization: `Bearer ${token}` } }
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
    // eslint-disable-next-line
  }, [token]);

  // ✅ MUST be before any return
  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );

  const updateStatus = async (orderId, status) => {
    if (!token) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && res.data?.order) {
        setOrders((prev) =>
          prev.map((o) => (o._id === res.data.order._id ? res.data.order : o))
        );
      } else {
        fetchOrders();
      }
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">All Orders</h1>

      {safeOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {safeOrders.map((o) => (
            <div key={o._id} className="bg-white border rounded-lg shadow-md p-5">
              {/* Header */}
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {o.publicOrderId || o._id}
                  </p>
                  <p className="text-xs">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                <select
                  value={o.orderStatus}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border px-3 py-2 rounded text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items */}
              {(o.products || []).map((i, idx) => (
                <div
                  key={i._id || `${o._id}-${idx}`}
                  className="flex gap-4 border rounded p-3 mb-2"
                >
                  <img src={i.image} className="w-20 h-20 object-contain" />
                  <div>
                    <p className="font-medium">{i.name}</p>
                    {i.size && <p className="text-xs">Size: {i.size}</p>}
                    <p className="text-xs">Qty: {i.quantity}</p>
                    <p className="font-semibold">
                      ₹{i.price * i.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
