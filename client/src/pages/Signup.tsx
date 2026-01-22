import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("AuthContext is not provided");

  const { signup } = auth;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(name, email, password);
      navigate("/"); // redirect after successful signup
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141414] p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl mb-1 font-semibold">Create Account</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Join Movie Plus for free 🎬
        </p>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] border border-white/10"
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] border border-white/10"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-[#1f1f1f] border border-white/10"
          required
        />

        <button
          disabled={loading}
          className="
            w-full bg-red-600 py-2 rounded
            hover:opacity-90 transition
            disabled:opacity-60
          "
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
