import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "dns";

// Force IPv4 ordering
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// ROUTES
import authRoutes from "./routes/auth.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import continueRoutes from "./routes/continue.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import commentRoutes from "./routes/comment.routes";
import reviewRoutes from "./routes/review.routes";
import tmdbRoutes from "./routes/tmdb.routes";

dotenv.config();
// Restart trigger

const app = express();
const PORT = process.env.PORT || 5000;

/* =====================
   MIDDLEWARE
===================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://movie-xi-seven.vercel.app", // ✅ Vercel Frontend
      process.env.FRONTEND_URL || "*"
    ],
    credentials: true,
  })
);
app.use(express.json());

/* =====================
   STATIC FILES
===================== */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* =====================
   ROUTES
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/continue", continueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tmdb", tmdbRoutes); // ✅ Proxy Route

/* =====================
   HEALTH CHECK (OPTIONAL)
===================== */
app.get("/", (_, res) => {
  res.send("API is running ✅");
});

/* =====================
   DATABASE + SERVER
===================== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      family: 4, // Force IPv4
    });
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();
