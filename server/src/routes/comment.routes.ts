import { Router } from "express";
import {
  addComment,
  getComments,
  deleteComment,
  toggleReaction,
  reportComment,
  getReportedComments,
  toggleHideComment,
} from "../controllers/comment.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminAuth } from "../middleware/admin.middleware";

const router = Router();

/* ===== USER ROUTES ===== */
router.get("/", getComments);
router.post("/", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deleteComment);
router.post("/:id/react", authMiddleware, toggleReaction);
router.post("/:id/report", authMiddleware, reportComment);

/* ===== ADMIN ROUTES ===== */
router.get("/admin/reported", adminAuth, getReportedComments);
router.patch("/admin/:id/hide", adminAuth, toggleHideComment);

export default router;
