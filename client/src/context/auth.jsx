// ==================================================
// AUTH CONTEXT (Fixed + Production Ready)
// ==================================================
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // -----------------------------------------------
  // 🟢 Load auth from localStorage on first load
  // -----------------------------------------------
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setAuth({
        user: parsed.user,
        token: parsed.token,
      });
    }
  }, []);

  // -----------------------------------------------
  // 🟢 Automatically attach token to all axios requests
  // -----------------------------------------------
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    // Persist to localStorage
    localStorage.setItem("auth", JSON.stringify(auth));

  }, [auth]);


  // -----------------------------------------------
  // 🔴 LOGOUT
  // -----------------------------------------------
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: "" });
    window.location.href = "/login";   // forces refresh + clears protected routes
  };


  return (
    <Auth.Provider value={{ auth, setAuth, logout }}>
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => useContext(Auth);
