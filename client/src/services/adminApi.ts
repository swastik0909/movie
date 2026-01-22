import axios from "axios";

/* ================= BASE ADMIN API ================= */

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

/* 🔐 Attach USER token (role checked by backend) */
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ SAME TOKEN
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= TYPES ================= */

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isBanned: boolean;
  lastLogin?: string;
}

/* ================= DASHBOARD ================= */

export const getAdminStats = () =>
  adminApi.get<{
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    watchlistCount: number;
    continueWatchingCount: number;
  }>("/stats");

/* ================= USERS ================= */

export const getUsers = () =>
  adminApi.get<AdminUser[]>("/users");

export const toggleBan = (userId: string) =>
  adminApi.put(`/users/${userId}/ban`);

/* ================= ACTIVITY ================= */

export const getUserActivity = () =>
  adminApi.get<
    {
      email: string;
      lastLogin: string;
      lastActivity?: string;
      role: "user" | "admin";
      isBanned: boolean;
    }[]
  >("/activity");

/* ================= ANALYTICS ================= */

export const getLoginsPerDay = () =>
  adminApi.get<{ _id: string; count: number }[]>(
    "/analytics/logins-per-day"
  );

export const getActiveUsersToday = () =>
  adminApi.get<{ activeUsersToday: number }>(
    "/analytics/active-users-today"
  );

export const getMostWatched = () =>
  adminApi.get<
    {
      _id: {
        title: string;
        poster: string;
        mediaType: "movie" | "tv";
      };
      views: number;
    }[]
  >("/analytics/most-watched");

export default adminApi;
