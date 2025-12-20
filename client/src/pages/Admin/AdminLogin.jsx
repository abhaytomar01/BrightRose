// src/pages/Admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { authAdmin, loginAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If admin already logged in, redirect to admin dashboard
  useEffect(() => {
    // wait until auth context finishes restoring
    if (loading) return;
    try {
      if (authAdmin?.token && authAdmin?.user?.role === "admin") {
        navigate("/admin/dashboard/profile", { replace: true });
      } else {
        // also check localStorage fallback for older sessions
        const stored = localStorage.getItem("auth_admin");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token && parsed?.user?.role === "admin") {
            // sync into context if loginAdmin exists
            if (loginAdmin) loginAdmin(parsed);
            navigate("/admin/dashboard/profile", { replace: true });
          }
        }
      }
    } catch (err) {
      // swallow — user will see login form
      // console.error("Admin restore:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAdmin, loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter email and password");
      return;
    }

    setSubmitting(true);
    try {
      // Use api client directly (baseURL + interceptors)
      const res = await api.post("/api/v1/auth/admin-login", { email, password });


      if (res?.data?.success) {
        toast.success("Admin Login Successful!");

        const adminPayload = {
          user: res.data.user,
          token: res.data.token,
        };

        // Save isolated admin session to context + localStorage
        if (loginAdmin) loginAdmin(adminPayload);
        try {
          localStorage.setItem("auth_admin", JSON.stringify(adminPayload));
        } catch (err) {
          // ignore localStorage errors
        }

        // Navigate to admin dashboard
        navigate("/admin/dashboard/profile", { replace: true });
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login request failed";
      toast.error(msg);
      console.error("Admin login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center px-2 pt-0 md:pt-24">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-center text-xl md:text-2xl font-serif tracking-widest mb-6">
          THE BRIGHT ROSE
        </h1>
        <p className="text-center text-gray-600 mb-6 text-sm">Admin Access</p>

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
            disabled={submitting}
            className="mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition font-semibold tracking-wide"
          >
            {submitting ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">© The Bright Rose • Admin Only</p>
      </div>

      
    </div>
  );
};



export default AdminLogin;
