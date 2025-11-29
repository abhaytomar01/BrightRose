import { useAuth } from "../../context/auth";
import { Link, NavLink } from "react-router-dom";
import { GiCrossMark } from "react-icons/gi";

const UserMenu = ({ closeMenu }) => {
  const { authUser, logoutUser } = useAuth();

  const baseLink =
    "px-5 py-3 text-[15px] text-gray-700 rounded-md transition-all tracking-wide";
  const activeLink = "bg-black text-white";

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg">
          👤
        </div>

        <div>
          <p className="text-gray-500 text-sm">Welcome</p>
          <p className="font-medium text-lg luxury-title">{authUser?.user?.name}</p>
        </div>

        {/* Close Mobile */}
        {closeMenu && (
          <button
            className="absolute right-0 top-0 text-xl text-gray-600 md:hidden"
            onClick={closeMenu}
          >
            <GiCrossMark />
          </button>
        )}
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">

        {/* Account Settings */}
        <div>
          <h3 className="luxury-title text-[15px] mb-2 text-gray-700">Account</h3>

          <div className="space-y-2">
            <NavLink
              to="./profile"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-200"}`
              }
            >
              Profile Information
            </NavLink>

            <NavLink
              to="./address"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-200"}`
              }
            >
              Manage Addresses
            </NavLink>
          </div>
        </div>

        {/* Dashboard Links */}
        <div>
          <h3 className="luxury-title text-[15px] mb-2 text-gray-700">Dashboard</h3>

          <div className="space-y-2">
            <NavLink
              to="/user/orders"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-200"}`
              }
            >
              My Orders
            </NavLink>

            <NavLink
              to="/user/wishlist"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-200"}`
              }
            >
              Wishlist
            </NavLink>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logoutUser}
          className="px-5 py-3 text-red-600 hover:bg-red-50 rounded-md text-[15px] tracking-wide"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
