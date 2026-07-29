// LogoutButton.jsx
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { loginUser } = useAuth(); // reuse your existing setter
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth_user");
    // clear context
    loginUser(null); // you can treat null as logout in your context
    navigate("/login");
  };

  return (
    <button onClick={logout} className="bg-gray-300 px-4 py-2 rounded">
      Logout
    </button>
  );
}
