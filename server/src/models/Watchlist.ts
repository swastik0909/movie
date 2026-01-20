import mongoose, { Schema, Types } from "mongoose";

const watchlistSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
    },
    poster: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    listType: {
      type: String,
      enum: ["favorites", "watchLater", "completed"],
      default: "watchLater",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Watchlist", watchlistSchema);
