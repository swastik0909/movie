import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tmdbApi from "@/services/api-client";

import TrendingMovie from "./TrendingMovie";
import TrendingTv from "./TrendingTv";
import HighestRatedMovie from "./HighestRatedMovie";
import HighestRatedTv from "./HighestRatedTv";
import TrendingFooter from "@/components/TrendingFooter";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const Trending = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  /* 🎬 HERO – TRENDING MOVIES */
  useEffect(() => {
    tmdbApi.get("/trending/movie/week").then((res) => {
      setMovies(res.data.results.slice(0, 10));
    });
  }, []);

  /* 🔁 AUTO SLIDE */
  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const movie = movies[index];

  return (
    <div className="bg-black text-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center">
        {movie && (
          <div
            key={movie.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />

        {/* GLOWS */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />

        {/* CONTENT */}
        {movie && (
          <div className="relative z-10 px-6 md:px-16 max-w-3xl">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                HD
              </span>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                Movie
              </span>
              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                {movie.release_date?.slice(0, 4)}
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl font-extrabold mb-3 md:mb-5 leading-tight">
              {movie.title}
            </h1>

            <p className="text-gray-300 max-w-xl mb-6 md:mb-8 line-clamp-3 text-sm md:text-lg">
              {movie.overview}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-red-600 hover:bg-red-700 transition px-5 py-2 md:px-6 md:py-3 rounded-md font-semibold text-sm md:text-base"
              >
                ▶ Watch Now
              </button>

              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-white/10 hover:bg-white/20 transition px-5 py-2 md:px-6 md:py-3 rounded-md text-sm md:text-base"
              >
                More Info
              </button>
            </div>
          </div>
        )}

        {/* CONTROLS */}
        {movies.length > 1 && (
          <>
            <button
              onClick={() =>
                setIndex((index - 1 + movies.length) % movies.length)
              }
              className="absolute right-20 top-1/2 -translate-y-1/2 text-3xl opacity-60 hover:opacity-100"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setIndex((index + 1) % movies.length)
              }
              className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl opacity-60 hover:opacity-100"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent" />
      </section>

      {/* ================= CONTENT ================= */}
      <div className="space-y-20 py-14">
        {/* 🆕 LATEST MOVIES */}
        <section>
          <h2 className="px-6 md:px-16 text-xl md:text-2xl font-semibold mb-6">
            🆕 Latest Movies
          </h2>
          <TrendingMovie />
        </section>

        {/* 🆕 LATEST TV SHOWS */}
        <section>
          <h2 className="px-6 md:px-16 text-xl md:text-2xl font-semibold mb-6">
            🆕 Latest TV Shows
          </h2>
          <TrendingTv />
        </section>

        {/* ⭐ HIGHEST RATED MOVIES */}
        <section>
          <h2 className="px-6 md:px-16 text-xl md:text-2xl font-semibold mb-6">
            ⭐ Highest Rated Movies
          </h2>
          <HighestRatedMovie />
        </section>

        {/* ⭐ HIGHEST RATED TV SHOWS */}
        <section>
          <h2 className="px-6 md:px-16 text-xl md:text-2xl font-semibold mb-6">
            ⭐ Highest Rated TV Shows
          </h2>
          <HighestRatedTv />
        </section>
      </div>

      {/* FOOTER */}
      <TrendingFooter />
    </div>
  );
};

export default Trending;
