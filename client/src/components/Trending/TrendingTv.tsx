import useTrendingList from "@/hooks/useTrendingList";
import { useEffect, useRef, useState } from "react";
import TvShowCard from "../TvShowCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEM_WIDTH = 220;
const AUTO_SLIDE_TIME = 5000;

const TrendingTv = () => {
  /* ================= HOOK ================= */
  const { trendingData } = useTrendingList("tv");

  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  /* ================= DATA ================= */
  // 🆕 LATEST TV SHOWS (no Top 10, no ranking)
  const tvShows = trendingData ?? [];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!tvShows.length) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= tvShows.length - 1) return prev;

        sliderRef.current?.scrollBy({
          left: ITEM_WIDTH,
          behavior: "smooth",
        });

        return prev + 1;
      });
    }, AUTO_SLIDE_TIME);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tvShows.length]);

  /* ================= CONTROLS ================= */
  const slideNext = () => {
    if (index >= tvShows.length - 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIndex((i) => i + 1);
    sliderRef.current?.scrollBy({
      left: ITEM_WIDTH,
      behavior: "smooth",
    });
  };

  const slidePrev = () => {
    if (index <= 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIndex((i) => i - 1);
    sliderRef.current?.scrollBy({
      left: -ITEM_WIDTH,
      behavior: "smooth",
    });
  };

  /* ================= UI ================= */
  if (!tvShows.length) {
    return (
      <section className="px-6 py-10 text-gray-400">
        Loading latest TV shows…
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
        disabled={index >= tvShows.length - 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full disabled:opacity-30"
      >
        <ChevronRight size={28} />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-hidden scroll-smooth"
      >
        {tvShows.map((tv) => (
          <div
            key={tv.id}
            className="relative min-w-[200px] hover:scale-105 transition"
          >
            <TvShowCard tvshowResult={tv} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingTv;
