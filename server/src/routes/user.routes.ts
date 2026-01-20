import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.put("/profile", authMiddleware, updateProfile);
router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

export default router;
