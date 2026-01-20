import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GenresContext } from "@/context/genres_context";

const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

const TrendingFooter = () => {
  const { setGenres } = useContext(GenresContext);
  const navigate = useNavigate();

  const handleGenreClick = (id: number) => {
    setGenres(id);
    navigate("/movies");
  };

  return (
    <footer className="relative bg-black text-gray-400 mt-24">
      {/* TOP GRADIENT */}
      <div className="h-px bg-linear-to-r from-transparent via-red-600/60 to-transparent" />

      <div className="px-6 md:px-16 py-14 grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* BRAND */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-3">
            Movie<span className="text-red-600">Plus</span>
          </h2>
          <p className="text-sm max-w-sm">
            Discover trending movies in high quality.
            Updated daily using TMDB.
          </p>
        </div>

        {/* MOVIE GENRES */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Movie Genres
          </h3>

          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {movieGenres.map((genre) => (
              <li
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className="cursor-pointer hover:text-white transition"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 px-6 md:px-16 flex flex-col md:flex-row justify-between text-sm">
        <p>© {new Date().getFullYear()} MoviePlus</p>
        <p className="text-gray-500 mt-2 md:mt-0">
          Powered by TMDB
        </p>
      </div>

      {/* GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[120px] bg-red-600/10 blur-[120px]" />
    </footer>
  );
};

export default TrendingFooter;
