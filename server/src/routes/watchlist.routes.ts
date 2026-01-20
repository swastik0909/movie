import { Router } from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getWatchlist);
router.post("/", authMiddleware, addToWatchlist);
router.delete("/:id", authMiddleware, removeFromWatchlist);

export default router;
