// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getWishlistAPI } from "../api/wishlist";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({ user: null, token: "" });
  const [authAdmin, setAuthAdmin] = useState({ user: null, token: "" });
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // WISHLIST → ALWAYS PRODUCT IDs ONLY
  // -----------------------------------------------------
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist_ids") || "[]")
  );

  // Sync wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem("wishlist_ids", JSON.stringify(wishlist));
  }, [wishlist]);

  // -----------------------------------------------------
  // Restore auth data on first page load
  // -----------------------------------------------------
  useEffect(() => {
    try {
      const user = localStorage.getItem("auth_user");
      const admin = localStorage.getItem("auth_admin");

      if (user) setAuthUser(JSON.parse(user));
      if (admin) setAuthAdmin(JSON.parse(admin));
    } catch (err) {
      console.error("Auth restore error:", err);
    }

    setLoading(false);
  }, []);

  // -----------------------------------------------------
  // Fetch wishlist AFTER user logs in (only once)
  // -----------------------------------------------------
  useEffect(() => {
    if (!authUser?.token) return; // No login = no fetch

    const loadWishlist = async () => {
      try {
        const res = await getWishlistAPI(authUser.token);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Wishlist load failed:", err);
      }
    };

    loadWishlist();
  }, [authUser?.token]); // only refetch when token actually changes

  // -----------------------------------------------------
  // LOGIN USER
  // -----------------------------------------------------
  const loginUser = async (data) => {
    setAuthUser(data);
    localStorage.setItem("auth_user", JSON.stringify(data));

    // Fetch wishlist after login
    if (data?.token) {
      try {
        const res = await getWishlistAPI(data.token);
        setWishlist(res.data.wishlist || []);
      } catch {
        setWishlist([]);
      }
    }
  };

  // -----------------------------------------------------
  // LOGIN ADMIN
  // -----------------------------------------------------
  const loginAdmin = (data) => {
    setAuthAdmin(data);
    localStorage.setItem("auth_admin", JSON.stringify(data));
  };

  // -----------------------------------------------------
  // LOGOUT USER
  // -----------------------------------------------------
  const logoutUser = () => {
    localStorage.removeItem("auth_user");
    setAuthUser({ user: null, token: "" });
    setWishlist([]); // reset wishlist cleanly
  };

  // -----------------------------------------------------
  // LOGOUT ADMIN
  // -----------------------------------------------------
  const logoutAdmin = () => {
    localStorage.removeItem("auth_admin");
    setAuthAdmin({ user: null, token: "" });
  };

  // -----------------------------------------------------
  // PROVIDER
  // -----------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        authUser,
        authAdmin,
        loginUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
        loading,
        wishlist,
        setWishlist, // important for product details page toggle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
