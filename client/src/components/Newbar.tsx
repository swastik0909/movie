import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.avif";
import { AuthContext } from "@/context/AuthContext";
import { SearchResultContext } from "@/context/searchResult.context";
import { User, Clock, Heart, LogOut } from "lucide-react";
import Genres from "./Genres";

const Newbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { searchText, setSearchText } =
    useContext(SearchResultContext);

  const [open, setOpen] = useState(false);

  if (!auth || !auth.user) return null;

  const { user, logout } = auth;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim()) {
      navigate(`/search/${value}`);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-6">
          <img
            src={logo}
            alt="logo"
            className="h-9 select-none cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* CENTER: SEARCH + GENRES */}
        <div className="hidden md:flex items-center bg-zinc-800 rounded-full w-[560px] overflow-hidden border border-zinc-700">
          <input
            type="text"
            placeholder="Search movies, tv shows..."
            value={searchText}
            onChange={handleSearch}
            className="
              flex-1 bg-transparent px-5 py-2
              text-white placeholder-gray-400
              outline-none text-sm
            "
          />

          <div className="px-4 py-2 border-l border-zinc-700">
            <Genres />
          </div>
        </div>

        {/* RIGHT: NAV + PROFILE */}
        <div className="flex items-center gap-8">

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <NavItem to="/" label="HOME" />
            <NavItem to="/movies" label="MOVIES" />
            <NavItem to="/tvshows" label="TV SERIES" />
          </nav>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-red-600 text-white font-bold overflow-hidden"
            >
              {user.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-72 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl">
                <div className="px-4 py-4 border-b border-zinc-700">
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <MenuItem icon={<User size={18} />} label="Profile" onClick={() => navigate("/profile")} />
                  <MenuItem icon={<Clock size={18} />} label="Continue Watching" onClick={() => navigate("/continue")} />
                  <MenuItem icon={<Heart size={18} />} label="Watch List" onClick={() => navigate("/watchlist")} />
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 border-t border-zinc-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Newbar;

/* ================= NAV ITEM ================= */

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
        tracking-wide transition
        ${isActive ? "text-red-500" : "text-white/80 hover:text-white"}
      `
    }
  >
    {label}
  </NavLink>
);

/* ================= MENU ITEM ================= */

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-zinc-800 hover:text-white"
  >
    {icon}
    {label}
  </button>
);
