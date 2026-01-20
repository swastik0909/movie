const TvSeasons = ({
  seasons,
  onPlay,
}: {
  seasons: any[];
  onPlay: (season: number, episode: number) => void;
}) => {
  const validSeasons = seasons.filter(
    (s) => s.season_number > 0
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Episodes
      </h2>

      {/* SEASONS GRID (5 PER ROW) */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          gap-6
        "
      >
        {validSeasons.map((season) => (
          <div
            key={season.id}
            className="
              bg-zinc-900
              border border-white/10
              rounded-xl
              p-5
              flex
              flex-col
              justify-between
              hover:scale-[1.03]
              transition
            "
          >
            {/* SEASON TITLE */}
            <h3 className="text-lg font-medium mb-4">
              Season {season.season_number}
            </h3>

            {/* PLAY BUTTON */}
            <button
              onClick={() =>
                onPlay(season.season_number, 1)
              }
              className="
                mt-auto
                flex
                items-center
                justify-center
                gap-2
                bg-red-600
                hover:bg-red-700
                transition
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
              "
            >
              ▶ Play Episode 1
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TvSeasons;
