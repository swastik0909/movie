import { Router } from "express";
import {
  getAllUsers,
  toggleBanUser,
  getAdminStats,
  getUserActivity,
  getLoginsPerDay,
  getActiveUsersToday,
  getMostWatchedContent,
} from "../controllers/admin.controller";
import { adminAuth } from "../middleware/admin.middleware";

const router = Router();

/* 👥 USERS */
router.get("/users", adminAuth, getAllUsers);

/* 🚫 BAN / UNBAN USER */
router.put("/users/:id/ban", adminAuth, toggleBanUser);

/* 📊 DASHBOARD STATS (existing cards) */
router.get("/stats", adminAuth, getAdminStats);

/* 📈 USER ACTIVITY */
router.get("/activity", adminAuth, getUserActivity);

/* 📊 ANALYTICS (NEW) */

// Logins per day (last 7 days)
router.get("/analytics/logins-per-day", adminAuth, getLoginsPerDay);

// Active users today
router.get(
  "/analytics/active-users-today",
  adminAuth,
  getActiveUsersToday
);

// Most watched movies / TV shows
router.get(
  "/analytics/most-watched",
  adminAuth,
  getMostWatchedContent
);

export default router;
