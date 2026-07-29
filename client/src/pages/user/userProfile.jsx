import React from "react";

const UserProfile = () => {
  return (
    <div className="p-6">
      <h2 className="luxury-title text-[22px] md:text-[26px] mb-8 tracking-wide">Profile Information</h2>
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <p className="text-gray-600 mb-3">👋 Welcome to your dashboard!</p>
        <p className="text-gray-500 text-sm">
          You can manage your personal details, check orders, update addresses, and more using the sidebar.
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
