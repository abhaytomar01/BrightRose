import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: "" });
    navigate("/login");
  };

  return <button onClick={logout} className="bg-gray-300 px-4 py-2 rounded">Logout</button>;
}
