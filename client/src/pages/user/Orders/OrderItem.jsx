import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/auth";

const OrderItem = ({ order, item, fetchOrders }) => {
  const { authUser } = useAuth();
  const {
    _id,
    orderStatus,
    createdAt,
    totalAmount,
    invoicePath,
    publicOrderId,
  } = order;

  const [isCancelling, setIsCancelling] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
      case "PAID":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PACKED":
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "OUT_FOR_DELIVERY":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setIsCancelling(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/cancel/${_id}`,
        {},
        { headers: { Authorization: `Bearer ${authUser?.token}` } }
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        if (fetchOrders) fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };


  return (
    <div className="flex flex-col bg-white border rounded-lg shadow-sm hover:shadow-lg transition p-5">
      {/* Main Clickable Area (Link to Order Details) */}
      <Link
        to={`/user/orders/order_details/${_id}`}
        className="flex flex-col sm:flex-row items-start"
      >
        {/* Image */}
        <div className="w-full sm:w-28 h-20 mb-3 sm:mb-0">
          <img
            src={item?.image || "/fallback.jpg"}
            alt={item?.name}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>

        {/* Details */}
        <div className="flex justify-between w-full sm:px-5">
          <div className="flex flex-col">
            <p className="text-[11px] text-gray-500 mb-1">
              Order {publicOrderId || _id}
            </p>
            <p className="text-sm font-medium">{item?.name}</p>
            {item.size && (
              <p className="text-gray-500 text-xs">Size: {item.size}</p>
            )}
            <p className="text-gray-500 text-xs">
              Qty: {item.quantity}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">₹{totalAmount}</p>
            <p className="text-xs text-gray-600">
              Ordered: {new Date(createdAt).toDateString()}
            </p>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(orderStatus)}`}>
              {orderStatus?.replace(/_/g, " ")}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex justify-between items-center mt-4">
        {/* ⭐ Invoice Download Button */}
        {invoicePath ? (
          <a
            href={`${import.meta.env.VITE_SERVER_URL}/${invoicePath}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#AD000F] underline text-sm hover:text-black transition"
          >
            Download Invoice (PDF)
          </a>
        ) : (
          <p className="text-xs text-gray-500">
            Invoice will be available after order confirmation.
          </p>
        )}

        {/* Cancel Order Button */}
        {(orderStatus === "PLACED" || orderStatus === "PAID") && (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
