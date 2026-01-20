import mongoose, { Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaId: {
      type: String,
      required: true,
      index: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    likes: [{ type: Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Types.ObjectId, ref: "User" }],

    /* 🚫 REPORT SYSTEM */
    reports: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* 👮 ADMIN MODERATION */
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
