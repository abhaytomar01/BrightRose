const Deactivate = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Deactivate Account</h2>
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <p className="text-gray-500">
          Are you sure you want to deactivate your account? This action cannot be undone.
        </p>
        <button className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
          Deactivate Account
        </button>
      </div>
    </div>
  );
};

export default Deactivate;
