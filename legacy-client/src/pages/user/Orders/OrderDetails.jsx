import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import Spinner from "../../../components/Spinner";
import MinCategory from "../../../components/MinCategory";
import SeoData from "../../../SEO/SeoData";
import Tracker from "./Tracker";

const OrderDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/order/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data.order);
      } catch (err) {
        console.error("Order details error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token, id]);

  if (loading) return <Spinner />;
  if (!order) return <p className="p-10">Order not found.</p>;

  const {
    products,
    shippingInfo,
    buyer,
    totalAmount,
    orderStatus,
    statusHistory,
    createdAt,
    invoicePath,
    publicOrderId,
    shipment, // ⬅️ comes from orderModel
  } = order;

  return (
    <>
      <SeoData title="Order Details | Bright Rose" />
      <MinCategory />

      <main className="px-4 sm:px-10 py-10 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Reference</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{publicOrderId || `#${id}`}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 mb-1">{new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                orderStatus === 'SHIPPED' || orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-indigo-100 text-indigo-700' :
                'bg-blue-100 text-blue-700'
              }`}>{orderStatus?.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Address Block */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

            <p className="font-medium">{buyer?.name}</p>
            <p className="text-sm text-gray-600">{buyer?.email}</p>

            <p className="text-sm">
              {shippingInfo?.address}, {shippingInfo?.city},{" "}
              {shippingInfo?.state} - {shippingInfo?.pincode}
            </p>

            <p className="text-sm mt-1">Phone: {buyer?.phone}</p>

            {/* ⭐ Invoice Download */}
            <div className="mt-4">
              {invoicePath ? (
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/${invoicePath.match(/uploads[/\\]invoices[/\\][^/\\]+$/) ? invoicePath.match(/uploads[/\\]invoices[/\\][^/\\]+$/)[0].replace(/\\/g, '/') : invoicePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#AD000F] underline text-sm hover:text-black transition"
                >
                  Download Invoice (PDF)
                </a>
              ) : (
                <p className="text-xs text-gray-500">
                  Invoice will be available once the order is processed.
                </p>
              )}
            </div>

            {/* ⭐ Shipping tracking + label */}
            <div className="mt-4 space-y-1 text-sm">
              {shipment?.trackingUrl && (
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#AD000F] underline hover:text-black transition block"
                >
                  Track Shipment
                </a>
              )}

              {shipment?.labelUrl && (
                <a
                  href={shipment.labelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#AD000F] underline hover:text-black transition block"
                >
                  Download Shipping Label
                </a>
              )}

              {shipment?.awb && (
                <p className="text-xs text-gray-600">
                  AWB: {shipment.awb}
                </p>
              )}
            </div>

            {/* Order amount summary */}
            <div className="mt-4 text-sm">
              <p className="font-medium">Order Total: ₹{totalAmount}</p>
            </div>
          </div>

          {/* Items */}
          {products?.map((item) => (
            <div
              key={item._id || `${item.productId}-${item.size}`}
              className="bg-white rounded shadow p-6 flex gap-5"
            >
              <img
                src={item.image}
                className="w-28 h-28 object-contain"
                draggable="false"
                alt={item.name}
              />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                {item.size && (
                  <p className="text-xs text-gray-600">
                    Size: {item.size}
                  </p>
                )}
                <p className="text-xs text-gray-600">
                  Qty: {item.quantity}
                </p>
                <p className="font-semibold mt-2">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            </div>
          ))}

          {/* Order Tracker */}
          <div className="bg-white rounded-lg shadow p-6">
            <Tracker
              statusHistory={statusHistory}
              currentStatus={orderStatus}
              orderOn={createdAt}
            />

            {/* Live courier tracking link */}
            {shipment?.trackingUrl && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <a
                  href={shipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition"
                >
                  🚚 Track Shipment (Carrier)
                </a>
                {shipment.awb && (
                  <p className="text-xs text-gray-500 mt-2">AWB: {shipment.awb}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderDetails;
