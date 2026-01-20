import { useEffect, useMemo, useState } from "react";
import { getUserActivity } from "@/services/adminApi";

/* ================= TYPES ================= */
interface UserActivity {
  email: string;
  role: "admin" | "user";
  isBanned: boolean;
  lastLogin?: string;
}

/* ================= TIME HELPERS ================= */
const MINUTE = 60 * 1000;

const isOnline = (date?: string) =>
  date
    ? Date.now() - new Date(date).getTime() <
      5 * MINUTE
    : false;

const timeAgo = (date?: string) => {
  if (!date) return "Never";

  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / MINUTE);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

/* ================= COMPONENT ================= */
const AdminActivity = () => {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<"all" | "today" | "7days">("all");

  useEffect(() => {
    getUserActivity().then((res) =>
      setUsers(res.data)
    );
  }, []);

  /* ================= FILTER + SEARCH ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (
        search &&
        !u.email
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      if (!u.lastLogin) return filter === "all";

      const login = new Date(u.lastLogin);
      const now = new Date();

      if (filter === "today") {
        return (
          login.toDateString() ===
          now.toDateString()
        );
      }

      if (filter === "7days") {
        return (
          now.getTime() - login.getTime() <=
          7 * 24 * 60 * 60 * 1000
        );
      }

      return true;
    });
  }, [users, search, filter]);

  /* ================= GROUP BY DATE (TIMELINE) ================= */
  const grouped = useMemo(() => {
    const map: Record<string, UserActivity[]> = {};

    filteredUsers.forEach((u) => {
      const key = u.lastLogin
        ? new Date(u.lastLogin).toDateString()
        : "Never";

      if (!map[key]) map[key] = [];
      map[key].push(u);
    });

    return map;
  }, [filteredUsers]);

  return (
    <div className="p-8 text-white space-y-6">
      <h1 className="text-3xl font-bold">
        📊 User Activity
      </h1>

      {/* ================= CONTROLS ================= */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Search by email"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="bg-[#1f1f1f] px-4 py-2 rounded w-full md:w-64"
        />

        <div className="flex gap-2">
          {[
            { k: "all", l: "All" },
            { k: "today", l: "Today" },
            { k: "7days", l: "Last 7 Days" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() =>
                setFilter(
                  f.k as "all" | "today" | "7days"
                )
              }
              className={`px-4 py-1 rounded-full ${
                filter === f.k
                  ? "bg-red-600"
                  : "bg-gray-700"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TIMELINE ================= */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-400">
          No activity found
        </p>
      ) : (
        Object.entries(grouped).map(
          ([date, list]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-3 text-gray-300">
                {date}
              </h2>

              <div className="space-y-3">
                {list.map((u, idx) => (
                  <div
                    key={`${u.email}-${idx}`}
                    className="bg-[#1f1f1f] p-4 rounded-lg flex justify-between items-center hover:bg-[#262626] transition"
                  >
                    {/* LEFT */}
                    <div>
                      <p className="font-medium">
                        {u.email}
                      </p>
                      <p className="text-sm text-gray-400">
                        Last seen:{" "}
                        {timeAgo(u.lastLogin)}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      {isOnline(u.lastLogin) && (
                        <span className="bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full">
                          🟢 Online
                        </span>
                      )}

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-purple-600/20 text-purple-400"
                            : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        {u.role}
                      </span>

                      {u.isBanned && (
                        <span className="bg-red-600/20 text-red-400 text-xs px-3 py-1 rounded-full">
                          Banned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default AdminActivity;
