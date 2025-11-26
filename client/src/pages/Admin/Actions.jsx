// src/pages/Admin/Actions.jsx
import { Link, useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const Actions = ({ id, name, updateDeletedProduct }) => {
  const { authAdmin } = useAuth();
  const navigate = useNavigate();

  const deleteHandler = async () => {
    if (!confirm(`Delete product "${name}"?`)) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${authAdmin.token}` }
      });

      if (res.status === 200 || res.data?.success) {
        toast.success("Product deleted");
        updateDeletedProduct(id);
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(err.response?.data?.message || "Error deleting product");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Link to={`/admin/dashboard/product/${id}`} className="p-1 rounded hover:bg-gray-100" title="Edit">
        <EditOutlinedIcon fontSize="small" />
      </Link>

      <button onClick={deleteHandler} className="p-1 rounded hover:bg-gray-100 text-red-600" title="Delete">
        <DeleteOutlineIcon fontSize="small" />
      </button>
    </div>
  );
};

export default Actions;
