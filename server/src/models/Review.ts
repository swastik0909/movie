import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    mediaId: string; // TMDB ID (Movie or TV)
    mediaType: "movie" | "tv";
    category: "Skip" | "Timepass" | "Go for it" | "Perfection";
    text: string;
    hasSpoilers: boolean;
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[]; // NEW
    reports: { user: mongoose.Types.ObjectId; reason: string; createdAt: Date }[]; // NEW
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        mediaId: { type: String, required: true },
        mediaType: {
            type: String,
            enum: ["movie", "tv"],
            required: true,
        },
        category: {
            type: String,
            enum: ["Skip", "Timepass", "Go for it", "Perfection"],
            required: true,
        },
        text: {
            type: String,
            required: false, // Allow empty comments (rating only)
        },
        hasSpoilers: {
            type: Boolean,
            default: false,
        },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }], // NEW
        reports: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                reason: String,
                createdAt: { type: Date, default: Date.now },
            },
        ], // NEW
    },
    { timestamps: true }
);

// Prevent duplicate reviews from same user for same media
reviewSchema.index({ user: 1, mediaId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);
