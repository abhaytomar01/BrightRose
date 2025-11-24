import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const AdminRoute = () => {
  const [ok, setOk] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/admin-auth`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setOk(res.data.ok === true);
      } catch (err) {
        setOk(false);
      }
    };

    verifyAdmin();
  }, [auth?.token]);

  if (ok === null) return <Spinner />;
  if (!ok) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
