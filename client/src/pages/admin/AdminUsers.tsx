import { useEffect, useState } from "react";
import { getUsers, toggleBan } from "@/services/adminApi";

interface User {
  _id: string;
  email: string;
  isBanned: boolean;
  role: "user" | "admin";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers().then(res => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  const handleToggleBan = async (id: string) => {
    await toggleBan(id);

    setUsers(prev =>
      prev.map(u =>
        u._id === id ? { ...u, isBanned: !u.isBanned } : u
      )
    );
  };

  if (loading) {
    return <div className="p-8 text-white">Loading users...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {users.map(user => (
        <div
          key={user._id}
          className="flex justify-between items-center mb-3 bg-[#1f1f1f] p-4 rounded"
        >
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-gray-400">
              Role: {user.role}
            </p>
          </div>

          {user.role !== "admin" && (
            <button
              onClick={() => handleToggleBan(user._id)}
              className={`px-4 py-1 rounded ${
                user.isBanned
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
