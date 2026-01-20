import { Response } from "express";
import User from "../models/User";

export const updateProfile = async (
  req: any,
  res: Response
) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name },
    { new: true }
  );
  res.json({ user });
};

export const uploadAvatar = async (
  req: any,
  res: Response
) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: `/uploads/${req.file.filename}` },
    { new: true }
  );
  res.json({ user });
};
