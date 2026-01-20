import { Router } from "express";
import {
  saveProgress,
  getContinueWatching,
} from "../controllers/continue.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * ⏯ Save / update continue watching progress
 * - Movie → one entry
 * - TV → one entry per series (no duplicates)
 */
router.post("/", authMiddleware, saveProgress);

/**
 * 📥 Get continue watching list
 * - Sorted by last watched
 * - Max 20 items
 */
router.get("/", authMiddleware, getContinueWatching);

export default router;
