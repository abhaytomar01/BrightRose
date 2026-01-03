import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth.jsx";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X } from "lucide-react";

const AddressComponent = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const API = import.meta.env.VITE_SERVER_URL;

  // -----------------------------------------------------
  // Fetch addresses
  // -----------------------------------------------------
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/user/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.error("Address fetch error:", err);
        toast.error("Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  // -----------------------------------------------------
  // OPEN MODAL
  // -----------------------------------------------------
  const openModal = (address = null) => {
    if (address) {
      setEditingAddressId(address._id);
      setForm(address);
    } else {
      setEditingAddressId(null);
      setForm({
        name: "",
        phone: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // -----------------------------------------------------
  // SAVE (Add OR Update)
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAddressId) {
        // UPDATE
        const res = await axios.put(
          `${API}/api/v1/user/address/${editingAddressId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddresses(res.data.addresses);
        toast.success("Address updated");
      } else {
        // ADD NEW
        if (addresses.length >= 3) {
          toast.error("You can only add up to 3 addresses");
          return;
        }

        const res = await axios.post(
          `${API}/api/v1/user/address`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddresses(res.data.addresses);
        toast.success("Address added");
      }

      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  // -----------------------------------------------------
  // DELETE Address
  // -----------------------------------------------------
  const deleteAddress = async (id) => {
    try {
      const res = await axios.delete(
        `${API}/api/v1/user/address/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses(res.data.addresses);
      toast.success("Address removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  if (loading) return <p className="p-4">Loading addresses...</p>;

  return (
    <div className="p-4 md:p-6">


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
            <p className="text-gray-700">
              {addr.city}, {addr.state} – {addr.pincode}
            </p>

            <p className="mt-2 text-sm text-gray-500">Phone: {addr.phone}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999] p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">

            <button onClick={closeModal} className="absolute right-4 top-4">
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingAddressId ? "Edit Address" : "Add Address"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                required
                maxLength="10"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Pincode"
                value={form.pincode}
                required
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full border p-3 rounded-md"
              />

              <textarea
                placeholder="Complete Address"
                value={form.address}
                required
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border p-3 rounded-md h-20"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  required
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-1/2 border p-3 rounded-md"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={form.state}
                  required
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-1/2 border p-3 rounded-md"
                />
              </div>

              <button className="w-full py-3 rounded-md bg-black text-white tracking-wide hover:opacity-90 transition">
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
