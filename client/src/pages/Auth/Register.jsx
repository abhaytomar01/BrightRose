import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: res.data.user, token: res.data.token })
        );

        toast.success("Registered & logged in");
        navigate("/");
      } else {
        toast.error(res.data?.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-pureWhite flex items-center justify-center px-6 pt-36 pb-20 md:pt-44">

      <div className="w-full max-w-lg text-center">

        {/* TITLE */}
        <h1 className="text-4xl sm:text-5xl font-light tracking-[4px] text-neutralDark/80 uppercase mb-10">
          Register
        </h1>

        {/* FORM CARD */}
        <div className="bg-white border border-mutedGray/70 rounded-2xl p-10 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-6 text-left">

            {/* FULL NAME */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="
                  w-full px-4 py-3 
                  bg-neutralLight
                  border border-mutedGray
                  rounded-md
                  focus:outline-none focus:border-accentGold
                  text-neutralDark
                  placeholder-gray-400
                "
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="
                  w-full px-4 py-3 
                  bg-neutralLight
                  border border-mutedGray
                  rounded-md
                  focus:outline-none focus:border-accentGold
                  text-neutralDark
                  placeholder-gray-400
                "
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="
                  w-full px-4 py-3 
                  bg-neutralLight
                  border border-mutedGray
                  rounded-md
                  focus:outline-none focus:border-accentGold
                  text-neutralDark
                  placeholder-gray-400
                "
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                placeholder="Your full address"
                className="
                  w-full px-4 py-3 
                  bg-neutralLight
                  border border-mutedGray
                  rounded-md
                  focus:outline-none focus:border-accentGold
                  text-neutralDark
                  placeholder-gray-400
                "
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="
                    w-full px-4 py-3 pr-12
                    bg-neutralLight
                    border border-mutedGray
                    rounded-md
                    focus:outline-none focus:border-accentGold
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm tracking-wide text-neutralDark mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="
                    w-full px-4 py-3 pr-12
                    bg-neutralLight
                    border border-mutedGray
                    rounded-md
                    focus:outline-none focus:border-accentGold
                    text-neutralDark
                    placeholder-gray-400
                  "
                />

                <button
                  type="button"
                  className="absolute right-3 top-3 text-neutralDark/60 hover:text-neutralDark"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
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
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 text-center text-gray-500 text-sm">
            OR
          </div>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-neutralDark">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-neutralDark/80 underline hover:text-neutralDark/70"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
};

export default Register;
