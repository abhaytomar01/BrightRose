import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import UserMenu from "./UserMenu";
import UserProfile from "../UserProfile";
import AddressComponent from "../AddressComponent";
import PanCardComponent from "../PanCardComponent";
import Deactivate from "../Auth/Deactivate";
import Reviews from "./Reviews";
import PaymentCards from "./PaymentCards";
import SeoData from "../../SEO/SeoData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Redirect to default profile page if user lands on /user/dashboard
  useEffect(() => {
    if (window.location.pathname === "/user/dashboard") {
      navigate("./profile");
    }
  }, [navigate]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <SeoData title="User Dashboard" />
      <div className="mt-32 md:mt-48 px-4 md:px-10">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Menu */}
          <div
            className={`${
              isMenuOpen
                ? "block absolute top-0 left-0 w-full h-full bg-white z-50 p-4"
                : "hidden md:block md:w-[30%]"
            }`}
          >
            <UserMenu toggleMenu={toggleMenu} />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-md rounded-md relative p-4">
            <button
              onClick={toggleMenu}
              className="md:hidden absolute top-4 right-4 text-blue-500 text-xl"
            >
              <GiHamburgerMenu />
            </button>

            <Routes>
              <Route path="profile" element={<UserProfile />} />
              <Route path="address" element={<AddressComponent />} />
              <Route path="pan" element={<PanCardComponent />} />
              <Route path="payment-cards" element={<PaymentCards />} />
              <Route path="user-review" element={<Reviews />} />
              <Route path="profile/deactivate" element={<Deactivate />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
