import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const emptyForm = {
  name: "",
  phone: "",
  pincode: "",
  address: "",
  city: "",
  state: "",
  isDefault: false,
};

const AddressComponent = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const token = authUser?.token;
  const redirect = new URLSearchParams(location.search).get("redirect");

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    if (!token) return;
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(data.addresses || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MODAL ================= */
  const openModal = (addr = null) => {
    if (addr) {
      setEditingId(addr._id);
      setForm({
        name: addr.name,
        phone: addr.phone,
        pincode: addr.pincode,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        isDefault: addr.isDefault || false,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  /* ================= SAVE ADDRESS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`;
      const method = editingId ? "put" : "post";
      const endpoint = editingId ? `${url}/${editingId}` : url;

      await axios({
        method,
        url: endpoint,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(editingId ? "Address updated" : "Address added");
      closeModal();
      fetchAddresses();

      // 🔁 Smooth return to checkout if user came from there
      if (redirect) {
        navigate(redirect);
      }
    } catch {
      toast.error("Failed to save address");
    }
  };

  /* ================= DELETE ================= */
  const deleteAddress = async (addressId) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  /* ================= UI ================= */
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light tracking-wide">Manage Addresses</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* ADDRESS LIST */}
      {addresses.length === 0 ? (
        <p className="text-sm text-gray-500">No saved addresses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="border border-gray-300 rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">
                  {addr.name}{" "}
                  {addr.isDefault && (
                    <span className="text-xs text-green-600">(Default)</span>
                  )}
                </h3>
                <div className="flex gap-3">
                  <Edit2
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => openModal(addr)}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => deleteAddress(addr._id)}
                  />
                </div>
              </div>

              <p className="mt-2 text-gray-700">{addr.address}</p>
              <p>
                {addr.city}, {addr.state} – {addr.pincode}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Phone: {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X />
            </button>

            <h3 className="text-lg mb-4">
              {editingId ? "Edit Address" : "Add Address"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full border p-3 rounded"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border p-3 rounded"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="w-full border p-3 rounded"
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
              <textarea
                className="w-full border p-3 rounded"
                placeholder="Complete Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <div className="flex gap-3">
                <input
                  className="w-full border p-3 rounded"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <input
                  className="w-full border p-3 rounded"
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                Set as default address
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
