import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import RatingGauge from "./RatingGauge";
import { ThumbsUp, ThumbsDown, Trash2, Flag, AlertTriangle, Send } from "lucide-react";


interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
    category: "Skip" | "Timepass" | "Go for it" | "Perfection";
    text: string;
    hasSpoilers: boolean;
    likes: string[];
    dislikes: string[];
    createdAt: string;
}

interface ReviewsSectionProps {
    mediaId: string;
    mediaType: "movie" | "tv";
}

const CATEGORIES = ["Skip", "Timepass", "Go for it", "Perfection"];

const ReviewsSection = ({ mediaId, mediaType }: ReviewsSectionProps) => {
    const { user } = useContext(AuthContext) || {};
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [category, setCategory] = useState<string>("");
    const [text, setText] = useState("");
    const [hasSpoilers, setHasSpoilers] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filter State
    const [showSpoilers, setShowSpoilers] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [mediaId, mediaType]);

    const fetchReviews = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const res = await axios.get(`${baseUrl}/reviews/${mediaType}/${mediaId}`);
            setReviews(res.data.reviews);
            setStats(res.data.stats);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please login to review");
        if (!category) return alert("Please select a rating category");

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            await axios.post(
                `${baseUrl}/reviews`,
                { mediaId, mediaType, category, text, hasSpoilers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Reset form and refresh
            setCategory("");
            setText("");
            setHasSpoilers(false);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReaction = async (reviewId: string, type: "like" | "dislike") => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            await axios.put(
                `${baseUrl}/reviews/${reviewId}/${type}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReviews(); // Refresh to get latest counts (or implement optimistic UI for dislikes too)
        } catch (err) {
            console.error("Reaction failed", err);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            await axios.delete(`${baseUrl}/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        } catch (err) {
            alert("Failed to delete review");
        }
    };

    const handleReport = async (reviewId: string) => {
        const reason = prompt("Why are you reporting this review?");
        if (!reason) return;
        try {
            const token = localStorage.getItem("token");
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            await axios.post(
                `${baseUrl}/reviews/${reviewId}/report`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Review reported. Thanks for helping!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to report");
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Loading reviews...</div>;

    return (
        <div className="w-full max-w-6xl mx-auto mt-12 px-4">
            <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-yellow-500 pl-4">Community Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT: GAUGE + STATS (4 Columns) */}
                <div className="lg:col-span-4 space-y-8">
                    {stats && stats.percentage !== undefined && (
                        <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
                            <h3 className="text-gray-400 font-medium mb-4">Vibe Check</h3>
                            <RatingGauge stats={stats} />
                        </div>
                    )}
                </div>

                {/* RIGHT: REVIEWS LIST + FORM (8 Columns) */}
                <div className="lg:col-span-8">

                    {/* INPUT FORM */}
                    <div className="bg-[#141414] border border-zinc-800 rounded-xl p-6 mb-8 shadow-lg">
                        {!user ? (
                            <div className="text-center text-gray-400 py-4">
                                <a href="/login" className="text-yellow-500 hover:underline font-bold">Login</a> to join the conversation.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.name[0]}</div>}
                                    </div>
                                    <span className="text-gray-200 font-medium">@{user.name}</span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-400 mb-2">What's the vibe?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${category === cat
                                                    ? "bg-yellow-500 border-yellow-500 text-black"
                                                    : "bg-zinc-900 border-zinc-700 text-gray-400 hover:border-gray-500"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Add a comment... (optional)"
                                        className="w-full bg-zinc-900/50 text-gray-200 p-4 rounded-xl border border-zinc-700 focus:border-yellow-500 focus:outline-none min-h-[100px] resize-y"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="absolute bottom-3 right-3 bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer hover:text-red-400 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={hasSpoilers}
                                            onChange={(e) => setHasSpoilers(e.target.checked)}
                                            className="accent-red-500 w-4 h-4"
                                        />
                                        <span className={hasSpoilers ? "text-red-400 font-bold" : ""}>Contains Spoilers</span>
                                    </label>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* FILTERS */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">All Reviews <span className="text-gray-500 text-sm font-normal">({reviews.length})</span></h3>
                        <label className="flex items-center gap-2 text-gray-400 text-xs cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showSpoilers}
                                onChange={(e) => setShowSpoilers(e.target.checked)}
                                className="accent-red-500"
                            />
                            Show Spoilers
                        </label>
                    </div>

                    {/* REVIEWS LIST */}
                    <div className="space-y-4">
                        {reviews.map((review) => {
                            const isSpoilerBlocked = review.hasSpoilers && !showSpoilers;
                            const isOwner = user && user._id === review.user._id;
                            const isAdmin = user && user.role === "admin";

                            return (
                                <div key={review._id} className="bg-[#141414] border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                                                {review.user.avatar ? <img src={review.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-xs">{review.user.name[0]}</div>}
                                            </div>
                                            <div>
                                                <h4 className="text-gray-200 text-sm font-bold">@{review.user.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider ${review.category === "Skip" ? "bg-red-500/20 text-red-500" :
                                                        review.category === "Timepass" ? "bg-orange-500/20 text-orange-500" :
                                                            review.category === "Go for it" ? "bg-green-500/20 text-green-500" :
                                                                "bg-purple-500/20 text-purple-500"
                                                        }`}>
                                                        {review.category}
                                                    </span>
                                                    <span className="text-zinc-600 text-xs">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {(isOwner || isAdmin) && (
                                            <button onClick={() => handleDelete(review._id)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="ml-13 pl-1 mb-4">
                                        {isSpoilerBlocked ? (
                                            <div onClick={() => setShowSpoilers(true)} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-red-500/20 transition-colors">
                                                <AlertTriangle className="text-red-500" size={18} />
                                                <span className="text-red-400 text-sm font-medium">Contains Spoilers (Click to reveal)</span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
                                        )}
                                    </div>

                                    {/* ACTIONS BAR */}
                                    <div className="flex items-center gap-6 ml-1 pl-1 pt-2 border-t border-zinc-800/50">
                                        <button
                                            onClick={() => handleReaction(review._id, "like")}
                                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${user && review.likes.includes(user._id) ? "text-green-500" : "text-gray-500 hover:text-gray-300"}`}
                                        >
                                            <ThumbsUp size={14} className={user && review.likes.includes(user._id) ? "fill-current" : ""} />
                                            {review.likes.length || 0}
                                        </button>

                                        <button
                                            onClick={() => handleReaction(review._id, "dislike")}
                                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${user && review.dislikes?.includes(user._id) ? "text-red-500" : "text-gray-500 hover:text-gray-300"}`}
                                        >
                                            <ThumbsDown size={14} className={user && review.dislikes?.includes(user._id) ? "fill-current" : ""} />
                                            {review.dislikes?.length || 0}
                                        </button>

                                        {!isOwner && (
                                            <button
                                                onClick={() => handleReport(review._id)}
                                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-yellow-500 transition-colors ml-auto"
                                            >
                                                <Flag size={14} />
                                                Report
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {reviews.length === 0 && (
                            <div className="text-center bg-[#141414] border border-zinc-800 rounded-xl p-10">
                                <p className="text-gray-500">No reviews yet. Be the first to share your vibe! 🚀</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
