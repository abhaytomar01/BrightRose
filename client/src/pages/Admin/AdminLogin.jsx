// src/pages/Admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const authCtx = useAuth(); // may contain setAuth or loginAdmin depending on your context
  // prefer loginAdmin if your updated context has it, otherwise fallback to setAuth
  const loginAdminFn = authCtx?.loginAdmin || authCtx?.setAuth || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If admin already logged in (localStorage or context), redirect to admin dashboard
  useEffect(() => {
    try {
      // 1) If new context has admin state
      if (authCtx?.authAdmin?.token && authCtx?.authAdmin?.user?.role === "admin") {
        navigate("/admin/dashboard/profile", { replace: true });
        return;
      }

      // 2) If legacy single auth context has admin role
      if (authCtx?.auth?.user?.role === "admin" && authCtx?.auth?.token) {
        navigate("/admin/dashboard/profile", { replace: true });
        return;
      }

      // 3) Local storage fallback (isolated admin session)
      const storedAdmin = localStorage.getItem("auth_admin");
      if (storedAdmin) {
        const parsed = JSON.parse(storedAdmin);
        if (parsed?.token && parsed?.user?.role === "admin") {
          // Optionally sync into context if loginAdmin exists
          if (authCtx?.loginAdmin) authCtx.loginAdmin(parsed);
          navigate("/admin/dashboard/profile", { replace: true });
        }
      }
    } catch (err) {
      // ignore and let user login
      // console.error("Admin restore check error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/admin-login`,
        { email, password },
        {
          // Preflight/headers handled by browser; no special headers here.
        }
      );

      if (res.data?.success) {
        toast.success("Admin Login Successful!");

        const adminPayload = { user: res.data.user, token: res.data.token };

        // 1) If your context exposes loginAdmin, use it (recommended)
        if (authCtx?.loginAdmin) {
          authCtx.loginAdmin(adminPayload);
        } else if (authCtx?.setAuth) {
          // 2) Otherwise, try to set single auth (legacy) — but mark role admin will be inside user object.
          // This can conflict with user session — only do this if you intentionally want single auth.
          // Uncomment the next line if you want to reuse single auth (NOT recommended if you want strict separation):
          // authCtx.setAuth({ user: res.data.user, token: res.data.token });
        }

        // 3) Always save isolated admin session in localStorage (won't break user auth)
        try {
          localStorage.setItem("auth_admin", JSON.stringify(adminPayload));
        } catch (err) {
          console.warn("Could not save admin session to localStorage", err);
        }

        // Redirect to admin dashboard
        navigate("/admin/dashboard/profile", { replace: true });
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-4 pt-28 md:pt-36">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-center text-2xl font-serif tracking-widest mb-6">
          THE BRIGHT ROSE
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">Admin Panel Access</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition font-semibold tracking-wide"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">© The Bright Rose • Admin Only</p>
      </div>
    </div>
  );
};

export default AdminLogin;
