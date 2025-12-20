// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/auth";
import api from "../../utils/apiClient";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  // const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const getResponsiveConfig = (width) => {
    if (width >= 1400) {
    return { BIG: 138, SMALL: 24, START_Y: 190, TOP: -104 };
  }
  if (width >= 1200) {
    return { BIG: 122, SMALL: 24, START_Y: 160, TOP: -91 };
  }
  if (width >= 900) {
    return { BIG: 90, SMALL: 22, START_Y: 160, TOP: -66 };
  }
  if (width >= 700) {
    return { BIG: 72, SMALL: 22, START_Y: 160, TOP: -52 };
  }
  if (width >= 500) {
    return { BIG: 48, SMALL: 20, START_Y: 135, TOP: -38 };
  }
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

  //  const [hideAnnouncement, setHideAnnouncement] = useState(false);

  const { authAdmin } = useAuth();
  const adminIconLink = authAdmin?.token
    ? "/admin/dashboard/profile"
    : "/admin/login";

  /** UI STATE */
  const [open, setOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /** SEARCH */
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /** HEADER */
  const [isScrolled, setIsScrolled] = useState(false);

  /** LOGO ANIMATION */
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


  /** SEARCH HANDLER */
  useEffect(() => {
    if (!searchTerm.trim()) return;
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/products/search/${encodeURIComponent(searchTerm)}`
        );
        setSearchResults(res.data.products || []);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /** SCROLL LISTENER */
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

  /** GUCCI INERTIA ANIMATION */
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

      const color =
        p < 0.75
          ? "#ffffff"
          : `rgba(0,0,0,${(p - 0.75) / 0.25})`;
      
      // after calculating `p`
const zIndex = p > 0.92 ? 600 : 400;
logo.style.zIndex = zIndex;


      logo.style.transform = `translate(-50%, ${translateY}px) scale(${scale})`;
      logo.style.letterSpacing = `${spacing}em`;
      logo.style.color = color;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHome]);

  return (
    <>
      {/* BIG GUCCI LOGO (HOME – DESKTOP & MOBILE) */}
      {isHome && (
        <div
          ref={logoRef}
          className="fixed left-1/2 pointer-events-none "
          style={{
            top: CUSTOM_TOP,
            transform: `translate(-50%, ${BIG_START_Y}px) scale(1)`,
            fontFamily: "PlayfairDisplay",
            fontSize: BIG_SIZE,
            letterSpacing: "0.32em",
            fontWeight: 100,
            color: "#fff",
            whiteSpace: "nowrap",
          }}
        >
          BRIGHT ROSE
        </div>
      )}

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-[500]
        transisScrolledition-colors duration-300
        ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}
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
            <button onClick={() => setIsSearchOpen(true)}>
              <Search size={18} />
            </button>
            <Link to={adminIconLink}>
              <User size={18} />
            </Link>
            <Link to="/cart">
              <ShoppingBag size={18} />
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
        <span className="text-sm text-neutral-600">Close</span>
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

        <Link to="/products" onClick={() => setOpen(false)}>Shop</Link>
        <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>

        {/* FOOTER BUTTONS */}
        <div className="mt-6 pt-4 border-t flex gap-3">
          <button className="flex-1 py-3 border rounded-md">
            <Link to="/weavecollection">Weave</Link>
          </button>
          <button className="flex-1 py-3 bg-neutral-100 rounded-md">
            <Link to="/stylecollection">Style</Link>
          </button>
        </div>
      </nav>
    </aside>
  </>
)}


      {/* SEARCH PANEL (FIXED) */}
      {isSearchOpen && (
        <>
          <div
  className="fixed inset-0 bg-black/60 backdrop-blur-md z-[950]"
  onClick={() => setIsSearchOpen(false)}
/>

<div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white z-[1000] shadow-xl flex flex-col">

            <div className="flex justify-between px-6 py-5 border-b">
              <button onClick={() => setIsSearchOpen(false)}>
                <X size={22} />
              </button>
              <Search size={20} />
            </div>

            <div className="px-6 py-5 border-b">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full text-[15px] outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading && <p>Searching…</p>}
              {searchResults.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex gap-4 border-b py-4"
                >
                  <img src={p.images?.[0]?.url} className="w-20 h-24 object-cover" />
                  <div>
                    <p>{p.name}</p>
                    <p className="text-sm text-neutral-500">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
