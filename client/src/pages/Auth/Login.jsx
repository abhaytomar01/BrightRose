import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, X } from "lucide-react";

const Login = ({ onClose }) => {
  const navigate = useNavigate();

  // correct context
  const { authUser, loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (authUser?.token) {
      navigate("/user/dashboard/profile");
    }
  }, [authUser]);

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

        // correct login function
        loginUser({
          user: res.data.user,
          token: res.data.token,
        });

        // remember me using correct key
        if (remember) {
          localStorage.setItem(
            "auth_user",
            JSON.stringify({ user: res.data.user, token: res.data.token })
          );
        }

        if (onClose) onClose(); // close popup if open
        navigate("/user/dashboard/profile");
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl relative">

        {/* CLOSE BUTTON */}
        {onClose && (
          <button 
            className="absolute right-4 top-4 text-gray-600 hover:text-black"
            onClick={onClose}
          >
            <X size={26} />
          </button>
        )}

        <h1 className="text-3xl text-center font-light tracking-[4px] uppercase text-neutralDark mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm text-neutralDark mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="yourname@example.com"
              className="w-full px-4 py-3 bg-neutralLight border border-mutedGray rounded-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-neutralDark mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-neutralLight border border-mutedGray rounded-md"
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
            className="w-full py-3 border border-accentGold text-neutralDark tracking-[3px] uppercase rounded-md hover:bg-accentGold/10"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm">
          New to Bright Rose?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              if (onClose) onClose();
              navigate("/register");
            }}
          >
            Create account
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
