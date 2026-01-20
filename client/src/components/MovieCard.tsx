import type { MovieResult } from "@/hooks/useMovies";
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router";
import userApi from "@/services/userApi";
import { useState } from "react";

interface Props {
  movieResult: MovieResult;
}

const MovieCard = ({ movieResult }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [, setAdded] = useState(false);

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
        movieId: movieResult.id,
        title: movieResult.title || movieResult.name,
        poster: movieResult.poster_path,
        mediaType: "movie",
        listType,
      });

      setAdded(true);
    } catch (error) {
      console.error("Watchlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/movie/${movieResult.id}`)}
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

          {/* Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movieResult.poster_path}`}
            alt="poster"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
          />

          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition p-4">
            <h1 className="text-white font-semibold text-sm md:text-base">
              {movieResult.title ?? movieResult.name}
            </h1>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
