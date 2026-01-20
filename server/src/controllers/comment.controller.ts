import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/Comment";

/* ================= TYPES ================= */

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

/* ================= ADD COMMENT ================= */

export const addComment = async (
  req: AuthRequest,
  res: Response
) => {
  const { mediaId, mediaType, text } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!mediaId || !mediaType || !text) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const comment = await Comment.create({
    user: new mongoose.Types.ObjectId(req.user.id),
    mediaId,
    mediaType,
    text,
    likes: [],
    dislikes: [],
    reports: [],
    isHidden: false,
  });

  const populated = await comment.populate(
    "user",
    "name avatar role"
  );

  res.status(201).json(populated);
};

/* ================= GET COMMENTS ================= */

export const getComments = async (
  req: Request,
  res: Response
) => {
  const { mediaId, mediaType } = req.query;

  if (!mediaId || !mediaType) {
    return res.status(400).json({ message: "Missing params" });
  }

  const comments = await Comment.find({
    mediaId,
    mediaType,
    isHidden: false,
  })
    .populate("user", "name avatar role")
    .sort({ createdAt: -1 });

  res.json(comments);
};

/* ================= DELETE COMMENT ================= */

export const deleteComment = async (
  req: AuthRequest,
  res: Response
) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment || !req.user?.id) {
    return res.status(404).json({ message: "Not found" });
  }

  const isOwner =
    comment.user.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};

/* ================= LIKE / DISLIKE ================= */

export const toggleReaction = async (
  req: AuthRequest,
  res: Response
) => {
  const { type } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment || !req.user?.id) {
    return res.status(404).json({ message: "Not found" });
  }

  const userId = new mongoose.Types.ObjectId(req.user.id);

  comment.likes = comment.likes.filter(
    (id) => !id.equals(userId)
  );
  comment.dislikes = comment.dislikes.filter(
    (id) => !id.equals(userId)
  );

  if (type === "like") comment.likes.push(userId);
  if (type === "dislike")
    comment.dislikes.push(userId);

  await comment.save();

  const populated = await comment.populate(
    "user",
    "name avatar role"
  );

  res.json(populated);
};

/* ================= REPORT COMMENT ================= */

export const reportComment = async (
  req: AuthRequest,
  res: Response
) => {
  const { reason } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (!comment || !req.user?.id) {
    return res.status(404).json({ message: "Not found" });
  }

  if (!reason) {
    return res
      .status(400)
      .json({ message: "Report reason required" });
  }

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const alreadyReported = comment.reports.some(
    (r) => r.user && r.user.equals(userId)
  );

  if (alreadyReported) {
    return res
      .status(400)
      .json({ message: "Already reported" });
  }

  comment.reports.push({
    user: userId,
    reason,
    createdAt: new Date(),
  });

  await comment.save();

  res.json({ message: "Comment reported" });
};

/* ================= ADMIN: GET REPORTED ================= */

export const getReportedComments = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const comments = await Comment.find({
    "reports.0": { $exists: true },
  })
    .populate("user", "name avatar")
    .sort({ updatedAt: -1 });

  res.json(comments);
};

/* ================= ADMIN: HIDE / UNHIDE ================= */

export const toggleHideComment = async (
  req: AuthRequest,
  res: Response
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: "Not found" });
  }

  comment.isHidden = !comment.isHidden;
  await comment.save();

  res.json(comment);
};
