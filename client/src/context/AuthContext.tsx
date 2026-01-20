import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  signupUser,
  updateProfile,
  uploadAvatar,
} from "@/services/userApi";

/* 🔐 USER TYPE (UPDATED) */
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin"; // ✅ NEW
}

interface AuthContextType {
  user: User | null;

  // 🔑 login now RETURNS user (IMPORTANT)
  login: (
    email: string,
    password: string
  ) => Promise<User>;

  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
  updateName: (name: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  /* 🔄 LOAD USER FROM STORAGE */
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  /* 🔐 LOGIN (USER + ADMIN) */
const login = async (
  email: string,
  password: string,
  adminLogin = false
) => {
  const res = await loginUser({
    email,
    password,
    adminLogin,
  });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  setUser(res.data.user);

  return res.data.user;
};


  /* 📝 SIGNUP */
  const signup = async (
    name: string,
    email: string,
    password: string
  ) => {
    const res = await signupUser({ name, email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    setUser(res.data.user);
  };

  /* 🚪 LOGOUT */
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  /* ✏️ UPDATE NAME */
  const updateName = async (name: string) => {
    const res = await updateProfile({ name });
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );
    setUser(res.data.user);
  };

  /* 🖼 UPDATE AVATAR */
  const updateAvatar = async (file: File) => {
    const res = await uploadAvatar(file);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateName,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
