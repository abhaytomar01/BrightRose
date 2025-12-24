import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // ===== READ TARGET PATH =====
  const redirectTo = location.state?.redirectTo || "/user/dashboard/profile";

  // Redirect if already logged in
  useEffect(() => {
    if (authUser?.token) {
      navigate(redirectTo, { replace: true });
    }
  }, [authUser, navigate, redirectTo]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        { email: form.email, password: form.password }
      );

      if (res.data?.success) {
        toast.success("Login successful!");

        loginUser({
          user: res.data.user,
          token: res.data.token,
        });

        if (remember) {
          localStorage.setItem(
            "auth_user",
            JSON.stringify({ user: res.data.user, token: res.data.token })
          );
        }

        // ===== REDIRECT TO INTENDED PAGE =====
        navigate(redirectTo, { replace: true });

      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md">

        <h1 className="text-4xl text-center mb-10 tracking-[4px] font-light uppercase">
          Login
        </h1>

        <div className="bg-white border rounded-2xl p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                className="w-full px-4 py-3 bg-neutralLight border rounded-md"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-neutralLight border rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-neutralDark/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-accentGold rounded-md tracking-[3px] uppercase hover:bg-accentGold/10"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            New to Bright Rose?{" "}
            <Link to="/register" className="underline">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
