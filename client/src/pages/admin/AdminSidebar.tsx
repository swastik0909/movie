import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `
      flex items-center gap-2
      px-3 py-2 rounded-lg
      transition
      ${
        isActive
          ? "bg-red-600/15 text-red-500"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }
    `;

  return (
    <div className="w-64 bg-[#141414] text-white min-h-screen p-5 border-r border-white/10">
      <h2 className="text-xl font-bold mb-8">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          👥 Users
        </NavLink>

        <NavLink to="/admin/activity" className={linkClass}>
          🕒 Activity
        </NavLink>

        <NavLink to="/admin/most-watched" className={linkClass}>
          🔥 Most Watched
        </NavLink>

        {/* 🚨 COMMENT MODERATION */}
        <NavLink to="/admin/comments" className={linkClass}>
          🚨 Comments
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            mt-10
            bg-red-600
            hover:bg-red-700
            py-2
            rounded-lg
            transition
          "
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
