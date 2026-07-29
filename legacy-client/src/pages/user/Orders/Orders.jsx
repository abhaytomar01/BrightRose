// src/pages/user/orders/Orders.jsx
import { useEffect, useState, useMemo } from "react";
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
  const [orders, setOrders] = useState([]); // always array
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setOrders([]);
      return;
    }

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
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const fetchOrdersManual = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/my-orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders]
  );

  // Flatten orders → order lines, to search & render per product line
  const lines = useMemo(() => {
    return safeOrders.flatMap((order) =>
      (order.products || []).map((item, index) => ({
        order,
        item,
        key: `${order._id}-${item._id || index}`,
      }))
    );
  }, [safeOrders]);

  // Search filter on product name and status
  const filteredLines = useMemo(() => {
    let filtered = lines;

    if (activeTab !== "ALL") {
      filtered = filtered.filter((line) => {
        if (activeTab === "PROCESSING") {
          return ["PLACED", "PAID", "PACKED"].includes(line.order.orderStatus);
        }
        return line.order.orderStatus === activeTab;
      });
    }

    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((line) =>
      (line.item.name || "").toLowerCase().includes(q)
    );
  }, [lines, search, activeTab]);

  const tabs = [
    { id: "ALL", label: "All Orders" },
    { id: "PROCESSING", label: "Processing" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <>
      <SeoData title="My Orders | Bright Rose" />

      <main className="w-full px-4 sm:px-10 py-4 pt-28 md:pt-40 bg-[#F8F6F3] min-h-screen">
        <div className="flex w-full">
          {loading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-5 w-full">
              {/* Tabs & Search Container */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border rounded p-2 shadow-sm">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-colors ${
                        activeTab === tab.id
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <form className="flex items-center w-full md:w-auto bg-gray-50 border rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-black">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full md:w-64 px-4 py-2 text-sm bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    className="px-4 text-gray-500 hover:text-black transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Empty */}
              {filteredLines.length === 0 && (
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

              {/* Orders List (one card per ordered product) */}
              {filteredLines
                .map(({ order, item, key }) => (
                  <OrderItem key={key} order={order} item={item} fetchOrders={fetchOrdersManual} />
                ))
                .reverse()}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Orders;
