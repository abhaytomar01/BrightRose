import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { auth } = useAuth();

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold">Welcome, {auth.user?.name}</h2>
      <p className="text-gray-600">Your email: {auth.user?.email}</p>
    </div>
  );
}
