import { useEffect, useState, useContext } from "react";
import userApi from "@/services/userApi";
import { AuthContext } from "@/context/AuthContext";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Flag,
} from "lucide-react";

/* ================= TYPES ================= */

interface CommentUser {
  _id: string;
  name: string;
  avatar?: string;
  role?: "user" | "admin";
}

interface Comment {
  _id: string;
  text: string;
  user: CommentUser;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

/* ================= COMPONENT ================= */

const TvComments = ({ mediaId }: { mediaId: string }) => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  /* 📥 FETCH COMMENTS */
  const fetchComments = async () => {
    try {
      const res = await userApi.get("/comments", {
        params: { mediaId, mediaType: "tv" },
      });
      setComments(res.data || []);
    } catch (err) {
      console.error("Fetch comments failed", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mediaId]);

  /* ➕ ADD COMMENT */
  const postComment = async () => {
    if (!text.trim()) return;

    await userApi.post("/comments", {
      mediaId,
      mediaType: "tv",
      text,
    });

    setText("");
    fetchComments();
  };

  /* 🗑 DELETE (OWNER / ADMIN) */
  const handleDelete = async (id: string) => {
    await userApi.delete(`/comments/${id}`);
    fetchComments();
  };

  /* 👍👎 LIKE / DISLIKE */
  const handleReact = async (
    id: string,
    type: "like" | "dislike"
  ) => {
    await userApi.post(`/comments/${id}/react`, {
      type,
    });
    fetchComments();
  };

  /* 🚫 REPORT COMMENT */
  const handleReport = async (id: string) => {
    try {
      await userApi.post(`/comments/${id}/report`, {
        reason: "Abuse / Spam",
      });
      alert("Comment reported 🚫");
    } catch {
      alert("You already reported this comment");
    }
  };

  return (
    <div className="px-6 mt-10">
      <h2 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* ADD COMMENT */}
      <div className="flex gap-3 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-zinc-800 px-4 py-2 rounded-lg text-white"
        />
        <button
          onClick={postComment}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Post
        </button>
      </div>

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <p className="text-gray-400">
          No comments yet 👋
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const isOwner =
              c.user._id === currentUser?._id;
            const isAdmin =
              currentUser?.role === "admin";

            return (
              <div
                key={c._id}
                className="bg-zinc-900 p-4 rounded-lg"
              >
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      c.user.avatar
                        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`.replace("/api", "") + c.user.avatar
                        : "/avatar.png"
                    }
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <span className="font-medium">
                    {c.user.name}
                  </span>

                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() =>
                        handleDelete(c._id)
                      }
                      className="ml-auto text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* TEXT */}
                <p className="text-gray-300 mb-3">
                  {c.text}
                </p>

                {/* ACTIONS */}
                <div className="flex items-center gap-5 text-sm text-gray-400">
                  <button
                    onClick={() =>
                      handleReact(c._id, "like")
                    }
                    className="flex items-center gap-1 hover:text-green-400"
                  >
                    <ThumbsUp size={16} />
                    {c.likes.length}
                  </button>

                  <button
                    onClick={() =>
                      handleReact(c._id, "dislike")
                    }
                    className="flex items-center gap-1 hover:text-red-400"
                  >
                    <ThumbsDown size={16} />
                    {c.dislikes.length}
                  </button>

                  {!isOwner && !isAdmin && (
                    <button
                      onClick={() =>
                        handleReport(c._id)
                      }
                      className="flex items-center gap-1 hover:text-yellow-400"
                    >
                      <Flag size={16} />
                      Report
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TvComments;
