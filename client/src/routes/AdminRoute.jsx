import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/apiClient";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const AdminRoute = () => {
  const { authAdmin, loading, loginAdmin } = useAuth();
  const [verified, setVerified] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    // ⭐ 1 — LocalStorage restore must complete first
    if (loading) return;

    // ⭐ 2 — If context does NOT have token, try restoring it
    if (!authAdmin?.token) {
      const stored = localStorage.getItem("auth_admin");
      if (stored) {
        loginAdmin(JSON.parse(stored));  // restore to context
        return; // wait for next state update
      }

      // no token anywhere → not logged in
      setVerified(true);
      setOk(false);
      return;
    }

    // ⭐ 3 — If token exists, verify with backend only ONCE
    verifyToken();
  }, [loading, authAdmin?.token]);

  const verifyToken = async () => {
    try {
      const res = await api.get("/api/v1/auth/admin-auth");
      setOk(res.data?.ok === true);
    } catch (err) {
      setOk(false);
    } finally {
      setVerified(true);
    }
  };

  // ⏳ Still loading auth data? show spinner
  if (!verified) return <Spinner />;

  // ❌ Not admin → redirect
  if (!ok) return <Navigate to="/admin/login" replace />;

  // ✅ Allow admin
  return <Outlet />;
};

export default AdminRoute;
        