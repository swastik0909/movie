import { useEffect, useState } from "react";
import tmdbApi from "@/services/api-client";
import TvShowCard from "./TvShowCard";

/* 📅 YEARS */
const YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i);

/* 🔀 SORT OPTIONS */
const SORTS = [
  { label: "Popular", value: "popularity.desc" },
  { label: "Latest", value: "first_air_date.desc" },
  { label: "Highest Rated", value: "vote_average.desc" },
];

const TvShowsList = () => {
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<string>("popularity.desc");
  const [loading, setLoading] = useState(false);

  /* 📺 FETCH TV SHOWS */
  useEffect(() => {
    setLoading(true);

    tmdbApi
      .get("/discover/tv", {
        params: {
          sort_by: sort,
          first_air_date_year: year !== "all" ? year : undefined,
          vote_count_gte: 50,
        },
      })
      .then((res) => setTvShows(res.data.results || []))
      .finally(() => setLoading(false));
  }, [year, sort]);

  return (
    <div className="bg-black min-h-screen text-white px-6 md:px-16 py-10">
      {/* ================= TITLE ================= */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 tracking-wide">
        TV Shows
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-4 mb-10">
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

      {/* ================= GRID ================= */}
      {loading ? (
        <div className="text-gray-400 py-20 text-center">
          Loading TV shows…
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
          {tvShows.map((tv) => (
            <div
              key={tv.id}
              className="
                relative
                transition-all
                duration-300
                hover:scale-110
                hover:z-20
              "
            >
              <TvShowCard tvshowResult={tv} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TvShowsList;
