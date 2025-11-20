/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import axios from "axios";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import SeoData from "../../SEO/SeoData";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [userFound, setUserFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (email === "test@test.com" || email === "store@flipkart.com") {
      toast.error("Functionality disabled for demo accounts.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (userFound) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/forgot-password`,
          { email, password }
        );

        if (response.status === 200) {
          toast.success("Password Reset Successfully!");
          navigate("/login");
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user-exist`,
          { email }
        );

        if (response.status === 200) setUserFound(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("User not found!");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SeoData title="Forgot Password | Bright Rose" />

      <section className="min-h-screen bg-[#FCF7F1] flex items-center justify-center px-6 pt-32 md:pt-44 pb-20">
        <div className="w-full max-w-lg">
          
          {/* Luxury Title */}
          <h1 className="text-4xl sm:text-5xl font-light tracking-[6px] text-[#B88646] uppercase text-center mb-10">
            Forgot Password
          </h1>

          {/* Form Card */}
          <div className="bg-white p-10 rounded-xl border border-[#e6ddce] shadow-sm">
            {isSubmitting ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-8">

                {/* Email */}
                <div>
                  <label className="block text-sm tracking-wide text-[#704214] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="
                      w-full px-4 py-3 
                      bg-[#FDFDFC]
                      border border-[#d4c5ae]
                      rounded-md
                      focus:outline-none focus:border-[#B88646]
                      text-[#704214]
                      placeholder-[#c1a98b]
                    "
                  />
                </div>

                {/* Password reset fields if user exists */}
                {userFound && (
                  <>
                    {/* New Password */}
                    <div>
                      <label className="block text-sm tracking-wide text-[#704214] mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          minLength={5}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="
                            w-full px-4 py-3 pr-12
                            bg-[#FDFDFC]
                            border border-[#d4c5ae]
                            rounded-md
                            focus:outline-none focus:border-[#B88646]
                            text-[#704214]
                            placeholder-[#c1a98b]
                          "
                        />

                        <span
                          className="absolute right-3 top-3 cursor-pointer text-gray-600 hover:text-[#704214]"
                          onClick={handlePasswordToggle}
                        >
                          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm tracking-wide text-[#704214] mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="
                          w-full px-4 py-3
                          bg-[#FDFDFC]
                          border border-[#d4c5ae]
                          rounded-md
                          focus:outline-none focus:border-[#B88646]
                          text-[#704214]
                          placeholder-[#c1a98b]
                        "
                      />
                    </div>
                  </>
                )}

                {/* Terms */}
                <p className="text-xs text-[#a1866f] leading-relaxed">
                  By continuing, you agree to Bright Rose’s Terms of Use and Privacy Policy.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    w-full py-3 
                    text-sm tracking-[3px]
                    uppercase 
                    border border-[#B88646]
                    text-[#704214]
                    rounded-md
                    hover:bg-[#B88646]/10
                    transition
                  "
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
