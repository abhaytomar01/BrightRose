// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getWishlistAPI } from "../api/wishlist"; // <-- IMPORTANT

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({ user: null, token: "" });
  const [authAdmin, setAuthAdmin] = useState({ user: null, token: "" });
  const [loading, setLoading] = useState(true);

  // ⭐ Wishlist stored globally for logged-in user
  const [wishlist, setWishlist] = useState([]);

  // ----------------------------------------------------
  // Load auth user/admin from localStorage
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Auto-fetch wishlist when user logs in
  // ----------------------------------------------------
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!authUser?.token) return;

      try {
        const res = await getWishlistAPI(authUser.token);
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };

    fetchWishlist();
  }, [authUser]);

  // ----------------------------------------------------
  // LOGIN USER
  // ----------------------------------------------------
  const loginUser = (data) => {
  setAuthUser(data);
  localStorage.setItem("auth_user", JSON.stringify(data));

  if (data?.token) {
    getWishlistAPI(data.token)
      .then((res) => setWishlist(res.data.wishlist || []))
      .catch(() => {});
  }
};


  // ----------------------------------------------------
  // LOGIN ADMIN
  // ----------------------------------------------------
  const loginAdmin = (data) => {
    setAuthAdmin(data);
    localStorage.setItem("auth_admin", JSON.stringify(data));
  };

  // ----------------------------------------------------
  // LOGOUT USER
  // ----------------------------------------------------
  const logoutUser = () => {
    localStorage.removeItem("auth_user");
    setAuthUser({ user: null, token: "" });
    setWishlist([]); // CLEAR wishlist on logout
  };

  // ----------------------------------------------------
  // LOGOUT ADMIN
  // ----------------------------------------------------
  const logoutAdmin = () => {
    localStorage.removeItem("auth_admin");
    setAuthAdmin({ user: null, token: "" });
  };

  // ----------------------------------------------------
  // PROVIDER EXPORT
  // ----------------------------------------------------
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
        setWishlist, // needed for updating after add/remove
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export hook
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
