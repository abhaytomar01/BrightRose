import { useAuth } from "../../context/auth";

const AdminProfile = () => {
  const { authAdmin } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Admin Profile</h1>

      <div className="bg-gray-50 p-4 rounded shadow-sm">
        <p><strong>Name:</strong> {authAdmin?.user?.name}</p>
        <p><strong>Email:</strong> {authAdmin?.user?.email}</p>
        <p><strong>Role:</strong> Admin</p>
      </div>
    </div>
  );
};

export default AdminProfile;
