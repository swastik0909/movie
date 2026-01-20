import { useEffect, useState } from "react";
import { getMostWatched } from "@/services/adminApi";

interface MostWatchedItem {
  _id: {
    title: string;
    poster: string;
    mediaType: "movie" | "tv";
  };
  views: number;
}

const AdminMostWatched = () => {
  const [items, setItems] = useState<MostWatchedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMostWatched().then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">
        🔥 Most Watched Content
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400">No data available</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[#1f1f1f] p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://image.tmdb.org/t/p/w200${item._id.poster}`}
                  className="w-14 h-20 rounded object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {item._id.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item._id.mediaType === "tv"
                      ? "📺 TV Show"
                      : "🎬 Movie"}
                  </p>
                </div>
              </div>

              <span className="text-red-500 font-bold">
                {item.views} views
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMostWatched;
