import { useAuth } from "../../context/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { GiCrossMark } from "react-icons/gi";

const AdminMenu = ({ toggleMenu }) => {
  const { authAdmin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-3">

      {/* PROFILE PREVIEW */}
      <div className="flex items-center gap-3 bg-white shadow p-3 relative">
        <img
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg"
          className="w-12"
        />
        <div>
          <p className="text-sm">Hello,</p>
          <p className="font-bold">{authAdmin?.user?.name || "Admin"}</p>
        </div>

        <GiCrossMark
          className="absolute right-4 top-4 sm:hidden cursor-pointer"
          onClick={toggleMenu}
        />
      </div>

      {/* LINKS */}
      <div className="bg-white shadow rounded flex flex-col">

        <NavLink to="./profile" className="admin-link">Profile</NavLink>
        <NavLink to="./all-products" className="admin-link">Products</NavLink>
        <NavLink to="./add-product" className="admin-link">Add Product</NavLink>
        <NavLink to="./users" className="admin-link">Users</NavLink>
        <NavLink to="./orders" className="admin-link">Orders</NavLink>

        <button
          onClick={handleLogout}
          className="admin-link text-red-600 hover:bg-red-100"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default AdminMenu;
