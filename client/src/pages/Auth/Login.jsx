import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (auth?.token && auth?.user?.role === "user") {
      navigate("/user/dashboard/profile");
    }
  }, [auth]);

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
        setAuth({ user: res.data.user, token: res.data.token });

        if (remember)
          localStorage.setItem(
            "auth",
            JSON.stringify({ user: res.data.user, token: res.data.token })
          );

        navigate("/user/dashboard/profile");
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-pureWhite flex items-center justify-center px-6 pt-36 pb-20 md:pt-44">

      <div className="w-full max-w-md text-center">

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-light tracking-[4px] text-neutralDark/80 uppercase mb-10">
          Login
        </h1>

        {/* FORM CARD */}
        <div className="bg-white border border-mutedGray/70 rounded-2xl p-10 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6 text-left">

            {/* Email */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="yourname@example.com"
                value={form.email}
                onChange={handleChange}
                className="
                  w-full px-4 py-3 
                  bg-neutralLight
                  border border-mutedGray
                  rounded-md
                  focus:outline-none 
                  focus:border-accentGold
                  text-neutralDark
                  placeholder-gray-400
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 pr-12
                    bg-neutralLight
                    border border-mutedGray
                    rounded-md
                    focus:outline-none 
                    focus:border-accentGold
                    text-neutralDark
                    placeholder-gray-400
                  "
                />

                <button
                  type="button"
                  className="absolute right-3 top-3 text-neutralDark/60 hover:text-neutralDark"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-neutralDark">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-neutralDark/80 underline hover:text-neutralDark/70"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 
                text-sm tracking-[3px]
                uppercase border border-accentGold 
                text-neutralDark/80
                rounded-md
                hover:bg-accentGold/10
                transition
              "
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <p className="text-center text-gray-500 text-sm my-6">OR</p>

          {/* Register Link */}
          <p className="text-center text-sm text-neutralDark">
            New to Bright Rose?{" "}
            <Link
              to="/register"
              className="text-neutralDark/80 underline hover:text-[#8c000c]"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
};

export default Login;
