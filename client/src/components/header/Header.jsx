// -------------------------------------------------------
// FIXED + OPTIMIZED HEADER
// -------------------------------------------------------

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

  const { authUser, authAdmin } = useAuth();

  const isUserLoggedIn = !!authUser?.token;
  const isAdminLoggedIn = !!authAdmin?.token;

  const adminIconLink = isAdminLoggedIn
    ? "/admin/dashboard/profile"
    : "/admin/login";

  // -------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/products/search/${encodeURIComponent(term)}`);
      setSearchResults(res.data.products || []);
    } catch (e) {
      console.log("Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(searchTerm), 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // -------------------------------------------------------
  // SCROLL EFFECT
  // -------------------------------------------------------
  useEffect(() => {
    const onScroll = () => {
      setHideAnnouncement(window.scrollY > 24);
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // -------------------------------------------------------
  // RETURN
  // -------------------------------------------------------
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Announcement */}
      <Link
        to="/contact"
        className={`block w-full text-center bg-neutralDark/40 text-white 
          text-[10px] md:text-[12px] tracking-wide font-medium uppercase transition-all ${
            hideAnnouncement ? "opacity-0 h-0 py-0" : "opacity-100 py-2"
          }`}
      >
        For any customisation or personal assistance, contact us
      </Link>

    {/* Header Main */}
<div className="grid grid-cols-3 items-center px-4 py-4 md:px-6 border-b">

  {/* LEFT SIDE (Mobile: menu + search) */}
  <div className="flex items-center gap-3">

    {/* MOBILE HAMBURGER */}
    <button aria-label="menu" onClick={() => setOpen(true)} className="md:hidden">
      <Menu size={28} />
    </button>

    {/* MOBILE SEARCH ICON */}
    <button
      className="md:hidden"
      onClick={() => setIsSearchOpen(true)}
    >
      <Search className="w-5 h-5 text-gray-700" />
    </button>

    {/* DESKTOP SEARCH */}
    <div
      className="hidden md:flex items-center gap-2 cursor-pointer"
      onClick={() => setIsSearchOpen(true)}
    >
      <Search className="w-5 h-5 text-gray-600" />
      <span className="text-sm text-gray-600">Search</span>
    </div>

  </div>

  {/* LOGO – stays perfectly centered */}
  <div className="flex justify-center logofont">
    <Link to="/" className="select-none">
      <h1
        className="
          font-[Cizel]
          text-[18px]
          sm:text-[20px]
          md:text-[28px]
          font-normal
          tracking-[0.10em]
          text-[#000000]
          leading-none
          whitespace-nowrap
        "
      >
        BRIGHT ROSE
      </h1>
    </Link>
  </div>

  {/* RIGHT SIDE ICONS */}
  <div className="flex items-center justify-end gap-4">

    {/* Admin/User Icon */}
    <Link to={adminIconLink} className="text-gray-700 hover:text-black">
      <User className="w-5 h-5" />
    </Link>

    {/* Cart Icon */}
    <Link to="/cart" className="text-gray-700 hover:text-black">
      <ShoppingBag className="w-5 h-5" />
    </Link>
  </div>
</div>

      {/* DESKTOP MENU */}
      <nav className="hidden md:flex justify-center space-x-8 text-[12px] font-semibold py-2 uppercase">

        <Link to="/" className="hover:text-[#AD000F]">Home</Link>
        <Link to="/ourheritage" className="hover:text-[#AD000F]">Our Heritage</Link>

        {/* COLLECTIONS DROPDOWN */}
<div className="relative group">
  <button className="flex items-center gap-1 cursor-pointer">
    COLLECTIONS
    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
  </button>

  {/* FIXED DROPDOWN — now does NOT hide when moving cursor */}
  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[220px]
                  bg-white border border-gray-200 rounded-md shadow-lg
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200">
    <ul className="py-3 px-4 space-y-3 text-sm text-gray-700">
      <li>
        <Link to="/weavecollection" className="hover:text-[#AD000F] block">
          WEAVES
        </Link>
      </li>
      <li>
        <Link to="/stylecollection" className="hover:text-[#AD000F] block">
          STYLE
        </Link>
      </li>
    </ul>
  </div>
</div>


        <Link to="/products" className="hover:text-[#AD000F]">Shop</Link>

        {/* USER LOGIN */}
        {!isUserLoggedIn ? (
          <Link to="/login" className="hover:text-[#AD000F]">Login</Link>
        ) : (
          <Link to="/user/dashboard/profile" className="hover:text-[#AD000F]">
            My Account
          </Link>
        )}

        <Link to="/contact" className="hover:text-[#AD000F]">Contact</Link>
      </nav>

      {/* ----------------------------------------------------
      MOBILE MENU
      ---------------------------------------------------- */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Side Drawer */}
          <div className="fixed top-0 left-0 w-[80%] max-w-xs h-full bg-white z-50 p-6 shadow-xl overflow-y-auto">

            <button onClick={() => setOpen(false)} className="mb-6">
              <X size={28} />
            </button>

            <nav className="flex flex-col gap-4 text-[15px]">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/ourheritage" onClick={() => setOpen(false)}>Our Heritage</Link>

              {/* MOBILE SUBMENU */}
<div>
  <button
    className="flex justify-between items-center w-full py-2"
    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
  >
    <span>Collections</span>
    <ChevronDown
      className={`w-5 h-5 transition-transform ${
        mobileSubmenuOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {mobileSubmenuOpen && (
    <div className="ml-4 mt-2 space-y-3 text-gray-700 text-[15px]">
      <Link
        to="/weavecollection"
        onClick={() => setOpen(false)}
        className="block"
      >
        Weaves
      </Link>

      <Link
        to="/stylecollection"
        onClick={() => setOpen(false)}
        className="block"
      >
        Styles
      </Link>
    </div>
  )}
</div>


              <Link to="/products" onClick={() => setOpen(false)}>Shop</Link>

              {/* USER LOGIN */}
              {!isUserLoggedIn ? (
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              ) : (
                <Link to="/user/dashboard/profile" onClick={() => setOpen(false)}>My Account</Link>
              )}

              <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </nav>
          </div>
        </>
      )}

      {/* ----------------------------------------------------
      SEARCH OVERLAY
      ---------------------------------------------------- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[9999] p-6 flex flex-col items-center">
          <button
            className="absolute top-6 right-6"
            onClick={() => setIsSearchOpen(false)}
          >
            <X size={30} />
          </button>

          <input
            autoFocus
            type="text"
            value={searchTerm}
            placeholder="Search for sarees, skirts, accessories..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl border border-gray-300 rounded-full px-6 py-3 text-lg shadow-md"
          />

          <div className="w-full max-w-3xl mt-6 h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 mt-4">Searching…</p>
            ) : searchResults.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="border rounded-xl overflow-hidden shadow hover:shadow-lg"
                  >
                    <img
                      src={p.images?.[0]?.url}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center mt-6 text-gray-400">
                Type to search…
              </p>
            )}
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
