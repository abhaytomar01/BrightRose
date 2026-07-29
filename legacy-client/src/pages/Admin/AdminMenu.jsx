// src/pages/Admin/AdminMenu.jsx

import { useAuth } from "../../context/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import { GiCrossMark } from "react-icons/gi";

const AdminMenu = ({ toggleMenu }) => {
  const { authAdmin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block px-5 py-3 text-[15px] rounded 
    ${isActive ? "bg-blue-100 font-semibold text-blue-800" : "text-gray-700"}
    hover:bg-gray-100`;

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="relative p-5 border-b flex items-center gap-4 bg-white">
        <img
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg"
          alt="user"
          className="w-12"
        />
        <div>
          <p className="text-sm text-gray-600">Hello,</p>
          <p className="font-semibold text-[16px] capitalize">
            {authAdmin?.user?.name || "Admin"}
          </p>
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={toggleMenu}
          className="absolute right-3 top-3 text-xl sm:hidden"
        >
          <GiCrossMark />
        </button>
      </div>

      {/* Scrollable Menu Items */}
      <div className="overflow-y-auto flex-1 px-3 py-4">

        <p className="flex items-center gap-2 text-gray-500 text-sm mb-1 px-2">
          <PersonIcon fontSize="small" /> ACCOUNT
        </p>

        <NavLink to="./profile" className={linkClass}>
          Profile
        </NavLink>

        <p className="flex items-center gap-2 text-gray-500 text-sm mb-1 mt-4 px-2">
          <BarChartIcon fontSize="small" /> MANAGEMENT
        </p>

        <NavLink to="./all-products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="./add-product" className={linkClass}>
          Add Product
        </NavLink>

        <NavLink to="./users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="./orders" className={linkClass}>
          Orders
        </NavLink>
      </div>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 font-semibold"
        >
          <PowerSettingsNewIcon />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminMenu;
