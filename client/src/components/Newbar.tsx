import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.avif";
import { AuthContext } from "@/context/AuthContext";
import { SearchResultContext } from "@/context/searchResult.context";
import { User, Clock, Heart, LogOut, Menu, X, Search } from "lucide-react";
import Genres from "./Genres";

const Newbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { searchText, setSearchText } = useContext(SearchResultContext);

  const [open, setOpen] = useState(false); // Profile dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu drawer

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // If VITE_API_URL is set (e.g. https://api.site.com/api), we assume images are at https://api.site.com
  // But our backend usually serves uploads at /uploads relative to root. 
  // If VITE_API_URL includes /api, we should strip it if we're constructing a root URL for static files.
  // A safer bet: if the backend returns specific paths, adjusting the base.

  // Strategy: Define a FILE_BASE_URL helper
  const fileBaseUrl = apiUrl.replace("/api", "");

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
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-[1600px] mx-auto">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-4">
          {/* HAMBURGER BUTTON (Mobile) */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>

          <img
            src={logo}
            alt="logo"
            className="h-7 md:h-9 select-none cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* CENTER: SEARCH + GENRES (Desktop) */}
        <div className="hidden md:flex items-center bg-zinc-800 rounded-full w-[400px] lg:w-[560px] overflow-hidden border border-zinc-700 transition-all">
          <Search className="ml-4 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search movies, tv shows..."
            value={searchText}
            onChange={handleSearch}
            className="
              flex-1 bg-transparent px-3 py-2
              text-white placeholder-gray-400
              outline-none text-sm
            "
          />

          <div className="px-4 py-2 border-l border-zinc-700">
            <Genres />
          </div>
        </div>

        {/* RIGHT: NAV + PROFILE */}
        <div className="flex items-center gap-4 md:gap-8">

          {/* NAV LINKS (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
            <NavItem to="/" label="HOME" />
            <NavItem to="/movies" label="MOVIES" />
            <NavItem to="/tvshows" label="TV SERIES" />
          </nav>

          {/* SEARCH ICON (Mobile - opens search page or focuses input? For now just an indicator or direct to search page if needed, but we used Drawer) */}
          {/* <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}><Search size={24} /></button> */}

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-red-600 text-white font-bold overflow-hidden ring-2 ring-transparent hover:ring-white/20 transition"
            >
              {user.avatar ? (
                <img
                  src={`${fileBaseUrl}${user.avatar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-64 md:w-72 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-4 border-b border-zinc-700 bg-zinc-800/50">
                  <p className="text-white font-semibold truncate">{user.name}</p>
                  <p className="text-xs md:text-sm text-gray-400 truncate">{user.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <MenuItem icon={<User size={18} />} label="Profile" onClick={() => navigate("/profile")} />
                  <MenuItem icon={<Clock size={18} />} label="Continue Watching" onClick={() => navigate("/continue")} />
                  <MenuItem icon={<Heart size={18} />} label="Watch List" onClick={() => navigate("/watchlist")} />
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 border-t border-zinc-700 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-[80%] max-w-[300px] bg-zinc-900 h-full border-r border-zinc-700 p-6 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center">
              <img src={logo} alt="logo" className="h-8" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="bg-zinc-800 rounded-lg flex items-center px-3 py-2 border border-zinc-700">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
                className="bg-transparent border-none outline-none text-white text-sm ml-2 w-full placeholder-gray-500"
              />
            </div>

            {/* Mobile Genres */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Genres</span>
              <Genres />
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-4">Browse</span>
              <NavItemMobile to="/" label="HOME" onClick={() => setMobileMenuOpen(false)} />
              <NavItemMobile to="/movies" label="MOVIES" onClick={() => setMobileMenuOpen(false)} />
              <NavItemMobile to="/tvshows" label="TV SERIES" onClick={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        </div>
      )}

    </header>
  );
};

export default Newbar;

/* ================= NAV ITEM (DESKTOP) ================= */

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `
        tracking-wide transition text-xs lg:text-sm font-bold
        ${isActive ? "text-red-500" : "text-white/70 hover:text-white"}
      `
    }
  >
    {label}
  </NavLink>
);

/* ================= NAV ITEM (MOBILE) ================= */

const NavItemMobile = ({ to, label, onClick }: { to: string; label: string, onClick: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `
          block px-4 py-3 rounded-lg font-semibold transition
          ${isActive ? "bg-red-600 text-white" : "text-gray-300 hover:bg-zinc-800 hover:text-white"}
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
    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition"
  >
    {icon}
    {label}
  </button>
);

