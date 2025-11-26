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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      navigate("/admin/dashboard/profile", { replace: true });
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <SeoData title="Admin Dashboard" />

      <div className="pt-24 md:pt-36 pb-4 min-h-screen bg-[#f5f5f5]">
        <div className="flex relative w-full">

          {/* LEFT SIDEBAR */}
          <div
            className={`
              fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 
              transform transition-transform duration-300
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
              sm:static sm:translate-x-0 sm:w-1/4 sm:block
            `}
          >
            <AdminMenu toggleMenu={toggleMenu} />
          </div>

          {/* OVERLAY (MOBILE ONLY) */}
          {isMenuOpen && (
            <div
              onClick={toggleMenu}
              className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
            ></div>
          )}

          {/* RIGHT CONTENT PANEL */}
          <div className="w-full sm:w-3/4 px-2 sm:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden text-2xl mb-3 mt-2"
            >
              <GiHamburgerMenu />
            </button>

            <div className="bg-white shadow rounded-lg p-3 sm:p-6 min-h-[75vh]">
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
      </div>
    </>
  );
};

export default AdminDashboard;
