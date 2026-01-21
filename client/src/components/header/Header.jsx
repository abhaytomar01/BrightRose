// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag, ChevronDown, Heart } from "lucide-react";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import api from "../../utils/apiClient";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { cartItems = [] } = useCart();
  const count = cartItems.length;

  const { authUser, authAdmin } = useAuth();
  const navigate = useNavigate();

  const isUserLoggedIn = !!authUser?.token;
const userAccountLink = isUserLoggedIn
  ? "/user/dashboard/profile"
  : "/login";
const userAccountLabel = isUserLoggedIn ? "Account" : "Login";


  /** ======================
   WISHLIST CLICK
  ====================== **/
  const handleWishlistClick = () => {
    if (!authUser) {
      navigate("/login", {
        state: { redirectTo: "/user/wishlist" }
      });
      return;
    }

    navigate("/user/wishlist");
  };  

  /** ======================
   RESPONSIVE CONFIG
  ====================== **/
  const getResponsiveConfig = (width) => {
    if (width >= 1400) return { BIG: 138, SMALL: 24, START_Y: 190, TOP: -104 };
    if (width >= 1200) return { BIG: 122, SMALL: 24, START_Y: 160, TOP: -91 };
    if (width >= 900)  return { BIG: 90, SMALL: 22, START_Y: 160, TOP: -66 };
    if (width >= 700)  return { BIG: 72, SMALL: 22, START_Y: 160, TOP: -52 };
    if (width >= 500)  return { BIG: 48, SMALL: 20, START_Y: 135, TOP: -38 };
    return { BIG: 38, SMALL: 16, START_Y: 130, TOP: -27 };
  };

  const [viewport, setViewport] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const adminIconLink = authAdmin?.token
    ? "/admin/dashboard/profile"
    : "/admin/login";

  /** ======================
   UI STATE
  ====================== **/
  const [open, setOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  // const [isSearchOpen, setIsSearchOpen] = useState(false);

  /** SEARCH **/
  // const [searchTerm, setSearchTerm] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  // const [loading, setLoading] = useState(false);

  /** HEADER **/
  const [isScrolled, setIsScrolled] = useState(false);

  /** LOGO **/
  const logoRef = useRef(null);
  const currentProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafRef = useRef(null);

  const { BIG, SMALL, START_Y, TOP } = getResponsiveConfig(viewport);
  const BIG_SIZE = BIG;
  const SMALL_SIZE = SMALL;
  const BIG_START_Y = START_Y;
  const CUSTOM_TOP = TOP;
  const HEADER_HEIGHT = 72;
  const SCALE_END = SMALL_SIZE / BIG_SIZE;

  /** SEARCH REQUEST **/
  // useEffect(() => {
  //   if (!searchTerm.trim()) return;
  //   const t = setTimeout(async () => {
  //     try {
  //       setLoading(true);
  //       const res = await api.get(
  //         `/products/search/${encodeURIComponent(searchTerm)}`
  //       );
  //       setSearchResults(res.data.products || []);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 400);
  //   return () => clearTimeout(t);
  // }, [searchTerm]);

  /** SCROLL **/
  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 5);

      const threshold = BIG_START_Y - HEADER_HEIGHT / 2;
      targetProgress.current = Math.min(1, Math.max(0, y / threshold));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /** LOGO INERTIA **/
  useEffect(() => {
    if (!isHome) return;

    const animate = () => {
      const logo = logoRef.current;
      if (!logo) return;

      const SMOOTHING = 0.035;
      const next =
        currentProgress.current +
        (targetProgress.current - currentProgress.current) * SMOOTHING;

      currentProgress.current = next;

      const p = 1 - Math.pow(1 - next, 4);

      const translateY =
        BIG_START_Y + (HEADER_HEIGHT / 2 - BIG_START_Y) * p;
      const scale = 1 + (SCALE_END - 1) * p;
      const spacing = 0.32 + (0.05 - 0.32) * p;

      const color = p < 0.75
        ? "#ffffff"
        : `rgba(0,0,0,${(p - 0.75) / 0.25})`;

      logo.style.zIndex = p > 0.92 ? 600 : 400;
      logo.style.transform = `translate(-50%, ${translateY}px) scale(${scale})`;
      logo.style.letterSpacing = `${spacing}em`;
      logo.style.color = color;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHome]);

 /** SEARCH (right panel) **/
const [searchTerm, setSearchTerm] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [isSearchOpen, setIsSearchOpen] = useState(false);

// Close on Esc
useEffect(() => {
  if (!isSearchOpen) return;
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchTerm("");
      setSearchResults([]);
    }
  };
  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [isSearchOpen]);

