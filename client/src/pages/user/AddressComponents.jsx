import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth.jsx";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X } from "lucide-react";

const API = import.meta.env.VITE_SERVER_URL; // base URL

const AddressComponent = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    default: false,
  });

  // -------------------------------------------------------
  // Fetch Addresses
  // -------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.error("Address fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  // -------------------------------------------------------
  // OPEN MODAL
  // -------------------------------------------------------
  const openModal = (addr = null) => {
    if (addr) {
      setEditingAddress(addr._id);
      setForm(addr);
    } else {
      setEditingAddress(null);
      setForm({
        label: "Home",
        name: "",
        phone: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
        default: false,
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // -------------------------------------------------------
  // ADD / UPDATE ADDRESS
  // -------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        // UPDATE
        const res = await axios.put(
          `${API}/api/v1/address/${editingAddress}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAddresses(res.data.addresses);
        toast.success("Address updated successfully");
      } else {
        // ADD
        if (addresses.length >= 3) {
          return toast.error("You can add up to 3 addresses");
        }

        const res = await axios.post(`${API}/api/v1/address/add`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses(res.data.addresses);
        toast.success("Address added");
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  // -------------------------------------------------------
  // DELETE ADDRESS
  // -------------------------------------------------------
  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(`${API}/api/v1/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(res.data.addresses);
      toast.success("Address removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  if (loading) return <p className="p-4">Loading addresses...</p>;

  return (
    <div className="p-6">

      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light tracking-wide">Manage Addresses</h2>

        {addresses.length < 3 && (
          <button
            className="flex items-center gap-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
            onClick={() => openModal()}
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border border-gray-300 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{addr.name}</h3>

              <div className="flex gap-3">
                <Edit2
                  size={18}
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => openModal(addr)}
                />

                <Trash2
                  size={18}
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => deleteAddress(addr._id)}
                />
              </div>
            </div>

            <p className="mt-2 text-gray-700">{addr.address}</p>
            <p className="text-gray-700">
              {addr.city}, {addr.state} – {addr.pincode}
            </p>

            <p className="mt-2 text-sm text-gray-500">Phone: {addr.phone}</p>

            {addr.default && (
              <span className="inline-block mt-2 px-3 py-1 text-xs bg-black text-white rounded-full">
                Default Address
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-[999]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">

            <button
              onClick={closeModal}
              className="absolute right-4 top-4"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* FORM FIELDS */}
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Phone Number"
                maxLength="10"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Pincode"
                required
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <textarea
                placeholder="Complete Address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border p-3 rounded-md h-20"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-1/2 border p-3 rounded-md"
                />

                <input
                  type="text"
                  placeholder="State"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-1/2 border p-3 rounded-md"
                />
              </div>

              <button className="w-full py-3 mt-2 rounded-md bg-black text-white tracking-wide hover:opacity-90 transition">
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
