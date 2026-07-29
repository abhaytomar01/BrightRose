import { useAuth } from "../../context/auth";
import { NavLink } from "react-router-dom";
import { GiCrossMark } from "react-icons/gi";

const UserMenu = ({ closeMenu }) => {
  const { authUser, logoutUser } = useAuth();

  const baseLink =
    "w-full flex items-center px-4 py-3 text-[14px] rounded-lg transition-all text-gray-700";
  const activeLink = "bg-black text-white";

  return (
    <div className="w-full h-full flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-lg">
          👤
        </div>

        <div className="leading-tight">
          <p className="text-[12px] text-gray-500">Welcome</p>
          <p className="font-medium text-[16px] truncate max-w-[160px]">
            {authUser?.user?.name}
          </p>
        </div>

        {closeMenu && (
          <button
            onClick={closeMenu}
            className="absolute right-0 top-0 text-xl text-gray-600 md:hidden"
          >
            <GiCrossMark />
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="flex-1 space-y-8">

        {/* ACCOUNT */}
        <div>
          <h3 className="text-[12px] uppercase tracking-widest text-gray-400 mb-3">
            Account
          </h3>

          <div className="flex flex-col gap-2">
            <NavLink
              to="./profile"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-100"}`
              }
            >
              Profile Information
            </NavLink>

            <NavLink
              to="./address"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-100"}`
              }
            >
              Manage Addresses
            </NavLink>
          </div>
        </div>

        {/* DASHBOARD */}
        <div>
          <h3 className="text-[12px] uppercase tracking-widest text-gray-400 mb-3">
            Dashboard
          </h3>

          <div className="flex flex-col gap-2">
            <NavLink
              to="/user/orders"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-100"}`
              }
            >
              My Orders
            </NavLink>

            <NavLink
              to="/user/wishlist"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : "hover:bg-gray-100"}`
              }
            >
              Wishlist
            </NavLink>
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="pt-4 border-t">
        <button
          onClick={logoutUser}
          className="w-full text-left px-4 py-3 text-[14px] text-red-600 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
