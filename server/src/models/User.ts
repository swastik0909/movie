import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;

  // 🔐 Forgot password
  resetOtp?: string | null;
  resetOtpExpiry?: Date | null;

  // 🚫 Admin control
  isBanned: boolean;

  // 🧑‍💼 Role-based auth (NEW)
  role: "user" | "admin";

  // 📊 Activity tracking (NEW)
  lastLogin?: Date;
  lastActivity?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // 🔐 FORGOT PASSWORD
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },

    // 🧑‍💼 ROLE (NEW)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🚫 ADMIN BAN
    isBanned: {
      type: Boolean,
      default: false,
    },

    // 📊 ACTIVITY (NEW)
    lastLogin: {
      type: Date,
    },
    lastActivity: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
