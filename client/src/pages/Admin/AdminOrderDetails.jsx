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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data.order || null);
    } catch (err) {
      console.error("Order detail error:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [token, id]);

  // ✅ MUST be before return
  const safeProducts = useMemo(
    () => (Array.isArray(order?.products) ? order.products : []),
    [order?.products]
  );

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10">Order not found.</p>;

  const {
    buyer,
    shippingInfo,
    paymentInfo,
    orderStatus,
    createdAt,
    totalAmount,
    shipment,
    publicOrderId,
  } = order;

  return (
    <main className="px-6 py-10">
      <h1 className="text-xl font-semibold mb-2">
        Order {publicOrderId || order._id}
      </h1>
      <p className="text-sm text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </p>

      {/* Items */}
      <div className="mt-6 space-y-4">
        {safeProducts.map((i, idx) => (
          <div
            key={i._id || `${order._id}-${idx}`}
            className="flex gap-4 border rounded p-4"
          >
            <img src={i.image} className="w-24 h-24 object-contain" />
            <div>
              <p className="font-medium">{i.name}</p>
              {i.size && <p className="text-sm">Size: {i.size}</p>}
              <p className="text-sm">Qty: {i.quantity}</p>
              <p className="font-semibold mt-1">
                ₹{i.price * i.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="mt-6">
        <p className="text-sm">
          Payment:{" "}
          <strong>
            {paymentInfo?.status === "paid" ? "Paid" : "COD"}
          </strong>
        </p>
        <p className="text-lg font-semibold mt-2">
          Total: ₹{totalAmount}
        </p>
      </div>

      {/* Shipment */}
      {shipment?.awb && (
        <div className="mt-6 border-t pt-4">
          <p className="text-sm">AWB: {shipment.awb}</p>
          {shipment.trackingUrl && (
            <a
              href={shipment.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Track Shipment
            </a>
          )}
        </div>
      )}
    </main>
  );
};

export default AdminOrderDetails;
