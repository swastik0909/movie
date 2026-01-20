// Review routes
import express from "express";
import { addReview, getReviews, likeReview, dislikeReview, deleteReview, reportReview } from "../controllers/reviews.controller";
import { authMiddleware as protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:mediaType/:mediaId", getReviews);
router.put("/:reviewId/like", protect, likeReview);
router.put("/:reviewId/dislike", protect, dislikeReview);
router.delete("/:reviewId", protect, deleteReview);
router.post("/:reviewId/report", protect, reportReview);

export default router;
