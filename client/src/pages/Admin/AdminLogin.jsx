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

      if (res.data.success) {
  toast.success("Admin Login Successful!");

  const authData = {
    user: res.data.user,
    token: res.data.token,
  };

  setAuth(authData);
  localStorage.setItem("auth", JSON.stringify(authData));

  navigate("/admin/dashboard");
}

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-4 pt-28 md:pt-36">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200">

        {/* Logo */}
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
