import mongoose from "mongoose";

const ContinueWatchingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },

    mediaId: {
      type: Number, // TMDB ID
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      default: null,
    },

    season: {
      type: Number,
      default: null,
    },

    episode: {
      type: Number,
      default: null,
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ✅ Prevent duplicate entries for same user & media */
ContinueWatchingSchema.index(
  { user: 1, mediaType: 1, mediaId: 1, season: 1, episode: 1 },
  { unique: true }
);

export default mongoose.model(
  "ContinueWatching",
  ContinueWatchingSchema
);
