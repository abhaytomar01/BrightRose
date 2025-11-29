// --------------------------------------
// USER PROFILE — LUXURY PREMIUM VERSION
// --------------------------------------

import { useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { authUser, loginUser } = useAuth();

  const [name, setName] = useState(authUser?.user?.name || "");
  const [email, setEmail] = useState(authUser?.user?.email || "");
  const [phone, setPhone] = useState(authUser?.user?.phone || "");

  const [editField, setEditField] = useState(null);

  // -------------------------
  // Save API
  // -------------------------
  const updateField = async (field, value) => {
    try {
      const body = {
        email: authUser?.user?.email, // identifier
      };

      if (field === "name") body.newName = value;
      if (field === "email") body.newEmail = value;
      if (field === "phone") body.newPhone = value;

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-details`,
        body
      );

      // Save locally
      loginUser({
        user: {
          ...authUser.user,
          [field]: value,
        },
        token: authUser.token,
      });

      toast.success("Updated successfully");
      setEditField(null);
    } catch (err) {
      console.log(err);
      toast.error("Update failed!");
    }
  };

  // -------------------------
  // Field UI Component
  // -------------------------
  const Field = ({ label, value, fieldKey, setter }) => (
    <div className="mb-10 border-b pb-6">

      {/* Label + Edit Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] luxury-title tracking-wide">{label}</h3>

        {!editField && (
          <button
            className="text-sm tracking-wide text-gray-600 hover:text-black"
            onClick={() => setEditField(fieldKey)}
          >
            EDIT
          </button>
        )}
      </div>

      {/* Value / Edit Field */}
      {editField === fieldKey ? (
        <div className="flex items-center gap-4">

          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:border-black"
          />

          <button
            className="px-4 py-2 bg-black text-white rounded-md text-sm tracking-wide"
            onClick={() => updateField(fieldKey, value)}
          >
            Save
          </button>

          <button
            className="px-4 py-2 border border-gray-400 rounded-md text-sm tracking-wide"
            onClick={() => setEditField(null)}
          >
            Cancel
          </button>

        </div>
      ) : (
        <div className="text-gray-700 text-[15px]">
          {value || <span className="text-gray-400">Not added</span>}
        </div>
      )}
    </div>
  );

  // ----------------------------------
  // MAIN COMPONENT RETURN
  // ----------------------------------
  return (
    <div className="w-full">

      <h1 className="luxury-title text-[26px] mb-10 tracking-wide">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>

          <Field
            label="Full Name"
            value={name}
            fieldKey="name"
            setter={setName}
          />

          <Field
            label="Email Address"
            value={email}
            fieldKey="email"
            setter={setEmail}
          />

          <Field
            label="Mobile Number"
            value={phone}
            fieldKey="phone"
            setter={setPhone}
          />

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex justify-center items-start pt-4">
          <img
            src="https://www.dior.com/couture/var/dior/storage/images/horizon/customer-account/my-account/37553058-5-eng-GB/my-account_1440_1200.jpg"
            alt="luxury"
            className="w-[80%] rounded-xl shadow-md object-cover"
          />
        </div>

      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="luxury-title text-[20px] mb-4 tracking-wide">
          FAQs
        </h2>

        <div className="space-y-6 text-gray-600">

          <div>
            <h4 className="font-medium">What happens when I update my details?</h4>
            <p className="text-sm mt-2">
              Your login information will be updated instantly.
            </p>
          </div>

          <div>
            <h4 className="font-medium">Will I stay logged in?</h4>
            <p className="text-sm mt-2">
              Yes, your session stays active unless you log out manually.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserProfile;
