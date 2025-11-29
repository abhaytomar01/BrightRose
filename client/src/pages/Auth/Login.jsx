import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { authUser, loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // redirect if already logged in
  useEffect(() => {
  if (authUser?.token) {
    navigate("/user/dashboard/profile");
  }
}, [authUser]);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        form
      );

      if (res.data?.success) {

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

  toast.success("Login successful!");

  navigate("/user/dashboard/profile");
  if (onClose) onClose();
}

    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-6 pt-36 md:pt-44">

      <div className="w-full max-w-md text-center">

        {/* TITLE */}
        <h1 className="text-4xl font-light tracking-[4px] uppercase mb-10 text-neutralDark">
          Login
        </h1>

        <div className="bg-white border border-gray-300 rounded-2xl p-10 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6 text-left">

            <div>
              <label className="text-sm text-neutralDark">Email Address</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                className="w-full px-4 py-3 bg-gray-100 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm text-neutralDark">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border rounded-md"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex gap-2">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-accentGold tracking-[3px] uppercase rounded-md hover:bg-accentGold/10"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            New to Bright Rose?{" "}
            <Link to="/register" className="underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
