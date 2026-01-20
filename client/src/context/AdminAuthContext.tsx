import { createContext, useState } from "react";
import { loginUser } from "@/services/userApi";

/* ================= TYPES ================= */

interface AdminAuthContextType {
  adminLoginUser: (email: string, password: string) => Promise<void>;
  isAdmin: boolean;
  logoutAdmin: () => void;
}

/* ================= CONTEXT ================= */

export const AdminAuthContext =
  createContext<AdminAuthContextType | null>(null);

/* ================= PROVIDER ================= */

export const AdminAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    !!localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("user") || "{}").role === "admin"
  );

  /* 🔐 ADMIN LOGIN */
  const adminLoginUser = async (
    email: string,
    password: string
  ) => {
    // Call the unified loginUser with adminLogin: true
    const res = await loginUser({ email, password, adminLogin: true });

    // Store in standard locations so AuthContext picks it up too
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Also keep legacy adminToken if other parts use it (optional, but safe)
    localStorage.setItem("adminToken", res.data.token);
    
    setIsAdmin(true);
  };

  /* 🚪 ADMIN LOGOUT */
  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminLoginUser,
        isAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
