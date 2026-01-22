// Review Controller
import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review";

/* ================= TYPES ================= */

interface AuthRequest extends Request {
    user?: {
        id: string;
        role?: "user" | "admin";
    };
}

/* ================= ADD REVIEW ================= */

export const addReview = async (req: AuthRequest, res: Response) => {
    try {
        const { mediaId, mediaType, category, text, hasSpoilers } = req.body;

        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!mediaId || !mediaType || !category) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const review = await Review.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            mediaId,
            mediaType,
            category,
            text,
            hasSpoilers,
            likes: [],
            dislikes: [],
            reports: [],
        });

        const populated = await review.populate("user", "name avatar role");

        res.status(201).json(populated);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this title" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ================= GET REVIEWS ================= */

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { mediaType, mediaId } = req.params;

        const reviews = await Review.find({ mediaId, mediaType })
            .populate("user", "name avatar role")
            .sort({ createdAt: -1 });

        // Calculate stats
        const total = reviews.length;
        console.log(`[getReviews] Search: type=${mediaType}, id=${mediaId}. Found: ${total}`);

        if (total === 0) {
            return res.json({ reviews: [], stats: { percentage: 0, total: 0 } });
        }

        // "Go for it" and "Perfection" are positive
        const positiveCount = reviews.filter(
            (r) => r.category === "Go for it" || r.category === "Perfection"
        ).length;

        const percentage = total > 0 ? Math.round((positiveCount / total) * 100) : 0;

        res.json({
            reviews,
            stats: {
                percentage,
                total,
            },
        });

    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ================= DELETE REVIEW ================= */

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review || !req.user?.id) {
            return res.status(404).json({ message: "Not found" });
        }

        const isOwner = review.user.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await review.deleteOne();
        res.json({ message: "Review deleted" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ================= LIKE / DISLIKE ================= */

export const likeReview = async (req: AuthRequest, res: Response) => {
    return toggleReaction(req, res, "like");
};

export const dislikeReview = async (req: AuthRequest, res: Response) => {
    return toggleReaction(req, res, "dislike");
};

const toggleReaction = async (
    req: AuthRequest,
    res: Response,
    type: "like" | "dislike"
) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review || !req.user?.id) {
            return res.status(404).json({ message: "Not found" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Remove existing reactions from this user
        review.likes = review.likes.filter((id) => !id.equals(userId));
        review.dislikes = review.dislikes.filter((id) => !id.equals(userId));

        // Add new reaction
        if (type === "like") review.likes.push(userId);
        if (type === "dislike") review.dislikes.push(userId);

        await review.save();

        res.json({ message: "Success" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* ================= REPORT REVIEW ================= */

export const reportReview = async (req: AuthRequest, res: Response) => {
    try {
        const { reason } = req.body;
        const review = await Review.findById(req.params.reviewId);

        if (!review || !req.user?.id) {
            return res.status(404).json({ message: "Not found" });
        }

        if (!reason) {
            return res.status(400).json({ message: "Report reason required" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const alreadyReported = review.reports.some(
            (r) => r.user && r.user.equals(userId)
        );

        if (alreadyReported) {
            return res.status(400).json({ message: "Already reported" });
        }

        review.reports.push({
            user: userId,
            reason,
            createdAt: new Date(),
        });

        await review.save();

        res.json({ message: "Review reported" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
