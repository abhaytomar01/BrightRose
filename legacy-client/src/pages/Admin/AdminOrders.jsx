// src/pages/Admin/AdminOrders.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
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

const STATUS_COLORS = {
  PLACED: "bg-blue-100 text-blue-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PACKED: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const { authAdmin } = useAuth();
  const token = authAdmin?.token;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

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

  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return safeOrders;
    return safeOrders.filter((o) => o.orderStatus === filter);
  }, [safeOrders, filter]);

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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">All Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{safeOrders.length} total orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["ALL", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition ${
                filter === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg">No orders found for this status.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredOrders.map((o) => {
            const addr = o.shippingInfo || o.address || {};
            const buyer = o.buyer || {};
            const statusColor = STATUS_COLORS[o.orderStatus] || "bg-gray-100 text-gray-600";

            return (
              <div key={o._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800">
                        #{o.publicOrderId || o._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                        {o.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-gray-900">
                      ₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}
                    </span>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition whitespace-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {/* Customer & Shipping Info */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Customer & Shipping
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-semibold text-gray-800">{buyer.name || addr.name || "—"}</p>
                      {buyer.email && (
                        <p className="text-gray-500 text-xs">{buyer.email}</p>
                      )}
                      {buyer.phone && (
                        <p className="text-gray-500 text-xs">📞 {buyer.phone}</p>
                      )}
                      <div className="pt-1 text-gray-600 text-xs leading-relaxed">
                        <p>{addr.address || "—"}</p>
                        <p>
                          {[addr.city, addr.state, addr.pincode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {addr.country && <p>{addr.country}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Items ({(o.products || []).length})
                    </p>
                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
                      {(o.products || []).map((i, idx) => (
                        <div
                          key={i._id || `${o._id}-${idx}`}
                          className="flex gap-3 items-center"
                        >
                          <img
                            src={i.image}
                            alt={i.name}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-800 truncate">{i.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              {i.size && <span className="bg-gray-100 px-1.5 py-0.5 rounded">Size: {i.size}</span>}
                              <span>Qty: {i.quantity}</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 mt-0.5">
                              ₹{Number(i.price * i.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
