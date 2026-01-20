import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const AdminProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user } = auth;

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Not admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin access
  return <>{children}</>;
};

export default AdminProtectedRoute;
