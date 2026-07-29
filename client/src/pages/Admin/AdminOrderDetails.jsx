// src/pages/Admin/AdminOrderDetails.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import Tracker from "../user/Orders/Tracker";

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
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(false);

  // Status update form
  const [newStatus, setNewStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusLocation, setStatusLocation] = useState("");

  // Tracking update form (separate – pushes a note without changing status)
  const [trackMessage, setTrackMessage] = useState("");
  const [trackLocation, setTrackLocation] = useState("");

  const fetchOrder = async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetched = res.data.order || null;
      setOrder(fetched);
      if (fetched) setNewStatus(fetched.orderStatus);
    } catch (err) {
      console.error("Order detail error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [token, id]);

  const safeProducts = useMemo(
    () => (Array.isArray(order?.products) ? order.products : []),
    [order?.products]
  );

  // ─── Update main order status ────────────────────────────────────
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) return toast.error("Please select a status");
    setUpdatingStatus(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${id}`,
        { status: newStatus, message: statusMessage || undefined, location: statusLocation || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        setStatusMessage("");
        setStatusLocation("");
        await fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ─── Push a custom tracking note ─────────────────────────────────
  const handleAddTrackingUpdate = async (e) => {
    e.preventDefault();
    if (!trackMessage.trim()) return toast.error("Message is required");
    setAddingUpdate(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${id}/tracking`,
        { message: trackMessage, location: trackLocation || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Tracking update posted!");
        setTrackMessage("");
        setTrackLocation("");
        await fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post update");
    } finally {
      setAddingUpdate(false);
    }
  };

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10 text-gray-600">Order not found.</p>;

  const {
    buyer,
    shippingInfo,
    paymentInfo,
    orderStatus,
    statusHistory,
    createdAt,
    totalAmount,
    shipment,
    publicOrderId,
    products,
    invoicePath,
  } = order;

  return (
    <main className="px-4 md:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order Reference</p>
            <p className="text-2xl font-bold text-gray-900">{publicOrderId || order._id}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(createdAt).toLocaleString("en-IN")}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${orderStatus === "DELIVERED" ? "bg-green-100 text-green-700" :
              orderStatus === "CANCELLED" ? "bg-red-100 text-red-700" :
                orderStatus === "SHIPPED" || orderStatus === "OUT_FOR_DELIVERY" ? "bg-indigo-100 text-indigo-700" :
                  "bg-blue-100 text-blue-700"
              }`}>
              {orderStatus?.replace(/_/g, " ")}
            </span>
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${paymentInfo?.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}>
              {paymentInfo?.status === "paid" ? "✓ Paid" : paymentInfo?.status?.toUpperCase() || "Pending"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Items */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {safeProducts.map((item, idx) => (
                  <div key={item._id || idx} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-lg border border-gray-100" alt={item.name} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{item.name}</p>
                      {item.size && <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-lg text-gray-900">₹{totalAmount?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* ── Order Timeline ─────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow p-6">
              <Tracker statusHistory={statusHistory} currentStatus={orderStatus} orderOn={createdAt} />
              {shipment?.awb && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">AWB: <span className="font-mono">{shipment.awb}</span></p>
                  {shipment.trackingUrl && (
                    <a href={shipment.trackingUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">
                      🚚 Open Carrier Tracking
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Delivery Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-3">Delivery Info</h2>
              <p className="font-medium text-sm">{buyer?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{buyer?.email}</p>
              <p className="text-xs text-gray-500">{buyer?.phone}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {shippingInfo?.address},<br />
                  {shippingInfo?.city}, {shippingInfo?.state} – {shippingInfo?.pincode}
                </p>
              </div>

              {/* ⭐ Invoice Download for Admin */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {invoicePath ? (
                  <a
                    href={`${import.meta.env.VITE_SERVER_URL}/${invoicePath.match(/uploads[/\\]invoices[/\\][^/\\]+$/) ? invoicePath.match(/uploads[/\\]invoices[/\\][^/\\]+$/)[0].replace(/\\/g, '/') : invoicePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    📄 Download Invoice (PDF)
                  </a>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    No invoice generated yet.
                  </p>
                )}
              </div>
            </div>

            {/* ── Update Status Form ─────────────────────────────── */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Update Order Status</h2>
              <form onSubmit={handleStatusUpdate} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Note (optional)</label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="e.g. Ready to dispatch"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Location (optional)</label>
                  <input
                    type="text"
                    value={statusLocation}
                    onChange={(e) => setStatusLocation(e.target.value)}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {updatingStatus ? "Updating…" : "Update Status"}
                </button>
              </form>
            </div>

            {/* ── Add Tracking Note Form ──────────────────────────── */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-800 mb-1">Add Tracking Note</h2>
              <p className="text-xs text-gray-500 mb-4">Push a custom update to the customer's timeline without changing the order status.</p>
              <form onSubmit={handleAddTrackingUpdate} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={trackMessage}
                    onChange={(e) => setTrackMessage(e.target.value)}
                    rows={3}
                    placeholder="e.g. Package has reached Bangalore sorting hub"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Location (optional)</label>
                  <input
                    type="text"
                    value={trackLocation}
                    onChange={(e) => setTrackLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, KA"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingUpdate}
                  className="w-full bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {addingUpdate ? "Posting…" : "📍 Post Tracking Update"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminOrderDetails;
