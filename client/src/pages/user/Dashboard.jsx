import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import UserMenu from "./UserMenu";
import UserProfile from "../UserProfile";
import AddressComponent from "../AddressComponent";
import Deactivate from "../Auth/Deactivate";
import PaymentCards from "./PaymentCards";
import SeoData from "../../SEO/SeoData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/user/dashboard") {
      navigate("./profile");
    }
  }, [navigate]);

  return (
    <>
      <SeoData title="My Account – Bright Rose" />

      <div className="mt-32 md:mt-44 px-4 md:px-10">

        {/* Main Flex */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar (Luxury) */}
          <div
            className={`${isMenuOpen
                ? "fixed top-0 left-0 bg-white w-[80%] h-full z-50 shadow-xl p-6"
                : "hidden md:block md:w-[28%]"
              } transition-all duration-300`}
          >
            <UserMenu closeMenu={() => setIsMenuOpen(false)} />
          </div>

          {/* Content */}
          <div className="flex-1 bg-white shadow-lg rounded-xl p-6 relative">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden absolute top-4 right-4 text-black text-2xl"
            >
              <GiHamburgerMenu />
            </button>

            <Routes>
              <Route path="profile" element={<UserProfile />} />
              <Route path="address" element={<AddressComponent />} />
              <Route path="payment-cards" element={<PaymentCards />} />
              <Route path="profile/deactivate" element={<Deactivate />} />
            </Routes>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
