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
import axios from "axios";

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

  const { auth } = useAuth();

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/v1/product/search/${term}`
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // 🔔 Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setHideAnnouncement(window.scrollY > 24);
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔙 Close search on ESC
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && setIsSearchOpen(false);
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

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
    text-[11px] md:text-[12px] tracking-wide 
    font-medium uppercase 
    transition-all duration-500 ease-in-out cursor-pointer
    ${hideAnnouncement ? "opacity-0 h-0 py-0 pointer-events-none" : "opacity-100 py-2"}
  `}
>
  For any customisation or personal assistance, contact us
</Link>


      {/* Header Content */}
      <div className="grid grid-cols-3 items-center px-4 py-2 md:px-6 border-b">

        {/* Mobile Hamburger */}
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
    <img
      className="w-24 md:w-28 h-16 object-contain"
      src={Logo}
      alt="Logo"
    />
  </Link>
</div>



        {/* Icons */}
        <div className="flex items-center justify-end gap-4">
  <Link to="/admin/login" className="text-gray-700 hover:text-black">
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
            className={`absolute left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-md py-3 px-4 min-w-[220px] border border-gray-100 z-50 transition-all duration-200 ease-in-out ${
              isSubmenuVisible ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <ul className="space-y-2 text-sm font-medium text-gray-700">
              <li>
                <Link
                  to="/weavecollection"
                  className="block hover:text-[#AD000F] transition-colors duration-200"
                >
                  WEAVES
                </Link>
              </li>
              <li>
                <Link
                  to="/stylecollection"
                  className="block hover:text-[#AD000F] transition-colors duration-200"
                >
                  STYLE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Link to="/products" className="hover:text-[#AD000F] transition">
          Shop
        </Link>
        {!auth?.token ? (
          <Link to="/login" className="hover:text-[#AD000F] transition">
            Login
          </Link>
        ) : (
          <Link
            to="/user/dashboard"
            className="hover:text-[#AD000F] transition"
          >
            My Account
          </Link>
        )}
        <Link to="/contact" className="hover:text-[#AD000F] transition">
          Contact
        </Link>
      </nav>

      {/* Mobile Menu */}
      {open && (
  <>
    {/* Background Overlay */}
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setOpen(false)}
    ></div>

    {/* Slide Menu */}
    <div
      className="fixed top-0 left-0 w-[80vw] max-w-xs h-screen bg-[#F9F5F0] z-50 flex flex-col pt-6 px-6 overflow-y-auto transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Icon */}
      <button
        className="self-end mb-6 text-gray-700"
        aria-label="close"
        onClick={() => setOpen(false)}
      >
        <X size={30} />
      </button>

      {/* Mobile Menu Title */}
      <h2 className="text-[20px] font-semibold mb-6 tracking-wide text-gray-800">
        Menu
      </h2>

      {/* MENU ITEMS START */}
      <nav className="flex flex-col text-[15px] font-medium text-gray-900 w-full">

        {/* Home */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="py-3 border-b border-gray-300"
        >
          Home
        </Link>

        {/* Our Heritage */}
        <Link
          to="/ourheritage"
          onClick={() => setOpen(false)}
          className="py-3 border-b border-gray-300"
        >
          Our Heritage
        </Link>

        {/* COLLECTIONS WITH SUBMENU */}
        <div className="border-b border-gray-300 py-3">
          <button
            onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
            className="w-full flex justify-between items-center"
          >
            <span>Collections</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                mobileSubmenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileSubmenuOpen && (
            <div className="mt-3 pl-3 space-y-3 text-gray-700 text-[14px]">
              <Link
                to="/weavecollection"
                onClick={() => setOpen(false)}
                className="block"
              >
                WEAVES
              </Link>
              <Link
                to="/stylecollection"
                onClick={() => setOpen(false)}
                className="block"
              >
                STYLE
              </Link>
            </div>
          )}
        </div>

        {/* Shop */}
        <Link
          to="/products"
          onClick={() => setOpen(false)}
          className="py-3 border-b border-gray-300"
        >
          Shop
        </Link>

        {/* Login / Account */}
        {!auth?.token ? (
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="py-3 border-b border-gray-300"
          >
            Login
          </Link>
        ) : (
          <Link
            to="/user/dashboard"
            onClick={() => setOpen(false)}
            className="py-3 border-b border-gray-300"
          >
            My Account
          </Link>
        )}

        {/* Contact */}
        <Link
          to="/contact"
          onClick={() => setOpen(false)}
          className="py-3 border-b border-gray-300"
        >
          Contact
        </Link>
      </nav>

      {/* FOOTER LINKS – like Hermès */}
      {/* <div className="mt-10 text-[14px] text-gray-700 space-y-5 pb-10">

        <div className="flex items-center gap-3">
          <span className="text-[18px]">📍</span>
          <span>Find a store</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[18px]">👤</span>
          <span>Account</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[18px]">💬</span>
          <span>Contact us</span>
        </div>

      </div> */}
    </div>
  </>
)}


      {/* 🔍 Full-Screen Search Overlay (shared for desktop & mobile) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999] flex flex-col items-center p-6 animate-fadeIn">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for sarees, skirts, accessories..."
              autoFocus
              className="w-full border border-gray-300 rounded-full px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-[#AD000F] transition-all"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-3 text-gray-500 hover:text-black transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-3xl mt-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 mt-4">Searching...</p>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="group bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#AD000F] truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">₹{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchTerm ? (
              <p className="text-center text-gray-500 mt-10">
                No results found for "
                <span className="font-medium">{searchTerm}</span>"
              </p>
            ) : (
              <p className="text-center text-gray-400 mt-10">
                Start typing to search...
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