// Debounced search (reuse your API logic)
useEffect(() => {
  const term = searchTerm.trim();

  if (!term) {
    setSearchResults([]);
    setLoading(false);
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products/search/${encodeURIComponent(term)}`,
        { signal: controller.signal }
      );
      const products = res.data?.products || [];
      setSearchResults(products.slice(0, 8));
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Search error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, 350);

  return () => {
    clearTimeout(timeoutId);
    controller.abort();
  };
}, [searchTerm]);



  return (
    <>
      {/* BIG GUCCI LOGO (HOME – DESKTOP & MOBILE) */}
      {isHome && (
        <div
          ref={logoRef}
          className="fixed left-1/2 pointer-events-none"
          style={{
            top: CUSTOM_TOP,
            transform: `translate(-50%, ${BIG_START_Y}px) scale(1)`,
            fontFamily: "PlayfairDisplay",
            fontSize: BIG_SIZE,
            letterSpacing: "0.32em",
            fontWeight: 400,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          BRIGHT ROSE
        </div>
      )}

      {/* HEADER */}
      <header
  className={`fixed top-0 left-0 w-full z-[500] duration-300
    ${
      isHome
        ? isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
        : "bg-white shadow-sm"
    }
  `}
  style={{ height: HEADER_HEIGHT }}
>

        {/* Announcement Bar */}
      {/* <Link
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
      </Link> */}
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
          <button onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          {!isHome && (
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 text-[16px] md:text-[24px]
              tracking-[0.06em] font-uppercase text-black"
              style = {{ fontFamily: "PlayfairDisplay"}}
            >
              BRIGHT ROSE
            </Link>
          )}

          <div className="flex items-center gap-4">
  <button
  type="button"
  onClick={() => setIsSearchOpen(true)}
  className="p-2 rounded-full hover:bg-black/5 transition"
  aria-label="Search"
>
  <Search size={20} />
</button>




  <button onClick={handleWishlistClick}>
      <Heart size={20} />
    </button>
{/* 
  <Link to={adminIconLink}>
    <User size={18} />
  </Link> */}

  <Link to="/cart" className="relative inline-block">
      <ShoppingBag size={20} />

      {count > 0 && (
        <span
          className="
            absolute -top-2 -right-2
            bg-black text-white 
            text-[10px] min-w-[18px] h-[18px]
            flex items-center justify-center
            rounded-full font-medium
            animate-badge
          "
        >
          {count}
        </span>
      )}
    </Link>
</div>

        </div>
      </header>

      {/* ===========================
   MOBILE / TABLET MENU DRAWER
=========================== */}
{open && (
  <>
    {/* BACKDROP */}
    {/* BACKDROP */}
<div
  className="fixed inset-0 z-[800] bg-black/50 backdrop-blur-sm"
  onClick={() => setOpen(false)}
/>

{/* DRAWER */}
<aside
  className="
    fixed top-0 left-0 z-[900]
    h-full w-[82%] max-w-[360px]
    bg-white shadow-2xl
    animate-[slideIn_0.35s_ease-out]
    overflow-y-auto
  "
>

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-5 border-b z-[9999]">
        <button onClick={() => setOpen(false)}>
          <X size={26} />
        </button>
        <span onClick={() => setOpen(false)} className="text-sm text-neutral-600">Close</span>
      </div>

      {/* NAV */}
      <nav className="px-6 py-6 flex flex-col gap-4 uppercase text-[15px] ">
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/ourheritage" onClick={() => setOpen(false)}>Our Heritage</Link>

        {/* COLLECTIONS */}
        <div>
          <button
            onClick={() => setMobileSubmenuOpen(v => !v)}
            className="flex w-full items-center justify-between py-0"
          >
            <span className="uppercase">Collections</span>
            <ChevronDown
              className={`transition ${mobileSubmenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileSubmenuOpen && (
            <div className="ml-4 mt-2 flex flex-col gap-3 text-neutral-700">
              <Link to="/weavecollection" onClick={() => setOpen(false)}>
                Weaves
              </Link>
              <Link  to="/stylecollection" onClick={() => setOpen(false)}>
                Style
              </Link>
            </div>
          )}
        </div>

        <Link to="/products" onClick={() => setOpen(false)}>Shop All</Link>
        {/* <Link to="/login" onClick={() => setOpen(false)}>Login</Link> */}
        
<Link to={userAccountLink} onClick={() => setOpen(false)}>
  {userAccountLabel}
</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        <Link to="/atelier" onClick={() => setOpen(false)}>Custom Order</Link>
        <Link to="/Terms" onClick={() => setOpen(false)}>Terms & Conditions</Link>
        <Link to="/privacy" onClick={() => setOpen(false)}>Privacy Policy</Link>
        <Link to="/exchange-return" onClick={() => setOpen(false)}>Shipping Policy</Link>
        <Link to="/exchange-return" onClick={() => setOpen(false)}>Returns & Refunds</Link>
        <Link to="/customer-service" onClick={() => setOpen(false)}>Customer Service</Link>

        {/* FOOTER BUTTONS */}
        <div className="mt-6 pt-4 border-t flex gap-3">
          <button className="flex-1 py-3 border rounded-md">
            <Link to="/weavecollection">Weave</Link>
          </button>
          <button className="flex-1 py-3 bg-neutral-100 rounded-md">
            <Link to="/stylecollection">Style</Link>
          </button>
        </div>

        <div className="bg-mutedGray/50 px-4 py-3 mt-6 text-center text-sm text-neutral-600">
        <Link to={adminIconLink} onClick={() => setOpen(false)}>Admin</Link>

        </div>
      </nav>
    </aside>
  </>
)}


      {/* SEARCH PANEL (FIXED) */}
     {isSearchOpen && (
  <div className="fixed inset-0 z-[9999] flex justify-end">
    {/* Backdrop */}
    <div
      className="flex-1 bg-black/30 backdrop-blur-sm"
      onClick={() => {
        setIsSearchOpen(false);
        setSearchTerm("");
        setSearchResults([]);
      }}
    />

    {/* Sliding panel */}
    <div className="w-full sm:w-[480px] md:w-[520px] h-full bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-out translate-x-0">
      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchTerm("");
            setSearchResults([]);
          }}
          className="flex items-center gap-2 text-sm text-gray-800 hover:underline"
        >
          <X size={16} />
          <span>Close</span>
        </button>

        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Search input */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent outline-none text-sm md:text-base text-gray-900 placeholder-gray-500"
          />
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-xs text-gray-500 hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-6 py-4 overflow-y-auto h-[calc(100%-140px)]">
        <div className="mb-5">
          <h3 className="text-xs font-semibold tracking-wide text-gray-500 mb-2">
            Suggestions
          </h3>
          <div className="flex flex-col gap-1 text-sm text-gray-800">
            {["Jacket", "Saree", "Silk", "Blouse", "Corset"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSearchTerm(item)}
                className="text-left hover:underline"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Results or 'You may also like' */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold tracking-wide text-gray-500 mb-2">
            {searchTerm.trim() ? "Results" : "You may also like"}
          </h3>

          {loading && searchResults.length === 0 && (
            <div className="py-3 text-sm text-gray-500">Searching…</div>
          )}

          {!loading && searchResults.length === 0 && searchTerm.trim() && (
            <div className="py-3 text-sm text-gray-500">
              No products found
            </div>
          )}

          <div className="space-y-2">
            {searchResults.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
              >
                <img
                  src={
                    product.images?.[0]?.url?.startsWith("http")
                      ? product.images[0].url
                      : `${import.meta.env.VITE_SERVER_URL}${product.images?.[0]?.url || ""}`
                  }
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {product.name?.length > 40
                      ? `${product.name.substring(0, 40)}…`
                      : product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ₹{(product.price || 0).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      
    </>
  );
}
