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
  const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { authUser, authAdmin } = useAuth();

  const isUserLoggedIn = !!authUser?.token;
  const isAdminLoggedIn = !!authAdmin?.token;

  const adminIconLink = isAdminLoggedIn
    ? "/admin/dashboard/profile"
    : "/admin/login";

  // -----------------------
  // Search System
  // -----------------------
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/products/search/${encodeURIComponent(term)}`
      );
      setSearchResults(res.data.products || []);
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

  // -----------------------
  // Scroll Effects
  // -----------------------
  useEffect(() => {
    const onScroll = () => {
      setHideAnnouncement(window.scrollY > 24);
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // -----------------------
  // Header UI
  // -----------------------
  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full 
        transition-all duration-500 
        ${isScrolled ? "bg-white/85 backdrop-blur-md border-b border-neutral-200" : "bg-transparent"}
      `}
    >
      {/* Announcement */}
      <Link
        to="/contact"
        className={`
          block w-full text-center 
          bg-[#F4EFE9] 
          text-neutral-800 text-[11px] md:text-[12px] 
          tracking-wide font-medium uppercase 
          transition-all duration-500
          ${hideAnnouncement ? "opacity-0 h-0 py-0" : "opacity-100 py-2"}
        `}
      >
        For any customisation or personal assistance — contact us
      </Link>

      {/* HEADER MAIN */}
      <div className="grid grid-cols-3 items-center px-4 py-2 md:px-6">

        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setOpen(true)}>
            <Menu size={26} className="text-neutral-700" />
          </button>
        </div>

        {/* Search (Desktop Placeholder Text) */}
        <div className="hidden md:flex items-center gap-2 text-neutral-600">
          <Search className="w-5 h-5" />
          <span className="text-sm">Search</span>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img
              src={Logo}
              className="w-24 md:w-28 object-contain drop-shadow-sm"
              alt="Bright Rose Logo"
            />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-5">

          {/* Admin/User Icon */}
          <Link
            to={adminIconLink}
            className="text-neutral-700 hover:text-[#AD000F] transition"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="text-neutral-700 hover:text-[#AD000F] transition"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="
        hidden md:flex 
        justify-center gap-10 
        uppercase text-[12px] font-medium 
        tracking-wide text-neutral-800
        py-3
      ">
        <Link to="/" className="hover:text-[#AD000F] transition">Home</Link>

        <Link to="/ourheritage" className="hover:text-[#AD000F] transition">
          Our Heritage
        </Link>

        {/* COLLECTION DROPDOWN */}
        <div
          className="relative group"
          onMouseEnter={() => setIsSubmenuVisible(true)}
          onMouseLeave={() => setIsSubmenuVisible(false)}
        >
          <button className="flex items-center gap-1 cursor-default">
            Collections
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isSubmenuVisible ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`
              absolute left-1/2 -translate-x-1/2 top-[110%]
              bg-white border border-neutral-200 shadow-lg 
              rounded-xl py-3 px-5 w-[220px]
              transition-all duration-300 
              ${isSubmenuVisible ? "opacity-100 visible" : "opacity-0 invisible"}
            `}
          >
            <ul className="space-y-3 text-sm text-neutral-700">
              <li>
                <Link to="/weavecollection" className="hover:text-[#AD000F]">
                  Weaves
                </Link>
              </li>

              <li>
                <Link to="/stylecollection" className="hover:text-[#AD000F]">
                  Style
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Link to="/products" className="hover:text-[#AD000F] transition">
          Shop
        </Link>

        {!isUserLoggedIn ? (
          <Link to="/login" className="hover:text-[#AD000F] transition">
            Login
          </Link>
        ) : (
          <Link
            to="/user/dashboard/profile"
            className="hover:text-[#AD000F] transition"
          >
            My Account
          </Link>
        )}

        <Link to="/contact" className="hover:text-[#AD000F] transition">
          Contact
        </Link>
      </nav>

      {/* ----------------------------------
          MOBILE MENU PANEL (SLIDE-IN)
      ---------------------------------- */}
      {open && (
        <div className="fixed inset-0 z-[999]">
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          ></div>

          {/* Panel */}
          <div
            className="
              absolute left-0 top-0 h-full w-[75%] sm:w-[60%]
              bg-white shadow-xl p-6
              flex flex-col gap-6
            "
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="mb-4 text-neutral-800 hover:text-[#AD000F]"
            >
              <X size={26} />
            </button>

            {/* Links */}
            <Link to="/" onClick={() => setOpen(false)} className="text-lg">
              Home
            </Link>

            <Link to="/ourheritage" onClick={() => setOpen(false)} className="text-lg">
              Our Heritage
            </Link>

            <Link to="/weavecollection" onClick={() => setOpen(false)} className="text-lg">
              Weaves
            </Link>

            <Link to="/stylecollection" onClick={() => setOpen(false)} className="text-lg">
              Style
            </Link>

            <Link to="/products" onClick={() => setOpen(false)} className="text-lg">
              Shop
            </Link>

            {!isUserLoggedIn ? (
              <Link to="/login" onClick={() => setOpen(false)} className="text-lg">
                Login
              </Link>
            ) : (
              <Link
                to="/user/dashboard/profile"
                onClick={() => setOpen(false)}
                className="text-lg"
              >
                My Account
              </Link>
            )}

            <Link to="/contact" onClick={() => setOpen(false)} className="text-lg">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
