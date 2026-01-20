const MovieHero = ({
  movie,
  onPlay,
}: {
  movie: any;
  onPlay: () => void;
}) => {
  return (
    <div
      className="relative h-[70vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 h-full flex flex-col justify-end p-10 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          {movie.title}
        </h1>

        <button
          onClick={onPlay}
          className="w-fit px-8 py-3 bg-red-600 rounded text-lg hover:bg-red-700"
        >
          ▶ Play
        </button>
      </div>
    </div>
  );
};

export default MovieHero;
