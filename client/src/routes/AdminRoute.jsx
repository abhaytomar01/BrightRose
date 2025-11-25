// src/routes/AdminRoute.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import api from "../utils/apiClient";
import Spinner from "../components/Spinner";


const AdminRoute = () => {
const [ok, setOk] = useState(null);
const { auth, isContextLoading } = useAuth();


useEffect(() => {
const verifyAdmin = async () => {
try {
if (!auth?.token) {
setOk(false);
return;
}


// call backend admin-auth (api wrapper will add Authorization header)
const res = await api.get("/auth/admin-auth");


// require both backend ok AND frontend role check
const hasFrontendRole = auth.role === "admin" || auth.user?.role === "admin";
if (res.data?.ok && hasFrontendRole) setOk(true);
else setOk(false);
} catch (err) {
setOk(false);
}
};


if (!isContextLoading) verifyAdmin();
}, [auth?.token, isContextLoading]);


if (isContextLoading || ok === null) return <Spinner />;
if (!ok) return <Navigate to="/admin/login" replace />;
return <Outlet />;
};


export default AdminRoute;