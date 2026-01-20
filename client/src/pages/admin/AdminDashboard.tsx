import { useEffect, useState } from "react";
import {
  getLoginsPerDay,
  getActiveUsersToday,
} from "@/services/adminApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

/* ================= TYPES ================= */

interface LoginStat {
  _id: string; // date
  count: number;
}

/* ================= COMPONENT ================= */

const AdminDashboard = () => {
  const [logins, setLogins] = useState<LoginStat[]>([]);
  const [activeToday, setActiveToday] = useState<number>(0);

  useEffect(() => {
    getLoginsPerDay().then((res) => setLogins(res.data));
    getActiveUsersToday().then(
      (res) => setActiveToday(res.data.activeUsersToday)
    );
  }, []);

  return (
    <div className="p-8 text-white space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Platform activity overview
        </p>
      </div>

      {/* ================= ACTIVE USERS TODAY ================= */}
      <div className="bg-[#1c1c1c] p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Active Users Today
        </h2>
        <p className="text-4xl font-bold text-green-500">
          {activeToday}
        </p>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-[#1c1c1c] p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Logins Per Day (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={logins}>
            <CartesianGrid stroke="#2a2a2a" />
            <XAxis dataKey="_id" stroke="#aaa" />
            <YAxis
              stroke="#aaa"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "none",
                color: "#fff",
              }}
            />
            <Bar
              dataKey="count"
              fill="#ef4444"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= LINE CHART ================= */}
      <div className="bg-[#1c1c1c] p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">
          Login Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logins}>
            <CartesianGrid stroke="#2a2a2a" />
            <XAxis dataKey="_id" stroke="#aaa" />
            <YAxis
              stroke="#aaa"
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "none",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
