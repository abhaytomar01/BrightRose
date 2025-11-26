import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useAuth } from "../../context/auth";

const AdminOrders = () => {
  const { authAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authAdmin?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/admin-orders`,
          {
            headers: { Authorization: `Bearer ${authAdmin.token}` }
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authAdmin?.token]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-3">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-gray-50 p-3 rounded shadow-sm">
              <p><strong>Order ID:</strong> {o._id}</p>
              <p><strong>Status:</strong> {o.orderStatus}</p>
              <p><strong>Amount:</strong> ₹{o.amount}</p>
              <p><strong>Buyer:</strong> {o.buyer?.name}</p>
              <p><strong>Products:</strong> {o.products?.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
