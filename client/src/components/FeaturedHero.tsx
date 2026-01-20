import { useNavigate } from "react-router-dom";

const IMAGE = "https://image.tmdb.org/t/p/original";

interface Props {
  item: any;
  type: "movie" | "tv";
  index: number;
}

const FeaturedHero = ({ item, type, index }: Props) => {
  const navigate = useNavigate();

  if (!item) return null;

  return (
    <section className="relative w-full h-[60vh] bg-[#1f3b55] flex items-center overflow-hidden rounded-2xl">
      {/* LEFT */}
      <div className="relative z-10 px-10 max-w-xl text-white">
        <div className="flex gap-2 mb-3 text-xs">
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
            HD
          </span>
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
            {type === "movie" ? "Movie" : "TV"}
          </span>
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
            {(item.release_date || item.first_air_date)?.slice(0, 4)}
          </span>
        </div>

        <h1 className="text-4xl font-extrabold mb-3">
          {item.title || item.name}
        </h1>

        <div className="flex gap-1 text-yellow-400 mb-3">
          {"★".repeat(Math.round(item.vote_average / 2))}
        </div>

        <p className="text-gray-200 line-clamp-4 mb-6">
          {item.overview}
        </p>

        <button
          onClick={() =>
            navigate(
              type === "movie"
                ? `/movie/${item.id}`
                : `/tvshow/${item.id}`
            )
          }
          className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-full font-semibold"
        >
          ▶ Watch now
        </button>
      </div>

      {/* RIGHT */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[45%] rounded-xl overflow-hidden">
        <img
          src={IMAGE + item.backdrop_path}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center text-white text-3xl">
            ▶
          </div>
        </div>

        <span className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default FeaturedHero;
