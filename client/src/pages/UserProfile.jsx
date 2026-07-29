// --------------------------------------
// USER PROFILE — LUXURY RESPONSIVE VERSION
// --------------------------------------

import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { authUser, loginUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editField, setEditField] = useState(null);
  
  useEffect(() => {
    if (authUser?.user) {
      setName(authUser.user.name || "");
      setEmail(authUser.user.email || "");
      setPhone(authUser.user.phone || "");
    }
  }, [authUser]);

  const updateField = async (field, value) => {
    try {
      const body = { email: authUser?.user?.email };

      if (field === "name") body.newName = value;
      if (field === "email") body.newEmail = value;
      if (field === "phone") body.newPhone = value;

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-details`,
        body
      );

      loginUser({
        user: { ...authUser.user, [field]: value },
        token: authUser.token,
      });

      toast.success("Updated successfully");
      setEditField(null);
    } catch {
      toast.error("Update failed!");
    }
  };

  const Field = ({ label, value, fieldKey, setter }) => (
    <div className="mb-8 sm:mb-10 border-b pb-5 sm:pb-6">

      {/* Label + Edit */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="luxury-title text-[14px] sm:text-[16px] md:text-[18px] tracking-wide">
          {label}
        </h3>

        {editField !== fieldKey && (
          <button
            onClick={() => setEditField(fieldKey)}
            className="text-[11px] sm:text-[12px] md:text-[13px] tracking-widest text-gray-500 hover:text-black"
          >
            EDIT
          </button>
        )}
      </div>

      {/* Value / Edit */}
      {editField === fieldKey ? (
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">

          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="w-full sm:max-w-xs px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none text-[13px] sm:text-[14px]"
          />

          <button
            onClick={() => updateField(fieldKey, value)}
            className="px-4 py-2 bg-black text-white rounded-md text-[12px] sm:text-[13px]"
          >
            Save
          </button>

          <button
            onClick={() => setEditField(null)}
            className="px-4 py-2 border border-gray-400 rounded-md text-[12px] sm:text-[13px]"
          >
            Cancel
          </button>

        </div>
      ) : (
        <p className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px]">
          {value || <span className="text-gray-400">Not added</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full">

      {/* TITLE */}
      <h1 className="luxury-title text-[18px] sm:text-[22px] md:text-[26px] mb-8 sm:mb-10 tracking-wide">
        My Profile
      </h1>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">

        <div>
          <Field label="Full Name" value={name} fieldKey="name" setter={setName} />
          <Field label="Email Address" value={email} fieldKey="email" setter={setEmail} />
          <Field label="Mobile Number" value={phone} fieldKey="phone" setter={setPhone} />
        </div>

        {/* IMAGE */}
        <div className="hidden md:flex justify-center items-start pt-4">
          {/* <img
            src="https://www.dior.com/couture/var/dior/storage/images/horizon/customer-account/my-account/37553058-5-eng-GB/my-account_1440_1200.jpg"
            alt="luxury"
            className="w-[80%] rounded-xl shadow-md object-cover"
          /> */}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 sm:mt-16">
        <h2 className="luxury-title text-[16px] sm:text-[18px] md:text-[20px] mb-4 tracking-wide">
          FAQs
        </h2>

        <div className="space-y-5 sm:space-y-6 text-gray-600">

          <div>
            <h4 className="font-medium text-[13px] sm:text-[14px]">
              What happens when I update my details?
            </h4>
            <p className="text-[12px] sm:text-[13px] md:text-[14px] mt-2">
              Your login information will be updated instantly.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-[13px] sm:text-[14px]">
              Will I stay logged in?
            </h4>
            <p className="text-[12px] sm:text-[13px] md:text-[14px] mt-2">
              Yes, your session stays active unless you log out manually.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default UserProfile;
