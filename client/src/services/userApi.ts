import axios from "axios";
import type { AxiosResponse } from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔐 Attach JWT token (USER or ADMIN) */
userApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= AUTH ================= */

export const signupUser = (data: {
  name: string;
  email: string;
  password: string;
}) => userApi.post("/auth/signup", data);

export const loginUser = (data: {
  email: string;
  password: string;
  adminLogin?: boolean;
}) => userApi.post("/auth/login", data);

export const forgotPassword = (email: string) =>
  userApi.post("/auth/forgot-password", { email });

export const verifyOtp = (email: string, otp: string) =>
  userApi.post("/auth/verify-otp", { email, otp });

export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => userApi.post("/auth/reset-password", data);

/* ================= PROFILE ================= */

export const updateProfile = (data: { name: string }) =>
  userApi.put("/users/profile", data);

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return userApi.post("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* ================= CONTINUE WATCHING ================= */

export interface ContinueWatchingItem {
  _id: string;
  mediaId: number; // ✅ matches backend (Number)
  mediaType: "movie" | "tv";
  title: string;
  poster: string | null;
  season?: number;
  episode?: number;
  progress: number;
}

export const saveContinueProgress = (data: {
  mediaId: number;
  title: string;
  poster: string | null;
  mediaType: "movie" | "tv";
  progress: number;
  season?: number;
  episode?: number;
}) => userApi.post("/continue", data);

export const getContinueWatching = (): Promise<
  AxiosResponse<ContinueWatchingItem[]>
> => userApi.get("/continue");

export default userApi;
