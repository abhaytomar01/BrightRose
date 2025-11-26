// src/routes/AdminRoute.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/apiClient";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const AdminRoute = () => {
  const { authAdmin, loading } = useAuth();
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (!authAdmin?.token) return setOk(false);

      try {
        const res = await api.get("/api/v1/auth/admin-auth", {
          headers: {
            Authorization: `Bearer ${authAdmin.token}`,
          },
        });
        setOk(res.data?.ok === true);
      } catch (err) {
        setOk(false);
      }
    };

    if (!loading) check();
  }, [authAdmin?.token, loading]);

  if (loading || ok === null) return <Spinner />;
  if (!ok) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
