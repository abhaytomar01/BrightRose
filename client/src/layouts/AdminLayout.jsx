// src/layout/AdminLayout.jsx

const AdminLayout = ({ children }) => {
  return (
    <div
      className="
        w-full 
        min-h-screen 
        bg-[#f7f7f7] 
        pt-[90px] 
        sm:pt-[110px] 
        px-2 
        sm:px-6 
        pb-6
      "
    >
      {children}
    </div>
  );
};

export default AdminLayout;
