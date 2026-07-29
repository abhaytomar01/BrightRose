// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getWishlistAPI } from "../api/wishlist";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({ user: null, token: "" });
  const [authAdmin, setAuthAdmin] = useState({ user: null, token: "" });
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // WISHLIST
  // -----------------------------------------------------
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist_ids") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("wishlist_ids", JSON.stringify(wishlist));
  }, [wishlist]);

  // -----------------------------------------------------
  // Restore user & admin from localStorage
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
  // Auto-attach Authorization token to axios
  // -----------------------------------------------------
  useEffect(() => {
    let token = null;

    if (authAdmin?.token) token = authAdmin.token;
    else if (authUser?.token) token = authUser.token;

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authAdmin, authUser]);

  // -----------------------------------------------------
  // Load wishlist only when user logs in
  // -----------------------------------------------------
  useEffect(() => {
    if (!authUser?.token) return;

    const loadWishlist = async () => {
      try {
        const res = await getWishlistAPI(authUser.token);
        setWishlist((res.data.wishlist || []).map((p) => p._id || p));
      } catch (err) {
        console.error("Wishlist load failed:", err);
      }
    };

    loadWishlist();
  }, [authUser?.token]);

  // -----------------------------------------------------
  // LOGIN USER
  // -----------------------------------------------------
  const loginUser = async (data) => {
    // allow calling loginUser(null) to clear state if ever needed
    if (!data || !data.token) {
      localStorage.removeItem("auth_user");
      setAuthUser({ user: null, token: "" });
      setWishlist([]);

      // clear all per-user cart keys on hard reset
      Object.keys(localStorage)
        .filter((k) => k.startsWith("brightrose_cart_v1_"))
        .forEach((k) => localStorage.removeItem(k));

      return;
    }

    setAuthUser(data);
    localStorage.setItem("auth_user", JSON.stringify(data));

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
    setWishlist([]);

    // Clear any stored carts so next user does not see previous items
    Object.keys(localStorage)
      .filter((k) => k.startsWith("brightrose_cart_v1_"))
      .forEach((k) => localStorage.removeItem(k));
  };

  // -----------------------------------------------------
  // LOGOUT ADMIN
  // -----------------------------------------------------
  const logoutAdmin = () => {
    localStorage.removeItem("auth_admin");
    setAuthAdmin({ user: null, token: "" });
  };

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
        setWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
