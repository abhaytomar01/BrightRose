// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuthState] = useState({ user: null, token: "" });
  const [isContextLoading, setIsContextLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user && parsed?.token) {
          setAuthState({ user: parsed.user, token: parsed.token });
        }
      }
    } catch (err) {
      console.error("Error restoring auth:", err);
    } finally {
      setIsContextLoading(false);
    }
  }, []);

  // setAuth expects { user, token } - token must be the raw JWT (no "Bearer ")
  const setAuth = ({ user, token }) => {
    setAuthState({ user, token });
    try {
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    } catch (err) {
      console.error("Error saving auth:", err);
    }
  };

  const logout = (opts = { redirect: "/login" }) => {
    localStorage.removeItem("auth");
    setAuthState({ user: null, token: "" });
    if (opts.redirect) navigate(opts.redirect);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, isContextLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
