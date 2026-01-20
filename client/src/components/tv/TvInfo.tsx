const TvInfo = ({ tv }: { tv: any }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
      <p className="text-gray-300">{tv.overview}</p>

      <div className="flex gap-6 text-sm text-gray-400">
        <span>⭐ {tv.vote_average}</span>
        <span>📺 {tv.number_of_episodes} Episodes</span>
      </div>
    </div>
  );
};

export default TvInfo;
