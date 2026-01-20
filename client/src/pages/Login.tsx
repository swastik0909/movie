import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not provided");
  }

  const { login } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      // ✅ ROLE BASED REDIRECT
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden text-white">

      {/* 🔥 Cinematic Gradient Glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/25 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[160px] animate-pulse delay-1000" />
      </div>

      {/* 🌑 Subtle Noise / Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

      {/* 🔐 Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#141414]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Log in
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#1f1f1f] outline-none placeholder-gray-400 focus:ring-2 focus:ring-red-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full mb-6 px-4 py-3 rounded-lg bg-[#1f1f1f] outline-none placeholder-gray-400 focus:ring-2 focus:ring-red-600"
            required
          />

          <div className="flex justify-end mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-red-500 transition"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-semibold tracking-wide"
          >
            {loading ? "Loging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
