import useTrendingList from "@/hooks/useTrendingList";
import { useEffect, useRef, useState } from "react";
import MovieCard from "../MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_SLIDE_MS = 5000;
const CARD_WIDTH = 220;

const TrendingMovie = () => {
  /* ================= HOOKS ================= */
  const { trendingData } = useTrendingList("movie");
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  /* ================= DATA ================= */
  // 🆕 LATEST MOVIES (no Top 10 limit)
  const movies = trendingData ?? [];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (movies.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= movies.length - 1) return prev;
        sliderRef.current?.scrollBy({
          left: CARD_WIDTH,
          behavior: "smooth",
        });
        return prev + 1;
      });
    }, AUTO_SLIDE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies.length]);

  /* ================= CONTROLS ================= */
  const slideNext = () => {
    if (index >= movies.length - 1) return;
    setIndex((i) => i + 1);
    sliderRef.current?.scrollBy({
      left: CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const slidePrev = () => {
    if (index <= 0) return;
    setIndex((i) => i - 1);
    sliderRef.current?.scrollBy({
      left: -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  /* ================= UI ================= */
  if (movies.length === 0) {
    return (
      <section className="px-6 py-10 text-gray-400">
        Loading latest movies…
      </section>
    );
  }

  return (
    <section className="px-4 md:px-10 mb-16 relative">
      {/* LEFT */}
      <button
        onClick={slidePrev}
        disabled={index === 0}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full disabled:opacity-30"
      >
        <ChevronLeft size={28} />
      </button>

      {/* RIGHT */}
      <button
        onClick={slideNext}
        disabled={index >= movies.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full disabled:opacity-30"
      >
        <ChevronRight size={28} />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-hidden scroll-smooth"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative min-w-[200px] hover:scale-105 transition"
          >
            <MovieCard movieResult={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingMovie;
