// src/routes/PrivateRoute.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import api from "../utils/apiClient";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const { auth, logout, isContextLoading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          setLoading(false);
          return;
        }

        const res = await api.get("/auth/user-auth");
        if (res.data?.ok) setOk(true);
        else {
          setOk(false);
          logout({ redirect: "/login" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Session expired, please log in again.");
        logout({ redirect: "/login" });
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isContextLoading) checkAuth();
  }, [auth?.token, logout, isContextLoading]);

  if (isContextLoading || loading) return <Spinner />;
  if (!ok) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default PrivateRoute;
