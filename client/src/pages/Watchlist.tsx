import { useEffect, useState } from "react";
import userApi from "@/services/userApi";
import { useNavigate } from "react-router-dom";

type ListType = "favorites" | "watchLater" | "completed";
type MediaFilter = "all" | "movie" | "tv";

interface WatchItem {
  _id: string;
  movieId: number;
  title: string;
  poster: string;
  mediaType: "movie" | "tv";
  listType: ListType;
}

const Watchlist = () => {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [activeList, setActiveList] =
    useState<ListType>("watchLater");
  const [mediaFilter, setMediaFilter] =
    useState<MediaFilter>("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [activeList]);

  const fetchList = async () => {
    const res = await userApi.get(
      `/watchlist?type=${activeList}`
    );
    setItems(res.data);
  };

  const removeItem = async (id: string) => {
    await userApi.delete(`/watchlist/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  // ✅ FILTER MOVIES / TV
  const filteredItems =
    mediaFilter === "all"
      ? items
      : items.filter(
          (item) => item.mediaType === mediaFilter
        );

  return (
    <div className="px-6 mt-8 text-white">
      <h1 className="text-2xl mb-4">My Lists</h1>

      {/* LIST TYPE TABS */}
      <div className="flex gap-2 mb-4">
        {[
          { k: "favorites", l: "❤️ Favorites" },
          { k: "watchLater", l: "⏳ Watch Later" },
          { k: "completed", l: "✅ Completed" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() =>
              setActiveList(t.k as ListType)
            }
            className={`px-4 py-1 rounded-full ${
              activeList === t.k
                ? "bg-red-600"
                : "bg-gray-700"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* MEDIA TYPE FILTER */}
      <div className="flex gap-2 mb-6">
        {[
          { k: "all", l: "All" },
          { k: "movie", l: "🎬 Movies" },
          { k: "tv", l: "📺 TV Shows" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() =>
              setMediaFilter(t.k as MediaFilter)
            }
            className={`px-4 py-1 rounded-full ${
              mediaFilter === t.k
                ? "bg-red-600"
                : "bg-gray-700"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* GRID */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-400">
          No items found.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                navigate(
                  item.mediaType === "movie"
                    ? `/player/${item.movieId}`
                    : `/tv/${item.movieId}/1/1`
                )
              }
              className="relative cursor-pointer"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                alt={item.title}
                className="rounded-lg"
              />

              {/* REMOVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item._id);
                }}
                className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded"
              >
                ✕
              </button>

              {/* TITLE */}
              <p className="mt-2 text-sm truncate">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
