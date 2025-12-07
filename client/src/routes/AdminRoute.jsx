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
    if (loading) return;

    // No token → try restoring
    if (!authAdmin?.token) {
      const stored = localStorage.getItem("auth_admin");
      if (stored) {
        loginAdmin(JSON.parse(stored));
        return; // wait next cycle (VERY IMPORTANT)
      }

      setVerified(true);
      setOk(false);
      return;
    }

    // Token exists → now verify
    verifyAdmin();
  }, [authAdmin?.token, loading]);

  const verifyAdmin = async () => {
    try {
      const res = await api.get("/api/v1/auth/admin-auth");
      setOk(res.data?.ok === true);
    } catch (err) {
      setOk(false);
    } finally {
      setVerified(true);
    }
  };

  if (!verified) return <Spinner />;
  if (!ok) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
