import { useEffect, useRef, useState } from "react";
import tmdbApi from "@/services/api-client";
import TvShowCard from "../TvShowCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AUTO_SLIDE_MS = 5000;
const CARD_WIDTH = 220;
const IMAGE = "https://image.tmdb.org/t/p/original";

const HighestRatedTv = () => {
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  /* ⭐ FETCH HIGHEST RATED TV SHOWS */
  useEffect(() => {
    tmdbApi
      .get("/tv/top_rated")
      .then((res) => setTvShows(res.data.results.slice(0, 10)))
      .catch(() => { });
  }, []);

  /* 🎞 AUTO SLIDE HERO */
  useEffect(() => {
    if (!tvShows.length) return;

    intervalRef.current = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % tvShows.length);
    }, AUTO_SLIDE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tvShows]);

  if (!tvShows.length) {
    return (
      <section className="px-6 py-10 text-gray-400">
        Loading highest rated TV shows…
      </section>
    );
  }

  const hero = tvShows[heroIndex];

  return (
    <section className="space-y-10 px-4 md:px-10 mb-20 group">
      {/* ================= HERO ================= */}
      <div className="relative h-[60vh] rounded-2xl overflow-hidden bg-[#1f3b55] flex items-center">
        {/* BACKDROP */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGE}${hero.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 px-6 md:px-10 max-w-xl text-white">
          <div className="flex gap-2 mb-4 text-xs">
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
              HD
            </span>
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
              TV
            </span>
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
              {hero.first_air_date?.slice(0, 4)}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            {hero.name}
          </h1>

          {/* ⭐ RATING */}
          <div className="flex gap-1 text-yellow-400 mb-4">
            {"★".repeat(Math.round(hero.vote_average / 2))}
          </div>

          <p className="text-gray-200 line-clamp-4 mb-6 text-sm md:text-base">
            {hero.overview}
          </p>

          <button
            onClick={() => navigate(`/tvshow/${hero.id}`)}
            className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-full font-semibold text-sm md:text-base"
          >
            ▶ Watch now
          </button>
        </div>

        {/* RIGHT POSTER */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[40%] hidden md:block">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={IMAGE + hero.poster_path}
              alt={hero.name}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center text-white text-3xl">
                ▶
              </div>
            </div>
            <span className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-white min-w-[2rem] text-center">
              {String(heroIndex + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SLIDER ================= */}
      <div className="relative">
        {/* LEFT */}
        <button
          onClick={() =>
            sliderRef.current?.scrollBy({
              left: -CARD_WIDTH,
              behavior: "smooth",
            })
          }
          className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={28} />
        </button>

        {/* RIGHT */}
        <button
          onClick={() =>
            sliderRef.current?.scrollBy({
              left: CARD_WIDTH,
              behavior: "smooth",
            })
          }
          className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={28} />
        </button>

        {/* TV LIST */}
        <div
          ref={sliderRef}
          className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-hidden scroll-smooth scrollbar-hide pb-4 md:pb-0"
        >
          {tvShows.map((tv, i) => (
            <div
              key={tv.id}
              className="relative min-w-[160px] md:min-w-[200px] hover:scale-105 transition"
            >
              {/* RANK */}
              <span className="absolute -left-4 md:-left-8 bottom-4 text-[60px] md:text-[100px] font-extrabold text-white/10 select-none z-[-1]">
                {i + 1}
              </span>

              <TvShowCard tvshowResult={tv} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighestRatedTv;
