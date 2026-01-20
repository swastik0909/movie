import { useEffect, useState } from "react";
import userApi from "@/services/userApi";
import { EyeOff, Trash2, Flag } from "lucide-react";

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Report {
  user: User;
  reason: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  user: User;
  mediaId: string;
  mediaType: "movie" | "tv";
  reports: Report[];
  isHidden: boolean;
  createdAt: string;
}

const AdminComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedComments = async () => {
    setLoading(true);
    const res = await userApi.get("/comments/admin/reported");
    setComments(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const toggleHide = async (id: string) => {
    await userApi.patch(`/comments/admin/${id}/hide`);
    fetchReportedComments();
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    await userApi.delete(`/comments/${id}`);
    fetchReportedComments();
  };

  if (loading) {
    return (
      <div className="p-10 text-gray-400">
        Loading reported comments...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        🚨 Reported Comments
      </h1>

      {comments.length === 0 ? (
        <p className="text-gray-400">
          No reported comments 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    c.user.avatar
                      ? `http://localhost:5000${c.user.avatar}`
                      : "/avatar.png"
                  }
                  className="w-9 h-9 rounded-full"
                />

                <div>
                  <p className="font-semibold">
                    {c.user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {c.mediaType.toUpperCase()} • {c.mediaId}
                  </p>
                </div>

                {c.isHidden && (
                  <span className="ml-auto text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded">
                    Hidden
                  </span>
                )}
              </div>

              {/* COMMENT TEXT */}
              <p className="text-gray-300 mb-3">
                {c.text}
              </p>

              {/* REPORTS */}
              <div className="text-sm text-yellow-400 mb-3 flex items-center gap-2">
                <Flag size={16} />
                {c.reports.length} reports
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => toggleHide(c._id)}
                  className="flex items-center gap-1 text-sm hover:text-yellow-400"
                >
                  <EyeOff size={16} />
                  {c.isHidden ? "Unhide" : "Hide"}
                </button>

                <button
                  onClick={() => deleteComment(c._id)}
                  className="flex items-center gap-1 text-sm hover:text-red-500"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComments;
