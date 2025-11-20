/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

const AdminRoute = () => {
  const [isAllowed, setIsAllowed] = useState(null); // null = loading
  const { auth, isContextLoading } = useAuth();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // If no token stored → redirect to admin login
        if (!auth?.token) {
          setIsAllowed(false);
          return;
        }

        // Backend check
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/admin-auth`,
          {
            headers: { Authorization: auth.token },
          }
        );

        if (res.data.ok) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } catch (error) {
        setIsAllowed(false);
      }
    };

    if (!isContextLoading) {
      verifyAdmin();
    }
  }, [auth?.token, isContextLoading]);

  // Still loading context → show spinner
  if (isContextLoading || isAllowed === null) {
    return <Spinner />;
  }

  // Not admin → redirect to Admin Login
  if (!isAllowed) {
    return <Navigate to="/admin/login" />;
  }

  // Allowed → show admin pages
  return <Outlet />;
};

export default AdminRoute;
