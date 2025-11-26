// src/pages/Admin/AdminDashboard.jsx

import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import Users from "./Users";
import EditProduct from "./EditProduct";
import SeoData from "../../SEO/SeoData";
import AdminOrders from "./AdminOrders";
import AdminLayout from "../../layouts/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      navigate("/admin/dashboard/profile", { replace: true });
    }
  }, [location.pathname]);

  return (
    <>
      <SeoData title="Admin Dashboard" />

      <AdminLayout>
        <div className="flex relative w-full">

          {/* SIDEBAR */}
          <div
            className={`
              fixed top-[90px] left-0 h-[calc(100vh-90px)] w-64 bg-white shadow-lg z-50 
              transform transition-transform duration-300
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
              sm:static sm:translate-x-0 sm:w-64 sm:h-auto
            `}
          >
            <AdminMenu toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          </div>

          {/* OVERLAY */}
          {isMenuOpen && (
            <div
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
            ></div>
          )}

          {/* RIGHT PANEL */}
          <div className="w-full sm:pl-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="sm:hidden text-2xl mb-4 ml-1"
            >
              <GiHamburgerMenu />
            </button>

            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 min-h-[70vh]">
              <Routes>
                <Route path="profile" element={<AdminProfile />} />
                <Route path="add-product" element={<CreateProduct />} />
                <Route path="all-products" element={<AllProducts />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="product/:productId" element={<EditProduct />} />
              </Routes>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
