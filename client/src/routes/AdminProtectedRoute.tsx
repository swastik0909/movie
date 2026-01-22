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

  const { user, isLoading } = auth;

  // ⏳ Wait for session check
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white">
        Loading...
      </div>
    );
  }

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
