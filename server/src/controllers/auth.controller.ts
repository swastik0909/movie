import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendEmail } from "../utils/emailService";

/* 📝 SIGNUP (USER ONLY) */
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "user", // ✅ default role
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};

/* 🔐 LOGIN (USER + ADMIN) */
export const login = async (req: Request, res: Response) => {
  const { email, password, adminLogin } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.isBanned) {
    return res.status(403).json({ message: "User is banned" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🚨 ADMIN LOGIN RESTRICTION
  if (adminLogin && user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not an admin user" });
  }

  // 📊 ACTIVITY TRACKING
  user.lastLogin = new Date();
  user.lastActivity = "Logged in";
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};

/* 🔑 FORGOT PASSWORD */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (valid for 15 mins)
    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Send Email (Async - Non-blocking)
    sendEmail(
      email,
      "Password Reset OTP - Movie Plus",
      `Your OTP is: ${otp}. It is valid for 15 minutes.`
    ).catch(err => console.error("Background Email Error:", err));

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ✅ VERIFY OTP */
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.resetOtp !== otp || (user.resetOtpExpiry && user.resetOtpExpiry < new Date())) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
};

/* 🔄 RESET PASSWORD */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.resetOtp !== otp || (user.resetOtpExpiry && user.resetOtpExpiry < new Date())) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  // Clear OTP
  user.resetOtp = null;
  user.resetOtpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successfully. Please login." });
};
