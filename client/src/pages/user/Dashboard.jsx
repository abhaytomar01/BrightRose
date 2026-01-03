import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import UserMenu from "./UserMenu";
import UserProfile from "../UserProfile";
import AddressComponent from "./AddressComponents";
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

          {/* Mobile Overlay */}
{isMenuOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40 md:hidden"
    onClick={() => setIsMenuOpen(false)}
  />
)}

{/* Sidebar */}
<div
  className={`
    fixed md:static top-0 left-0 h-full md:h-auto
    bg-white z-50 md:z-auto
    w-[80%] md:w-[28%]
    transform transition-transform duration-300
    ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    p-6 shadow-xl md:shadow-none
  `}
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
