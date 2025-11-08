import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const { auth, logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user-auth`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
          logout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Session expired, please log in again.");
        logout();
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [auth?.token]);

  // ✅ 1. While checking auth, show spinner
  if (loading) return <Spinner />;

  // ✅ 2. If not logged in or token invalid, redirect
  if (!ok) return <Navigate to="/login" replace />;

  // ✅ 3. If valid user, render dashboard routes
  return <Outlet />;
};

export default PrivateRoute;
