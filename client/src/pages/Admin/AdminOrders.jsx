import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useAuth } from "../../context/auth";

const AdminOrders = () => {
  const { authAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/orders`,
        {
          headers: { Authorization: `Bearer ${authAdmin.token}` }
        }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log("Admin orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authAdmin?.token) fetchOrders();
  }, [authAdmin?.token]);

  // Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/admin/order-status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${authAdmin.token}` } }
      );

      if (res.data.success) {
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

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white border rounded-lg shadow-md p-5"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold text-lg">{o._id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 md:mt-0">
                  <label className="text-sm font-medium">Update Status:</label>
                  <select
                    className="ml-2 px-3 py-2 border rounded"
                    value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Customer Details</p>
                <p className="text-sm mt-1">{o.address?.name}</p>
                <p className="text-sm">{o.address?.email}</p>
                <p className="text-sm">{o.address?.phone}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Address</p>
                <p className="text-sm mt-1">
                  {o.address?.address}, {o.address?.city}, {o.address?.state} -{" "}
                  {o.address?.pincode}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-4">
                  {o.items.map((i) => (
                    <div
                      key={i._id}
                      className="flex gap-4 border rounded p-3 bg-gray-50"
                    >
                      <img
                        src={i.image}
                        className="w-20 h-20 object-contain rounded"
                        draggable="false"
                      />
                      <div>
                        <p className="font-medium text-sm">{i.name}</p>
                        <p className="text-xs">Size: {i.size}</p>
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
                  <p className="font-medium">
                    {o.paymentInfo?.status === "paid"
                      ? "Paid (Online)"
                      : "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-lg">₹{o.totalAmount}</p>
                </div>
              </div>

              {/* Invoice Download */}
              <div className="mt-4">
                {o.invoiceUrl ? (
                  <a
                    href={`${import.meta.env.VITE_SERVER_URL}/${o.invoiceUrl}`}
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
