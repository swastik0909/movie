import { Request, Response } from "express";
import User from "../models/User";
import Watchlist from "../models/Watchlist";
import ContinueWatching from "../models/ContinueWatching";

/* 👥 USERS */
export const getAllUsers = async (_: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/* 🚫 BAN / UNBAN USER */
export const toggleBanUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ⛔ Prevent banning admins
  if (user.role === "admin") {
    return res
      .status(403)
      .json({ message: "Admin accounts cannot be banned" });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  res.json({
    message: user.isBanned ? "User banned" : "User unbanned",
    user,
  });
};

/* 📊 ADMIN DASHBOARD STATS */
export const getAdminStats = async (_: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const bannedUsers = await User.countDocuments({ isBanned: true });
  const watchlistCount = await Watchlist.countDocuments();
  const continueCount = await ContinueWatching.countDocuments();

  res.json({
    totalUsers,
    activeUsers: totalUsers - bannedUsers,
    bannedUsers,
    watchlistCount,
    continueWatchingCount: continueCount,
  });
};

/* 📈 USER ACTIVITY */
export const getUserActivity = async (_: Request, res: Response) => {
  const users = await User.find()
    .select("email lastLogin lastActivity role isBanned")
    .sort({ lastLogin: -1 });

  res.json(users);
};

/* 📊 LOGINS PER DAY (LAST 7 DAYS) */
export const getLoginsPerDay = async (_: Request, res: Response) => {
  const data = await User.aggregate([
    {
      $match: {
        lastLogin: { $exists: true },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$lastLogin",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 7 },
  ]);

  res.json(data);
};

/* 🟢 ACTIVE USERS TODAY */
export const getActiveUsersToday = async (_: Request, res: Response) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const count = await User.countDocuments({
    lastLogin: { $gte: start, $lte: end },
  });

  res.json({ activeUsersToday: count });
};

/* 🔥 MOST WATCHED CONTENT */
export const getMostWatchedContent = async (
  _: Request,
  res: Response
) => {
  const data = await ContinueWatching.aggregate([
    {
      $group: {
        _id: {
          mediaId: "$mediaId",
          title: "$title",
          poster: "$poster",
          mediaType: "$mediaType",
        },
        views: { $sum: 1 },
      },
    },
    { $sort: { views: -1 } },
    { $limit: 5 },
  ]);

  res.json(data);
};
