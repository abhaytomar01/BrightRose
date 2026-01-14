import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth"; // Fix path
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X } from "lucide-react";

const AddressComponent = () => {
  const { authUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Use _id

  const [form, setForm] = useState({
    name: "", phone: "", pincode: "", address: "", city: "", state: "", isDefault: false
  });

  useEffect(() => {
    if (!authUser?.token) return;
    fetchAddresses();
  }, [authUser]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`, {
        headers: { Authorization: `Bearer ${authUser.token}` }
      });
      setAddresses(data.addresses || []);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (addr = null) => {
    if (addr) {
      setEditingId(addr._id);
      setForm(addr);
    } else {
      setEditingId(null);
      setForm({ name: "", phone: "", pincode: "", address: "", city: "", state: "", isDefault: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`;
      let method = editingId ? 'put' : 'post';
      let body = editingId ? { ...form, addrId: editingId } : form; // Backend handles via params/body

      await axios({ method, url: `${url}/${editingId || ''}`, data: body, 
        headers: { Authorization: `Bearer ${authUser.token}` } });
      
      toast.success("Address updated");
      fetchAddresses();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const deleteAddress = async (addrId) => {
    if (!confirm("Delete this address?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses/${addrId}`, {
        headers: { Authorization: `Bearer ${authUser.token}` }
      });
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light tracking-wide">Manage Addresses</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition">
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr._id} className="border border-gray-300 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-medium">{addr.name} {addr.isDefault && '(Default)'}</h3>
              <div className="flex gap-3">
                <Edit2 className="cursor-pointer hover:text-blue-500" size={18} onClick={() => openModal(addr)} />
                <Trash2 className="cursor-pointer hover:text-red-500" size={18} onClick={() => deleteAddress(addr._id)} />
              </div>
            </div>
            <p className="mt-2 text-gray-700">{addr.address}</p>
            <p>{addr.city}, {addr.state} – {addr.pincode}</p>
            <p className="mt-2 text-sm text-gray-500">Phone: {addr.phone}</p>
          </div>
        ))}
      </div>

      {/* Modal unchanged except form fields: addressLine -> address, add isDefault checkbox */}
      {isModalOpen && (
        // ... existing modal JSX, update placeholder="Complete Address" value={form.address}, add:
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({...form, isDefault: e.target.checked})} />
          <label>Set as Default</label>
        </div>
        // ... rest unchanged
      )}
    </div>
  );
};

export default AddressComponent;
