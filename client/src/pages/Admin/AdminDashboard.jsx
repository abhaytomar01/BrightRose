import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import Users from "./Users";
import EditProduct from "./EditProduct";
import AdminOrders from "./AdminOrders";
import SeoData from "../../SEO/SeoData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      navigate("/admin/dashboard/profile", { replace: true });
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen((p) => !p);

  return (
    <>
      <SeoData title="Admin Dashboard" />

      <div className="pt-28 md:pt-32 min-h-screen bg-gray-100">
        <div className="flex gap-5 px-2 sm:px-10">

          {/* LEFT MENU */}
          <div
            className={`sm:w-[30%] ${
              isMenuOpen ? "block w-full bg-white z-50" : "hidden sm:block"
            }`}
          >
            <AdminMenu toggleMenu={toggleMenu} />
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full sm:w-[70%] bg-white shadow-md rounded-sm p-2">
            <button
              onClick={toggleMenu}
              className="sm:hidden text-black text-xl p-2"
            >
              {isMenuOpen ? "Close" : <GiHamburgerMenu />}
            </button>

            <Routes>
              <Route path="profile" element={<AdminProfile />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="add-product" element={<CreateProduct />} />
              <Route path="product/:productId" element={<EditProduct />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<AdminOrders />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
