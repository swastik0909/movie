import { Outlet } from "react-router-dom";
import AdminSidebar from "@/pages/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex bg-[#0f0f0f] text-white min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
