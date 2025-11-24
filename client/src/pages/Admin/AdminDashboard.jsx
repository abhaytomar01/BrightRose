import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import AdminMenu from "./AdminMenu";
import AdminProfile from "./AdminProfile";       // ✅ NEW admin profile
import CreateProduct from "./CreateProduct";
import AllProducts from "./AllProducts";
import Users from "./Users";
import EditProduct from "./EditProduct";
import SeoData from "../../SEO/SeoData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FIX: redirect only once on root admin dashboard
  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      navigate("/admin/dashboard/profile", { replace: true });
    }
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <>
      <SeoData title="Admin Dashboard" />

      <div className="py-[5px] pt-28 md:pt-32 h-full">
        <div className="flex items-start justify-between text-[14px] h-full px-2 sm:px-[50px] py-2 sm:py-[40px] gap-5">

          {/* LEFT MENU */}
          <div
            className={`sm:w-[30%] ${
              isMenuOpen
                ? "relative w-full h-full bg-white z-50"
                : "hidden sm:block"
            }`}
          >
            <AdminMenu toggleMenu={toggleMenu} />
          </div>

          {/* RIGHT PANEL */}
          <div className={`w-full sm:w-[70%] bg-white h-full shadow-md rounded-sm`}>
            <button
              onClick={toggleMenu}
              className="sm:hidden text-blue-400 underline rounded px-2 text-lg py-2"
            >
              {isMenuOpen ? "Close" : <GiHamburgerMenu />}
            </button>

            <Routes>
              <Route path="profile" element={<AdminProfile />} />
              <Route path="add-product" element={<CreateProduct />} />
              <Route path="all-products" element={<AllProducts />} />
              <Route path="users" element={<Users />} />
              <Route path="product/:productId" element={<EditProduct />} />
            </Routes>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
