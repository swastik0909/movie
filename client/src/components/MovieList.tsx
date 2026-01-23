import { useEffect, useState, useContext } from "react";
import tmdbApi from "@/services/api-client";
import { GenresContext } from "@/context/genres_context";
import MovieCard from "./MovieCard";

/* 📅 YEARS */
const YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i);

/* 🔀 SORT OPTIONS */
const SORTS = [
  { label: "Popular", value: "popularity.desc" },
  { label: "Latest", value: "release_date.desc" },
  { label: "Highest Rated", value: "vote_average.desc" },
];

const MovieList = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<string>("popularity.desc");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>("all"); // ✅ New Language Parameter

  // 🌍 Genre Context
  const { genres } = useContext(GenresContext);

  /* 🎬 FETCH MOVIES */
  useEffect(() => {
    setLoading(true);

    tmdbApi
      .get("/discover/movie", {
        params: {
          sort_by: sort,
          primary_release_year: year !== "all" ? year : undefined,
          vote_count_gte: 50,
          with_genres: genres || undefined,
          with_original_language: language !== "all" ? language : undefined, // ✅ Apply Language Filter
        },
      })
      .then((res) => setMovies(res.data.results || []))
      .finally(() => setLoading(false));
  }, [year, sort, genres, language]); // ✅ Depend on language

  return (
    <div className="bg-black min-h-screen text-white px-6 md:px-16 py-10">
      {/* ================= TITLE ================= */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 tracking-wide">
        Movies
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-4 mb-10">
        
        {/* LANGUAGE FILTER (NEW) */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="
            bg-zinc-900 border border-white/10 px-4 py-2 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-red-600
          "
        >
          <option value="all">All Languages</option>
          <option value="mr">Marathi</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="ml">Malayalam</option>
          <option value="kn">Kannada</option>
          <option value="pa">Punjabi</option>
          <option value="gu">Gujarati</option>
          <option value="en">English</option>
        </select>

        {/* YEAR FILTER */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="
            bg-zinc-900
            border border-white/10
            px-4 py-2
            rounded-md
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-red-600
          "
        >
          <option value="all">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* SORT FILTER */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="
            bg-zinc-900
            border border-white/10
            px-4 py-2
            rounded-md
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-red-600
          "
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================= MOVIE GRID ================= */}
      {loading ? (
        <div className="text-gray-400 py-20 text-center">
          Loading movies…
        </div>
      ) : (
        <div
          className="
            grid gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
          "
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="
                relative
                transition-all
                duration-300
                hover:scale-110
                hover:z-20
              "
            >
              <MovieCard movieResult={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
