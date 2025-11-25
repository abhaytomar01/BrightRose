// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState({ user: null, token: "" });
  const [authAdmin, setAuthAdmin] = useState({ user: null, token: "" });
  const [loading, setLoading] = useState(true);

  // Load from localStorage
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

  const loginUser = (data) => {
    setAuthUser(data);
    localStorage.setItem("auth_user", JSON.stringify(data));
  };

  const loginAdmin = (data) => {
    setAuthAdmin(data);
    localStorage.setItem("auth_admin", JSON.stringify(data));
  };

  const logoutUser = () => {
    localStorage.removeItem("auth_user");
    setAuthUser({ user: null, token: "" });
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
