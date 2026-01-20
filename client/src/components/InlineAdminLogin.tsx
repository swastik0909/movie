import { useContext, useState } from "react";
import { AdminAuthContext } from "@/context/AdminAuthContext";

const InlineAdminLogin = () => {
  const adminAuth = useContext(AdminAuthContext);

  if (!adminAuth) return null;

  const { adminLoginUser } = adminAuth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await adminLoginUser(email, password);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="w-full max-w-md bg-black rounded-lg p-8 border border-red-600">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Admin Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-3 px-4 py-3 rounded bg-zinc-800 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded bg-zinc-800 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 transition rounded text-white font-semibold"
        >
          {loading ? "Signing In..." : "Admin Login"}
        </button>

        <p className="text-gray-400 text-xs mt-4 text-center">
          Admin access only
        </p>
      </div>
    </div>
  );
};

export default InlineAdminLogin;
