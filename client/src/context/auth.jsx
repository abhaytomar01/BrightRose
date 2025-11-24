import { createContext, useState, useEffect, useContext } from "react";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || "",
  });

  useEffect(() => {
    if (auth.user && auth.token) {
      localStorage.setItem("user", JSON.stringify(auth.user));
      localStorage.setItem("token", auth.token);
    }
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth({ user: null, token: "" });
  };

  return (
    <Auth.Provider value={{ auth, setAuth, logout }}>
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => useContext(Auth);
