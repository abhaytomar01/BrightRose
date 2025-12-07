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
    // 1️⃣ While loading auth from localStorage → DO NOTHING
    if (loading) return;

    // 2️⃣ Try restoring from localStorage if context empty
    if (!authAdmin?.token) {
      const stored = localStorage.getItem("auth_admin");
      if (stored) {
        loginAdmin(JSON.parse(stored)); // restore into context
        return; // ⛔ WAIT FOR NEXT RENDER BEFORE CHECKING
      }

      // no admin token anywhere
      setVerified(true);
      setOk(false);
      return;
    }

    // 3️⃣ Token exists → now verify with backend
    verifyAdmin();
  }, [authAdmin?.token, loading]);

  const verifyAdmin = async () => {
    try {
      const res = await api.get("/api/v1/auth/admin-auth");
      setOk(res.data?.ok === true);
    } catch {
      setOk(false);
    } finally {
      setVerified(true);
    }
  };

  // ⏳ STILL restoring? show spinner
  if (!verified) return <Spinner />;

  // ❌ Failed authentication
  if (!ok) return <Navigate to="/admin/login" replace />;

  // ✅ Admin allowed
  return <Outlet />;
};

export default AdminRoute;
