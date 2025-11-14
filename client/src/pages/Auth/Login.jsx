import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ If user already logged in, redirect to dashboard
  useEffect(() => {
    if (auth?.token) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [auth?.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        { email, password }
      );

      if (res.data?.success) {
        toast.success("Login successful!");
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        navigate("/user/dashboard");
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center mt-32 md:mt-48">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-xl w-[350px] flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
        >
          Login
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          New to Bright Rose?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
