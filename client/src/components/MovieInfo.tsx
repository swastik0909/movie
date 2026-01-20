const MovieInfo = ({ movie }: { movie: any }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
      <p className="text-gray-300">{movie.overview}</p>

      <div className="flex gap-6 text-sm text-gray-400">
        <span>⭐ {movie.vote_average}</span>
        <span>⏱ {movie.runtime} min</span>
        <span>📅 {movie.release_date}</span>
      </div>
    </div>
  );
};

export default MovieInfo;
