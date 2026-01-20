import type { TvShowResult } from "@/hooks/useTvShowList";
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router-dom";
import userApi from "@/services/userApi";
import { useState } from "react";

interface Props {
  tvshowResult: TvShowResult;
}

const TvShowCard = ({ tvshowResult }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ▶️ OPEN TV DETAILS PAGE */
  const handlePlay = () => {
    navigate(`/tvshow/${tvshowResult.id}`);
  };

  /* ➕ ADD TO WATCHLIST */
  const addToList = async (
    e: React.MouseEvent<HTMLButtonElement>,
    listType: "favorites" | "watchLater" | "completed"
  ) => {
    e.stopPropagation();
    if (loading) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await userApi.post("/watchlist", {
        movieId: tvshowResult.id,
        title: tvshowResult.name,
        poster: tvshowResult.poster_path,
        mediaType: "tv",
        listType,
      });
    } catch (error) {
      console.error("TV Watchlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={handlePlay}
      className="bg-transparent border-0 cursor-pointer group"
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-xl">
          {/* LIST ACTIONS */}
          <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => addToList(e, "favorites")}
              className="px-2 py-1 text-xs rounded-full bg-black/70 text-white hover:bg-red-600"
            >
              ❤️
            </button>
            <button
              onClick={(e) => addToList(e, "watchLater")}
              className="px-2 py-1 text-xs rounded-full bg-black/70 text-white hover:bg-yellow-600"
            >
              ⏳
            </button>
            <button
              onClick={(e) => addToList(e, "completed")}
              className="px-2 py-1 text-xs rounded-full bg-black/70 text-white hover:bg-green-600"
            >
              ✅
            </button>
          </div>

          {/* POSTER */}
          <img
            src={
              tvshowResult.poster_path
                ? `https://image.tmdb.org/t/p/w500${tvshowResult.poster_path}`
                : "/placeholder.jpg"
            }
            alt={tvshowResult.name}
            className="
              w-full h-full object-cover
              transition-transform duration-300
              group-hover:scale-110 group-hover:brightness-75
            "
          />

          {/* TITLE OVERLAY */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition p-4">
            <h1 className="text-white font-semibold text-sm md:text-base">
              {tvshowResult.name}
            </h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TvShowCard;
