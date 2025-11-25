// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const navigate = useNavigate();
// add role to state
const [auth, setAuthState] = useState({ user: null, token: "", role: null });
const [isContextLoading, setIsContextLoading] = useState(true);


useEffect(() => {
try {
const raw = localStorage.getItem("auth");
if (raw) {
const parsed = JSON.parse(raw);
if (parsed?.user && parsed?.token) {
setAuthState({
user: parsed.user,
token: parsed.token,
role: parsed.role || parsed.user?.role || null,
});
}
}
} catch (err) {
console.error("Error restoring auth:", err);
} finally {
setIsContextLoading(false);
}
}, []);


// setAuth expects { user, token, role }
const setAuth = ({ user, token, role }) => {
const finalRole = role || user?.role || null;
setAuthState({ user, token, role: finalRole });
try {
localStorage.setItem("auth", JSON.stringify({ user, token, role: finalRole }));
} catch (err) {
console.error("Error saving auth:", err);
}
};


const logout = (opts = { redirect: "/login" }) => {
localStorage.removeItem("auth");
setAuthState({ user: null, token: "", role: null });
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