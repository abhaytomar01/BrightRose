// src/components/dashboard/AddressComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

// Decorative image (developer: local path included per request)
const DECOR_IMAGE = "/mnt/data/Screenshot 2025-11-21 123458.png";

const emptyForm = {
  label: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  default: false,
};

const AddressComponent = () => {
  const { auth, setAuth } = useAuth();
  const token = auth?.token;
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = token ? { Authorization: token } : {};

  // Fetch addresses
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/addresses`, { headers });
      if (res.data?.success) setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("loadAddresses", err);
      toast.error("Cannot load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: reset
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // Add or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      if (editingId) {
        // update
        const res = await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/address/${editingId}`,
          form,
          { headers }
        );
        if (res.data?.success) {
          setAddresses(res.data.addresses);
          toast.success("Address updated");
          resetForm();
        }
      } else {
        // add
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/address`, form, { headers });
        if (res.data?.success) {
          setAddresses(res.data.addresses);
          toast.success("Address added");
          resetForm();
        }
      }
    } catch (err) {
      console.error("save address", err);
      toast.error(err.response?.data?.message || "Unable to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setEditingId(addr._id);
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      default: !!addr.default,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/address/${id}`, { headers });
      if (res.data?.success) {
        setAddresses(res.data.addresses);
        toast.success("Address deleted");
      }
    } catch (err) {
      console.error("delete address", err);
      toast.error("Unable to delete address");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setLoading(true);
      const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/address/${id}/default`, {}, { headers });
      if (res.data?.success) {
        setAddresses(res.data.addresses);
        toast.success("Default address set");
      }
    } catch (err) {
      console.error("set default", err);
      toast.error("Unable to set default");
    } finally {
      setLoading(false);
    }
  };

  // Quick UI: form field change
  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{editingId ? "Edit Address" : "Add New Address"}</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Label (Home/Work)" value={form.label}
                     onChange={(e) => change("label", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Full name" value={form.name}
                     onChange={(e) => change("name", e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Phone" value={form.phone}
                     onChange={(e) => change("phone", e.target.value)} required />
              <input className="border p-2 rounded" placeholder="Pincode" value={form.pincode}
                     onChange={(e) => change("pincode", e.target.value)} required />
            </div>

            <textarea className="w-full border p-2 rounded" rows="3" placeholder="Address line" value={form.address}
                      onChange={(e) => change("address", e.target.value)} required />

            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="City" value={form.city}
                     onChange={(e) => change("city", e.target.value)} required />
              <input className="border p-2 rounded" placeholder="State" value={form.state}
                     onChange={(e) => change("state", e.target.value)} required />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!form.default}
                       onChange={(e) => change("default", e.target.checked)} />
                Set as default
              </label>

              <div className="ml-auto">
                <button type="button" onClick={resetForm} className="px-3 py-2 border rounded mr-2">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                  {loading ? "Saving..." : (editingId ? "Update Address" : "Add Address")}
                </button>
              </div>
            </div>
          </form>

          {/* decorative image (local path provided) */}
          <div className="mt-6">
            <img src={DECOR_IMAGE} alt="decor" className="w-40 object-cover rounded-md shadow-sm" />
          </div>
        </div>

        {/* Right: List of addresses */}
        <div className="md:w-1/2">
          <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

          {loading && <div>Loading...</div>}

          {!loading && (!addresses || addresses.length === 0) && (
            <div className="bg-white p-6 rounded shadow text-gray-500">No addresses saved yet.</div>
          )}

          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr._id} className={`bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center gap-4`}>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{addr.name} {addr.default && <span className="text-sm text-green-600 ml-2">Default</span>}</div>
                      <div className="text-sm text-gray-600">{addr.label} • {addr.phone}</div>
                      <div className="text-sm mt-2 text-gray-700">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col gap-2">
                      <button onClick={() => handleEdit(addr)} className="text-sm text-blue-600">Edit</button>
                      <button onClick={() => handleDelete(addr._id)} className="text-sm text-red-600">Delete</button>
                      {!addr.default && <button onClick={() => handleSetDefault(addr._id)} className="text-sm">Set default</button>}
                    </div>
                  </div>

                  {/* Mobile buttons */}
                  <div className="flex md:hidden gap-2 mt-3">
                    <button onClick={() => handleEdit(addr)} className="text-sm text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(addr._id)} className="text-sm text-red-600">Delete</button>
                    {!addr.default && <button onClick={() => handleSetDefault(addr._id)} className="text-sm">Set default</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
