import { Link } from "react-router-dom";
import {
  User,
  Clock,
  Heart,
  Bell,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
}

const ProfileMenu = ({ onClose }: Props) => {
  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { user, logout } = auth;

  return (
    <div className="absolute right-0 top-14 w-72 bg-[#181818] rounded-2xl shadow-2xl p-4 z-50">
      {/* USER INFO */}
      <div className="mb-4">
        <p className="text-white font-semibold text-lg">
          {user?.name}
        </p>
        <p className="text-gray-400 text-sm">
          {user?.email}
        </p>
      </div>

      {/* MENU ITEMS */}
      <div className="flex flex-col gap-2">
        <MenuItem
          icon={<User size={18} />}
          label="Profile"
          to="/profile"
          onClose={onClose}
        />

        <MenuItem
          icon={<Clock size={18} />}
          label="Continue Watching"
          to="/profile#continue"
          onClose={onClose}
        />

        <MenuItem
          icon={<Heart size={18} />}
          label="Watch List"
          to="/watchlist"
          onClose={onClose}
        />

        <MenuItem
          icon={<Bell size={18} />}
          label="Notifications"
          to="/notifications"
          onClose={onClose}
        />
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          logout();
          onClose();
        }}
        className="mt-4 w-full flex items-center justify-between text-gray-300 hover:text-red-500 transition"
      >
        Logout <LogOut size={18} />
      </button>
    </div>
  );
};

export default ProfileMenu;

/* ---------- Reusable Item ---------- */

const MenuItem = ({
  icon,
  label,
  to,
  onClose,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClose: () => void;
}) => (
  <Link
    to={to}
    onClick={onClose}
    className="
      flex items-center gap-3
      px-4 py-3
      rounded-xl
      bg-[#2a2a2a]
      hover:bg-[#333]
      text-gray-200
      transition
    "
  >
    {icon}
    <span>{label}</span>
  </Link>
);
