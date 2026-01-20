import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "@/context/AdminAuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const adminAuth = useContext(AdminAuthContext);

  if (!adminAuth) {
    throw new Error("AdminAuthContext not provided");
  }

  const { adminLoginUser } = adminAuth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLoginUser(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid admin credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-[#141414] rounded-xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-[#1f1f1f]"
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded bg-[#1f1f1f]"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-red-600 py-3 rounded font-semibold"
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
