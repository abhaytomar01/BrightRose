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
    if (auth?.token) navigate("/user/dashboard", { replace: true });
  }, [auth?.token]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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

        navigate("/user/dashboard");
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
    <section className="min-h-screen bg-[#FCF7F1] flex items-center justify-center px-6 pt-36 pb-20 md:pt-44">
      
      <div className="w-full max-w-md text-center">

        {/* LUXURY TITLE */}
        <h1 className="text-4xl sm:text-5xl font-light tracking-[6px] text-[#B88646] uppercase mb-10">
          Login
        </h1>

        {/* FORM CARD */}
        <div className="bg-white border border-[#e6ddce] rounded-xl p-10 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6 text-left">

            {/* Email */}
            <div>
              <label className="block text-sm tracking-wide text-[#704214] mb-1">
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
                  bg-[#FDFDFC]
                  border border-[#d4c5ae]
                  rounded-md
                  focus:outline-none 
                  focus:border-[#B88646]
                  text-[#704214]
                  placeholder-[#c1a98b]
                  tracking-wide
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm tracking-wide text-[#704214] mb-1">
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
                    bg-[#FDFDFC]
                    border border-[#d4c5ae]
                    rounded-md
                    focus:outline-none 
                    focus:border-[#B88646]
                    text-[#704214]
                    placeholder-[#c1a98b]
                    tracking-wide
                  "
                />

                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600 hover:text-[#704214]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-[#704214]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#AD000F] underline hover:text-[#8c000c]"
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
                uppercase border border-[#B88646] 
                text-[#704214]
                rounded-md
                hover:bg-[#B88646]/10
                transition
              "
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <p className="text-center text-gray-500 text-sm my-6">OR</p>

          {/* Register Link */}
          <p className="text-center text-sm text-[#704214]">
            New to Bright Rose?{" "}
            <Link
              to="/register"
              className="text-[#AD000F] underline hover:text-[#8c000c]"
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
