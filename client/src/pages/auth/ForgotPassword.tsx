import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp, resetPassword } from "@/services/userApi";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await forgotPassword(email);
            setSuccess("OTP sent to your email!");
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await verifyOtp(email, otp);
            setSuccess("OTP verified! Create new password.");
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await resetPassword({ email, otp, newPassword });
            setSuccess("Password reset successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent_70%)]" />

            <div className="relative z-10 w-full max-w-md bg-[#141414]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-2">Recovery</h2>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    {step === 1 && "Enter your email to receive an OTP"}
                    {step === 2 && "Enter the 6-digit code sent to your email"}
                    {step === 3 && "Create a secure new password"}
                </p>

                {error && <p className="text-red-500 text-center text-sm mb-4 bg-red-500/10 p-2 rounded">{error}</p>}
                {success && <p className="text-green-500 text-center text-sm mb-4 bg-green-500/10 p-2 rounded">{success}</p>}

                {/* STEP 1: SEND OTP */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-6 px-4 py-3 rounded-lg bg-[#1f1f1f] outline-none focus:ring-2 focus:ring-red-600"
                            required
                        />
                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-bold">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 2: VERIFY OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full mb-6 px-4 py-3 rounded-lg bg-[#1f1f1f] outline-none focus:ring-2 focus:ring-red-600 text-center tracking-[0.5em] text-xl"
                            required
                        />
                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-bold">
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full mt-3 text-sm text-gray-400 hover:text-white"
                        >
                            Change Email
                        </button>
                    </form>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mb-6 px-4 py-3 rounded-lg bg-[#1f1f1f] outline-none focus:ring-2 focus:ring-red-600"
                            required
                        />
                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-bold">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-gray-400 hover:text-white">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
