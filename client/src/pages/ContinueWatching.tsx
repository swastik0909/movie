import { useEffect, useMemo, useState } from "react";
import { getContinueWatching } from "@/services/userApi";
import { useNavigate } from "react-router-dom";
import type { ContinueWatchingItem } from "@/services/userApi";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const ContinueWatching = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const navigate = useNavigate();

  useEffect(() => {
    getContinueWatching().then((res) => setItems(res.data));
  }, []);

  /**
   * ✅ ONE poster per TV show
   * FIX: mediaId is number → Map<number, string>
   */
  const tvPosterMap = useMemo(() => {
    const map = new Map<number, string>();

    for (const item of items) {
      if (item.mediaType !== "tv") continue;
      if (map.has(item.mediaId)) continue;

      if (item.poster && item.poster.trim() !== "") {
        map.set(item.mediaId, item.poster);
      }
    }

    return map;
  }, [items]);

  const filtered =
    filter === "all"
      ? items
      : items.filter((i) => i.mediaType === filter);

  const handleClick = (item: ContinueWatchingItem) => {
    if (item.mediaType === "movie") {
      navigate(`/player/${String(item.mediaId)}`);
    } else {
      navigate(
        `/tv/${String(item.mediaId)}/${item.season}/${item.episode}`
      );
    }
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">
        Continue Watching
      </h1>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {(["all", "movie", "tv"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1 rounded ${
              filter === t ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {filtered.map((item) => {
          const poster =
            item.mediaType === "tv"
              ? tvPosterMap.get(item.mediaId)
              : item.poster;

          const posterUrl =
            poster && poster.trim() !== ""
              ? poster.startsWith("http")
                ? poster
                : `${IMAGE_BASE}${poster}`
              : null;

          return (
            <div
              key={item._id}
              onClick={() => handleClick(item)}
              className="cursor-pointer group"
            >
              <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden bg-zinc-800">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="h-1 bg-gray-700 rounded mt-2">
                <div
                  className="h-1 bg-red-600"
                  style={{
                    width: `${Math.min(item.progress, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm line-clamp-2">
                {item.mediaType === "tv"
                  ? `${item.title} • S${item.season}E${item.episode}`
                  : item.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatching;
