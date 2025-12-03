import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderItem from "./OrderItem";
import Spinner from "../../../components/Spinner";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import SeoData from "../../../SEO/SeoData";
import { Search } from "lucide-react";

const Orders = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Search filter
  const filteredOrders = orders.filter((o) =>
    o.items.some((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <SeoData title="My Orders | Bright Rose" />

      <main className="w-full px-4 sm:px-10 py-4 pt-28 md:pt-40 bg-[#F8F6F3] min-h-screen">
        <div className="flex w-full">
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-5 w-full">

              {/* Search */}
              <form className="flex items-center w-full sm:w-9/12 bg-white border rounded shadow-sm">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your orders..."
                  className="flex-1 p-3 text-sm outline-none"
                />
                <button
                  type="button"
                  className="px-5 bg-black text-white flex items-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
              </form>

              {/* Empty */}
              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center bg-white p-10 rounded shadow">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1376/1376786.png"
                    className="w-24 opacity-80"
                    draggable="false"
                  />
                  <p className="mt-4 text-xl font-medium">No Orders Found</p>
                  <Link
                    to="/products"
                    className="mt-4 bg-black text-white px-5 py-2 rounded"
                  >
                    Shop Now
                  </Link>
                </div>
              )}

              {/* Orders List */}
              {filteredOrders
                .map((order) =>
                  order.items.map((item, index) => (
                    <OrderItem key={index} order={order} item={item} />
                  ))
                )
                .reverse()}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Orders;
