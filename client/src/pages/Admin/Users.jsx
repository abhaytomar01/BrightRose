// src/pages/Admin/Users.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const Users = () => {
  const { authAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!authAdmin?.token) return;

    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/all-users`,
          {
            headers: { Authorization: `Bearer ${authAdmin.token}` },
          }
        );

        if (res.data?.success) {
          setUsers(res.data.users || []);
        } else {
          setUsers([]);
          toast.error(res.data?.message || "Failed to load users");
        }
      } catch (err) {
        console.error("Admin users error:", err);
        setUsers([]);
        toast.error(
          err.response?.data?.message || "Unable to fetch users"
        );
      }
    };

    load();
  }, [authAdmin?.token]);

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/user/delete-user/${id}`,
      { headers: { Authorization: `Bearer ${authAdmin.token}` } }
    );
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-3">Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            className="bg-gray-100 p-3 rounded shadow flex justify-between"
          >
            <div>
              <p>
                <strong>{u.name}</strong>
              </p>
              <p>{u.email}</p>
            </div>
            <button
              onClick={() => deleteUser(u._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Users;
