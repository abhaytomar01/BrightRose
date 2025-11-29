import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X } from "lucide-react";

const AddressComponent = () => {
  const { authUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
  });

  // -----------------------------------------------------
  // Fetch addresses from backend
  // -----------------------------------------------------
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`,
          { headers: { Authorization: `Bearer ${authUser.token}` } }
        );

        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.log("Address fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // -----------------------------------------------------
  // OPEN MODAL
  // -----------------------------------------------------
  const openModal = (index = null) => {
    if (index !== null) {
      // Edit existing
      setEditingIndex(index);
      setForm(addresses[index]);
    } else {
      // Add new
      setEditingIndex(null);
      setForm({
        name: "",
        phone: "",
        pincode: "",
        addressLine: "",
        city: "",
        state: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // -----------------------------------------------------
  // SUBMIT (Add or Edit)
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedAddresses = [...addresses];

      if (editingIndex !== null) {
        updatedAddresses[editingIndex] = form;
      } else {
        if (addresses.length >= 3) {
          toast.error("You can only add up to 3 addresses.");
          return;
        }
        updatedAddresses.push(form);
      }

      // Update backend
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-addresses`,
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      setAddresses(res.data.addresses);
      toast.success("Address saved successfully");
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error("Failed to save address");
    }
  };

  // -----------------------------------------------------
  // DELETE ADDRESS
  // -----------------------------------------------------
  const deleteAddress = async (index) => {
    try {
      const updated = addresses.filter((_, i) => i !== index);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-addresses`,
        { addresses: updated },
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      setAddresses(res.data.addresses);
      toast.success("Address removed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete");
    }
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------

  if (loading) return <p className="p-4">Loading addresses...</p>;

  return (
    <div className="p-6">

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
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{addr.name}</h3>
              <div className="flex gap-3">
                <Edit2
                  size={18}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => openModal(index)}
                />
                <Trash2
                  size={18}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => deleteAddress(index)}
                />
              </div>
            </div>

            <p className="mt-2 text-gray-700">{addr.addressLine}</p>
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
              {editingIndex !== null ? "Edit Address" : "Add Address"}
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
                value={form.addressLine}
                required
                onChange={(e) =>
                  setForm({ ...form, addressLine: e.target.value })
                }
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
