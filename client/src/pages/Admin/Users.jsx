import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Users = () => {
  const { authAdmin } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/all-users`,
        {
          headers: { Authorization: `Bearer ${authAdmin.token}` }
        }
      );
      setUsers(res.data.users);
    };
    load();
  }, []);

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

      {users.map((u) => (
        <div key={u._id} className="bg-gray-100 p-3 rounded shadow flex justify-between">
          <div>
            <p><strong>{u.name}</strong></p>
            <p>{u.email}</p>
          </div>
          <button
            onClick={() => deleteUser(u._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Users;
