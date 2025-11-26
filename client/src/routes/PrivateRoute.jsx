import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/apiClient";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const PrivateRoute = () => {
  const { authUser, loading, logoutUser } = useAuth();
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const check = async () => {
      if (!authUser.token) return setOk(false);

      try {
       await api.get("/api/v1/auth/user-auth",  {
          headers: { Authorization: `Bearer ${authUser.token}` },
        });
        setOk(res.data.ok === true);
      } catch (err) {
        logoutUser();
        setOk(false);
      }
    };

    if (!loading) check();
  }, [authUser.token, loading]);

  if (loading || ok === null) return <Spinner />;
  if (!ok) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
