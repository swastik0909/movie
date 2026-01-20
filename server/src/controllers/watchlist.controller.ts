import { Request, Response } from "express";
import Watchlist from "../models/Watchlist";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * listType values:
 * - "favorites" ❤️
 * - "watchLater" ⏳ (default)
 * - "completed" ✅
 */

// ✅ ADD OR UPDATE WATCHLIST ITEM
export const addToWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const {
      movieId,
      title,
      poster,
      mediaType,
      listType = "watchLater", // ⏳ default
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!movieId || !mediaType) {
      return res
        .status(400)
        .json({ message: "movieId and mediaType are required" });
    }

    // 🔍 Check if item already exists
    const existing = await Watchlist.findOne({
      user: userId,
      movieId,
      mediaType,
    });

    // 🔁 If exists, update listType
    if (existing) {
      existing.listType = listType;
      await existing.save();

      return res.json({
        message: "Watchlist updated",
        item: existing,
      });
    }

    // ➕ Create new watchlist item
    const item = await Watchlist.create({
      user: userId,          // ✅ OPTION 1 FIELD
      movieId,
      title,
      poster,
      mediaType,
      listType,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET USER WATCHLIST (OPTIONAL FILTER BY LIST TYPE)
export const getWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type } = req.query;

    const filter: any = {
      user: req.user.id,
    };

    if (type) {
      filter.listType = type; // favorites | watchLater | completed
    }

    const items = await Watchlist.find(filter).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ REMOVE FROM WATCHLIST
export const removeFromWatchlist = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await Watchlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // ✅ OPTION 1 FIELD
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Remove watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
