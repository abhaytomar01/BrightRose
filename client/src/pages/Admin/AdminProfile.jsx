import { useAuth } from "../../context/auth";

const AdminProfile = () => {
  const { auth } = useAuth();

  return (
    <div className="p-6 min-h-screen">

      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">

        {/* Admin Info */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Information
        </h2>

        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {auth?.user?.name || "Admin"}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {auth?.user?.email}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            <span className="text-green-600 font-semibold">Admin</span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="p-4 border rounded-lg shadow-sm hover:shadow transition cursor-pointer bg-gray-50">
            <h4 className="font-medium text-gray-800">Add New Product</h4>
            <p className="text-sm text-gray-500">Create and upload new products</p>
          </div>

          <div className="p-4 border rounded-lg shadow-sm hover:shadow transition cursor-pointer bg-gray-50">
            <h4 className="font-medium text-gray-800">Manage Products</h4>
            <p className="text-sm text-gray-500">Edit or delete existing products</p>
          </div>

          <div className="p-4 border rounded-lg shadow-sm hover:shadow transition cursor-pointer bg-gray-50">
            <h4 className="font-medium text-gray-800">Manage Users</h4>
            <p className="text-sm text-gray-500">View and control user accounts</p>
          </div>

          <div className="p-4 border rounded-lg shadow-sm hover:shadow transition cursor-pointer bg-gray-50">
            <h4 className="font-medium text-gray-800">View Orders</h4>
            <p className="text-sm text-gray-500">Check recent customer orders</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
