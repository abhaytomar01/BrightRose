// src/routes/PrivateRoute.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const { auth, logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user-auth`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

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

    checkAuth();
  }, [auth?.token, logout]);

  if (loading) return <Spinner />;

  if (!ok) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
