import { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem("token") || "", 
  });

  // const navigate = useNavigate();

  // ✅ Restore user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setAuth({ user: JSON.parse(storedUser), token: storedToken });
    }
  }, []);

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("auth"); // remove token + user
    setAuth({ user: null, token: "" });
    navigate("/login"); // redirect
  };

  return (
    <Auth.Provider value={{ auth, setAuth, logout }}>
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => useContext(Auth);
