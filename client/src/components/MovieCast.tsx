import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
const SCROLL_AMOUNT = 300;

const MovieCast = ({ cast }: { cast: Cast[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!cast?.length) return null;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-6 md:px-16 mt-14 relative group">
      <h2 className="text-xl md:text-2xl font-semibold mb-5">
        🎭 Cast
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={26} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={26} />
      </button>

      {/* CAST SCROLLER */}
      <div
        ref={scrollRef}
        className="
          flex gap-6 pb-4
          overflow-x-auto
          scroll-smooth
        "
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE / Edge
        }}
      >
        {/* Chrome / Safari */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {cast.map((person) => (
          <div
            key={person.id}
            className="shrink-0 w-28 text-center group/cast cursor-pointer"
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover/cast:ring-red-600 transition">
              <img
                src={
                  person.profile_path
                    ? `${IMAGE_BASE}${person.profile_path}`
                    : "/avatar.png"
                }
                alt={person.name}
                className="w-full h-full object-cover group-hover/cast:scale-110 transition"
                loading="lazy"
              />
            </div>

            <p className="mt-3 text-sm font-medium truncate">
              {person.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {person.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieCast;
