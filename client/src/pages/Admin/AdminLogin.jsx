// src/pages/Admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/admin-login`,
        { email, password }
      );

      if (res.data?.success) {
        toast.success("Admin Login Successful!");

        const user = res.data?.user || {};
        const token = res.data?.token || "";

        // VERY IMPORTANT:
        // Force role to admin if backend did not send role
        const role = user.role || "admin";

        const authData = {
          user: { ...user, role },
          token,
          role,
        };

        // Save in context + localStorage
        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));

        // Redirect to admin dashboard
        navigate("/admin/dashboard/profile", { replace: true });
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
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
        <p className="text-center text-gray-600 mb-6 text-sm">
          Admin Panel Access
        </p>

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

        <p className="text-center mt-6 text-xs text-gray-400">
          © The Bright Rose • Admin Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
