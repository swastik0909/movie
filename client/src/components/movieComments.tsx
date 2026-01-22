import { useEffect, useState } from "react";
import {
  addComment,
  getComments,
  reactComment,
  deleteComment,
} from "@/services/commentApi";
import { ThumbsUp, ThumbsDown, Trash2, Flag } from "lucide-react";

/* ================= TYPES ================= */

interface User {
  _id: string;
  name: string;
  avatar?: string;
  role?: "user" | "admin";
}

interface Comment {
  _id: string;
  text: string;
  user: User;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

interface Props {
  mediaId: string;
  mediaType: "movie" | "tv";
}

/* ================= COMPONENT ================= */

const Comments = ({ mediaId, mediaType }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  /* 📥 FETCH COMMENTS */
  const fetchComments = async () => {
    const res = await getComments(mediaId, mediaType);
    setComments(res.data || []);
  };

  useEffect(() => {
    fetchComments();
  }, [mediaId, mediaType]);

  /* ➕ ADD COMMENT */
  const handleAdd = async () => {
    if (!text.trim()) return;

    const res = await addComment({
      mediaId,
      mediaType,
      text,
    });

    setComments((prev) => [res.data, ...prev]);
    setText("");
  };

  /* 👍👎 LIKE / DISLIKE */
  const handleReaction = async (
    commentId: string,
    type: "like" | "dislike"
  ) => {
    const res = await reactComment(commentId, type);
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? res.data : c))
    );
  };

  /* 🗑 DELETE COMMENT */
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
    setComments((prev) =>
      prev.filter((c) => c._id !== commentId)
    );
  };

  /* 🚫 REPORT COMMENT */
  const handleReport = async (commentId: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      await fetch(
        `${baseUrl}/comments/${commentId}/report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""
              }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "Abuse / Spam",
          }),
        }
      );

      alert("Comment reported 🚫");
    } catch {
      alert("You already reported this comment");
    }
  };

  return (
    <div className="mt-10 px-6">
      <h2 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* INPUT */}
      <div className="flex gap-3 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-zinc-800 px-4 py-2 rounded-lg text-white"
        />
        <button
          onClick={handleAdd}
          className="bg-red-600 px-4 py-2 rounded-lg"
        >
          Post
        </button>
      </div>

      {/* COMMENTS */}
      {comments.length === 0 ? (
        <p className="text-gray-400">No comments yet 👋</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const isOwner =
              currentUser?._id === c.user._id;
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
                      onClick={() => handleDelete(c._id)}
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
                      handleReaction(c._id, "like")
                    }
                    className="flex items-center gap-1 hover:text-green-400"
                  >
                    <ThumbsUp size={16} />
                    {c.likes.length}
                  </button>

                  <button
                    onClick={() =>
                      handleReaction(c._id, "dislike")
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

export default Comments;
