import { Request, Response } from "express";
import mongoose from "mongoose";
import ContinueWatching from "../models/ContinueWatching";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "user" | "admin";
  };
}

/* ⏯ SAVE / UPDATE PROGRESS */
export const saveProgress = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      mediaId,
      title,
      poster,
      mediaType,
      season,
      episode,
      progress,
    } = req.body;

    // ✅ basic validation
    if (
      typeof mediaId !== "number" ||
      typeof title !== "string" ||
      typeof progress !== "number" ||
      !mediaType
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    /**
     * ✅ IMPORTANT FIX
     * For TV shows:
     * - Do NOT save progress unless episode & season exist
     * - Prevents 400 error when opening TV show page
     */
    if (mediaType === "tv") {
      if (season === undefined || episode === undefined) {
        return res.status(200).json({ skipped: true });
      }
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const item = await ContinueWatching.findOneAndUpdate(
      {
        user: userObjectId,
        mediaId,
        mediaType,
      },
      {
        // ✅ required fields on first insert
        $setOnInsert: {
          user: userObjectId,
          mediaId,
          mediaType,
          title,
          poster: poster ?? null,
          season: mediaType === "tv" ? season : null,
          episode: mediaType === "tv" ? episode : null,
        },

        // ✅ fields that update every time
        $set: {
          progress,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.json(item);
  } catch (error) {
    console.error("Save progress error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* 📥 GET CONTINUE WATCHING */
export const getContinueWatching = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const items = await ContinueWatching.find({
      user: userObjectId,
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    return res.json(items);
  } catch (error) {
    console.error("Get continue watching error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
