import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        isScrolled ? "backdrop-blur-sm bg-white" : "bg-transparent"
      }`}
    >
      {/* Announcement Bar */}
      <div
        className={`bg-primary-red text-white text-center font-medium text-[11px] md:text-xs tracking-wide uppercase transition-all duration-500 ease-in-out ${
          hideAnnouncement
            ? "opacity-0 h-0 py-0 pointer-events-none"
            : "opacity-100 h-auto py-0.5 md:py-2"
        }`}
      >
        FOR ANY CUSTOMISATION OR PERSONAL ASSISTANCE, PLEASE CONTACT US
      </div>

      {/* Header Content */}
      <div className="flex items-center justify-between px-4 py-2 md:px-6 border-b">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center z-50">
          <button aria-label="menu" onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
        </div>

        {/* Search (Desktop) */}
        <div className="w-1/4 hidden md:flex justify-start items-center">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-black transition text-sm"
          >
            <Search className="w-5 h-5" />
            <span className="text-sm font-medium">Search</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center justify-center">
            <img
              className="w-24 md:w-28 h-16 object-contain transition-all duration-300"
              src=".client/public/logonew2.png"
              alt="Logo"
              style={{ minWidth: 60, minHeight: 30 }}
            />
          </Link>
        </div>

        {/* Icons */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/user/dashboard" className="hover:text-black text-gray-700">
              <User className="w-5 h-5 cursor-pointer" />
            </Link>
            <Link to="/cart" className="hover:text-black text-gray-700">
              <ShoppingBag className="w-5 h-5 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center space-x-8 text-sm uppercase text-black font-semibold py-2 relative">
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
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          ></div>

          <div
            className="fixed top-0 left-0 w-[80vw] max-w-xs h-screen bg-white shadow-lg z-50 flex flex-col pt-6 px-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end mb-6"
              aria-label="close"
              onClick={() => setOpen(false)}
            >
              <X size={32} />
            </button>

            {/* 🔍 Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium">Search Products</span>
            </button>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-5 text-base font-semibold text-black uppercase">
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/ourheritage" onClick={() => setOpen(false)}>
                Our Heritage
              </Link>

              {/* Mobile Submenu */}
              <div>
                <button
                  className="flex justify-between items-center w-full"
                  onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                >
                  <span className="uppercase">Collections</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      mobileSubmenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileSubmenuOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-2 text-gray-700 text-sm font-medium">
                    <Link
                      to="/weavecollection"
                      onClick={() => setOpen(false)}
                      className="hover:text-[#AD000F]"
                    >
                      WEAVES
                    </Link>
                    <Link
                      to="/stylecollection"
                      onClick={() => setOpen(false)}
                      className="hover:text-[#AD000F]"
                    >
                      STYLE
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/products" onClick={() => setOpen(false)}>
                Shop
              </Link>
              {!auth?.token ? (
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              ) : (
                <Link to="/user/dashboard" onClick={() => setOpen(false)}>
                  My Account
                </Link>
              )}
              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </nav>
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
