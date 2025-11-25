import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/brightrose-logo.png";
import {
  Menu,
  X,
  Search,
  User,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../utils/apiClient";

const Header = () => {
  const [hideAnnouncement, setHideAnnouncement] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use our updated context (clean)
  const { authUser, authAdmin } = useAuth();

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/products/search/${encodeURIComponent(term)}`);
      setSearchResults(res.data.products || res.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(searchTerm), 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setHideAnnouncement(window.scrollY > 24);
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeEsc = (e) => e.key === "Escape" && setIsSearchOpen(false);
    window.addEventListener("keydown", closeEsc);
    return () => window.removeEventListener("keydown", closeEsc);
  }, []);

  // Correct logic:
  // Admin session → admin dashboard
  // User session → user dashboard
  // No session → admin login
  const accountLink = authAdmin?.token
    ? "/admin/dashboard/profile"
    : authUser?.token
    ? "/user/dashboard/profile"
    : "/admin/login";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled ? "backdrop-blur-sm bg-[#FCF7F1]" : "bg-transparent"
      }`}
    >
      {/* Announcement Bar */}
      <Link
        to="/contact"
        className={`
          block w-full text-center bg-[#F4EFE9] text-gray-800 
          text-[11px] md:text-[12px] tracking-wide font-medium uppercase 
          transition-all duration-500 ease-in-out cursor-pointer
          ${
            hideAnnouncement
              ? "opacity-0 h-0 py-0 pointer-events-none"
              : "opacity-100 py-2"
          }
        `}
      >
        For any customisation or personal assistance, contact us
      </Link>

      {/* Header */}
      <div className="grid grid-cols-3 items-center px-4 py-2 md:px-6 border-b">
        {/* Mobile menu */}
        <div className="flex items-center md:hidden">
          <button aria-label="menu" onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">Search</span>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center justify-center">
            <img className="w-24 md:w-28 h-16 object-contain" src={Logo} alt="Logo" />
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center justify-end gap-4">
          {/* Admin/User icon logic */}
          <Link to={accountLink} className="text-gray-700 hover:text-black">
            <User className="w-5 h-5" />
          </Link>

          <Link to="/cart" className="text-gray-700 hover:text-black">
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center space-x-8 text-[12px] uppercase text-black font-semibold py-2 relative">
        <Link to="/" className="hover:text-[#AD000F] transition">
          Home
        </Link>
        <Link to="/ourheritage" className="hover:text-[#AD000F] transition">
          Our Heritage
        </Link>

        {/* Dropdown */}
        <div
          className="relative group"
          onMouseEnter={() => setIsSubmenuVisible(true)}
          onMouseLeave={() => setIsSubmenuVisible(false)}
        >
          <button
            className="cursor-default flex items-center gap-1 focus:outline-none uppercase"
            onClick={(e) => e.preventDefault()}
          >
            COLLECTIONS
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                isSubmenuVisible
                  ? "rotate-180 text-[#AD000F]"
                  : "group-hover:text-[#AD000F]"
              }`}
            />
          </button>

          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-md py-3 px-4 min-w-[220px] border border-gray-100 z-50 transition-all duration-200 ${
              isSubmenuVisible ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <ul className="space-y-2 text-sm font-medium text-gray-700">
              <li>
                <Link to="/weavecollection" className="block hover:text-[#AD000F]">
                  WEAVES
                </Link>
              </li>
              <li>
                <Link to="/stylecollection" className="block hover:text-[#AD000F]">
                  STYLE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Link to="/products" className="hover:text-[#AD000F] transition">
          Shop
        </Link>

        {/* USER Login / My Account (NOT ADMIN) */}
        {!authUser?.token ? (
          <Link to="/login" className="hover:text-[#AD000F] transition">
            Login
          </Link>
        ) : (
          <Link to="/user/dashboard" className="hover:text-[#AD000F] transition">
            My Account
          </Link>
        )}

        <Link to="/contact" className="hover:text-[#AD000F] transition">
          Contact
        </Link>
      </nav>

      {/* search + mobile menu remains unchanged */}
    </header>
  );
};

export default Header;
